-- Create site_settings table for managing website section visibility
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    packages_visible BOOLEAN DEFAULT true NOT NULL,
    hotels_visible BOOLEAN DEFAULT true NOT NULL,
    cars_visible BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create RLS policies for site_settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated users can read settings (for public API access)
CREATE POLICY "Anyone can read site settings" ON site_settings
    FOR SELECT USING (true);

-- Policy: Only admins can modify settings (you may need to adjust this based on your auth setup)
CREATE POLICY "Only admins can modify site settings" ON site_settings
    FOR ALL USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Insert default settings if none exist
INSERT INTO site_settings (packages_visible, hotels_visible, cars_visible)
SELECT true, true, true
WHERE NOT EXISTS (SELECT 1 FROM site_settings);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_site_settings_updated_at 
    BEFORE UPDATE ON site_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();