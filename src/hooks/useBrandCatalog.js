import { useState, useEffect, useCallback } from 'react';
import { DEFAULT_WHOLESALE_BRANDS } from '@/data/wholesaleBrands';
import {
  fetchFeaturedBrandNamesFromPostgres,
  saveFeaturedBrandNamesToPostgres,
  subscribeToFeaturedBrands,
  isSupabaseConfigured,
} from '@/lib/supabase';

export const DEFAULT_TRUSTED_BRANDS = DEFAULT_WHOLESALE_BRANDS;

const STORAGE_KEY = 'gt_trusted_brands_catalog';

export function useBrandCatalog() {
  const [brands, setBrands] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        let parsed = JSON.parse(saved);
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

  // Sync featured brands from Supabase so mobile phones and computers stay in 100% lockstep
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    fetchFeaturedBrandNamesFromPostgres().then((brandNames) => {
      if (Array.isArray(brandNames)) {
        const featuredSet = new Set(brandNames.map((n) => n.toLowerCase().trim()));
        setBrands((current) =>
          current.map((b) => ({
            ...b,
            isFeatured: featuredSet.has((b.name || '').toLowerCase().trim()),
          }))
        );
      }
    });

    const unsubscribe = subscribeToFeaturedBrands((brandNames) => {
      if (Array.isArray(brandNames)) {
        const featuredSet = new Set(brandNames.map((n) => n.toLowerCase().trim()));
        setBrands((current) =>
          current.map((b) => ({
            ...b,
            isFeatured: featuredSet.has((b.name || '').toLowerCase().trim()),
          }))
        );
      }
    });

    return () => unsubscribe();
  }, []);

  // Save to localStorage whenever brands change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(brands));
    } catch (e) {
      console.warn('Failed to persist brands to localStorage:', e);
    }
  }, [brands]);

  // Helper to persist featured brand names to Supabase
  const syncFeaturedToCloud = useCallback((brandList) => {
    if (isSupabaseConfigured()) {
      const featuredNames = brandList
        .filter((b) => Boolean(b.isFeatured))
        .map((b) => b.name);
      saveFeaturedBrandNamesToPostgres(featuredNames).catch(console.warn);
    }
  }, []);

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

    setBrands((prev) => {
      const next = [newBrand, ...prev];
      syncFeaturedToCloud(next);
      return next;
    });
    return newBrand;
  }, [syncFeaturedToCloud]);

  // Update brand
  const updateBrand = useCallback((id, updatedData) => {
    setBrands((prev) => {
      const next = prev.map((b) => (b.id === id ? { ...b, ...updatedData } : b));
      if (updatedData.isFeatured !== undefined) {
        syncFeaturedToCloud(next);
      }
      return next;
    });
  }, [syncFeaturedToCloud]);

  // Toggle featured status
  const toggleBrandFeatured = useCallback((id) => {
    setBrands((prev) => {
      const next = prev.map((b) => (b.id === id ? { ...b, isFeatured: !b.isFeatured } : b));
      syncFeaturedToCloud(next);
      return next;
    });
  }, [syncFeaturedToCloud]);

  // Delete brand
  const deleteBrand = useCallback((id) => {
    setBrands((prev) => {
      const next = prev.filter((b) => b.id !== id);
      syncFeaturedToCloud(next);
      return next;
    });
  }, [syncFeaturedToCloud]);

  // Reset to defaults
  const resetToDefaultBrands = useCallback(() => {
    setBrands(DEFAULT_TRUSTED_BRANDS);
    syncFeaturedToCloud(DEFAULT_TRUSTED_BRANDS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  }, [syncFeaturedToCloud]);

  return {
    brands,
    addBrand,
    updateBrand,
    deleteBrand,
    toggleBrandFeatured,
    resetToDefaultBrands,
  };
}
