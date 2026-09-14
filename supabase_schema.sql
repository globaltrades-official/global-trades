-- ====================================================================
-- GLOBAL TRADES: PostgreSQL Database Schema (pgAdmin 4 & Supabase)
-- ====================================================================
-- Run this script in pgAdmin 4 or Supabase SQL Editor to initialize
-- your wholesale product catalog.

-- 1. Create the products table
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

-- 2. Create index on featured and category for fast filtering
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products (is_featured);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 4. Create Security Policies
-- Policy: Allow public read access (for mobile visitors & web clients)
DROP POLICY IF EXISTS "Allow public read access" ON public.products;
CREATE POLICY "Allow public read access" ON public.products
  FOR SELECT USING (true);

-- Policy: Allow write/update access
DROP POLICY IF EXISTS "Allow write access" ON public.products;
CREATE POLICY "Allow write access" ON public.products
  FOR ALL USING (true) WITH CHECK (true);

-- 5. Enable Real-Time Replication
-- This broadcasts row updates to mobile phones & PC browsers within milliseconds
-- whenever you change a row in pgAdmin 4 or the website!
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'products'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
  END IF;
END $$;
