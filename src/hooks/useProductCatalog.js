import { useState, useEffect, useCallback } from 'react';
import { CATALOG_PRODUCTS } from '@/data/catalogProducts';

const STORAGE_KEY = 'gt_wholesale_catalog_v1';

const DEFAULT_FEATURED_IDS = [211, 212, 188, 221, 20, 161];

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
      isFeatured: p.isFeatured !== undefined ? Boolean(p.isFeatured) : DEFAULT_FEATURED_IDS.includes(p.id),
    }));
  });

  const [loading, setLoading] = useState(false);

  // Synchronize state changes to localStorage
  const persist = useCallback((nextProducts) => {
    setProducts(nextProducts);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProducts));
    } catch (e) {
      console.error('Failed to persist products to localStorage:', e);
    }
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
        if (p.id === id) {
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
        if (p.id === id) {
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
      const updated = products.filter((p) => p.id !== id);
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
    loading,
    addProduct,
    updateProduct,
    toggleFeatured,
    deleteProduct,
    resetToDefaultCatalog,
  };
}
