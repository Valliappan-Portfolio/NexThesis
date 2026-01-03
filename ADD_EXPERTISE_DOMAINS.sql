-- Add expertise_domains and languages_array columns to professionals table
-- This allows storing multiple domains and languages as arrays

ALTER TABLE professionals
ADD COLUMN IF NOT EXISTS expertise_domains TEXT[],
ADD COLUMN IF NOT EXISTS languages_array TEXT[];

-- Create indexes for faster searches
CREATE INDEX IF NOT EXISTS idx_professionals_expertise_domains ON professionals USING GIN (expertise_domains);
CREATE INDEX IF NOT EXISTS idx_professionals_languages_array ON professionals USING GIN (languages_array);

-- Optional: Update existing records to have expertise_domains based on sector
-- UPDATE professionals
-- SET expertise_domains = ARRAY[sector]
-- WHERE expertise_domains IS NULL AND sector IS NOT NULL;

-- Optional: Update existing records to have languages_array based on languages string
-- UPDATE professionals
-- SET languages_array = string_to_array(languages, ', ')
-- WHERE languages_array IS NULL AND languages IS NOT NULL;
