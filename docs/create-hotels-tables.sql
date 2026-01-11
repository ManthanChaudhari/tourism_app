-- Hotels Management Tables

-- Main hotels table
CREATE TABLE public.hotels (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    destination_id uuid REFERENCES public.locations(id),
    address text NOT NULL,
    star_rating integer CHECK (star_rating >= 1 AND star_rating <= 5),
    status text DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    short_description text,
    check_in_time time DEFAULT '14:00:00',
    check_out_time time DEFAULT '11:00:00',
    contact_number text,
    email text,
    thumbnail_image text,
    gallery_images text[], -- Array of image URLs
    amenities text[], -- Array of amenity names
    cancellation_policy text,
    house_rules text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Hotel rooms table (separate for room management)
CREATE TABLE public.hotel_rooms (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id uuid NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
    room_name text NOT NULL,
    max_guests integer NOT NULL DEFAULT 2,
    price_per_night decimal(10,2) NOT NULL,
    room_size text, -- e.g., "25 sqm"
    bed_type text, -- e.g., "King Size", "Twin Beds"
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_hotels_destination ON public.hotels(destination_id);
CREATE INDEX idx_hotels_status ON public.hotels(status);
CREATE INDEX idx_hotels_star_rating ON public.hotels(star_rating);
CREATE INDEX idx_hotel_rooms_hotel_id ON public.hotel_rooms(hotel_id);

-- Add RLS policies (Row Level Security)
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_rooms ENABLE ROW LEVEL SECURITY;

-- Allow public read access for published hotels
CREATE POLICY "Public can view published hotels" ON public.hotels
    FOR SELECT USING (status = 'published');

-- Allow public read access for rooms of published hotels
CREATE POLICY "Public can view rooms of published hotels" ON public.hotel_rooms
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.hotels 
            WHERE hotels.id = hotel_rooms.hotel_id 
            AND hotels.status = 'published'
        )
    );

-- Admin policies (assuming admin role exists)
CREATE POLICY "Admins can manage hotels" ON public.hotels
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins can manage hotel rooms" ON public.hotel_rooms
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );