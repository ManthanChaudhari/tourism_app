import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from "@/lib/supabase/server"

// GET - Fetch current settings (public endpoint)
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()
    // Get settings from database
    const { data: settingsData, error } = await supabase
      .from('site_settings')
      .select('packages_visible, hotels_visible, cars_visible')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error fetching settings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch settings' },
        { status: 500 }
      );
    }

    // If no settings exist, return defaults (all visible)
    const settings = settingsData ? {
      packages_visible: settingsData.packages_visible ?? true,
      hotels_visible: settingsData.hotels_visible ?? true,
      cars_visible: settingsData.cars_visible ?? true
    } : {
      packages_visible: true,
      hotels_visible: true,
      cars_visible: true
    };

    return NextResponse.json({
      success: true,
      settings
    });

  } catch (error) {
    console.error('Error in GET /api/settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}