# Hotel Images Storage Setup Guide

This guide explains how to set up the hotel-images storage bucket and configure proper security policies in Supabase.

## Overview

The hotel management system uses Supabase Storage to handle image uploads for hotels. This includes:
- **Thumbnail images**: Main hotel images displayed in listings
- **Gallery images**: Multiple images showcasing the hotel

## Storage Structure

```
hotel-images/
├── hotels/
│   ├── {timestamp}-{filename}     # Thumbnail images
│   └── gallery/
│       └── {timestamp}-{filename} # Gallery images
```

## Setup Instructions

### 1. Create Storage Bucket (Automatic)

The storage bucket is created automatically when you first use the hotel upload functionality. Alternatively, you can create it manually by calling:

```bash
POST /api/admin/setup-storage
```

### 2. Configure Storage Policies (Manual)

**Important**: Storage policies must be configured manually in Supabase for security reasons.

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy and paste the contents of `docs/hotel-images-storage-policies.sql`
4. Execute the SQL commands

### 3. Verify Setup

After running the policies, verify the setup:

1. **Check bucket exists**:
   - Go to Storage > Buckets in Supabase dashboard
   - Confirm `hotel-images` bucket is present and public

2. **Test upload functionality**:
   - Try uploading a hotel image as an admin user
   - Verify the image appears in the bucket
   - Check that the image URL is publicly accessible

## Security Policies

The storage bucket uses Row Level Security (RLS) with the following policies:

### Public Read Access
- **Who**: Anyone (authenticated or not)
- **What**: View/download hotel images
- **Why**: Required for public website functionality

### Admin Upload Access
- **Who**: Authenticated admin users only
- **What**: Upload new hotel images
- **Why**: Prevents unauthorized image uploads

### Admin Update Access
- **Who**: Authenticated admin users only
- **What**: Replace existing hotel images
- **Why**: Allows admins to update hotel photos

### Admin Delete Access
- **Who**: Authenticated admin users only
- **What**: Delete hotel images
- **Why**: Manage storage space and remove outdated images

## Admin User Configuration

The policies check for admin users in two ways:

### Method 1: User Metadata (Recommended)
Admin users should have `role: 'admin'` in their `raw_user_meta_data`:

```json
{
  "role": "admin"
}
```

### Method 2: Email Whitelist (Alternative)
If you prefer email-based admin checking, uncomment and modify the alternative policies in the SQL file to include your admin email addresses.

## File Restrictions

- **Allowed formats**: JPEG, PNG, GIF, WebP
- **File size limit**: 10MB per file
- **Public access**: All uploaded images are publicly accessible via URL

## Troubleshooting

### Upload Fails with "Access Denied"
1. Verify the user has admin role in metadata
2. Check that storage policies are properly applied
3. Ensure the user is authenticated

### Images Not Loading
1. Verify bucket is set to public
2. Check that the image URLs are correct
3. Confirm public read policy is active

### Bucket Creation Fails
1. Check Supabase project permissions
2. Verify API keys are correctly configured
3. Ensure sufficient storage quota

## API Endpoints

- `POST /api/admin/setup-storage` - Create bucket and check setup
- `POST /api/admin/hotels` - Create hotel with image upload
- `PUT /api/admin/hotels/[id]` - Update hotel with image upload

## File Upload Flow

1. **Frontend**: User selects files in hotel form
2. **API**: Files sent via FormData to hotel API
3. **Storage**: Files uploaded to Supabase Storage
4. **Database**: Image URLs saved to hotel record
5. **Display**: Images shown via public URLs

## Best Practices

1. **Image Optimization**: Consider resizing images before upload
2. **File Naming**: Use timestamps to avoid naming conflicts
3. **Cleanup**: Implement cleanup for deleted hotels
4. **Monitoring**: Monitor storage usage and costs
5. **Backup**: Regular backups of important images

## Support

If you encounter issues:
1. Check Supabase logs for detailed error messages
2. Verify all policies are correctly applied
3. Test with a simple image upload first
4. Contact support with specific error messages