# Syllibus - Syllabus to Calendar Converter

Transform your syllabus into calendar events automatically using AI.

## Features

- Upload syllabus files (PDF, DOCX) or paste text directly
- AI-powered extraction of assignments, due dates, exams, and readings
- Automatic calendar event generation
- Export to .ics format (compatible with Google Calendar, Apple Calendar, Outlook, etc.)
- Clean, modern UI with dark mode support

## Tech Stack

- **Frontend**: Next.js 15 + React 19 + Tailwind CSS
- **AI Processing**: Claude (Anthropic API)
- **Document Parsing**: pdf-parse (PDF), mammoth (DOCX)
- **Calendar Generation**: ics package
- **Type Safety**: TypeScript

## Getting Started

### Prerequisites

- Node.js 20.14.0 or higher
- npm or yarn
- Anthropic API key ([get one here](https://console.anthropic.com/))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Syllibus
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.local.example .env.local
```

4. Add your Anthropic API key to `.env.local`:
```env
ANTHROPIC_API_KEY=your_api_key_here
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Upload or Paste**: Choose to upload a PDF/DOCX file or paste syllabus text
2. **Process**: Click "Extract Calendar Events" to analyze the syllabus
3. **Review**: View all extracted events with dates and details
4. **Export**: Download the .ics file and import it into your calendar app

### Importing to Calendar Apps

#### Google Calendar
1. Open Google Calendar
2. Click the "+" next to "Other calendars"
3. Select "Import"
4. Choose your downloaded .ics file

#### Apple Calendar (macOS/iOS)
- Double-click the .ics file or drag it to Calendar app

#### Outlook
1. Open Outlook Calendar
2. Go to File > Import & Export
3. Select "Import an iCalendar (.ics) file"

## Project Structure

```
Syllibus/
├── app/
│   ├── api/
│   │   ├── parse-syllabus/    # Handles file upload and text extraction
│   │   └── generate-ics/      # Creates .ics calendar files
│   ├── components/
│   │   └── FileUpload.tsx     # Main upload and results UI
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── public/
├── .env.local.example
├── package.json
└── README.md
```

## Future Enhancements

- [ ] User authentication with Clerk
- [ ] Save and manage multiple syllabi
- [ ] Direct Google Calendar integration
- [ ] Premium features with Stripe
- [ ] Support for more file formats
- [ ] Custom event editing before export
- [ ] Recurring events support
- [ ] Email reminders

## API Routes

### POST /api/parse-syllabus

Accepts either a file upload or text and returns extracted calendar events.

**Request**: FormData with either:
- `file`: PDF or DOCX file
- `text`: Plain text syllabus

**Response**:
```json
{
  "events": [
    {
      "title": "Assignment 1 Due",
      "start": "2024-09-15T23:59:00",
      "description": "First programming assignment",
      "location": "Online submission"
    }
  ]
}
```

### POST /api/generate-ics

Generates an .ics calendar file from events.

**Request**:
```json
{
  "events": [...]
}
```

**Response**: .ics file download

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.
