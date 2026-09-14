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
} from 'lucide-react';
import { CATALOG_CATEGORIES, CATALOG_BRANDS } from '@/data/catalogProducts';
import { BRANDING, CONTACT } from '@/constants/theme';
import {
  saveFirebaseConfig,
  removeFirebaseConfig,
  isCloudConfigured,
  saveCatalogToCloud,
} from '@/lib/firebase';

export default function AdminPage({
  products = [],
  addProduct,
  updateProduct,
  toggleFeatured,
  deleteProduct,
  resetCatalog,
  onNavigateHome,
  onNavigateProducts,
}) {
  const [authed, setAuthed] = useState(() => {
    return sessionStorage.getItem('gt_admin_auth') === 'true';
  });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Dashboard controls
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [firebaseConfigInput, setFirebaseConfigInput] = useState('');
  const [cloudConnected, setCloudConnected] = useState(() => isCloudConfigured());
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
    if (username.trim() === 'admin' && password.trim() === 'admin123') {
      setAuthed(true);
      sessionStorage.setItem('gt_admin_auth', 'true');
      setAuthError('');
      showToast('Welcome back, Admin!');
    } else {
      setAuthError('Invalid credentials. Use demo: admin / admin123');
    }
  };

  const handleLogout = () => {
    setAuthed(false);
    sessionStorage.removeItem('gt_admin_auth');
  };

  // Handle saving Firebase Configuration
  const handleSaveFirebaseConfig = async (e) => {
    e.preventDefault();
    try {
      let configObj = null;
      const raw = firebaseConfigInput.trim();

      if (raw.includes('{') && raw.includes('}')) {
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const jsonStr = jsonMatch[0]
            .replace(/([a-zA-Z0-9_]+)\s*:/g, '"$1":')
            .replace(/'/g, '"')
            .replace(/,\s*}/g, '}');
          try {
            configObj = JSON.parse(jsonStr);
          } catch (_) {
            const extract = (key) => {
              const m = raw.match(new RegExp(`${key}\\s*:\\s*["']([^"']+)["']`));
              return m ? m[1] : '';
            };
            configObj = {
              apiKey: extract('apiKey'),
              authDomain: extract('authDomain'),
              projectId: extract('projectId'),
              storageBucket: extract('storageBucket'),
              messagingSenderId: extract('messagingSenderId'),
              appId: extract('appId'),
            };
          }
        }
      }

      if (!configObj || !configObj.apiKey || !configObj.projectId) {
        alert('Please paste a valid Firebase configuration containing at least apiKey and projectId.');
        return;
      }

      saveFirebaseConfig(configObj);
      setCloudConnected(true);
      showToast('Firebase connected! Syncing catalog to cloud...');

      await saveCatalogToCloud(products);
      showToast('Catalog synced to Firebase! Changes are now live across all devices.');
      setIsCloudModalOpen(false);
    } catch (err) {
      console.error('Error configuring Firebase:', err);
      alert('Failed to connect Firebase: ' + err.message);
    }
  };

  const handleDisconnectCloud = () => {
    if (confirm('Disconnect Firebase cloud sync? Changes will only be saved to this local browser.')) {
      removeFirebaseConfig();
      setCloudConnected(false);
      showToast('Disconnected from cloud.');
      setIsCloudModalOpen(false);
    }
  };

  const handleManualCloudPush = async () => {
    if (!cloudConnected) {
      setIsCloudModalOpen(true);
      return;
    }
    showToast('Pushing catalog to cloud...');
    const ok = await saveCatalogToCloud(products);
    if (ok) {
      showToast('Catalog updated in Cloud! All mobile phones & visitors will refresh.');
    } else {
      showToast('Failed to push to cloud. Check your Firebase credentials.');
    }
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
      image: product.image || '',
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
    return products.filter((p) => {
      if (showFeaturedOnly && !p.isFeatured) {
        return false;
      }
      const matchesCategory =
        selectedCategory === 'All' || p.category === selectedCategory;
      const matchesBrand =
        selectedBrand === 'All' || p.brand === selectedBrand;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        (p.size && p.size.toLowerCase().includes(query));

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
    return ['All', ...Array.from(new Set(products.map((p) => p.brand).filter(Boolean))).sort()];
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
                placeholder="admin"
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
              <span>View Public Catalog</span>
            </button>
            <span className="text-xs font-bold text-[#081426]/40">|</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800">
              <span className="size-2 rounded-full bg-emerald-700 animate-pulse" />
              Admin Session Active
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Cloud Sync Status Indicator & Button */}
            <button
              onClick={() => setIsCloudModalOpen(true)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                cloudConnected
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  : 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100'
              }`}
              title="Configure real-time cross-device cloud sync"
            >
              {cloudConnected ? (
                <>
                  <Cloud size={14} className="text-emerald-600" />
                  <span>Cloud Synced (All Devices)</span>
                </>
              ) : (
                <>
                  <CloudOff size={14} className="text-amber-600" />
                  <span>Connect Cloud Sync</span>
                </>
              )}
            </button>

            {/* Force Push to Cloud Button */}
            {cloudConnected && (
              <button
                onClick={handleManualCloudPush}
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-white px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer"
                title="Force push current catalog to cloud immediately"
              >
                <RefreshCw size={13} />
                <span>Sync Cloud Now</span>
              </button>
            )}

            {/* Export Catalog */}
            <button
              onClick={handleExportCatalog}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D0DFEF] bg-white px-3 py-1.5 text-xs font-bold text-[#081426]/80 hover:bg-sky-50 hover:text-[#1A4C98] transition-colors cursor-pointer"
              title="Download or copy catalog JSON"
            >
              <Download size={13} />
              <span>Export Catalog</span>
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
              <span>Reset Catalog</span>
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
                            src={p.image}
                            alt={p.name}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                            className="size-full object-contain"
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
                                ? `Removed "${p.name}" from Home Showcase`
                                : `Added "${p.name}" to Home Showcase!`
                            );
                          }}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                            p.isFeatured
                              ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-sm hover:bg-amber-200'
                              : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200'
                          }`}
                          title={p.isFeatured ? 'Click to remove from Home showcase' : 'Click to feature on Home showcase'}
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
                    Includes this product in the Flagship Wholesale Showcase on the home overview.
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
                  {editingProduct ? 'Save Changes' : 'Add to Catalog'}
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

      {/* CLOUD DATABASE / FIREBASE SYNC MODAL */}
      {isCloudModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-[#D0DFEF]">
            <div className="flex items-center justify-between pb-4 border-b border-[#D0DFEF]">
              <div className="flex items-center gap-2.5">
                <div className="size-10 rounded-xl bg-[#1A4C98]/10 text-[#1A4C98] flex items-center justify-center">
                  <Database size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#081426] uppercase">
                    Real-time Cloud Database (Firebase)
                  </h3>
                  <p className="text-xs text-[#081426]/70">
                    Syncs catalog and featured products instantly across phones, laptops & visitors.
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

            <div className="my-5 space-y-4">
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
                    <Cloud size={24} className="text-emerald-600" />
                  ) : (
                    <CloudOff size={24} className="text-amber-600" />
                  )}
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider">
                      {cloudConnected ? 'Status: Real-Time Cloud Active' : 'Status: Offline (Local Device Only)'}
                    </span>
                    <p className="text-xs opacity-80 mt-0.5">
                      {cloudConnected
                        ? 'Every inventory edit or featured item change is broadcasting to all visitors and phones in real-time.'
                        : 'Changes are currently saved only to this browser. Connect Firebase to sync with mobile phones.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step-by-step setup guide */}
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#D0DFEF] text-xs space-y-2">
                <span className="font-bold text-[#1A4C98] uppercase tracking-wider block">
                  Quick Free Setup (Takes 2 Minutes):
                </span>
                <ol className="list-decimal list-inside space-y-1.5 text-[#081426]/80 font-medium">
                  <li>
                    Go to{' '}
                    <a
                      href="https://console.firebase.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1A4C98] font-bold underline inline-flex items-center gap-1"
                    >
                      console.firebase.google.com <ExternalLink size={11} />
                    </a>{' '}
                    and create a free project.
                  </li>
                  <li>In Project Settings, click <strong>Add Web App</strong> and copy the <code className="bg-white px-1 py-0.5 rounded border border-gray-200">firebaseConfig</code> snippet.</li>
                  <li>Under Build, click <strong>Cloud Firestore</strong> &rarr; <strong>Create Database</strong> (start in Test mode).</li>
                  <li>Paste the configuration snippet below and click <strong>Connect &amp; Sync Now</strong>!</li>
                </ol>
              </div>

              {/* Paste Config Area */}
              <form onSubmit={handleSaveFirebaseConfig} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#081426] mb-1 uppercase tracking-wider">
                    Firebase Config JSON or Snippet
                  </label>
                  <textarea
                    rows={4}
                    value={firebaseConfigInput}
                    onChange={(e) => setFirebaseConfigInput(e.target.value)}
                    placeholder={`const firebaseConfig = {\n  apiKey: "AIzaSy...",\n  projectId: "your-project-id",\n  ...\n};`}
                    className="w-full rounded-xl border border-[#D0DFEF] p-3 font-mono text-xs focus:border-[#1A4C98] focus:outline-none bg-[#F4F8FC]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  {cloudConnected ? (
                    <button
                      type="button"
                      onClick={handleDisconnectCloud}
                      className="text-xs font-bold text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                    >
                      Disconnect Cloud
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
                      className="rounded-xl bg-[#1A4C98] px-5 py-2 text-xs font-black uppercase tracking-wider text-white shadow-md hover:bg-[#123873] cursor-pointer"
                    >
                      Connect &amp; Sync Now
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
