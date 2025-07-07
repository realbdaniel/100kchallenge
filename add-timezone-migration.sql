-- Timezone Migration Script
-- Run this in your Supabase SQL editor to add timezone support

-- Add timezone column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC';

-- Update existing users to auto-detect their timezone on next login
-- (This will be handled automatically by the settings page)

-- Verify the column was added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'timezone'; 