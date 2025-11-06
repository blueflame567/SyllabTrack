# Syllibus Project Summary

## What We Built

A complete web application that automatically converts syllabus documents into calendar events using AI.

## Tech Stack Implemented

### Frontend
- **Next.js 15** with App Router
- **React 19** for UI components
- **Tailwind CSS** for styling
- **TypeScript** for type safety

### Backend/API
- **Next.js API Routes** for serverless functions
- **Anthropic Claude API** for intelligent text extraction
- **pdfjs-dist** for PDF parsing
- **mammoth** for DOCX parsing
- **ics** package for calendar file generation

### Features Completed

1. **File Upload System**
   - Drag-and-drop interface
   - Support for PDF and DOCX files
   - Direct text input option
   - File type validation

2. **AI-Powered Extraction**
   - Claude API integration
   - Extracts assignments, exams, readings, due dates
   - Handles various date formats
   - Extracts additional metadata (location, description)

3. **Calendar Generation**
   - Creates standard .ics files
   - Compatible with Google Calendar, Apple Calendar, Outlook
   - Includes 24-hour reminders
   - Proper timezone handling

4. **User Interface**
   - Clean, modern design
   - Dark mode support
   - Responsive layout
   - Real-time event preview
   - Loading states and error handling

## Project Structure

```
Syllibus/
├── app/
│   ├── api/
│   │   ├── parse-syllabus/
│   │   │   └── route.ts          # PDF/DOCX parsing + AI extraction
│   │   └── generate-ics/
│   │       └── route.ts          # Calendar file generation
│   ├── components/
│   │   └── FileUpload.tsx        # Main upload and UI component
│   ├── layout.tsx                # Root layout with fonts
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── .env.local                    # Environment variables
├── .env.local.example            # Environment template
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind config
├── next.config.ts                # Next.js config
├── README.md                     # Development docs
├── GETTING_STARTED.md            # User guide
├── PROJECT_SUMMARY.md            # This file
└── sample-syllabus.txt           # Sample test data
```

## API Endpoints

### POST /api/parse-syllabus

**Purpose**: Extracts calendar events from syllabus files or text

**Input**:
- FormData with `file` (PDF/DOCX) OR
- FormData with `text` (plain text)

**Output**:
```json
{
  "events": [
    {
      "title": "Assignment 1 Due",
      "start": "2024-09-13T23:59:00",
      "end": "2024-09-13T23:59:00",
      "description": "Hello World Program",
      "location": "Online submission"
    }
  ]
}
```

### POST /api/generate-ics

**Purpose**: Converts events array to .ics calendar file

**Input**:
```json
{
  "events": [...]
}
```

**Output**: .ics file for download

## How It Works

1. **User uploads syllabus** or pastes text
2. **Backend extracts text** from PDF/DOCX (if file uploaded)
3. **Claude AI analyzes** the text and identifies:
   - Assignment names and due dates
   - Exam dates and times
   - Reading assignments
   - Office hours
   - Other important events
4. **AI structures data** into JSON with standardized date-time format
5. **Frontend displays** extracted events for review
6. **User downloads** .ics file
7. **User imports** to their preferred calendar app

## Testing the Application

### Setup Steps

1. Install dependencies:
   ```bash
   npm install
   ```

2. Add your Anthropic API key to `.env.local`:
   ```env
   ANTHROPIC_API_KEY=sk-ant-...
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000

### Test Cases

1. **Test with sample text**:
   - Copy contents of `sample-syllabus.txt`
   - Click "Paste Text"
   - Paste and submit
   - Verify events are extracted

2. **Test with PDF upload**:
   - Create or find a real syllabus PDF
   - Upload via drag-and-drop or click
   - Verify extraction

3. **Test .ics download**:
   - After extraction, click "Download .ics File"
   - Import to Google Calendar or Apple Calendar
   - Verify events appear correctly

## Future Enhancements (Not Yet Implemented)

### Authentication & User Accounts
- [ ] Clerk authentication integration
- [ ] User dashboard
- [ ] Save multiple syllabi
- [ ] History of parsed syllabi

### Payments & Monetization
- [ ] Stripe integration
- [ ] Free tier (limited uses)
- [ ] Premium tier (unlimited + features)
- [ ] Subscription management

### Advanced Features
- [ ] Direct Google Calendar API integration
- [ ] Edit events before export
- [ ] Support for recurring events
- [ ] Email notifications
- [ ] Bulk upload multiple syllabi
- [ ] Share calendar with classmates
- [ ] Mobile app (React Native)
- [ ] Browser extension

### Database Integration
- [ ] Supabase setup
- [ ] Store user syllabi
- [ ] Event modification history
- [ ] Analytics (most common assignment types, etc.)

## Environment Variables Reference

```env
# Required for core functionality
ANTHROPIC_API_KEY=your_key_here

# Optional - for future auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Optional - for future payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=

# Optional - for database
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Key Files Explained

### [app/components/FileUpload.tsx](app/components/FileUpload.tsx)
Main UI component with:
- File upload handling
- Text input handling
- API calls to parse and generate
- Event display and download

### [app/api/parse-syllabus/route.ts](app/api/parse-syllabus/route.ts)
Backend API that:
- Accepts file uploads or text
- Extracts text from PDF (pdfjs-dist) or DOCX (mammoth)
- Sends text to Claude API with structured prompt
- Parses Claude's JSON response
- Returns events array

### [app/api/generate-ics/route.ts](app/api/generate-ics/route.ts)
Backend API that:
- Accepts events array
- Converts to .ics format using `ics` library
- Adds reminders
- Returns downloadable .ics file

## Performance Considerations

- **File Size Limit**: Currently no limit, but consider adding 10MB max
- **API Costs**: Each parse costs ~$0.01-0.05 depending on syllabus length
- **Rate Limiting**: Not implemented - consider adding for production
- **Caching**: Not implemented - could cache common syllabi

## Security Considerations

- API keys stored in environment variables (not committed)
- File validation by extension
- No persistent storage (files not saved to disk)
- CORS handled by Next.js
- Consider adding: rate limiting, file size limits, virus scanning for production

## Deployment Ready

The app is ready to deploy to:
- **Vercel** (recommended, zero-config)
- **Netlify**
- **AWS Amplify**
- **Railway**
- **Digital Ocean App Platform**

Just add your `ANTHROPIC_API_KEY` to the platform's environment variables.

## Credits

Built with:
- Next.js and React teams
- Anthropic Claude API
- Open source libraries: pdfjs-dist, mammoth, ics

## License

MIT - Free to use for personal or commercial projects
