import { useState, useEffect, useCallback } from 'react';
import { DEFAULT_WHOLESALE_BRANDS } from '@/data/wholesaleBrands';

export const DEFAULT_TRUSTED_BRANDS = DEFAULT_WHOLESALE_BRANDS;

const STORAGE_KEY = 'gt_trusted_brands_catalog';

export function useBrandCatalog() {
  const [brands, setBrands] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const defaultByName = new Map(
            DEFAULT_WHOLESALE_BRANDS.map((b) => [b.name.toLowerCase().trim(), b])
          );

          // Merge saved brands with default specifications; auto-fill logo if empty or missing
          const updated = parsed.map((brand) => {
            const defaultBrand = defaultByName.get((brand.name || '').toLowerCase().trim());
            const hasValidLogo =
              brand.logo &&
              typeof brand.logo === 'string' &&
              brand.logo.trim() !== '' &&
              !brand.logo.endsWith('undefined');

            return {
              ...(defaultBrand || {}),
              ...brand,
              logo: hasValidLogo ? brand.logo : (defaultBrand?.logo || ''),
            };
          });

          // Include any missing catalog brands
          const existingNames = new Set(
            updated.map((b) => (b.name || '').toLowerCase().trim())
          );
          const missing = DEFAULT_WHOLESALE_BRANDS.filter(
            (b) => !existingNames.has(b.name.toLowerCase().trim())
          );

          return [...updated, ...missing];
        }
      }
    } catch (e) {
      console.warn('Failed to load trusted brands from localStorage:', e);
    }
    return DEFAULT_TRUSTED_BRANDS;
  });

  // Save to localStorage whenever brands change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(brands));
    } catch (e) {
      console.warn('Failed to persist brands to localStorage:', e);
    }
  }, [brands]);

  // Add brand
  const addBrand = useCallback((brandData) => {
    const newBrand = {
      ...brandData,
      id: brandData.id || `brand-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: brandData.name.trim(),
      category: brandData.category?.trim() || 'Food Service Specialty',
      origin: brandData.origin?.trim() || 'Authorized Brand',
      logo: brandData.logo || '',
      isFeatured: brandData.isFeatured !== false,
    };

    setBrands((prev) => [newBrand, ...prev]);
    return newBrand;
  }, []);

  // Update brand
  const updateBrand = useCallback((id, updatedData) => {
    setBrands((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updatedData } : b))
    );
  }, []);

  // Toggle featured status
  const toggleBrandFeatured = useCallback((id) => {
    setBrands((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isFeatured: !b.isFeatured } : b))
    );
  }, []);

  // Delete brand
  const deleteBrand = useCallback((id) => {
    setBrands((prev) => prev.filter((b) => b.id !== id));
  }, []);

  // Reset to defaults
  const resetToDefaultBrands = useCallback(() => {
    setBrands(DEFAULT_TRUSTED_BRANDS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  }, []);

  return {
    brands,
    addBrand,
    updateBrand,
    deleteBrand,
    toggleBrandFeatured,
    resetToDefaultBrands,
  };
}
