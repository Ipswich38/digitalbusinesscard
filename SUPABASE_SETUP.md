# Simple Card Saving Setup

Just save cards and access them anywhere! Super simple setup.

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a project
2. Wait for it to be ready

## 2. Add Environment Variables

In Vercel (or your `.env.local` for development):

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Find these in your Supabase project settings.

## 3. Set up Database

1. Go to Supabase dashboard → SQL editor
2. Copy/paste `/scripts/setup-supabase.sql` 
3. Run it

This creates just one simple `cards` table - that's it!

## 4. Configure Auth URLs

In Supabase dashboard → Authentication → Settings:

**Site URL:** `https://your-domain.com`  
**Redirect URLs:** `https://your-domain.com/dashboard`

## 5. Test It

1. Visit `/auth/sign-up` and create an account
2. Create a card and save it
3. Check `/dashboard` to see your saved cards
4. Cards get unique URLs like `/card-abc123` for sharing

## How It Works

**Simple flow:**
1. User signs up with email/password
2. Create card → click save → card gets saved with unique URL
3. Access cards from any device via dashboard
4. Share cards using the unique URLs

**Database:**
- Just one `cards` table
- Each card has: title, data, unique slug, user_id
- That's it! No complex analytics or plans.

**Features:**
✅ Save cards to database  
✅ Access from any device  
✅ Unique shareable URLs  
✅ Simple dashboard to manage cards  
✅ Works without Supabase (shows setup message)