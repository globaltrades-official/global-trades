import { createClient } from '@supabase/supabase-js';

const CONFIG_KEY = 'gt_supabase_config_v1';

// Global Trades production database credentials (safe for public clients with Row Level Security)
const DEFAULT_SUPABASE_URL = 'https://osfewvmfxbghayaefkve.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_34n8tcaN2jF3eJLYtpBlLA_xiriaDf8';

let supabaseInstance = null;
let currentConfigSig = null;

/**
 * Get active Supabase configuration from localStorage, Vite env vars, or default project credentials.
 */
export function getSupabaseConfig() {
  try {
    const stored = localStorage.getItem(CONFIG_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.url && parsed.anonKey) {
        return {
          url: parsed.url.trim(),
          anonKey: parsed.anonKey.trim(),
        };
      }
    }
  } catch (e) {
    console.warn('Failed to parse stored Supabase config:', e);
  }

  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (envUrl && envKey) {
    return {
      url: envUrl.trim(),
      anonKey: envKey.trim(),
    };
  }

  // Built-in default so all mobile phones and visitors connect automatically
  if (DEFAULT_SUPABASE_URL && DEFAULT_SUPABASE_KEY) {
    return {
      url: DEFAULT_SUPABASE_URL,
      anonKey: DEFAULT_SUPABASE_KEY,
    };
  }

  return null;
}

/**
 * Check whether Supabase (PostgreSQL) credentials are configured.
 */
export function isSupabaseConfigured() {
  return getSupabaseConfig() !== null;
}

/**
 * Save user-provided Supabase credentials to localStorage and dispatch event.
 */
export function saveSupabaseConfig(url, anonKey) {
  if (!url || !anonKey) return false;
  try {
    const cleanUrl = url.trim();
    const cleanKey = anonKey.trim();
    localStorage.setItem(
      CONFIG_KEY,
      JSON.stringify({ url: cleanUrl, anonKey: cleanKey })
    );
    supabaseInstance = null;
    currentConfigSig = null;
    window.dispatchEvent(new Event('supabase-config-updated'));
    return true;
  } catch (e) {
    console.error('Failed to save Supabase config to localStorage:', e);
    return false;
  }
}

/**
 * Clear stored Supabase credentials.
 */
export function clearSupabaseConfig() {
  try {
    localStorage.removeItem(CONFIG_KEY);
    supabaseInstance = null;
    currentConfigSig = null;
    window.dispatchEvent(new Event('supabase-config-updated'));
  } catch (e) {
    console.error('Failed to clear Supabase config:', e);
  }
}

/**
 * Get the Supabase client instance.
 */
export function getSupabaseClient() {
  const config = getSupabaseConfig();
  if (!config) return null;

  const sig = `${config.url}::${config.anonKey}`;
  if (supabaseInstance && currentConfigSig === sig) {
    return supabaseInstance;
  }

  try {
    supabaseInstance = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: false,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
    currentConfigSig = sig;
    return supabaseInstance;
  } catch (e) {
    console.error('Failed to initialize Supabase client:', e);
    return null;
  }
}

/**
 * Transform a database row from the `products` table into application product format.
 */
export function transformPostgresRow(row) {
  if (!row) return null;
  const safeName = (row.name || '').replace(/[^a-zA-Z0-9]/g, '_');
  const defaultImage = `/catalog_images/${safeName}.jpg`;

  return {
    id: Number(row.id),
    name: row.name || '',
    brand: row.brand || '',
    category: row.category || '',
    origin: row.origin || '',
    size: row.pack_size || '',
    shelfLife: row.shelf_life || '',
    packSize: row.pack_size || '',
    description: row.description || '',
    features: Array.isArray(row.features) ? row.features : [],
    isFeatured: Boolean(row.is_featured),
    image: row.custom_image || defaultImage,
    customImage: row.custom_image || null,
  };
}

/**
 * Transform application product format into a PostgreSQL `products` table row.
 */
export function transformProductToRow(p) {
  const safeName = (p.name || '').replace(/[^a-zA-Z0-9]/g, '_');
  const defaultImage = `/catalog_images/${safeName}.jpg`;

  return {
    id: Number(p.id),
    name: p.name || '',
    brand: p.brand || '',
    category: p.category || '',
    origin: p.origin || '',
    shelf_life: p.shelfLife || '',
    pack_size: p.size || p.packSize || '',
    description: p.description || '',
    features: Array.isArray(p.features) ? p.features : [],
    is_featured: Boolean(p.isFeatured),
    custom_image: p.customImage || (p.image && p.image !== defaultImage ? p.image : null),
    updated_at: new Date().toISOString(),
  };
}

