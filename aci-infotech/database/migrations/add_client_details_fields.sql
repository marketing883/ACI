-- Migration: Add client_size and client_location columns to case_studies table
-- Run this in your Supabase SQL Editor

-- Add client_size column
ALTER TABLE case_studies
ADD COLUMN IF NOT EXISTS client_size TEXT;

-- Add client_location column
ALTER TABLE case_studies
ADD COLUMN IF NOT EXISTS client_location TEXT;

-- Add comments for documentation
COMMENT ON COLUMN case_studies.client_size IS 'Company size category (e.g., "Fortune 500", "1001-5000 employees")';
COMMENT ON COLUMN case_studies.client_location IS 'Client headquarters or primary location (e.g., "New York, NY")';
