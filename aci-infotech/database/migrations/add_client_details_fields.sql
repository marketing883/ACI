-- Migration: Add client_size and client_location columns to case_studies table
-- Run this in your Supabase SQL Editor

-- Add client_size column (VARCHAR for values like "1-50 employees", "Fortune 500")
ALTER TABLE case_studies
ADD COLUMN IF NOT EXISTS client_size VARCHAR(100);

-- Add client_location column
ALTER TABLE case_studies
ADD COLUMN IF NOT EXISTS client_location VARCHAR(255);

-- If columns already exist as TEXT, change them to VARCHAR:
-- ALTER TABLE case_studies ALTER COLUMN client_size TYPE VARCHAR(100);
-- ALTER TABLE case_studies ALTER COLUMN client_location TYPE VARCHAR(255);

-- Add comments for documentation
COMMENT ON COLUMN case_studies.client_size IS 'Company size category (e.g., "Fortune 500", "1001-5000 employees")';
COMMENT ON COLUMN case_studies.client_location IS 'Client headquarters or primary location (e.g., "New York, NY")';
