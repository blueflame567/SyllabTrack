# 💳 Stripe Production Setup Guide

**For SyllabTrack Premium Subscriptions**

---

## 📖 What is Stripe Doing in Your App?

Stripe handles all payment processing for SyllabTrack Premium subscriptions. Here's what happens:

1. **User clicks "Subscribe"** on pricing page
2. **Redirected to Stripe Checkout** (Stripe-hosted payment page)
3. **User enters payment details** (handled securely by Stripe)
4. **Payment processed** and subscription created
5. **Stripe sends webhook** to your app
6. **Your app updates user** to premium tier in database
7. **User redirected back** to success page

### Current Payment Tiers

- **Free Tier**: 5 syllabus uploads per month
- **Premium Tier**: Unlimited uploads, $[PRICE]/month

---

## ⚠️ Current Status: TEST MODE

Your app is currently using Stripe in **TEST MODE**. This means:

- ✅ You can test payment flows without real money
- ✅ Use test credit cards (4242 4242 4242 4242)
- ❌ Real customers CANNOT pay you
- ❌ No real money will be processed

**You MUST switch to LIVE MODE before launch.**

---

## 🔄 Switching from Test Mode to Production Mode

### Step 1: Activate Your Stripe Account

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Complete account activation:
   - [ ] Add business details
   - [ ] Verify business information
   - [ ] Add bank account for payouts
   - [ ] Verify identity (may require ID upload)
   - [ ] Accept Stripe Terms of Service

**⚠️ This can take 1-3 business days for approval**

### Step 2: Switch Dashboard to Live Mode

1. In Stripe Dashboard, look for toggle in top right
2. Currently says **"Viewing test data"**
3. Click to switch to **"Live"** mode
4. You'll see "Viewing live data" - you're now in production!

---

## 🏗️ Step 3: Create Production Products & Prices

### Create Monthly Subscription Product

1. In Stripe Dashboard (LIVE MODE), go to **Products** → **Add product**
2. Fill in product details:
   ```
   Name: SyllabTrack Premium - Monthly
   Description: Unlimited syllabus uploads and calendar generation

   Pricing:
   ✓ Recurring
   Price: $9.99 (or your chosen price)
   Billing period: Monthly
   Currency: USD

   Additional options:
   ✓ Allow customers to switch to different price
   Tax behavior: Choose based on your tax setup
   ```
3. Click **Save product**
4. **IMPORTANT**: Copy the Price ID
   - Format: `price_xxxxxxxxxxxxxxxxxxxxx`
   - You'll need this for environment variables

### Create Yearly Subscription Product (Optional)

If offering annual billing with discount:

1. Click **Add product** again
2. Fill in product details:
   ```
   Name: SyllabTrack Premium - Yearly
   Description: Unlimited syllabus uploads and calendar generation (Annual)

   Pricing:
   ✓ Recurring
   Price: $99.99 (or your chosen price - usually ~20% discount)
   Billing period: Yearly
   Currency: USD
   ```
3. Click **Save product**
4. **Copy the Price ID** for yearly subscription

---

## 🔑 Step 4: Get Production API Keys

### Get Publishable Key

1. In Stripe Dashboard (LIVE MODE)
2. Go to **Developers** → **API keys**
3. Find **Publishable key**
   - Format: `pk_live_xxxxxxxxxxxxxxxxxxxxx`
   - This is safe to expose in browser
4. Click **Reveal live key** and copy it

### Get Secret Key

1. On same page, find **Secret key**
   - Format: `sk_live_xxxxxxxxxxxxxxxxxxxxx`
   - ⚠️ NEVER expose this publicly
2. Click **Reveal live key** and copy it
3. **Store securely** - you'll add to Vercel

---

## 🪝 Step 5: Set Up Production Webhook

Webhooks notify your app when subscription events occur (payment success, cancellation, etc.)

### Create Webhook Endpoint

1. In Stripe Dashboard (LIVE MODE)
2. Go to **Developers** → **Webhooks**
3. Click **Add endpoint**

### Configure Webhook

```
Endpoint URL: https://[YOUR-DOMAIN].com/api/stripe/webhook

Description: SyllabTrack Production Webhook

Listen to events:
☑️ checkout.session.completed
☑️ customer.subscription.updated
☑️ customer.subscription.deleted
☑️ invoice.payment_succeeded
☑️ invoice.payment_failed

API version: Latest (default)
```

4. Click **Add endpoint**

### Get Webhook Signing Secret

1. After creating endpoint, you'll see the webhook details
2. Find **Signing secret**
   - Format: `whsec_xxxxxxxxxxxxxxxxxxxxx`
   - This proves webhooks are from Stripe
3. Click **Reveal** and copy it

---

## 🌐 Step 6: Configure Customer Portal

The Customer Portal lets users manage their own subscriptions.

1. In Stripe Dashboard (LIVE MODE)
2. Go to **Settings** → **Billing** → **Customer portal**
3. Configure settings:

### Portal Settings

