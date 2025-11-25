# Complete Setup Guide

This guide will walk you through setting up the Bible Study App from scratch.

## Prerequisites

### Required Software

1. **Node.js (v18 or higher)**
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **PostgreSQL (v14 or higher)**
   - Download from: https://www.postgresql.org/download/
   - Or use Docker: `docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:14`
   - Verify: `psql --version`

3. **Git**
   - Download from: https://git-scm.com/
   - Verify: `git --version`

### Required API Keys

1. **OpenAI API Key**
   - Sign up at: https://platform.openai.com/
   - Navigate to: https://platform.openai.com/api-keys
   - Create a new secret key
   - **Important**: You need access to GPT-4 for best results

## Step-by-Step Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd bible-study-app

# Install dependencies
npm install
```

### 2. Database Setup

#### Option A: Local PostgreSQL

```bash
# Create the database
createdb bible_study_app

# If createdb is not available, use psql:
psql -U postgres -c "CREATE DATABASE bible_study_app;"
```

#### Option B: Docker PostgreSQL

```bash
# Start PostgreSQL in Docker
docker run --name bible-study-postgres \
  -e POSTGRES_DB=bible_study_app \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  -d postgres:14

# Wait a few seconds for it to start
sleep 5
```

### 3. Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` with your favorite text editor:

```env
# Database URL
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/bible_study_app"

# NextAuth Secret
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="paste-the-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# OpenAI API Key
OPENAI_API_KEY="sk-your-openai-api-key-here"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Bible Study App"
```

#### Generate NextAuth Secret

On Linux/Mac:
```bash
openssl rand -base64 32
```

On Windows (PowerShell):
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

Or use an online generator: https://generate-secret.vercel.app/32

### 4. Database Migration and Seeding

```bash
# Generate Prisma client
npx prisma generate

# Run migrations (creates all tables)
npx prisma migrate dev

# Seed the database with Bible books and sample verses
npm run db:seed
```

Expected output:
```
✓ Prisma Client generated successfully
✓ Applied migration 20xx_xxx_init
✓ Seeding database...
✓ Seeding Bible books...
✓ Seeding sample verses...
✓ Database seeded successfully!
```

### 5. Verify Database

```bash
# Open Prisma Studio to view your database
npx prisma studio
```

This will open http://localhost:5555 where you can browse:
- BibleBook table (should have 66 books)
- BibleVerse table (should have 6 sample verses)
- User, UserProgress, VerseStudy tables (empty initially)

### 6. Start Development Server

```bash
npm run dev
```

You should see:
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Ready in X.Xs
```

### 7. Test the Application

1. **Open the app**: Navigate to http://localhost:3000
2. **Create account**: Click "Get Started" and register
3. **Study a verse**: Try "John 3:16" as your first study
4. **Complete the flow**: Go through all steps

## Troubleshooting

### Database Connection Errors

**Error**: `Can't reach database server`

Solutions:
1. Verify PostgreSQL is running:
   ```bash
   # macOS/Linux
   pg_isready

   # Windows
   pg_ctl status
   ```

2. Check connection string in `.env`
3. Ensure port 5432 is not blocked

### Prisma Errors

**Error**: `Migration engine error`

Solution:
```bash
# Reset the database (WARNING: deletes all data)
npx prisma migrate reset

# Then re-seed
npm run db:seed
```

### OpenAI API Errors

**Error**: `Invalid API key` or `Insufficient quota`

Solutions:
1. Verify your API key is correct in `.env`
2. Check your OpenAI billing: https://platform.openai.com/account/billing
3. Ensure you have GPT-4 access

**Error**: `Rate limit exceeded`

Solution:
- Wait a few minutes and try again
- Consider upgrading your OpenAI plan

### Port Conflicts

**Error**: `Port 3000 is already in use`

Solutions:
```bash
# Find and kill the process using port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port:
npm run dev -- -p 3001
```

### TypeScript Errors

**Error**: `Cannot find module '@/...'`

