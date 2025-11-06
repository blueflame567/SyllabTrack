# Deployment Guide

## Deploy to Vercel (Recommended - Easiest)

Vercel is the creator of Next.js and provides the best deployment experience.

### Steps:

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-github-repo-url
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Add Environment Variables**:
   - In Vercel dashboard, go to Settings > Environment Variables
   - Add: `ANTHROPIC_API_KEY` with your API key
   - Click "Deploy"

4. **Done!**
   - Your app will be live at `your-project.vercel.app`
   - Vercel provides automatic HTTPS and CDN

### Vercel Features:
- Free tier available
- Automatic deployments on git push
- Preview deployments for PRs
- Edge network (fast globally)
- Built-in analytics

## Deploy to Netlify

### Steps:

1. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Install command: `npm install`

2. **Deploy**:
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify init
   netlify deploy --prod
   ```

3. **Add Environment Variables**:
   - Go to Site settings > Environment variables
   - Add `ANTHROPIC_API_KEY`

## Deploy to Railway

### Steps:

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Deploy**:
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Add Environment Variable**:
   ```bash
   railway variables set ANTHROPIC_API_KEY=your_key_here
   ```

## Deploy to AWS (Advanced)

### Option 1: AWS Amplify

1. Connect GitHub repo to Amplify Console
2. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `.next`
3. Add environment variable: `ANTHROPIC_API_KEY`

### Option 2: Docker + ECS/Fargate

1. Create `Dockerfile`:
   ```dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. Build and push to ECR
3. Deploy to ECS/Fargate

## Environment Variables for Production

Make sure to set these in your deployment platform:

### Required:
```
ANTHROPIC_API_KEY=your_anthropic_key
```

### Optional (for future features):
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
```

## Pre-Deployment Checklist

- [ ] Build succeeds locally (`npm run build`)
- [ ] Environment variables configured
- [ ] API key is valid and has credits
- [ ] `.gitignore` includes `.env.local` and `node_modules`
- [ ] Test with sample syllabus
- [ ] Error handling works for invalid files
- [ ] Mobile responsiveness checked

## Post-Deployment

### Monitor:
- API usage in Anthropic console
- Error logs in deployment platform
- User feedback

### Optimize:
- Add rate limiting if getting too much traffic
- Consider caching common syllabus patterns
- Add file size limits (recommend 10MB max)
- Monitor API costs

## Custom Domain

### Vercel:
1. Go to Project Settings > Domains
2. Add your custom domain
3. Update DNS records as shown
4. SSL automatically configured

### Netlify:
1. Go to Domain Settings
2. Add custom domain
3. Update DNS
4. SSL auto-provisioned

## Scaling Considerations

### Free Tier Limits:
- **Vercel**: 100GB bandwidth, unlimited requests
- **Netlify**: 100GB bandwidth, 300 build minutes
- **Railway**: $5/month credit on free plan

### When to Upgrade:
- If you exceed free tier limits
- Need more than 10 concurrent functions
- Want priority support
- Require SLA guarantees

## Security for Production

1. **Add Rate Limiting**:
   ```typescript
   // middleware.ts
   import { Ratelimit } from "@upstash/ratelimit";
   import { Redis } from "@upstash/redis";
   ```

2. **File Size Limits**:
   ```typescript
   // In next.config.ts
   export default {
     api: {
       bodyParser: {
         sizeLimit: '10mb',
       },
     },
   };
   ```

3. **CORS Configuration** (if needed for API):
   ```typescript
   // Add to API routes
   headers: {
     'Access-Control-Allow-Origin': 'your-domain.com',
   }
   ```

4. **Environment Variable Validation**:
   ```typescript
   if (!process.env.ANTHROPIC_API_KEY) {
     throw new Error('Missing ANTHROPIC_API_KEY');
   }
   ```

## Monitoring & Analytics

### Free Options:
- **Vercel Analytics**: Built-in, one-click setup
- **Google Analytics**: Add to `layout.tsx`
- **Sentry**: Error tracking

### Add Google Analytics:

```typescript
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## Troubleshooting Deployment

### Build Fails:
- Check Node.js version (should be 20+)
- Ensure all dependencies in `package.json`
- Run `npm run build` locally first

### API Routes Not Working:
- Verify environment variables are set
- Check API route paths (should be `/api/...`)
- Review deployment logs

### PDF Parsing Fails:
- Ensure pdfjs-dist version compatibility
- Check file size limits
- Verify PDF is not password-protected

## Cost Estimates

### With 1000 users/month:

**Hosting** (Vercel Free Tier):
- Cost: $0

**Anthropic API**:
- Average: ~$0.02 per syllabus
- 1000 syllabi = ~$20/month

**Total**: ~$20/month for 1000 syllabi parsed

### Scaling to 10,000 users/month:

**Hosting** (Vercel Pro):
- Cost: $20/month

**Anthropic API**:
- 10,000 syllabi = ~$200/month

**Total**: ~$220/month

## Backup & Recovery

1. **Database** (future): Regular Supabase backups
2. **Code**: GitHub repository (already backed up)
3. **Environment Variables**: Keep secure copy locally

## Next Steps After Deployment

1. Share with students at your university
2. Gather feedback
3. Monitor usage and costs
4. Iterate on features
5. Consider monetization if popular

---

Need help? Check the [README.md](README.md) or [GETTING_STARTED.md](GETTING_STARTED.md)
