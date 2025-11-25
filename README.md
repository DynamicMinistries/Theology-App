# Bible Study App

A comprehensive Bible study application that helps users understand Scripture in its proper literary, historical, and theological context. Built with AI-powered guidance and designed with a specific theological framework emphasizing Unitarian Christology, conditional immortality, and holistic anthropology.

## 🌟 Features

### Core Features
- **Interactive Learning**: Users articulate their understanding before receiving explanations
- **AI-Powered Feedback**: Gentle, pastoral feedback that affirms and corrects
- **Structured Explanations**: Seven-part explanations covering:
  - Summary
  - Paragraph for ordinary readers
  - Literary context
  - Historical & cultural context
  - Key Hebrew/Greek words
  - Theological meaning
  - Pastoral application
- **Self-Check Quizzes**: Test understanding with multiple-choice questions
- **Progress Tracking**: Monitor learning journey with streaks and statistics
- **Review System**: Spaced repetition algorithm for long-term retention

### Theological Framework
All content aligns with:
- **Unitarian Christology**: God is one person (the Father); Jesus is the human Messiah
- **Conditional Immortality**: Immortality is a gift through resurrection, not inherent
- **Holistic Anthropology**: Humans are unified beings; no soul-body dualism
- **Resurrection Hope**: Emphasis on bodily resurrection and eternal life as God's gift

## 🛠️ Technology Stack

- **Frontend**: Next.js 14+ (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, tRPC patterns
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI**: OpenAI GPT-4 (configurable for other providers)
- **UI Components**: Radix UI primitives with custom styling

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- An OpenAI API key (for AI-powered features)
- npm or yarn package manager

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Theology-App
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and configure the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/bible_study_app"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-here"  # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# OpenAI API
OPENAI_API_KEY="sk-..."

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Setup

Create the database:

```bash
createdb bible_study_app
```

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Seed the database with Bible books and sample verses:

```bash
npm run db:seed
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
Theology-App/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeding script
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── api/           # API routes
│   │   ├── auth/          # Authentication pages
│   │   ├── dashboard/     # Dashboard page
│   │   ├── study/         # Verse study page
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Home page
│   ├── components/        # React components
│   │   └── ui/            # Reusable UI components
│   ├── lib/               # Utility libraries
│   │   ├── ai-service.ts  # AI integration
│   │   ├── auth.ts        # NextAuth configuration
│   │   ├── bible-service.ts # Bible data service
│   │   ├── db.ts          # Prisma client
│   │   └── utils.ts       # Utility functions
│   └── types/             # TypeScript type definitions
├── SPECIFICATION.md       # Complete product specification
├── SETUP_GUIDE.md        # Detailed setup instructions
├── package.json
├── tsconfig.json
└── README.md
```

## 🔑 Key Files

### Database Schema (`prisma/schema.prisma`)
Defines all database models including:
- Users and authentication
- Verse studies and reviews
- User progress tracking
- Bible text cache
- AI usage logging

### AI Service (`src/lib/ai-service.ts`)
Handles all AI interactions with:
- Theological framework enforcement
- User interpretation analysis
- Structured explanation generation
- Quiz question generation
- Review comparison

### Bible Service (`src/lib/bible-service.ts`)
Manages Bible text data:
- Verse fetching with caching
- External API integration
- Context retrieval
- Search functionality

## 🎯 Usage Guide

### For End Users

1. **Register an Account**: Create an account at `/auth/register`
2. **Choose a Verse**: Enter a verse reference (e.g., "John 3:16")
3. **Share Your Understanding**: Write what you think the verse means
4. **Receive Feedback**: Get warm, pastoral feedback on your interpretation
5. **Explore the Explanation**: Read the detailed 7-part explanation
6. **Take the Quiz**: Test your understanding with self-check questions
7. **Track Progress**: View your study streak and statistics

### For Developers

#### Adding New API Routes

Create a new route file in `src/app/api/`:

```typescript
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Your logic here
  return NextResponse.json({ data: 'Your response' })
}
```

#### Customizing the Theological Framework

Edit `src/lib/ai-service.ts` to modify the `THEOLOGICAL_FRAMEWORK_PROMPT`:

```typescript
const THEOLOGICAL_FRAMEWORK_PROMPT = `
Your custom theological framework here...
`
```

#### Adding New UI Components

Create components in `src/components/ui/` following the Radix UI + Tailwind pattern.

## 🧪 Testing

Run type checking:

```bash
npm run type-check
```

Run linting:

```bash
npm run lint
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables in Vercel dashboard
4. Connect a PostgreSQL database (Vercel Postgres or external)
5. Deploy!

### Docker

```bash
# Build the image
docker build -t bible-study-app .

# Run with docker-compose
docker-compose up -d
```

## 📊 Database Migrations

Create a new migration:

```bash
npx prisma migrate dev --name your_migration_name
```

Apply migrations in production:

```bash
npx prisma migrate deploy
```

## 🔐 Security Considerations

- All user passwords are hashed with bcrypt
- API routes require authentication
- AI responses are validated for theological compliance
- User input is sanitized to prevent XSS attacks
- Environment variables are properly secured

## 📝 Documentation

- **SPECIFICATION.md**: Complete product specification with theological framework, features, and architecture
- **SETUP_GUIDE.md**: Detailed step-by-step setup instructions with troubleshooting

## 🆘 Support

For detailed setup instructions, see `SETUP_GUIDE.md`.

For issues, questions, or feature requests, please contact the development team.

## 📚 Additional Resources

- **Prisma Docs**: https://www.prisma.io/docs
- **Next.js Docs**: https://nextjs.org/docs
- **NextAuth.js Docs**: https://next-auth.js.org

## 🙏 Acknowledgments

Built to help Christians understand Scripture faithfully in its proper context, with hope in the resurrection and eternal life as God's gracious gift.

---

**Version**: 1.0.0
**Last Updated**: 2025-11-25