Solution:
```bash
# Restart your TypeScript server in VS Code
# Command Palette (Cmd/Ctrl+Shift+P) > "TypeScript: Restart TS Server"

# Or reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Development Workflow

### Daily Development

```bash
# 1. Pull latest changes
git pull

# 2. Install new dependencies (if any)
npm install

# 3. Run migrations (if any)
npx prisma migrate dev

# 4. Start dev server
npm run dev
```

### Database Changes

When you modify `prisma/schema.prisma`:

```bash
# Create and apply migration
npx prisma migrate dev --name your_change_description

# Regenerate Prisma client
npx prisma generate
```

### Viewing Logs

- **Server logs**: Check your terminal running `npm run dev`
- **Browser console**: F12 > Console tab
- **Database queries**: Set `log: ['query']` in `src/lib/db.ts`

## Production Deployment

### Vercel Deployment

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**:
   - In Vercel dashboard > Settings > Environment Variables
   - Add all variables from your `.env` file
   - **Important**: Use a production PostgreSQL database URL

4. **Connect Database**:
   - Option A: Use Vercel Postgres (easiest)
   - Option B: Use external provider (Supabase, Railway, etc.)

5. **Run Migrations**:
   ```bash
   # After first deployment
   npx prisma migrate deploy
   ```

6. **Deploy**:
   - Push to GitHub, Vercel auto-deploys
   - Or click "Deploy" in Vercel dashboard

### Environment Variables for Production

```env
DATABASE_URL="postgresql://user:password@your-db-host:5432/dbname"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.com"
OPENAI_API_KEY="sk-your-production-key"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

## Advanced Configuration

### Using a Different AI Provider

Edit `src/lib/ai-service.ts` to use Anthropic Claude:

```typescript
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Update functions to use Claude API
```

### Integrating External Bible API

Edit `src/lib/bible-service.ts` to fetch from API.Bible or ESV API:

```typescript
async function fetchFromExternalAPI(reference: VerseReference, translation: string) {
  const response = await fetch(
    `https://api.scripture.api.bible/v1/bibles/${bibleId}/verses/${verseId}`,
    {
      headers: {
        'api-key': process.env.BIBLE_API_KEY!,
      },
    }
  )

  const data = await response.json()
  return data.data.content
}
```

### Customizing the UI Theme

Edit `src/app/globals.css` to change colors:

```css
:root {
  --primary: 217 91% 60%;  /* Change this */
  --secondary: 38 92% 50%; /* And this */
}
```

## Testing Checklist

After setup, verify:

- [ ] Home page loads at http://localhost:3000
- [ ] Can create a new account
- [ ] Can sign in with created account
- [ ] Dashboard shows user stats
- [ ] Can start a verse study (try "John 3:16")
- [ ] AI feedback is generated (may take 10-30 seconds)
- [ ] Can view full explanation
- [ ] Can complete quiz
- [ ] Progress is tracked on dashboard
- [ ] Can sign out and sign back in

## Next Steps

1. Read `SPECIFICATION.md` for full product details
2. Explore `src/app/` for page components
3. Review `src/lib/ai-service.ts` for AI integration
4. Customize theological prompts as needed
5. Add more Bible verses to the cache
6. Implement additional features (see SPECIFICATION.md Phase 2-4)

## Getting Help

If you encounter issues:

1. Check the error message carefully
2. Review the Troubleshooting section above
3. Check the logs (terminal and browser console)
4. Verify all environment variables are set correctly
5. Try resetting the database: `npx prisma migrate reset`

## Resources

- Next.js Documentation: https://nextjs.org/docs
- Prisma Documentation: https://www.prisma.io/docs
- NextAuth.js Documentation: https://next-auth.js.org/
- OpenAI API Documentation: https://platform.openai.com/docs
- Tailwind CSS Documentation: https://tailwindcss.com/docs

---

**Happy Coding!**

If you follow this guide step-by-step, you should have a fully functional Bible Study App running locally.
