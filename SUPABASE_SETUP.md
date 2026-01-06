# Supabase Setup Instructions

This document provides step-by-step instructions for setting up your Supabase database and storage for the BeeHiveping App.

## Prerequisites

- A Supabase account (free tier works fine)
- The Supabase integration already connected in v0

## 1. Database Setup

### Run SQL Scripts

The database schema has already been created by running the SQL scripts in the `scripts/` folder. If you need to re-run them:

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. The scripts should have been automatically executed
4. You can verify by clicking on **Table Editor** and checking that these tables exist:
   - `apartments`
   - `shops`
   - `products`
   - `orders`

### Verify RLS Policies

1. Go to **Authentication** → **Policies** in your Supabase dashboard
2. You should see RLS policies for all tables allowing full CRUD operations
3. This is configured for development - you can tighten security later

## 2. Storage Setup (For Product Images)

### Create Storage Bucket for Product Images

1. Go to **Storage** in your Supabase dashboard (left sidebar)
2. Click **New bucket**
3. Create a bucket with these settings:
   - **Name**: `product-images`
   - **Public bucket**: ✅ **Enable** (so images can be viewed without authentication)
   - **File size limit**: 5 MB (recommended)
   - **Allowed MIME types**: Leave as default or add: `image/jpeg, image/png, image/webp, image/gif`

4. Click **Create bucket**

### Create Storage Bucket for Shop Images

1. Click **New bucket** again
2. Create another bucket with these settings:
   - **Name**: `shop-images`
   - **Public bucket**: ✅ **Enable**
   - **File size limit**: 5 MB

3. Click **Create bucket**

### Set Storage Policies (Optional - for more control)

If you want to add storage policies:

1. Click on the `product-images` bucket
2. Go to **Policies** tab
3. Click **New policy**
4. For testing, you can use this simple policy:
   - **Policy name**: Public read access
   - **Target roles**: `public`
   - **Policy definition**: SELECT
   - **USING expression**: `true`

## 3. Authentication Setup

### Create Admin User

1. Go to **Authentication** → **Users** in Supabase dashboard
2. Click **Add user** → **Create new user**
3. Fill in:
   - **Email**: your-admin@example.com
   - **Password**: Choose a secure password
   - **Auto Confirm User**: ✅ Enable
4. After creating, click on the user to edit
5. Scroll to **User Metadata** section
6. Click **Edit** and add this JSON:
   \`\`\`json
   {
     "role": "admin"
   }
   \`\`\`
7. Click **Save**

### Test Seller Registration

Sellers can sign up directly through the app:
1. Go to the home page
2. Click "For Technicians"
3. Fill out the registration form
4. Their shop will be created in the database (initially inactive)
5. Use the admin account to activate shops

## 4. Seed Sample Data (Optional)

The `scripts/002_seed_data.sql` file contains sample data. To use it:

1. Go to **SQL Editor** in Supabase
2. Run the seed script if you want sample apartments and shops
3. This is optional - you can add data through the app UI

## 5. Environment Variables

All environment variables are automatically configured through the Supabase integration in v0. You don't need to manually add:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Other Supabase keys

## 6. Verify Everything Works

### Test Customer Flow
1. Visit the home page
2. Enter a flat number (e.g., "101")
3. Select an apartment
4. Browse shops and products

### Test Seller Flow
1. Go to `/auth/seller/sign-up`
2. Register a new shop
3. Check that the shop appears in the database
4. Login at `/auth/seller/login`
5. Add products to your shop

### Test Admin Flow
1. Login at `/auth/admin/login` with your admin credentials
2. Add apartments
3. Assign shops to apartments
4. Toggle shop active status

## Troubleshooting

### "No apartments found" error
- Make sure you've added at least one apartment through the admin panel
- Or run the seed data script

### Authentication errors
- Check that the admin user has `"role": "admin"` in user metadata
- Make sure sellers have `"role": "seller"` (this is set automatically during signup)

### Image upload not working
- Verify storage buckets are created and set to **public**
- Check bucket names match exactly: `product-images` and `shop-images`

### RLS Policy errors
- Go to Table Editor → Select table → Click on "RLS" icon
- Make sure RLS is enabled and policies exist
- For development, the policies are permissive (allow all)

## Production Considerations

Before deploying to production:

1. **Tighten RLS Policies**: Replace permissive policies with role-based access
2. **Add Storage Policies**: Restrict who can upload images
3. **Enable Email Confirmation**: In Authentication settings
4. **Set up Custom SMTP**: For production emails
5. **Add Rate Limiting**: Protect your API endpoints
6. **Review Security**: Run Supabase security advisor

## Support

If you encounter issues:
- Check the Supabase logs in the dashboard
- Review the RLS policies
- Verify environment variables are set
- Check browser console for errors
