# Supabase Setup Guide

Follow these steps to set up authentication and database for your Digital Business Card app.

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to be ready

## 2. Configure Environment Variables

Add these to your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can find these values in your Supabase project settings.

## 3. Set up Database Schema

1. Go to your Supabase dashboard
2. Navigate to the SQL editor
3. Copy and paste the contents of `/scripts/setup-supabase.sql`
4. Run the SQL script

This will create:
- `users` table for user profiles
- `business_cards` table for storing cards
- `analytics` table for tracking views/clicks
- Row Level Security policies
- Automatic user profile creation trigger

## 4. Configure Authentication

1. In Supabase dashboard, go to Authentication → Settings
2. Under Site URL, add your domain:
   - For development: `http://localhost:3000`
   - For production: `https://your-domain.com`
3. Under Redirect URLs, add:
   - `http://localhost:3000/dashboard` (development)
   - `https://your-domain.com/dashboard` (production)

## 5. Test Authentication

1. Start your development server: `npm run dev`
2. Visit `/auth/sign-up` to create a test account
3. Check that you're redirected to `/dashboard`
4. Verify the user profile was created in the database

## Current Features

✅ **Implemented:**
- User signup with email/password
- User login
- Dashboard with user profile
- Plan selection (free/pro/enterprise)
- Automatic user profile creation
- Row Level Security policies

🔄 **Coming Next:**
- Card creation and saving to database
- Card sharing with unique URLs
- Analytics tracking
- Plan limitations and upgrade flow

## Database Schema

### Users Table
- `id` (UUID, references auth.users)
- `email` (TEXT, unique)
- `full_name` (TEXT)
- `plan` (TEXT: 'free', 'pro', 'enterprise')
- `created_at`, `updated_at` (TIMESTAMP)

### Business Cards Table
- `id` (UUID, primary key)
- `user_id` (UUID, references users)
- `title` (TEXT)
- `slug` (TEXT, unique)
- `category` (TEXT: 'business', 'social-media', 'meme', 'fan', 'art')
- `is_active` (BOOLEAN)
- `data` (JSONB, card content)
- `theme_id` (TEXT)
- `created_at`, `updated_at` (TIMESTAMP)

### Analytics Table
- `id` (UUID, primary key)
- `card_id`, `user_id` (UUID references)
- `views`, `qr_scans`, `contact_clicks`, `social_clicks` (INTEGER)
- Various tracking data (JSONB)
- `created_at`, `updated_at` (TIMESTAMP)