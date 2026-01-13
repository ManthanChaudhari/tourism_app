import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from "@/lib/supabase/server"

// GET - Fetch current settings
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()
    // Try to get settings from database
    const { data: settingsData, error } = await supabase
      .from('site_settings')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error fetching settings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch settings' },
        { status: 500 }
      );
    }

    // If no settings exist, return defaults
    const defaultSettings = {
      packages_visible: true,
      hotels_visible: true,
      cars_visible: true
    };

    const settings = settingsData ? {
      packages_visible: settingsData.packages_visible ?? true,
      hotels_visible: settingsData.hotels_visible ?? true,
      cars_visible: settingsData.cars_visible ?? true
    } : defaultSettings;

    return NextResponse.json({
      success: true,
      settings
    });

  } catch (error) {
    console.error('Error in GET /api/admin/settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update settings
export async function PUT(request) {
  try {
    const supabase = await createSupabaseServerClient()
    const { settings } = await request.json();

    if (!settings) {
      return NextResponse.json(
        { error: 'Settings data is required' },
        { status: 400 }
      );
    }

    // Validate settings structure
    const validKeys = ['packages_visible', 'hotels_visible', 'cars_visible'];
    const filteredSettings = {};
    
    validKeys.forEach(key => {
      if (typeof settings[key] === 'boolean') {
        filteredSettings[key] = settings[key];
      }
    });

    if (Object.keys(filteredSettings).length === 0) {
      return NextResponse.json(
        { error: 'No valid settings provided' },
        { status: 400 }
      );
    }

    // Check if settings record exists
    const { data: existingSettings } = await supabase
      .from('site_settings')
      .select('id')
      .single();

    let result;
    
    if (existingSettings) {
      // Update existing settings
      result = await supabase
        .from('site_settings')
        .update({
          ...filteredSettings,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSettings.id)
        .select()
        .single();
    } else {
      // Create new settings record
      result = await supabase
        .from('site_settings')
        .insert({
          ...filteredSettings,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
    }

    if (result.error) {
      console.error('Error saving settings:', result.error);
      return NextResponse.json(
        { error: 'Failed to save settings' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      settings: {
        packages_visible: result.data.packages_visible,
        hotels_visible: result.data.hotels_visible,
        cars_visible: result.data.cars_visible
      }
    });

  } catch (error) {
    console.error('Error in PUT /api/admin/settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}