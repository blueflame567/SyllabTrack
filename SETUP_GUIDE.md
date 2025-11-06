# Syllibus - Setup Guide for Authentication & Payments 🚀

This guide will walk you through setting up Clerk authentication, PostgreSQL database, and Stripe payments for your Syllibus app.

## Current Status

✅ **Completed:**
- Dark mode removed
- Clerk authentication installed and configured
- Prisma database schema created
- Database models for users and usage tracking
- Auth UI added to homepage (Sign In/Sign Up/User Menu)

📋 **Next Steps (You Need To Do):**
1. Set up Clerk account and get API keys
2. Set up PostgreSQL database
3. Run database migrations
4. Set up Stripe account and get API keys
5. Test the authentication flow

---

## Step 1: Set Up Clerk Authentication

### 1.1 Create Clerk Account
1. Go to https://dashboard.clerk.com/
2. Sign up for a free account
3. Create a new application named "Syllibus"

### 1.2 Get Your API Keys
1. In Clerk Dashboard, go to **API Keys**
2. Copy your **Publishable Key** (starts with `pk_test_...`)
3. Copy your **Secret Key** (starts with `sk_test_...`)

### 1.3 Update .env.local
Replace these lines in `.env.local`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
CLERK_SECRET_KEY=your_secret_key_here
```

With your actual keys:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### 1.4 Configure Clerk Settings (Optional but Recommended)
In Clerk Dashboard:
- **Paths:** Set redirect URLs
  - Sign-in URL: `/sign-in`
  - Sign-up URL: `/sign-up`
  - After sign-in: `/`
  - After sign-up: `/`

---

## Step 2: Set Up PostgreSQL Database

You have several options for hosting PostgreSQL:

### Option A: Railway (Recommended - Free Tier Available)
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Provision PostgreSQL"
4. Click on your PostgreSQL service
5. Go to "Connect" tab
6. Copy the **Postgres Connection URL**

### Option B: Neon (Serverless Postgres - Free Tier)
1. Go to https://neon.tech
2. Sign up
3. Create a new project
4. Copy the connection string

### Option C: Supabase (Free Tier with Dashboard)
1. Go to https://supabase.com
2. Create new project
3. Go to Project Settings → Database
4. Copy **Connection String** (use "URI" format)

### 2.1 Update .env.local with Database URL
Replace this line:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/syllibus?schema=public"
```

With your actual database URL from Railway/Neon/Supabase:
```env
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"
```

---

## Step 3: Run Database Migrations

Once you have your `DATABASE_URL` configured:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view your database
npx prisma studio
```

This will create two tables:
- `User` - Stores user info, subscription tier, Stripe IDs
- `UsageRecord` - Tracks syllabus uploads per month

---

## Step 4: Set Up Stripe Payments

### 4.1 Create Stripe Account
1. Go to https://dashboard.stripe.com/register
2. Sign up for a free account
3. Complete business verification (can use test mode immediately)

### 4.2 Get Your API Keys
1. In Stripe Dashboard, go to **Developers** → **API Keys**
2. Toggle "Test mode" ON (top right)
3. Copy your **Publishable key** (starts with `pk_test_...`)
4. Reveal and copy your **Secret key** (starts with `sk_test_...`)

### 4.3 Update .env.local
Replace these lines:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key_here
STRIPE_SECRET_KEY=your_secret_key_here
```

With your actual keys:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### 4.4 Set Up Stripe Webhook (For Production)
You'll need this to receive subscription updates:

1. In Stripe Dashboard → **Developers** → **Webhooks**
2. Click "Add endpoint"
3. Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_...`)
6. Add to `.env.local`:
```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

**For local testing**, use Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## Step 5: Create Stripe Products & Pricing

### 5.1 Create Premium Plan
1. In Stripe Dashboard → **Products**
2. Click "Add product"
3. Fill in:
   - Name: "Syllibus Premium"
   - Description: "Unlimited syllabus parsing + priority support"
   - Pricing: Recurring
   - Price: $9.99 USD/month (or whatever you want)
   - Billing period: Monthly
4. Click "Save product"
5. **Copy the Price ID** (starts with `price_...`) - You'll need this!

---

## Step 6: Install Stripe Package & Create API Routes

```bash
npm install stripe
```

I'll create the necessary API routes for you in the next steps.

---

## Environment Variables Summary

Your `.env.local` should now look like:

```env
# Anthropic API Key
ANTHROPIC_API_KEY=sk-ant-api03-...

# Database
DATABASE_URL="postgresql://user:pass@host:port/db?schema=public"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Stripe Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... # (for production/webhook testing)
```

---

## What's Next?

Once you've completed the setup above, I'll help you implement:

1. **Usage Tracking System** - Track 3 free syllabi/month per user
2. **Pricing Page** - Display free vs premium tiers
3. **Checkout Flow** - Stripe integration for subscriptions
4. **Usage Limits** - Block free users after 3 uploads/month
5. **User Dashboard** - Show usage stats and subscription status
6. **Webhooks** - Handle Stripe subscription events

---

## Testing the Current Setup

1. Start your dev server:
```bash
npm run dev
```

2. Visit http://localhost:3000 (or 3001)
3. You should see:
   - "Sign In" and "Sign Up" buttons in the header (if not logged in)
   - User profile button (if logged in)

4. Try signing up with a test account
5. Check your database (Prisma Studio) to see if user was created

---

## Need Help?

- **Clerk Issues:** https://clerk.com/docs
- **Prisma Issues:** https://www.prisma.io/docs
- **Stripe Issues:** https://stripe.com/docs

Let me know once you've completed these steps and I'll continue building out the payment and usage tracking features!
