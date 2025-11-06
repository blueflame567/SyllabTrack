# Getting Started with Syllibus

## Quick Start

### 1. Set up your Anthropic API Key

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy the API key

### 2. Configure Environment Variables

Open the [.env.local](.env.local) file and add your API key:

```env
ANTHROPIC_API_KEY=your_api_key_here
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

### Method 1: Upload a File

1. Click on "Upload File" tab
2. Click the upload area or drag and drop your syllabus (PDF or DOCX)
3. Click "Extract Calendar Events"
4. Review the extracted events
5. Click "Download .ics File"

### Method 2: Paste Text

1. Click on "Paste Text" tab
2. Copy your syllabus text and paste it into the text area
3. Click "Extract Calendar Events"
4. Review the extracted events
5. Click "Download .ics File"

## Importing the Calendar

### Google Calendar

1. Open [Google Calendar](https://calendar.google.com)
2. Click the gear icon > Settings
3. Click "Import & Export" in the left sidebar
4. Click "Select file from your computer"
5. Choose your downloaded `syllabus-calendar.ics` file
6. Select which calendar to add events to
7. Click "Import"

### Apple Calendar (macOS/iOS)

**macOS:**
- Double-click the `.ics` file, or
- Drag the file onto the Calendar app icon

**iOS:**
- Email the `.ics` file to yourself
- Open the email on your iOS device
- Tap the `.ics` file attachment
- Tap "Add All" to add events to your calendar

### Microsoft Outlook

1. Open Outlook
2. Go to Calendar view
3. Click File > Open & Export > Import/Export
4. Select "Import an iCalendar (.ics) or vCalendar file (.vcs)"
5. Browse to your `.ics` file
6. Click "OK"

## Tips for Best Results

1. **Clear Formatting**: The clearer your syllabus formatting, the better the AI extraction
2. **Date Formats**: The AI handles various date formats, but consistent formatting helps
3. **Complete Information**: Include full details like times, locations, and descriptions
4. **Review Before Import**: Always review extracted events before importing to your calendar
5. **Edit Events**: You can edit events in the preview before downloading

## Troubleshooting

### No events extracted

- Make sure your syllabus contains dates and assignment information
- Try rephrasing or reformatting your syllabus
- Check that dates are clearly marked

### Wrong dates

- Verify the year in your syllabus (the AI assumes current academic year if not specified)
- Check for ambiguous date formats

### API Errors

- Verify your Anthropic API key is correct in `.env.local`
- Check you have credits in your Anthropic account
- Make sure the `.env.local` file is in the root directory

## Next Steps

Want to add more features?

- Set up authentication with [Clerk](https://clerk.com)
- Add payments with [Stripe](https://stripe.com)
- Store syllabi history in a database (Supabase recommended)
- Add direct Google Calendar API integration

See the main [README.md](README.md) for development information.
