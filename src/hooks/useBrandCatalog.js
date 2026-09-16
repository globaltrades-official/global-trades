import { useState, useEffect, useCallback } from 'react';

export const DEFAULT_TRUSTED_BRANDS = [
  { id: 'brand-1', name: 'Monin', category: 'Syrups, Purees & Frappes', origin: 'Imported (France)', logo: '', isFeatured: true },
  { id: 'brand-2', name: 'Callebaut', category: 'Belgian Couverture & Cocoa', origin: 'Imported (Belgium)', logo: '', isFeatured: true },
  { id: 'brand-3', name: 'Veeba', category: 'Sauces, Dressings & Dips', origin: 'Institutional Foodservice', logo: '', isFeatured: true },
  { id: 'brand-4', name: 'Del Monte', category: 'Canned Fruits & Condiments', origin: 'Commercial Packs', logo: '', isFeatured: true },
  { id: 'brand-5', name: 'American Garden', category: 'Hot Sauces, BBQ & Dressings', origin: 'Imported', logo: '', isFeatured: true },
  { id: 'brand-6', name: 'Kikkoman', category: 'Naturally Brewed Soy Sauces', origin: 'Imported', logo: '', isFeatured: true },
  { id: 'brand-7', name: 'Lee Kum Kee', category: 'Asian Sauces & Seasonings', origin: 'Imported', logo: '', isFeatured: true },
  { id: 'brand-8', name: 'Fruitomans', category: 'Bulk Sauces (1kg - 25kg)', origin: 'Institutional Supply', logo: '', isFeatured: true },
  { id: 'brand-9', name: 'Morton', category: 'Canned Mushrooms & Produce', origin: 'Commercial Cans', logo: '', isFeatured: true },
  { id: 'brand-10', name: 'Golden Crown', category: 'Gourmet Canned Fruits', origin: 'Hotel & Cafe Supply', logo: '', isFeatured: true },
  { id: 'brand-11', name: "D'lecta", category: 'Cheese Slices & Dairy', origin: 'Foodservice Dairy', logo: '', isFeatured: true },
  { id: 'brand-12', name: 'HyFun Foods', category: 'Frozen Fries & Burger Patties', origin: 'Commercial Frozen', logo: '', isFeatured: true },
  { id: 'brand-13', name: 'Amul', category: 'Cheese Blocks & Dairy', origin: 'Bulk Dairy', logo: '', isFeatured: true },
  { id: 'brand-14', name: 'Western', category: 'Frozen Chicken Nuggets & Patties', origin: 'Foodservice Line', logo: '', isFeatured: true },
  { id: 'brand-15', name: 'Fortune', category: 'Imported Specialty Cheeses', origin: 'Gourmet Kitchens', logo: '', isFeatured: true },
  { id: 'brand-16', name: 'Tetley', category: 'Tea Bags & Envelopes', origin: 'Hotel & Cafe Sachets', logo: '', isFeatured: true },
];

const STORAGE_KEY = 'gt_trusted_brands_catalog';

export function useBrandCatalog() {
  const [brands, setBrands] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
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
