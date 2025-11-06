# SyllabTrack - Syllabus to Calendar Converter

Transform your syllabus into calendar events automatically using AI. Upload, parse, and export your academic schedule in seconds.

## Features

### Core Features
- **Smart File Upload**: Support for PDF and DOCX files with AI-powered extraction
- **Intelligent Event Detection**: Automatically categorizes events into:
  - Assignments
  - Quizzes
  - Exams
  - Readings
  - Classes
  - Other events
- **Syllabus Library**: Save and manage all your uploaded syllabi in one place
- **Flexible Filtering**: Filter events by type before export
- **Calendar Export**: Download .ics files compatible with Google Calendar, Apple Calendar, Outlook, and more
- **Modern UI**: Clean, responsive interface built with Tailwind CSS

### User Management
- **Authentication**: Secure sign-in/sign-up with Clerk
- **User Profiles**: Personalized experience with user accounts
- **Usage Tracking**: Monitor your syllabus processing quota

### Subscription Tiers
- **Free Tier**: 3 syllabi per month
- **Premium Tier** ($4.99/month): Unlimited syllabus processing
- **Stripe Integration**: Secure payment processing with automatic subscription management

### Admin Features
- **Admin Dashboard**: View all users and their subscription status
- **Usage Monitoring**: Track platform-wide usage statistics
- **User Management**: View user details and subscription tiers

## Tech Stack

### Frontend
- **Next.js 15** with App Router
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Clerk** for authentication

### Backend
- **Prisma ORM** with PostgreSQL database
- **Railway** for database hosting
- **Stripe** for payment processing
- **Anthropic Claude API** (Haiku model) for AI-powered parsing

### Document Processing
- **pdf-parse-fork** for PDF extraction
- **mammoth** for DOCX extraction
- **ics** package for calendar file generation
- **date-fns** for date manipulation

## Getting Started

### Prerequisites

- Node.js 20.14.0 or higher
- npm or yarn
- Anthropic API key ([get one here](https://console.anthropic.com/))
- Clerk account ([sign up here](https://clerk.com/))
- Stripe account for payments ([sign up here](https://stripe.com/))
- PostgreSQL database (Railway recommended)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/blueflame567/SyllabTrack.git
cd SyllabTrack
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://..."

# Anthropic AI
ANTHROPIC_API_KEY="sk-ant-..."

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
CLERK_WEBHOOK_SECRET="whsec_..."

# Stripe Payments
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PREMIUM_PRICE_ID="price_..."

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ADMIN_USER_IDS="user_..."  # Comma-separated Clerk user IDs
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Usage

### For Students

1. **Sign Up/Sign In**: Create an account or log in with Clerk
2. **Upload Syllabus**: Upload a PDF or DOCX file on the homepage
3. **Review Events**: View all extracted events with automatic categorization
4. **Access Library**: Visit the Library page to see all your saved syllabi
5. **Filter Events**: Select which event types to include in your export
6. **Export Calendar**: Download .ics file and import to your calendar app

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
SyllabTrack/
├── app/
│   ├── api/
│   │   ├── parse-syllabus/       # Main syllabus parsing endpoint
│   │   ├── webhooks/
│   │   │   ├── clerk/            # User creation/update webhooks
│   │   │   └── stripe/           # Payment webhooks
│   │   └── create-checkout/      # Stripe checkout session
│   ├── components/
│   │   └── FileUpload.tsx        # Main upload and results UI
│   ├── library/
│   │   ├── page.tsx              # Library page (server component)
│   │   └── LibraryClient.tsx     # Library UI (client component)
│   ├── pricing/
│   │   └── page.tsx              # Pricing and subscription page
│   ├── admin/
│   │   └── page.tsx              # Admin dashboard
│   ├── sign-in/[[...sign-in]]/
│   ├── sign-up/[[...sign-up]]/
│   ├── layout.tsx                # Root layout with Clerk provider
│   ├── page.tsx                  # Homepage
│   └── globals.css
├── prisma/
│   └── schema.prisma             # Database schema
├── .env.example
├── package.json
└── README.md
```

## Database Schema

### User
- Clerk integration
- Subscription tier tracking
- Usage limits

### Syllabus
- File metadata
- Course information
- Relationships to events

### Event
- Title, dates, description, location
- Event type categorization
- Linked to parent syllabus

## API Routes

### POST /api/parse-syllabus

Accepts file upload, extracts events using Claude AI, and saves to database.

**Request**: FormData with:
- `file`: PDF or DOCX file

**Response**:
```json
{
  "events": [
    {
      "id": "evt_...",
      "title": "Assignment 1 Due",
      "start": "2025-09-15T23:59:00",
      "end": null,
      "description": "First programming assignment",
      "location": "Online submission",
      "type": "assignment"
    }
  ],
  "syllabusId": "syl_...",
  "usage": {
    "current": 1,
    "limit": 3,
    "tier": "free"
  }
}
```

### POST /api/webhooks/clerk

Handles user creation and updates from Clerk.

### POST /api/webhooks/stripe

Handles subscription events from Stripe (payment success, cancellation, etc.).

### POST /api/create-checkout

Creates a Stripe checkout session for premium subscription.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import repository in Vercel dashboard
3. Add all environment variables
4. Deploy!

### Post-Deployment Steps

1. **Update Webhook URLs**:
   - Clerk webhook: `https://your-domain.vercel.app/api/webhooks/clerk`
   - Stripe webhook: `https://your-domain.vercel.app/api/webhooks/stripe`

2. **Run Database Migration**:
   ```bash
   npx prisma db push
   ```

3. **Add Custom Domain** (optional):
   - Configure in Vercel dashboard
   - Update `NEXT_PUBLIC_APP_URL` environment variable

## Future Enhancements

- [ ] Direct Google Calendar integration (OAuth)
- [ ] Support for more file formats (TXT, images with OCR)
- [ ] Custom event editing before export
- [ ] Recurring events support (weekly classes)
- [ ] Email reminders for upcoming events
- [ ] Mobile app (React Native)
- [ ] Browser extension for one-click syllabus extraction
- [ ] Multi-language support
- [ ] Team/class sharing features
- [ ] Integration with LMS platforms (Canvas, Blackboard)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please open an issue on GitHub or contact support.

---

Built with Claude AI by Anthropic