```
Business information:
- Business name: SyllabTrack
- Support email: support@syllabtrack.com
- Privacy policy URL: https://[YOUR-DOMAIN]/privacy
- Terms of service URL: https://[YOUR-DOMAIN]/terms

Functionality:
☑️ Allow customers to update payment methods
☑️ Allow customers to view invoices
☑️ Allow customers to cancel subscriptions
☑️ Allow customers to update billing information

Cancellation settings:
- Cancellation behavior: Cancel at period end (recommended)
- Show cancellation survey: Yes (optional, to gather feedback)

Branding:
- Upload logo
- Set brand color: #4F46E5 (or your brand color)
```

4. Click **Save changes**

---

## 🔐 Step 7: Update Environment Variables in Vercel

Now update your production environment variables with the new keys.

### Update in Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your SyllabTrack project
3. Go to **Settings** → **Environment Variables**
4. Update these variables for **Production** environment:

```bash
# Stripe Production Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
STRIPE_MONTHLY_PRICE_ID=price_xxxxxxxxxxxxxxxxxxxxx
STRIPE_YEARLY_PRICE_ID=price_xxxxxxxxxxxxxxxxxxxxx  # If you created yearly
```

### Important Notes:

- ⚠️ Set environment for **Production** only (not Preview or Development)
- ⚠️ Mark `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` as **Sensitive**
- ✅ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` can be non-sensitive (it's exposed in browser)

### Trigger Redeployment

After updating environment variables:
1. Go to **Deployments** tab
2. Click **Redeploy** on latest deployment
3. Wait for build to complete

---

## ✅ Step 8: Test Production Setup

### Test Webhook Locally First

Before going live, test webhooks locally using Stripe CLI:

```bash
# Install Stripe CLI (one-time setup)
# Windows: Download from https://github.com/stripe/stripe-cli/releases
# Mac: brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to your production domain
stripe listen --forward-to https://[YOUR-DOMAIN]/api/stripe/webhook

# In another terminal, trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
stripe trigger invoice.payment_succeeded
```

### Verify Webhook Reception

1. Check Vercel **Logs** for webhook processing
2. Should see: "User [id] upgraded to premium via subscription"
3. Check your database - user should be upgraded
4. Check Stripe Dashboard → **Webhooks** → Click your endpoint → View events

---

## 💰 Step 9: Test Real Payment Flow

**⚠️ This will charge real money. Use a small amount or cancel immediately after testing.**

### Complete Test Transaction

1. Open your production site in incognito/private browser
2. Sign up for new account (use real email)
3. Go to Pricing page
4. Click **Subscribe**
5. **Use real credit card** (your own card for testing)
6. Complete Stripe Checkout
7. Verify:
   - [ ] Redirected to success page
   - [ ] Received email receipt from Stripe
   - [ ] User upgraded to premium in database
   - [ ] Webhook received (check Vercel logs)
   - [ ] Can upload unlimited syllabi

### Cancel Test Subscription

1. Go to Stripe Dashboard (LIVE MODE)
2. Navigate to **Customers**
3. Find your test customer
4. Click on the subscription
5. Click **Cancel subscription**
6. Choose "Cancel immediately" or "Cancel at period end"
7. Verify:
   - [ ] Webhook received
   - [ ] User downgraded to free tier (if canceled immediately)

---

## 📧 Step 10: Configure Email Receipts

Customize emails customers receive from Stripe.

1. In Stripe Dashboard (LIVE MODE)
2. Go to **Settings** → **Emails**
3. Configure:
   ```
   Successful payments:
   ☑️ Email customers about successful payments

   Failed payments:
   ☑️ Email customers about failed payments

   Customize email:
   - Upload company logo
   - Set brand color
   - Customize footer text
   - Add support email
   ```
4. Send test email to yourself

---

## 🎨 Step 11: Customize Checkout Appearance

Make Stripe Checkout match your brand.

1. Go to **Settings** → **Branding**
2. Upload company assets:
   - Brand logo (square, PNG, min 128x128px)
   - Icon (for browser tab)
3. Set brand color: `#4F46E5` (or your brand color)
4. Preview checkout appearance
5. Save changes

---

## 📊 Step 12: Set Up Alerts & Notifications

Monitor your payments and get notified of issues.

### Stripe Dashboard Alerts

1. Go to **Settings** → **Notifications**
2. Enable notifications for:
   - [ ] Successful payments (optional, can be noisy)
   - [ ] Failed payments (recommended)
   - [ ] Disputes/chargebacks (important)
   - [ ] Webhook failures (critical)
   - [ ] Weekly reports (recommended)

### Webhook Monitoring

1. In **Developers** → **Webhooks**
2. Click on your webhook endpoint
3. Enable:
   - [ ] Email notifications for failed webhooks
   - [ ] Set retry attempts (default: 3 days)

---

## 🔍 Monitoring & Maintenance

### Daily Checks (First Week)

- [ ] Check Stripe Dashboard for new subscriptions
- [ ] Verify webhook events are processing
- [ ] Monitor failed payments
- [ ] Check Vercel logs for errors

### Weekly Checks

- [ ] Review MRR (Monthly Recurring Revenue)
- [ ] Check churn rate (cancellations)
- [ ] Review failed payment recovery
- [ ] Monitor customer support inquiries

