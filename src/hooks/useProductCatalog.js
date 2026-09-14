import { useState, useEffect, useCallback, useRef } from 'react';
import { CATALOG_PRODUCTS } from '@/data/catalogProducts';
import {
  subscribeToCloudCatalog,
  saveCatalogToCloud,
  isCloudConfigured,
} from '@/lib/firebase';

const STORAGE_KEY = 'gt_wholesale_catalog_v1';

// Default flagship IDs for Global Trades Malabar distribution:
// 211: Monin Mojito Mint Syrup 1L
// 105: Morton Peaches Tin 800g
// 153: Barry Callebaut Belgium Dark Chocolate 2.5kg
// 81:  Golden Crown Mushroom Tin 800g
// 102: Veeba Professional Mayonnaise
// 188: Del Monte Penne Rigate 500g
const DEFAULT_FEATURED_IDS = [211, 105, 153, 81, 102, 188];

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

    // Ensure all items have a valid isFeatured boolean
    return rawProducts.map((p) => ({
      ...p,
      isFeatured:
        p.isFeatured !== undefined
          ? Boolean(p.isFeatured)
          : DEFAULT_FEATURED_IDS.includes(p.id),
    }));
  });

  const [isCloudConnected, setIsCloudConnected] = useState(() => isCloudConfigured());
  const isInternalUpdate = useRef(false);

  // Synchronize state changes to localStorage and Cloud (Firebase Firestore)
  const persist = useCallback((nextProducts) => {
    isInternalUpdate.current = true;
    setProducts(nextProducts);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProducts));
      window.dispatchEvent(new Event('catalog-updated'));
    } catch (e) {
      console.error('Failed to persist products to localStorage:', e);
    }

    // Broadcast to Firebase in the background so all phones & computers update instantly
    if (isCloudConfigured()) {
      saveCatalogToCloud(nextProducts).catch((err) => {
        console.warn('Cloud sync background warning:', err);
      });
    }

    setTimeout(() => {
      isInternalUpdate.current = false;
    }, 100);
  }, []);

  // Listen to real-time Cloud updates from Firebase Firestore
  useEffect(() => {
    const checkCloud = () => setIsCloudConnected(isCloudConfigured());
    window.addEventListener('firebase-config-updated', checkCloud);

    const unsubscribe = subscribeToCloudCatalog((cloudProducts) => {
      // Avoid re-triggering if this device was the origin of the update
      if (isInternalUpdate.current) return;

      if (Array.isArray(cloudProducts) && cloudProducts.length > 0) {
        const normalized = cloudProducts.map((p) => ({
          ...p,
          isFeatured:
            p.isFeatured !== undefined
              ? Boolean(p.isFeatured)
              : DEFAULT_FEATURED_IDS.includes(p.id),
        }));
        setProducts(normalized);

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
          window.dispatchEvent(new Event('catalog-updated'));
        } catch (_) {}
      }
    });

    return () => {
      unsubscribe();
      window.removeEventListener('firebase-config-updated', checkCloud);
    };
  }, []);

  // Listen to storage events for cross-tab synchronization
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(
              parsed.map((p) => ({
                ...p,
                isFeatured:
                  p.isFeatured !== undefined
                    ? Boolean(p.isFeatured)
                    : DEFAULT_FEATURED_IDS.includes(p.id),
              }))
            );
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
      const updated = products.map((p) => {
        if (p.id == id) {
          return {
            ...p,
            ...updatedFields,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      persist(updated);
    },
    [products, persist]
  );

  // Toggle featured status for home page showcase
  const toggleFeatured = useCallback(
    (id) => {
      const updated = products.map((p) => {
        if (p.id == id) {
          return {
            ...p,
            isFeatured: !p.isFeatured,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
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