/**
 * Subscribe to real-time PostgreSQL updates on the `products` table.
 * Whenever anyone updates a row in pgAdmin 4 or on the web, this callback fires.
 */
export function subscribeToPostgresCatalog(onRowChange, onReloadNeeded) {
  const client = getSupabaseClient();
  if (!client) {
    return () => {};
  }

  try {
    const channel = client
      .channel('realtime:public:products')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            if (payload.new && payload.new.id >= 900000) return;
            const transformed = transformPostgresRow(payload.new);
            if (transformed) onRowChange(transformed);
          } else if (payload.eventType === 'DELETE') {
            if (payload.old?.id && payload.old.id < 900000 && onReloadNeeded) {
              onReloadNeeded(payload.old.id);
            }
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[PostgreSQL Realtime] Connected and listening to table changes.');
        }
      });

    return () => {
      client.removeChannel(channel);
    };
  } catch (e) {
    console.error('Error subscribing to PostgreSQL real-time changes:', e);
    return () => {};
  }
}

/**
 * Fetch all products from the PostgreSQL `products` table.
 */
export function fetchCatalogFromPostgres() {
  const client = getSupabaseClient();
  if (!client) return Promise.resolve(null);

  return client
    .from('products')
    .select('*')
    .lt('id', 900000)
    .order('id', { ascending: true })
    .then(({ data, error }) => {
      if (error) {
        console.error('Error fetching catalog from PostgreSQL:', error);
        return null;
      }
      if (!Array.isArray(data) || data.length === 0) {
        return [];
      }
      return data.map(transformPostgresRow);
    })
    .catch((err) => {
      console.error('PostgreSQL fetch error:', err);
      return null;
    });
}

/**
 * Update or insert a single product in PostgreSQL.
 */
export async function updateProductInPostgres(product) {
  const client = getSupabaseClient();
  if (!client) return false;

  const row = transformProductToRow(product);
  try {
    const { error } = await client.from('products').upsert([row], { onConflict: 'id' });
    if (error) {
      console.error('Failed to update product in PostgreSQL:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('PostgreSQL product update error:', e);
    return false;
  }
}

/**
 * Batch push/upsert the entire catalog into PostgreSQL.
 */
export async function saveCatalogToPostgres(products) {
  const client = getSupabaseClient();
  if (!client) return false;

  const filteredProducts = (products || []).filter((p) => Number(p.id) < 900000);
  const rows = filteredProducts.map(transformProductToRow);
  const CHUNK_SIZE = 50;

  try {
    for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
      const chunk = rows.slice(i, i + CHUNK_SIZE);
      const { error } = await client.from('products').upsert(chunk, { onConflict: 'id' });
      if (error) {
        console.error(`Failed to upsert chunk ${i} to PostgreSQL:`, error);
        throw error;
      }
    }
    return true;
  } catch (e) {
    console.error('Failed to batch save catalog to PostgreSQL:', e);
    return false;
  }
}

/**
 * Fetch list of featured brand names from Supabase (system config row 999999).
 */
export async function fetchFeaturedBrandNamesFromPostgres() {
  const client = getSupabaseClient();
  if (!client) return null;
  try {
    const { data, error } = await client
      .from('products')
      .select('features')
      .eq('id', 999999)
      .single();

    if (error || !data || !Array.isArray(data.features)) return null;
    return data.features;
  } catch (e) {
    return null;
  }
}

/**
 * Save list of featured brand names to Supabase (system config row 999999).
 */
export async function saveFeaturedBrandNamesToPostgres(brandNames) {
  const client = getSupabaseClient();
  if (!client) return false;
  try {
    const { error } = await client.from('products').upsert([
      {
        id: 999999,
        name: '__SYSTEM_FEATURED_BRANDS__',
        brand: '__SYSTEM__',
        category: '__CONFIG__',
        features: brandNames,
        is_featured: false,
        updated_at: new Date().toISOString(),
      },
    ]);
    if (error) {
      console.warn('Failed to save featured brands to PostgreSQL:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('saveFeaturedBrandNamesToPostgres error:', e);
    return false;
  }
}

/**
 * Subscribe to realtime updates for featured brands.
 */
export function subscribeToFeaturedBrands(onFeaturedBrandsChange) {
  const client = getSupabaseClient();
  if (!client) return () => {};

  try {
    const channel = client
      .channel('realtime:public:system_brands')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products', filter: 'id=eq.999999' },
        (payload) => {
          if (payload.new && Array.isArray(payload.new.features)) {
            onFeaturedBrandsChange(payload.new.features);
          }
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  } catch (e) {
    return () => {};
  }
}
