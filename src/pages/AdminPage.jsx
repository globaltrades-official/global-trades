import React, { useState, useMemo, useEffect } from 'react';
import {
  ShieldCheck,
  Plus,
  LogOut,
  Pencil,
  Trash2,
  Search,
  X,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Package,
  SlidersHorizontal,
  ExternalLink,
  Star,
  Cloud,
  CloudOff,
  Database,
  Download,
  RefreshCw,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';
import { CATALOG_CATEGORIES, CATALOG_BRANDS } from '@/data/catalogProducts';
import { BRANDING, CONTACT } from '@/constants/theme';
import {
  saveSupabaseConfig,
  clearSupabaseConfig,
  isSupabaseConfigured,
  getSupabaseConfig,
  saveCatalogToPostgres,
} from '@/lib/supabase';

export default function AdminPage({
  products = [],
  addProduct,
  updateProduct,
  toggleFeatured,
  deleteProduct,
  resetCatalog,
  brands = [],
  addBrand,
  updateBrand,
  deleteBrand,
  toggleBrandFeatured,
  resetBrands,
  initialTab = 'products',
  onNavigateHome,
  onNavigateProducts,
}) {
  const [authed, setAuthed] = useState(() => {
    return sessionStorage.getItem('gt_admin_auth') === 'true';
  });

  const [activeAdminTab, setActiveAdminTab] = useState(initialTab || 'products');

  useEffect(() => {
    if (initialTab) {
      setActiveAdminTab(initialTab);
    }
  }, [initialTab]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Dashboard controls (Products)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Brand management controls & state
  const [brandSearchQuery, setBrandSearchQuery] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [brandToDelete, setBrandToDelete] = useState(null);

  const [brandFormData, setBrandFormData] = useState({
    name: '',
    category: '',
    origin: '',
    logo: '',
    isFeatured: true,
  });

  const openAddBrandModal = () => {
    setEditingBrand(null);
    setBrandFormData({
      name: '',
      category: '',
      origin: '',
      logo: '',
      isFeatured: true,
    });
    setIsBrandModalOpen(true);
  };

  const openEditBrandModal = (brand) => {
    setEditingBrand(brand);
    setBrandFormData({
      name: brand.name || '',
      category: brand.category || '',
      origin: brand.origin || '',
      logo: brand.logo || '',
      isFeatured: brand.isFeatured !== false,
    });
    setIsBrandModalOpen(true);
  };

  const handleBrandFormSubmit = (e) => {
    e.preventDefault();
    if (!brandFormData.name.trim()) {
      alert('Brand name is required.');
      return;
    }

    if (editingBrand) {
      if (updateBrand) {
        updateBrand(editingBrand.id, brandFormData);
      }
      showToast(`Updated brand "${brandFormData.name}" successfully!`);
    } else {
      if (addBrand) {
        addBrand(brandFormData);
      }
      showToast(`Added brand "${brandFormData.name}" to trusted showcase!`);
    }

    setIsBrandModalOpen(false);
  };

  const handleBrandLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit. Please upload a smaller logo image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBrandFormData((prev) => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmBrandDelete = () => {
    if (brandToDelete) {
      if (deleteBrand) {
        deleteBrand(brandToDelete.id);
      }
      showToast(`Removed brand "${brandToDelete.name}".`);
      setBrandToDelete(null);
    }
  };

  const handleResetBrands = () => {
    if (confirm('Restore default trusted brands showcase? Any custom edits will be reset.')) {
      if (resetBrands) {
        resetBrands();
      }
      showToast('Trusted brands restored to verified defaults.');
    }
  };

  const featuredProductBrands = useMemo(() => {
    const set = new Set();
    (products || []).forEach((p) => {
      if (p && p.isFeatured && p.brand) {
        set.add(String(p.brand).toLowerCase().trim());
      }
    });
    return set;
  }, [products]);

  const isBrandLiveOnHome = useCallback(
    (b) => Boolean(b?.isFeatured) || featuredProductBrands.has(String(b?.name || '').toLowerCase().trim()),
    [featuredProductBrands]
  );

  const filteredBrands = useMemo(() => {
    return (brands || []).filter((b) => {
      if (!b) return false;
      if (brandFilter === 'featured' && !isBrandLiveOnHome(b)) return false;
      const q = (brandSearchQuery || '').toLowerCase().trim();
      if (!q) return true;
      const bName = String(b.name || '').toLowerCase();
      const bCat = String(b.category || '').toLowerCase();
      const bOrigin = String(b.origin || '').toLowerCase();
      return bName.includes(q) || bCat.includes(q) || bOrigin.includes(q);
    });
  }, [brands, brandFilter, brandSearchQuery, isBrandLiveOnHome]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(() => getSupabaseConfig()?.url || '');
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(() => getSupabaseConfig()?.anonKey || '');
  const [cloudConnected, setCloudConnected] = useState(() => isSupabaseConfigured());
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: CATALOG_CATEGORIES[1] || 'Syrups & Crushes',
    size: '',
    image: '',
    inStock: true,
    isFeatured: false,
  });

  // Show temporary toast message
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const validUser = (username.trim() === 'globaltrades');
    const validPass = (password.trim() === 'gtrades');

    if (validUser && validPass) {
      setAuthed(true);
      sessionStorage.setItem('gt_admin_auth', 'true');
      setAuthError('');
      showToast('Welcome back, Admin!');
    } else {
      setAuthError('Invalid username or password. Please try again.');
    }
  };

  const handleLogout = () => {
    setAuthed(false);
    sessionStorage.removeItem('gt_admin_auth');
  };

  const SQL_SCHEMA_TEXT = `-- 1. Create the products table for Global Trades
CREATE TABLE IF NOT EXISTS public.products (
  id INT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  category TEXT,
  origin TEXT,
  shelf_life TEXT,
  pack_size TEXT,
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  is_featured BOOLEAN DEFAULT false,
  custom_image TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Performance indexes
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products (is_featured);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category);

-- 3. Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 4. Policies (Public Read + Full Edit)
DROP POLICY IF EXISTS "Allow public read access" ON public.products;
CREATE POLICY "Allow public read access" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow write access" ON public.products;
CREATE POLICY "Allow write access" ON public.products FOR ALL USING (true) WITH CHECK (true);

-- 5. Real-Time Replication (Syncs with mobile phones)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'products'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
  END IF;
END $$;`;

  // Handle saving Supabase (PostgreSQL) Configuration
  const handleSaveSupabaseConfig = async (e) => {
    e.preventDefault();
    const url = supabaseUrlInput.trim();
    const key = supabaseKeyInput.trim();

    if (!url || !key) {
      alert('Please enter both your Supabase Project URL and Anon Public Key.');
      return;
    }

    if (!url.startsWith('https://')) {
      alert('Project URL should start with https:// (e.g. https://xyzcompany.supabase.co)');
      return;
    }

    setIsSyncing(true);
    const saved = saveSupabaseConfig(url, key);
    if (!saved) {
      setIsSyncing(false);
      alert('Failed to save configuration.');
      return;
    }

    setCloudConnected(true);
    showToast('PostgreSQL connected! Syncing catalog...');

    try {
      const ok = await saveCatalogToPostgres(products);
      if (ok) {
        showToast('All products synced to PostgreSQL! Mobile phones & pgAdmin 4 ready.');
        setIsCloudModalOpen(false);
      } else {
        showToast('Connected, but initial sync had an issue. Please run the SQL schema in pgAdmin 4 first.');
      }
    } catch (err) {
      console.error(err);
      showToast('Error syncing to PostgreSQL. Ensure your table exists.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnectCloud = () => {
    if (confirm('Disconnect PostgreSQL database? Changes will only be saved locally in this browser.')) {
      clearSupabaseConfig();
      setCloudConnected(false);
      setSupabaseUrlInput('');
      setSupabaseKeyInput('');
      showToast('Disconnected from PostgreSQL.');
      setIsCloudModalOpen(false);
    }
  };

  const handleManualPostgresPush = async () => {
    if (!cloudConnected) {
      setIsCloudModalOpen(true);
      return;
    }
    setIsSyncing(true);
    showToast('Pushing catalog to PostgreSQL database...');
    const ok = await saveCatalogToPostgres(products);
    setIsSyncing(false);
    if (ok) {
      showToast('PostgreSQL database updated! All mobile phones & pgAdmin 4 are synchronized.');
    } else {
      showToast('Push failed. Make sure table "products" was created using the SQL schema.');
    }
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SQL_SCHEMA_TEXT);
    setCopiedSchema(true);
    showToast('PostgreSQL Schema SQL copied to clipboard!');
    setTimeout(() => setCopiedSchema(false), 3000);
  };

  const handleExportCatalog = () => {
    try {
      const jsonStr = JSON.stringify(products, null, 2);
      navigator.clipboard.writeText(jsonStr);
      showToast('Catalog JSON copied to clipboard!');

      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gt_catalog_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      showToast('Catalog exported.');
    }
  };

  // Open modal for Adding
  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      brand: '',
      category: CATALOG_CATEGORIES[1] || 'Syrups & Crushes',
      size: '',
      image: '',
      inStock: true,
      isFeatured: false,
    });
    setIsModalOpen(true);
  };

  // Open modal for Editing
  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      brand: product.brand || '',
      category: product.category || CATALOG_CATEGORIES[1],
      size: product.size || '',
      image: product.image || `/catalog_images/${(product.name || '').replace(/[^a-zA-Z0-9]/g, '_')}.jpg`,
      inStock: product.inStock !== false,
      isFeatured: Boolean(product.isFeatured),
    });
    setIsModalOpen(true);
  };

  // Handle Form Submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Product name is required.');
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
      showToast(`Updated "${formData.name}" successfully!`);
    } else {
      addProduct(formData);
      showToast(`Added "${formData.name}" to catalog!`);
    }

    setIsModalOpen(false);
  };

  // Handle Image File Upload (converts to data URL)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit. Please upload a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Delete Confirmation
  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      showToast(`Removed "${productToDelete.name}" from catalog.`);
      setProductToDelete(null);
    }
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return (products || []).filter((p) => {
      if (!p) return false;
      if (showFeaturedOnly && !p.isFeatured) {
        return false;
      }
      const matchesCategory =
        selectedCategory === 'All' || p.category === selectedCategory;
      const matchesBrand =
        selectedBrand === 'All' || p.brand === selectedBrand;
      const query = (searchQuery || '').toLowerCase().trim();
      if (!query) return matchesCategory && matchesBrand;

      const pName = String(p.name || '').toLowerCase();
      const pBrand = String(p.brand || '').toLowerCase();
      const pCat = String(p.category || '').toLowerCase();
      const pSize = String(p.size || '').toLowerCase();

      const matchesSearch =
        pName.includes(query) ||
        pBrand.includes(query) ||
        pCat.includes(query) ||
        pSize.includes(query);

      return matchesCategory && matchesBrand && matchesSearch;
    });
  }, [products, selectedCategory, selectedBrand, searchQuery, showFeaturedOnly]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const uniqueBrands = useMemo(() => {
    return ['All', ...Array.from(new Set((products || []).map((p) => p?.brand).filter(Boolean))).sort()];
  }, [products]);

  // Auth Gate Screen
  if (!authed) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-[#F4F8FC]">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl border border-[#D0DFEF]">
          <div className="text-center mb-6">
            <div className="mx-auto size-14 rounded-2xl bg-[#1A4C98]/10 flex items-center justify-center text-[#1A4C98] mb-3 border border-[#1A4C98]/20">
              <ShieldCheck size={28} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-[#081426]">
              Admin Portal
            </h2>
            <p className="text-xs font-bold text-[#1A4C98] mt-1">
              Global Trades · Kozhikode
            </p>
          </div>

          {authError && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-700 flex items-center gap-2">
              <AlertTriangle size={15} className="shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#081426]/70 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full rounded-xl border border-[#D0DFEF] bg-[#F4F8FC] px-4 py-2.5 text-sm font-semibold text-[#081426] focus:border-[#1A4C98] focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#081426]/70 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#D0DFEF] bg-[#F4F8FC] px-4 py-2.5 text-sm font-semibold text-[#081426] focus:border-[#1A4C98] focus:bg-white focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#1A4C98] py-3 text-sm font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#123873] transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              Sign in to Dashboard
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#D0DFEF] text-center">
            <button
              onClick={onNavigateHome}
              className="text-xs font-bold text-[#1A4C98] hover:underline cursor-pointer"
            >
              ← Return to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Dashboard
  return (
    <div className="min-h-screen bg-[#F4F8FC] text-[#081426] pb-24 pt-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-[#081426] px-5 py-3 text-sm font-bold text-white shadow-2xl border border-white/20 animate-fade-in">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-[#D0DFEF]">
          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateProducts}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1A4C98] hover:text-[#123873] cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>View Public Products</span>
            </button>
            <span className="text-xs font-bold text-[#081426]/40">|</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800">
              <span className="size-2 rounded-full bg-emerald-700 animate-pulse" />
              Admin Session Active
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* PostgreSQL & pgAdmin 4 Cloud Sync Button */}
            <button
              onClick={() => setIsCloudModalOpen(true)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                cloudConnected
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  : 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100'
              }`}
              title="Manage PostgreSQL database & pgAdmin 4 connection"
            >
              {cloudConnected ? (
                <>
                  <Database size={14} className="text-emerald-600" />
                  <span>PostgreSQL Connected</span>
                </>
              ) : (
                <>
                  <CloudOff size={14} className="text-amber-600" />
                  <span>Connect PostgreSQL / pgAdmin 4</span>
                </>
              )}
            </button>

            {/* Force Push to PostgreSQL */}
            {cloudConnected && (
              <button
                onClick={handleManualPostgresPush}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-white px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer disabled:opacity-50"
                title="Force push entire catalog to PostgreSQL database"
              >
                <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
                <span>{isSyncing ? 'Pushing...' : 'Push to PostgreSQL'}</span>
              </button>
            )}

            {/* Export Catalog */}
            <button
              onClick={handleExportCatalog}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D0DFEF] bg-white px-3 py-1.5 text-xs font-bold text-[#081426]/80 hover:bg-sky-50 hover:text-[#1A4C98] transition-colors cursor-pointer"
              title="Download or copy catalog JSON"
            >
              <Download size={13} />
              <span>Export Products</span>
            </button>

            <button
              onClick={() => {
                if (confirm('Restore default factory catalog? Any custom edits will be reset.')) {
                  resetCatalog();
                  showToast('Catalog restored to default.');
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D0DFEF] bg-white px-3 py-1.5 text-xs font-bold text-[#081426]/80 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Reset Products</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-200 transition-colors cursor-pointer"
            >
              <LogOut size={13} />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Admin Tab Navigation Switcher */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 mb-6">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-[#D0DFEF] shadow-xs max-w-md">
          <button
            type="button"
            onClick={() => setActiveAdminTab('products')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeAdminTab === 'products'
                ? 'bg-[#1A4C98] text-white shadow-sm'
                : 'text-[#081426]/75 hover:text-[#1A4C98] hover:bg-[#F4F8FC]'
            }`}
          >
            <Package size={16} />
            <span>Products ({products.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveAdminTab('brands')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeAdminTab === 'brands'
                ? 'bg-[#1A4C98] text-white shadow-sm'
                : 'text-[#081426]/75 hover:text-[#1A4C98] hover:bg-[#F4F8FC]'
            }`}
          >
            <Sparkles size={16} />
            <span>Trusted Brands ({(brands || []).length})</span>
          </button>
        </div>
      </div>

      {activeAdminTab === 'products' ? (
        <>
          {/* Dashboard Title & Stats */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#1A4C98]/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-[#1A4C98] mb-2 border border-[#1A4C98]/20">
              <ShieldCheck size={14} />
              <span>Commercial Procurement Desk</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase text-[#081426] tracking-tight">
              Product Inventory Manager
            </h1>
            <p className="text-sm text-[#081426]/75 mt-1">
              Add new wholesale SKUs, update specifications, change photos, or delete discontinued lines.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#1A4C98] px-6 py-3 text-sm font-black uppercase tracking-wider text-white shadow-md shadow-[#1A4C98]/30 hover:bg-[#123873] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Plus size={18} />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
          <div className="rounded-2xl bg-white p-4 border border-[#D0DFEF] shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[#081426]/60">
              Active Inventory
            </span>
            <div className="text-2xl md:text-3xl font-black text-[#1A4C98] mt-1">
              {products.length} <span className="text-xs font-bold text-[#081426]/60">Lines</span>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-white p-4 border border-amber-200/80 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900/80 flex items-center gap-1">
              <Star size={12} className="fill-amber-500 text-amber-500" />
              <span>Featured on Home</span>
            </span>
            <div className="text-2xl md:text-3xl font-black text-amber-600 mt-1">
              {products.filter((p) => p.isFeatured).length} <span className="text-xs font-bold text-amber-900/60">Curated</span>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 border border-[#D0DFEF] shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[#081426]/60">
              Departments
            </span>
            <div className="text-2xl md:text-3xl font-black text-emerald-800 mt-1">
              {CATALOG_CATEGORIES.length - 1} <span className="text-xs font-bold text-[#081426]/60">Categories</span>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 border border-[#D0DFEF] shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[#081426]/60">
              Unique Brands
            </span>
            <div className="text-2xl md:text-3xl font-black text-[#00A3E0] mt-1">
              {uniqueBrands.length - 1} <span className="text-xs font-bold text-[#081426]/60">Producers</span>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 border border-[#D0DFEF] shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[#081426]/60">
              In Stock Rate
            </span>
            <div className="text-2xl md:text-3xl font-black text-emerald-700 mt-1">
              100% <span className="text-xs font-bold text-[#081426]/60">Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table & Filter Controls */}
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="rounded-3xl bg-white border border-[#D0DFEF] shadow-sm overflow-hidden mb-8">
          {/* Filter Bar */}
          <div className="p-6 border-b border-[#D0DFEF] bg-slate-50/50 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Search */}
              <div className="md:col-span-6 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1A4C98]/60" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Filter inventory by name, brand, SKU..."
                  className="w-full rounded-xl border border-[#D0DFEF] bg-white py-2.5 pl-10 pr-9 text-sm font-semibold text-[#081426] placeholder-[#081426]/40 focus:border-[#1A4C98] focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#081426]/40 hover:text-[#081426]"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Category Dropdown */}
              <div className="md:col-span-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  aria-label="Filter by department"
                  className="w-full rounded-xl border border-[#D0DFEF] bg-white py-2.5 px-3 text-sm font-semibold text-[#081426] focus:border-[#1A4C98] focus:outline-none cursor-pointer"
                >
                  {CATALOG_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c === 'All' ? 'All Departments' : c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand Dropdown */}
              <div className="md:col-span-3">
                <select
                  value={selectedBrand}
                  onChange={(e) => {
                    setSelectedBrand(e.target.value);
                    setCurrentPage(1);
                  }}
                  aria-label="Filter by brand"
                  className="w-full rounded-xl border border-[#D0DFEF] bg-white py-2.5 px-3 text-sm font-semibold text-[#081426] focus:border-[#1A4C98] focus:outline-none cursor-pointer"
                >
                  {uniqueBrands.map((b) => (
                    <option key={b} value={b}>
                      {b === 'All' ? 'All Producers' : b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Filter Pill Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => {
                  setShowFeaturedOnly(false);
                  setCurrentPage(1);
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  !showFeaturedOnly
                    ? 'bg-[#1A4C98] text-white shadow-sm'
                    : 'bg-white text-[#081426]/70 border border-[#D0DFEF] hover:bg-gray-50'
                }`}
              >
                <span>All Products ({products.length})</span>
              </button>

              <button
                onClick={() => {
                  setShowFeaturedOnly(true);
                  setCurrentPage(1);
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  showFeaturedOnly
                    ? 'bg-amber-500 text-white shadow-sm font-black'
                    : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <Star size={13} className={showFeaturedOnly ? 'fill-white text-white' : 'fill-amber-500 text-amber-500'} />
                <span>Featured on Home ({products.filter((p) => p.isFeatured).length})</span>
              </button>
            </div>

            {/* Results bar */}
            <div className="flex items-center justify-between text-xs font-bold text-[#081426]/70 pt-2 border-t border-[#D0DFEF]/60">
              <div>
                Showing <span className="text-[#1A4C98]">{filteredProducts.length}</span> matching products
                {showFeaturedOnly && <span className="text-amber-700 ml-1">(Featured on Home view)</span>}
              </div>
              <div>
                Page {currentPage} of {totalPages}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#081426]">
              <thead className="bg-[#F8FAFC] text-xs font-extrabold uppercase tracking-wider text-[#081426]/70 border-b border-[#D0DFEF]">
                <tr>
                  <th className="py-3.5 px-4 w-16">Photo</th>
                  <th className="py-3.5 px-4">Product Name</th>
                  <th className="py-3.5 px-4">Brand / Producer</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Pack Size</th>
                  <th className="py-3.5 px-4 text-center">Featured on Home</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D0DFEF]">
                {paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-[#081426]/60">
                      No products match your filter query.
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-sky-50/40 transition-colors">
                      {/* Photo */}
                      <td className="py-3 px-4">
                        <div className="size-12 rounded-xl bg-white border border-[#D0DFEF] p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                          <img
                            src={p.image || `/catalog_images/${(p.name || '').replace(/[^a-zA-Z0-9]/g, '_')}.jpg`}
                            alt={p.name}
                            onError={(e) => {
                              e.currentTarget.src = '/company-logo.png';
                            }}
                            className="size-full object-contain"
                            loading="lazy"
                          />
                        </div>
                      </td>

                      {/* Name */}
                      <td className="py-3 px-4 font-bold text-[#081426] max-w-xs">
                        <div className="line-clamp-2">{p.name}</div>
                      </td>

                      {/* Brand */}
                      <td className="py-3 px-4 font-semibold text-[#1A4C98]">
                        {p.brand}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="inline-block rounded-md bg-[#00A3E0]/15 px-2 py-0.5 text-xs font-bold text-[#1A4C98] border border-[#00A3E0]/30">
                          {p.category}
                        </span>
                      </td>

                      {/* Pack Size */}
                      <td className="py-3 px-4 font-mono text-xs font-bold text-[#081426]/80">
                        {p.size || 'Standard'}
                      </td>

                      {/* Featured on Home 1-Click Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            if (toggleFeatured) {
                              toggleFeatured(p.id);
                            } else {
                              updateProduct(p.id, { isFeatured: !p.isFeatured });
                            }
                            showToast(
                              p.isFeatured
                                ? `Removed "${p.name}" & "${p.brand}" brand logo from Home`
                                : `Featured "${p.name}" & "${p.brand}" brand logo on Home!`
                            );
                          }}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                            p.isFeatured
                              ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-sm hover:bg-amber-200'
                              : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200'
                          }`}
                          title={p.isFeatured ? 'Click to remove product and brand logo from Home' : 'Click to feature product and show brand logo on Home'}
                        >
                          <Star size={13} className={p.isFeatured ? 'fill-amber-500 text-amber-500' : 'text-gray-400'} />
                          <span>{p.isFeatured ? 'Featured' : 'Feature'}</span>
                        </button>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                          <span className="size-1.5 rounded-full bg-emerald-700" />
                          In Stock
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded-lg text-[#1A4C98] hover:bg-[#1A4C98]/10 transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => setProductToDelete(p)}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-[#D0DFEF] flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-[#D0DFEF] bg-white text-xs font-bold text-[#081426] disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <span className="text-xs font-bold text-[#081426]/70 px-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-[#D0DFEF] bg-white text-xs font-bold text-[#081426] disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      </>
      ) : (
        <div className="mx-auto max-w-7xl px-4 md:px-8 mb-8">
          {/* Header & Quick Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#1A4C98]/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-[#1A4C98] mb-2 border border-[#1A4C98]/20">
                <Sparkles size={14} className="text-[#00A3E0]" />
                <span>Home Page Showcase</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black uppercase text-[#081426] tracking-tight">
                Brands Trusted by Food Businesses
              </h1>
              <p className="text-sm text-[#081426]/75 mt-1">
                Add, edit, or upload authorized brand logos displayed in the "Brands Trusted by Food Businesses" section on the public Home page.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={openAddBrandModal}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#1A4C98] px-5 py-3 text-sm font-black uppercase tracking-wider text-white shadow-md shadow-[#1A4C98]/30 hover:bg-[#123873] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Plus size={18} />
                <span>Add Brand Logo</span>
              </button>

              <button
                type="button"
                onClick={handleResetBrands}
                className="inline-flex items-center gap-1.5 rounded-2xl border border-[#D0DFEF] bg-white px-4 py-3 text-xs font-bold text-[#081426]/80 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors cursor-pointer"
                title="Restore default verified brand list"
              >
                <RotateCcw size={14} />
                <span>Reset Defaults</span>
              </button>

              <button
                type="button"
                onClick={onNavigateHome}
                className="inline-flex items-center gap-1.5 rounded-2xl border border-[#D0DFEF] bg-white px-4 py-3 text-xs font-bold text-[#1A4C98] hover:bg-sky-50 transition-colors cursor-pointer"
              >
                <ExternalLink size={14} />
                <span>View on Home</span>
              </button>
            </div>
          </div>

          {/* Quick Brand KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="rounded-2xl bg-white p-4 border border-[#D0DFEF] shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-[#081426]/60">
                Total Brands
              </span>
              <div className="text-2xl md:text-3xl font-black text-[#1A4C98] mt-1">
                {(brands || []).length} <span className="text-xs font-bold text-[#081426]/60">Brands</span>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4 border border-[#D0DFEF] shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Featured in Showcase
              </span>
              <div className="text-2xl md:text-3xl font-black text-emerald-700 mt-1">
                {(brands || []).filter(isBrandLiveOnHome).length} <span className="text-xs font-bold text-[#081426]/60">Live</span>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4 border border-[#D0DFEF] shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-[#00A3E0]">
                With Custom Logos
              </span>
              <div className="text-2xl md:text-3xl font-black text-[#00A3E0] mt-1">
                {(brands || []).filter((b) => b.logo).length} <span className="text-xs font-bold text-[#081426]/60">Logos</span>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4 border border-[#D0DFEF] shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-[#081426]/60">
                Display Format
              </span>
              <div className="text-sm font-black text-[#081426] mt-2">
                Dynamic Logo Grid
              </div>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="mt-8 rounded-2xl bg-white p-4 sm:p-5 border border-[#D0DFEF] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1A4C98]/60" size={17} />
              <input
                type="text"
                value={brandSearchQuery}
                onChange={(e) => setBrandSearchQuery(e.target.value)}
                placeholder="Search brands by name, specialty, origin..."
                className="w-full rounded-xl border border-[#D0DFEF] bg-[#F4F8FC] py-2.5 pl-10 pr-9 text-xs sm:text-sm font-semibold text-[#081426] focus:border-[#1A4C98] focus:bg-white focus:outline-none"
              />
              {brandSearchQuery && (
                <button
                  type="button"
                  onClick={() => setBrandSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#081426]/40 hover:text-[#081426] cursor-pointer"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setBrandFilter('all')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  brandFilter === 'all'
                    ? 'bg-[#1A4C98] text-white shadow-xs'
                    : 'bg-[#F4F8FC] text-[#081426]/75 hover:bg-[#E8F1FB]'
                }`}
              >
                All Brands ({(brands || []).length})
              </button>
              <button
                type="button"
                onClick={() => setBrandFilter('featured')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  brandFilter === 'featured'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-[#F4F8FC] text-[#081426]/75 hover:bg-[#E8F1FB]'
                }`}
              >
                Featured Only ({(brands || []).filter(isBrandLiveOnHome).length})
              </button>
            </div>
          </div>

          {/* Brands Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-6">
            {filteredBrands.map((brand) => (
              <div
                key={brand.id}
                className="rounded-2xl bg-white p-5 border border-[#D0DFEF] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Logo Preview Box */}
                  <div className="h-24 w-full rounded-xl bg-[#F8FAFD] border border-[#E2ECF8] flex items-center justify-center p-2 mb-3 relative overflow-hidden group">
                    {brand.logo ? (
                      <img
                        src={brand.logo}
                        alt={`${brand.name} logo`}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          if (brand.logo && brand.logo.endsWith('.png')) {
                            e.currentTarget.src = brand.logo.replace(/\.png$/, '.svg');
                          }
                        }}
                      />
                    ) : (
                      <div className="flex items-center gap-2.5">
                        <div className="size-11 rounded-lg bg-[#1A4C98] text-white flex items-center justify-center font-black text-base shadow-2xs">
                          {brand.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="text-left">
                          <span className="font-black text-sm text-[#081426] block leading-tight">
                            {brand.name}
                          </span>
                          <span className="text-[10px] font-bold text-[#00A3E0]">No Image Set</span>
                        </div>
                      </div>
                    )}

                    <span
                      onClick={() => toggleBrandFeatured && toggleBrandFeatured(brand.id)}
                      className={`absolute top-2 right-2 size-7 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110 ${
                        isBrandLiveOnHome(brand)
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                      title={isBrandLiveOnHome(brand) ? 'Featured on Home (Click to toggle)' : 'Hidden from Home (Click to feature)'}
                    >
                      <Star size={13} className={isBrandLiveOnHome(brand) ? 'fill-white' : ''} />
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-base font-black text-[#081426] truncate">
                      {brand.name}
                    </h3>
                    <span className="text-[10px] font-black uppercase text-[#00A3E0] bg-[#00A3E0]/10 px-2 py-0.5 rounded-full shrink-0">
                      {brand.origin || 'Brand'}
                    </span>
                  </div>

                  <p className="text-xs text-[#081426]/70 line-clamp-2">
                    {brand.category || 'Food Service Specialty'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F0F5FA] flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isBrandLiveOnHome(brand)
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-black'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {isBrandLiveOnHome(brand)
                      ? '★ Featured on Home'
                      : '— Hidden from Home'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditBrandModal(brand)}
                      className="p-1.5 rounded-lg text-[#1A4C98] hover:bg-[#1A4C98]/10 transition-colors cursor-pointer"
                      title="Edit Brand"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setBrandToDelete(brand)}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Brand"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredBrands.length === 0 && (
            <div className="text-center py-12 rounded-3xl bg-white border border-[#D0DFEF] mt-6">
              <p className="text-sm font-bold text-[#081426]/60">No brands match your search query.</p>
              <button
                type="button"
                onClick={() => {
                  setBrandSearchQuery('');
                  setBrandFilter('all');
                }}
                className="mt-3 text-xs font-bold text-[#1A4C98] hover:underline cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 md:p-8 shadow-2xl border border-[#D0DFEF] my-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 text-[#081426]/40 hover:text-[#081426] cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1A4C98]">
                {editingProduct ? 'Update Existing SKU' : 'New Commercial Line'}
              </span>
              <h3 className="text-2xl font-black text-[#081426] mt-0.5">
                {editingProduct ? 'Edit Product Details' : 'Add New Product'}
              </h3>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#081426]/70 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Monin Hazelnut Gourmet Syrup 1L"
                  className="w-full rounded-xl border border-[#D0DFEF] bg-[#F4F8FC] px-4 py-2.5 text-sm font-semibold text-[#081426] focus:border-[#1A4C98] focus:bg-white focus:outline-none"
                  required
                />
              </div>

              {/* Brand & Category row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#081426]/70 mb-1">
                    Producer / Brand *
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Monin, Veeba, Barry Callebaut..."
                    className="w-full rounded-xl border border-[#D0DFEF] bg-[#F4F8FC] px-4 py-2.5 text-sm font-semibold text-[#081426] focus:border-[#1A4C98] focus:bg-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#081426]/70 mb-1">
                    Department / Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-[#D0DFEF] bg-[#F4F8FC] px-4 py-2.5 text-sm font-semibold text-[#081426] focus:border-[#1A4C98] focus:bg-white focus:outline-none cursor-pointer"
                  >
                    {CATALOG_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pack Size */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#081426]/70 mb-1">
                  Packaging / Pack Size
                </label>
                <input
                  type="text"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  placeholder="e.g. 1kg Pouch, Case of 12 (850g Tins), 5L Jar..."
                  className="w-full rounded-xl border border-[#D0DFEF] bg-[#F4F8FC] px-4 py-2.5 text-sm font-semibold text-[#081426] focus:border-[#1A4C98] focus:bg-white focus:outline-none"
                />
              </div>

              {/* Product Image URL & Upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#081426]/70 mb-1">
                  Product Image URL or Path
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/catalog_images/... or https://..."
                    className="flex-1 rounded-xl border border-[#D0DFEF] bg-[#F4F8FC] px-4 py-2.5 text-sm font-semibold text-[#081426] focus:border-[#1A4C98] focus:bg-white focus:outline-none"
                  />
                  <label className="inline-flex items-center gap-1.5 rounded-xl border border-[#D0DFEF] bg-[#F4F8FC] px-3 py-2.5 text-xs font-bold text-[#1A4C98] hover:bg-[#1A4C98] hover:text-white transition-colors cursor-pointer shrink-0">
                    <Upload size={14} />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="rounded-2xl bg-[#F8FAFC] p-4 border border-[#D0DFEF]">
                <div className="text-xs font-bold uppercase tracking-wider text-[#081426]/50 mb-2">
                  Card Preview:
                </div>
                <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-[#D0DFEF]">
                  <div className="size-14 rounded-lg bg-[#F4F8FC] border border-[#D0DFEF] p-1 flex items-center justify-center shrink-0 overflow-hidden">
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="size-full object-contain"
                      />
                    ) : (
                      <ImageIcon size={20} className="text-[#081426]/40" />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-[#1A4C98]">
                      {formData.brand || 'Brand'} · {formData.category}
                    </span>
                    <h5 className="text-sm font-bold text-[#081426] leading-snug">
                      {formData.name || 'Product Title'}
                    </h5>
                    <span className="text-xs text-[#081426]/60">
                      Pack: {formData.size || 'Standard'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Feature on Home Page Toggle */}
              <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 cursor-pointer transition-colors hover:bg-amber-100/50">
                <input
                  type="checkbox"
                  checked={Boolean(formData.isFeatured)}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="size-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <div className="flex-1">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                    <Star size={13} className="fill-amber-500 text-amber-500" />
                    <span>Feature on Home Page</span>
                  </span>
                  <p className="text-[11px] font-medium text-amber-900/75 mt-0.5">
                    Includes this product in the Flagship Showcase and features its brand logo ({formData.brand || 'brand'}) in the Trusted Brands section on Home.
                  </p>
                </div>
              </label>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D0DFEF]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-[#D0DFEF] bg-white px-5 py-2.5 text-xs font-bold text-[#081426] hover:bg-[#F4F8FC] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#1A4C98] px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md hover:bg-[#123873] cursor-pointer"
                >
                  {editingProduct ? 'Save Changes' : 'Add to Products'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-[#D0DFEF] text-center">
            <div className="mx-auto size-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3">
              <Trash2 size={24} />
            </div>
            <h3 className="text-xl font-bold text-[#081426]">
              Remove from Catalog?
            </h3>
            <p className="text-sm text-[#081426]/75 mt-2">
              Are you sure you want to delete <strong className="text-[#081426]">"{productToDelete.name}"</strong>? This will immediately remove it from the public wholesale catalog.
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setProductToDelete(null)}
                className="rounded-xl border border-[#D0DFEF] bg-white px-5 py-2.5 text-xs font-bold text-[#081426] hover:bg-[#F4F8FC] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-xl bg-red-600 hover:bg-red-700 px-5 py-2.5 text-xs font-bold text-white shadow-md cursor-pointer"
              >
                Yes, Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BRAND ADD / EDIT MODAL */}
      {isBrandModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 md:p-8 shadow-2xl border border-[#D0DFEF] my-8 relative">
            <button
              onClick={() => setIsBrandModalOpen(false)}
              className="absolute right-5 top-5 text-[#081426]/40 hover:text-[#081426] cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1A4C98]">
                {editingBrand ? 'Update Showcase Brand' : 'New Partner Brand'}
              </span>
              <h3 className="text-2xl font-black text-[#081426] mt-0.5">
                {editingBrand ? 'Edit Trusted Brand' : 'Add Trusted Brand'}
              </h3>
              <p className="text-xs text-[#081426]/70 mt-1">
                Manage how this brand appears in the "Brands Trusted by Food Businesses" section on the home page.
              </p>
            </div>

            <form onSubmit={handleBrandFormSubmit} className="space-y-4">
              {/* Brand Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#081426]/70 mb-1">
                  Brand Name *
                </label>
                <input
                  type="text"
                  value={brandFormData.name}
                  onChange={(e) => setBrandFormData({ ...brandFormData, name: e.target.value })}
                  placeholder="e.g. Monin, Veeba, Barry Callebaut..."
                  className="w-full rounded-xl border border-[#D0DFEF] bg-[#F4F8FC] px-4 py-2.5 text-sm font-semibold text-[#081426] focus:border-[#1A4C98] focus:bg-white focus:outline-none"
                  required
                />
              </div>

              {/* Specialty & Origin */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#081426]/70 mb-1">
                    Specialty / Product Line
                  </label>
                  <input
                    type="text"
                    value={brandFormData.category}
                    onChange={(e) => setBrandFormData({ ...brandFormData, category: e.target.value })}
                    placeholder="e.g. Gourmet Syrups, Couverture & Cocoa"
                    className="w-full rounded-xl border border-[#D0DFEF] bg-[#F4F8FC] px-4 py-2.5 text-sm font-semibold text-[#081426] focus:border-[#1A4C98] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#081426]/70 mb-1">
                    Origin / Distribution Scope
                  </label>
                  <input
                    type="text"
                    value={brandFormData.origin}
                    onChange={(e) => setBrandFormData({ ...brandFormData, origin: e.target.value })}
                    placeholder="e.g. France, India, Belgium"
                    className="w-full rounded-xl border border-[#D0DFEF] bg-[#F4F8FC] px-4 py-2.5 text-sm font-semibold text-[#081426] focus:border-[#1A4C98] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Brand Logo Upload / URL */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#081426]/70 mb-1">
                  Brand Logo
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-[#1A4C98]/40 bg-[#1A4C98]/5 hover:bg-[#1A4C98]/10 px-4 py-2.5 text-xs font-bold text-[#1A4C98] cursor-pointer transition-colors w-full sm:w-auto">
                      <Upload size={15} />
                      <span>Upload Logo File (PNG / JPG / SVG)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBrandLogoUpload}
                        className="hidden"
                      />
                    </label>
                    {brandFormData.logo && (
                      <button
                        type="button"
                        onClick={() => setBrandFormData({ ...brandFormData, logo: '' })}
                        className="text-xs text-red-600 hover:text-red-800 font-bold cursor-pointer"
                      >
                        Remove Logo
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={brandFormData.logo}
                    onChange={(e) => setBrandFormData({ ...brandFormData, logo: e.target.value })}
                    placeholder="Or enter logo image URL (https://...)"
                    className="w-full rounded-xl border border-[#D0DFEF] bg-[#F4F8FC] px-4 py-2 text-xs text-[#081426] focus:border-[#1A4C98] focus:bg-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Real-time Logo Preview */}
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#081426]/60 mb-1">
                  Logo Live Preview (Home Showcase Card)
                </span>
                <div className="h-28 rounded-2xl border border-[#D0DFEF] bg-[#F8FAFD] p-4 flex items-center justify-center">
                  {brandFormData.logo ? (
                    <img
                      src={brandFormData.logo}
                      alt="Brand preview"
                      className="max-h-20 max-w-full object-contain"
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-xl bg-[#1A4C98] text-white flex items-center justify-center font-black text-lg shadow-sm">
                        {(brandFormData.name || 'GT').substring(0, 2).toUpperCase()}
                      </div>
                      <div className="text-left">
                        <span className="font-black text-sm text-[#081426] block">
                          {brandFormData.name || 'Brand Name'}
                        </span>
                        <span className="text-[11px] font-bold text-[#00A3E0]">
                          Avatar Fallback (When no logo image is set)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Showcase on Home Page Toggle */}
              <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 cursor-pointer transition-colors hover:bg-emerald-100/50">
                <input
                  type="checkbox"
                  checked={Boolean(brandFormData.isFeatured)}
                  onChange={(e) => setBrandFormData({ ...brandFormData, isFeatured: e.target.checked })}
                  className="size-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <div className="flex-1">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                    <Star size={13} className="fill-emerald-600 text-emerald-600" />
                    <span>Feature in Home "Brands Trusted by Food Businesses"</span>
                  </span>
                  <p className="text-[11px] font-medium text-emerald-900/75 mt-0.5">
                    When checked, this brand logo is featured on the home page showcase with direct link to wholesale catalogue.
                  </p>
                </div>
              </label>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D0DFEF]">
                <button
                  type="button"
                  onClick={() => setIsBrandModalOpen(false)}
                  className="rounded-xl border border-[#D0DFEF] bg-white px-5 py-2.5 text-xs font-bold text-[#081426] hover:bg-[#F4F8FC] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#1A4C98] px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md hover:bg-[#123873] cursor-pointer"
                >
                  {editingBrand ? 'Save Brand Changes' : 'Add to Trusted Brands'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BRAND DELETE CONFIRMATION DIALOG */}
      {brandToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-[#D0DFEF] text-center">
            <div className="mx-auto size-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3">
              <Trash2 size={24} />
            </div>
            <h3 className="text-xl font-bold text-[#081426]">
              Remove Brand from Showcase?
            </h3>
            <p className="text-sm text-[#081426]/75 mt-2">
              Are you sure you want to delete brand <strong className="text-[#081426]">"{brandToDelete.name}"</strong>? It will no longer appear in the Trusted Brands showcase.
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setBrandToDelete(null)}
                className="rounded-xl border border-[#D0DFEF] bg-white px-5 py-2.5 text-xs font-bold text-[#081426] hover:bg-[#F4F8FC] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmBrandDelete}
                className="rounded-xl bg-red-600 hover:bg-red-700 px-5 py-2.5 text-xs font-bold text-white shadow-md cursor-pointer"
              >
                Yes, Delete Brand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POSTGRESQL & PGADMIN 4 CLOUD SYNC MODAL */}
      {isCloudModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-[#D0DFEF] my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#D0DFEF]">
              <div className="flex items-center gap-2.5">
                <div className="size-10 rounded-xl bg-[#1A4C98]/10 text-[#1A4C98] flex items-center justify-center">
                  <Database size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#081426] uppercase">
                    PostgreSQL Database &amp; pgAdmin 4 Sync
                  </h3>
                  <p className="text-xs text-[#081426]/70">
                    Host your catalog on PostgreSQL and manage products directly from pgAdmin 4 on your PC.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCloudModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="my-5 space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              {/* Current Status */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  cloudConnected
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                    : 'bg-amber-50/80 border-amber-300 text-amber-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  {cloudConnected ? (
                    <Database size={24} className="text-emerald-600 shrink-0" />
                  ) : (
                    <CloudOff size={24} className="text-amber-600 shrink-0" />
                  )}
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider">
                      {cloudConnected ? 'Status: PostgreSQL Active & Syncing' : 'Status: Offline (Local Browser Only)'}
                    </span>
                    <p className="text-xs opacity-80 mt-0.5">
                      {cloudConnected
                        ? 'Edits made in pgAdmin 4 or on this portal broadcast to mobile phones & web visitors in real time.'
                        : 'Changes are currently saved only to this computer. Connect PostgreSQL to manage from pgAdmin 4 and sync with mobile.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Setup Guide */}
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#D0DFEF] text-xs space-y-3">
                <span className="font-black text-[#1A4C98] uppercase tracking-wider block">
                  Quick Setup Guide (PostgreSQL + pgAdmin 4):
                </span>

                <div className="space-y-2 text-[#081426]/80 font-medium">
                  <div className="flex items-start gap-2">
                    <span className="size-5 rounded-full bg-[#1A4C98]/10 text-[#1A4C98] font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                    <p>
                      Create a free cloud PostgreSQL database at{' '}
                      <a
                        href="https://supabase.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1A4C98] font-bold underline inline-flex items-center gap-1"
                      >
                        supabase.com <ExternalLink size={11} />
                      </a>
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="size-5 rounded-full bg-[#1A4C98]/10 text-[#1A4C98] font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                    <div className="w-full">
                      <p className="mb-1.5">
                        Run the SQL schema below to create the <code className="bg-white px-1 py-0.5 rounded border border-gray-200 font-mono text-[11px]">products</code> table and enable real-time mobile sync:
                      </p>
                      <button
                        type="button"
                        onClick={handleCopySchema}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#1A4C98]/30 bg-white text-[#1A4C98] font-bold hover:bg-sky-50 transition-colors cursor-pointer text-xs"
                      >
                        {copiedSchema ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                        <span>{copiedSchema ? 'SQL Schema Copied!' : 'Copy PostgreSQL SQL Schema'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="size-5 rounded-full bg-[#1A4C98]/10 text-[#1A4C98] font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                    <div className="w-full">
                      <p className="font-bold text-[#081426] mb-1">To connect in pgAdmin 4 on your PC:</p>
                      <ul className="list-disc list-inside space-y-0.5 text-xs text-[#081426]/70 pl-1 font-mono">
                        <li>In pgAdmin 4 &rarr; <strong>Servers</strong> &rarr; <strong>Register</strong> &rarr; <strong>Server</strong></li>
                        <li><strong>General &rarr; Name</strong>: <span className="text-[#1A4C98]">Global Trades DB</span></li>
                        <li><strong>Connection &rarr; Host</strong>: <span className="text-[#1A4C98]">db.[your-project-ref].supabase.co</span></li>
                        <li><strong>Port</strong>: <span className="text-[#1A4C98]">5432</span> | <strong>Maintenance DB</strong>: <span className="text-[#1A4C98]">postgres</span></li>
                        <li><strong>Username</strong>: <span className="text-[#1A4C98]">postgres</span> | <strong>Password</strong>: <span className="text-[#1A4C98]">[Your DB Password]</span></li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="size-5 rounded-full bg-[#1A4C98]/10 text-[#1A4C98] font-bold flex items-center justify-center shrink-0 text-[10px]">4</span>
                    <p>
                      In Supabase &rarr; <strong>Project Settings</strong> &rarr; <strong>API</strong>, copy your <strong>Project URL</strong> and <strong>anon public key</strong>, paste them below, and click Connect!
                    </p>
                  </div>
                </div>
              </div>

              {/* PostgreSQL Supabase Credentials Form */}
              <form onSubmit={handleSaveSupabaseConfig} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#081426] mb-1 uppercase tracking-wider">
                    Supabase Project URL
                  </label>
                  <input
                    type="url"
                    value={supabaseUrlInput}
                    onChange={(e) => setSupabaseUrlInput(e.target.value)}
                    placeholder="https://xyzabcdefghijklmnop.supabase.co"
                    className="w-full rounded-xl border border-[#D0DFEF] p-2.5 font-mono text-xs focus:border-[#1A4C98] focus:outline-none bg-[#F4F8FC]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#081426] mb-1 uppercase tracking-wider">
                    Supabase Anon Public API Key
                  </label>
                  <input
                    type="text"
                    value={supabaseKeyInput}
                    onChange={(e) => setSupabaseKeyInput(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full rounded-xl border border-[#D0DFEF] p-2.5 font-mono text-xs focus:border-[#1A4C98] focus:outline-none bg-[#F4F8FC]"
                    required
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  {cloudConnected ? (
                    <button
                      type="button"
                      onClick={handleDisconnectCloud}
                      className="text-xs font-bold text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                    >
                      Disconnect PostgreSQL
                    </button>
                  ) : (
                    <span />
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCloudModalOpen(false)}
                      className="rounded-xl border border-[#D0DFEF] bg-white px-4 py-2 text-xs font-bold text-[#081426] hover:bg-[#F4F8FC] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSyncing}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#1A4C98] px-5 py-2 text-xs font-black uppercase tracking-wider text-white shadow-md hover:bg-[#123873] cursor-pointer disabled:opacity-50"
                    >
                      {isSyncing && <RefreshCw size={13} className="animate-spin" />}
                      <span>{isSyncing ? 'Connecting & Syncing...' : 'Connect & Sync to PostgreSQL'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
