import { useState, useEffect, useCallback, useRef } from 'react';
import { CATALOG_PRODUCTS } from '@/data/catalogProducts';
import {
  subscribeToPostgresCatalog,
  fetchCatalogFromPostgres,
  saveCatalogToPostgres,
  updateProductInPostgres,
  isSupabaseConfigured,
} from '@/lib/supabase';

const STORAGE_KEY = 'gt_wholesale_catalog_v2';

// Default flagship IDs for Global Trades Kozhikode distribution:
// 211: Monin Mojito Mint Syrup 1L
// 105: Morton Peaches Tin 800g
// 153: Barry Callebaut Belgium Dark Chocolate 2.5kg
// 81:  Golden Crown Mushroom Tin 800g
// 102: Veeba Professional Mayonnaise
// 188: Del Monte Penne Rigate 500g
const DEFAULT_FEATURED_IDS = [211, 105, 153, 81, 102, 188];

function normalizeProduct(p) {
  const safeName = (p.name || '').replace(/[^a-zA-Z0-9]/g, '_');
  const defaultImage = `/catalog_images/${safeName}.jpg`;
  return {
    ...p,
    size: p.size || p.packSize || '',
    image: p.image || p.customImage || defaultImage,
    isFeatured:
      p.isFeatured !== undefined
        ? Boolean(p.isFeatured)
        : DEFAULT_FEATURED_IDS.includes(p.id),
  };
}

export function useProductCatalog() {
  const [products, setProducts] = useState(() => {
    let rawProducts = CATALOG_PRODUCTS;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          rawProducts = parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved catalog from localStorage:', e);
    }

    return rawProducts.map(normalizeProduct);
  });

  const [isCloudConnected, setIsCloudConnected] = useState(() => isSupabaseConfigured());
  const isInternalUpdate = useRef(false);

  // Synchronize state changes to localStorage and PostgreSQL
  const persist = useCallback((nextProducts) => {
    isInternalUpdate.current = true;
    setProducts(nextProducts);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProducts));
      window.dispatchEvent(new Event('catalog-updated'));
    } catch (e) {
      console.error('Failed to persist products to localStorage:', e);
    }

    // Broadcast to PostgreSQL in the background so all phones & computers update instantly
    if (isSupabaseConfigured()) {
      saveCatalogToPostgres(nextProducts).catch((err) => {
        console.warn('PostgreSQL sync background warning:', err);
      });
    }

    setTimeout(() => {
      isInternalUpdate.current = false;
    }, 100);
  }, []);

  // Listen to real-time Cloud updates from PostgreSQL (Supabase / pgAdmin 4)
  useEffect(() => {
    const checkCloud = () => setIsCloudConnected(isSupabaseConfigured());
    window.addEventListener('supabase-config-updated', checkCloud);

    // Initial fetch from PostgreSQL if configured
    if (isSupabaseConfigured()) {
      fetchCatalogFromPostgres().then((dbProducts) => {
        if (Array.isArray(dbProducts) && dbProducts.length > 0) {
          setProducts((current) => {
            const normalized = dbProducts.map(normalizeProduct);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
              window.dispatchEvent(new Event('catalog-updated'));
            } catch (_) {}
            return normalized;
          });
        }
      });
    }

    // Subscribe to live row edits from pgAdmin 4 or other devices
    const unsubscribe = subscribeToPostgresCatalog(
      (changedProduct) => {
        if (isInternalUpdate.current) return;
        const normalizedItem = normalizeProduct(changedProduct);
        setProducts((current) => {
          const index = current.findIndex((p) => p.id === normalizedItem.id);
          let next;
          if (index !== -1) {
            next = [...current];
            next[index] = { ...next[index], ...normalizedItem };
          } else {
            next = [normalizedItem, ...current];
          }
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            window.dispatchEvent(new Event('catalog-updated'));
          } catch (_) {}
          return next;
        });
      },
      (deletedId) => {
        if (isInternalUpdate.current) return;
        setProducts((current) => {
          const next = current.filter((p) => p.id !== deletedId);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            window.dispatchEvent(new Event('catalog-updated'));
          } catch (_) {}
          return next;
        });
      }
    );

    return () => {
      unsubscribe();
      window.removeEventListener('supabase-config-updated', checkCloud);
    };
  }, []);

  // Listen to storage events for cross-tab synchronization
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(parsed.map(normalizeProduct));
          }
        } catch (err) {
          console.warn('Failed to parse catalog from storage event:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Add new product
  const addProduct = useCallback(
    (productData) => {
      const newId = Date.now();
      const safeName = productData.name.replace(/[^a-zA-Z0-9]/g, '_');
      const newProduct = {
        id: newId,
        name: productData.name.trim(),
        brand: productData.brand?.trim() || 'Global Trades',
        category: productData.category || 'General',
        size: productData.size?.trim() || 'Standard Pack',
        image: productData.image?.trim() || `/catalog_images/${safeName}.jpg`,
        inStock: productData.inStock !== false,
        isFeatured: Boolean(productData.isFeatured),
        createdAt: new Date().toISOString(),
      };

      const updated = [newProduct, ...products];
      persist(updated);
      return newProduct;
    },
    [products, persist]
  );

  // Update existing product
  const updateProduct = useCallback(
    (id, updatedFields) => {
      let updatedItem = null;
      const updated = products.map((p) => {
        if (p.id == id) {
          updatedItem = {
            ...p,
            ...updatedFields,
            updatedAt: new Date().toISOString(),
          };
          return updatedItem;
        }
        return p;
      });

      if (updatedItem && isSupabaseConfigured()) {
        updateProductInPostgres(updatedItem).catch(console.warn);
      }

      persist(updated);
    },
    [products, persist]
  );

  // Toggle featured status for home page showcase
  const toggleFeatured = useCallback(
    (id) => {
      let toggledItem = null;
      const updated = products.map((p) => {
        if (p.id == id) {
          toggledItem = {
            ...p,
            isFeatured: !p.isFeatured,
            updatedAt: new Date().toISOString(),
          };
          return toggledItem;
        }
        return p;
      });

      if (toggledItem && isSupabaseConfigured()) {
        updateProductInPostgres(toggledItem).catch(console.warn);
      }

      persist(updated);
    },
    [products, persist]
  );

  // Delete product
  const deleteProduct = useCallback(
    (id) => {
      const updated = products.filter((p) => p.id != id);
      persist(updated);
    },
    [products, persist]
  );

  // Reset to original factory catalog
  const resetToDefaultCatalog = useCallback(() => {
    const defaultCatalog = CATALOG_PRODUCTS.map((p) => ({
      ...p,
      isFeatured: DEFAULT_FEATURED_IDS.includes(p.id),
    }));
    persist(defaultCatalog);
  }, [persist]);

  return {
    products,
    isCloudConnected,
    addProduct,
    updateProduct,
    toggleFeatured,
    deleteProduct,
    resetToDefaultCatalog,
  };
}