### Monthly Checks

- [ ] Review Stripe fees and costs
- [ ] Analyze subscription metrics
- [ ] Update prices if needed
- [ ] Review customer feedback

---

## 🐛 Troubleshooting

### Webhook Not Received

**Problem**: Stripe sends webhook but your app doesn't process it

**Solutions**:
1. Check webhook URL is correct: `https://[YOUR-DOMAIN]/api/stripe/webhook`
2. Verify `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard
3. Check Vercel logs for errors
4. Verify endpoint is not blocked by middleware
5. Test with Stripe CLI: `stripe trigger checkout.session.completed`

### Payment Succeeded but User Not Upgraded

**Problem**: Payment goes through but user stays on free tier

**Solutions**:
1. Check Vercel logs for webhook processing errors
2. Verify `userId` is being passed in Checkout session metadata
3. Check database for user record
4. Manually update user in database as temporary fix
5. Review `app/api/stripe/webhook/route.ts` for errors

### User Can't Access Customer Portal

**Problem**: User gets error accessing billing portal

**Solutions**:
1. Verify Customer Portal is configured in Stripe
2. Check user has `stripeCustomerId` in database
3. Verify Stripe API keys are correct
4. Check Vercel logs for Stripe API errors

### Webhook Signature Verification Failed

**Problem**: Webhook returns 400 error "Invalid signature"

**Solutions**:
1. Verify `STRIPE_WEBHOOK_SECRET` in Vercel matches Stripe Dashboard
2. Make sure you're using the secret for the correct webhook endpoint
3. Redeploy after updating environment variable
4. Check webhook endpoint in Stripe is using correct URL

---

## 📚 Important Stripe Concepts

### Test vs Live Mode

- **Test Mode**: Sandbox environment, fake money, test cards
- **Live Mode**: Real environment, real money, real cards
- Data does NOT sync between modes
- Products, prices, webhooks must be created in BOTH modes

### Subscriptions vs One-Time Payments

Your app uses **subscriptions** (recurring payments):
- Charged automatically every month/year
- Prorated upgrades/downgrades
- Can be canceled by customer or you
- Handles failed payments automatically

### Webhooks vs API Polling

Your app uses **webhooks** (recommended):
- Stripe notifies your app when events happen
- Real-time updates
- No need to constantly check Stripe API
- More reliable than polling

### Customer vs Subscription

- **Customer**: Person in Stripe's system (like a user account)
- **Subscription**: Active payment plan for a customer
- One customer can have multiple subscriptions
- Stored in database: `stripeCustomerId` and `stripeSubscriptionId`

---

## 💡 Best Practices

### Security

- ✅ Never commit API keys to Git
- ✅ Use environment variables for all secrets
- ✅ Always verify webhook signatures
- ✅ Use HTTPS for production webhooks
- ✅ Rotate API keys if compromised

### User Experience

- ✅ Show clear pricing before checkout
- ✅ Send confirmation emails
- ✅ Allow easy subscription management
- ✅ Handle failed payments gracefully
- ✅ Provide refund policy

### Business

- ✅ Monitor failed payment recovery
- ✅ Track subscription metrics (MRR, churn)
- ✅ Set up automatic tax collection (if required)
- ✅ Keep accurate records for accounting
- ✅ Respond to disputes quickly

---

## 🔗 Useful Resources

- [Stripe Dashboard](https://dashboard.stripe.com/)
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Webhook Event Reference](https://stripe.com/docs/api/events/types)
- [Stripe CLI Documentation](https://stripe.com/docs/cli)
- [Test Credit Cards](https://stripe.com/docs/testing)

### Test Credit Cards for Testing

When in test mode, use these cards:

```
Success: 4242 4242 4242 4242
Declined: 4000 0000 0000 0002
Insufficient funds: 4000 0000 0000 9995
Expired card: 4000 0000 0000 0069
3D Secure required: 4000 0027 6000 3184

Expiry: Any future date (e.g., 12/34)
CVC: Any 3 digits (e.g., 123)
ZIP: Any 5 digits (e.g., 12345)
```

---

## ✅ Production Checklist

Before going live, verify:

- [ ] Stripe account fully activated
- [ ] Bank account added for payouts
- [ ] Products created in LIVE mode
- [ ] Price IDs copied and added to Vercel
- [ ] API keys updated to live keys in Vercel
- [ ] Webhook created with correct production URL
- [ ] Webhook secret added to Vercel
- [ ] Customer Portal configured
- [ ] Email receipts customized
- [ ] Branding updated on checkout
- [ ] Test transaction completed successfully
- [ ] Webhooks received and processed
- [ ] User upgraded in database
- [ ] Test subscription canceled successfully
- [ ] User downgraded in database

---

## 🆘 Need Help?

- **Stripe Support**: https://support.stripe.com/
- **Stripe Discord**: https://stripe.com/go/developer-chat
- **Your code**: Check `lib/stripe.ts` and `app/api/stripe/webhook/route.ts`

---

**Remember: Test everything in TEST mode first, then switch to LIVE mode only when ready to accept real payments!**
