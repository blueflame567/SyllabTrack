# Quick Reference

## Essential Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Project URLs

- **Local Dev**: http://localhost:3000
- **API Docs**: See README.md
- **Anthropic Console**: https://console.anthropic.com/

## File Structure

```
app/
├── api/
│   ├── parse-syllabus/route.ts    # Main parsing logic
│   └── generate-ics/route.ts      # Calendar file creation
├── components/
│   └── FileUpload.tsx             # UI component
├── layout.tsx                     # App layout
├── page.tsx                       # Home page
└── globals.css                    # Styles
```

## Environment Variables

```env
# Required
ANTHROPIC_API_KEY=sk-ant-...

# Optional (future)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
```

## API Endpoints

### Parse Syllabus
```
POST /api/parse-syllabus
Content-Type: multipart/form-data

FormData:
  - file: <pdf/docx> OR
  - text: <string>

Response:
{
  "events": [
    {
      "title": "Assignment 1",
      "start": "2024-09-15T23:59:00",
      "description": "..."
    }
  ]
}
```

### Generate ICS
```
POST /api/generate-ics
Content-Type: application/json

Body:
{
  "events": [...]
}

Response: .ics file download
```

## Common Tasks

### Add a new dependency
```bash
npm install package-name
```

### Update dependencies
```bash
npm update
```

### Clear cache
```bash
rm -rf .next node_modules
npm install
```

## Troubleshooting

### "Module not found"
```bash
npm install
```

### "API key error"
Check `.env.local` file has correct key

### Build errors
```bash
npm run build
# Check errors and fix TypeScript issues
```

### Port already in use
```bash
# Change port
npm run dev -- -p 3001
```

## Testing Workflow

1. Start dev server: `npm run dev`
2. Open http://localhost:3000
3. Test with `sample-syllabus.txt`
4. Upload or paste syllabus
5. Verify events extracted
6. Download .ics file
7. Import to calendar app

## Key Dependencies

- `next` - Framework
- `react` - UI library
- `@anthropic-ai/sdk` - AI parsing
- `pdfjs-dist` - PDF parsing
- `mammoth` - DOCX parsing
- `ics` - Calendar generation
- `tailwindcss` - Styling

## Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [Anthropic API Docs](https://docs.anthropic.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [ICS Specification](https://datatracker.ietf.org/doc/html/rfc5545)

## Git Workflow

```bash
# Initialize repo
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin <your-repo-url>
git push -u origin main

# Create feature branch
git checkout -b feature/new-feature
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
```

## Deployment Quick Start

### Vercel (Fastest)
```bash
npm install -g vercel
vercel
# Add ANTHROPIC_API_KEY in dashboard
```

### Manual Build
```bash
npm run build
npm start
```

## Performance Tips

1. Keep syllabi under 10MB
2. Monitor API usage
3. Cache results if possible
4. Use loading states
5. Handle errors gracefully

## Security Checklist

- [ ] API keys in `.env.local` (not committed)
- [ ] `.gitignore` includes sensitive files
- [ ] File type validation enabled
- [ ] Error messages don't leak sensitive info
- [ ] HTTPS enabled (automatic on Vercel)

## Support

- Issues: GitHub Issues
- Docs: See README.md, GETTING_STARTED.md
- API Help: Anthropic Console

## Quick Fixes

**No events extracted?**
- Check syllabus has clear dates
- Verify API key is valid
- Check API credits

**Upload failing?**
- Verify file type (PDF/DOCX only)
- Check file size
- Try text paste instead

**ICS download not working?**
- Check browser console for errors
- Verify events were extracted first
- Try different browser

## Development Workflow

1. Edit code
2. Save (auto-reload with Fast Refresh)
3. Test in browser
4. Check console for errors
5. Commit when working
6. Push to deploy

---

For detailed guides, see:
- [README.md](README.md) - Full documentation
- [GETTING_STARTED.md](GETTING_STARTED.md) - Setup guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deploy guide
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Architecture overview
