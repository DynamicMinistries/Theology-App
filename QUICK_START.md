# Quick Start Guide

Get the Bible Study App running in 5 minutes!

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- OpenAI API Key

## Setup Commands

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Edit .env and add:
#    - DATABASE_URL (your PostgreSQL connection string)
#    - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
#    - OPENAI_API_KEY (your OpenAI API key)

# 4. Create database
createdb bible_study_app

# 5. Run migrations and seed
npx prisma migrate dev
npm run db:seed

# 6. Start the app
npm run dev

# 7. Open http://localhost:3000
```

## First Steps

1. Create an account at http://localhost:3000/auth/register
2. Try studying "John 3:16" as your first verse
3. Follow the 7-step study flow

## Troubleshooting

**Database connection failed?**
- Check PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL in `.env`

**AI not responding?**
- Verify OPENAI_API_KEY in `.env`
- Check your OpenAI account has credits

**Port 3000 in use?**
- Run on different port: `npm run dev -- -p 3001`

For detailed setup instructions, see `SETUP_GUIDE.md`.

## Project Structure

- `/src/app` - Pages and API routes
- `/src/components` - UI components
- `/src/lib` - Core services (AI, Bible data, auth)
- `/prisma` - Database schema and migrations
- `SPECIFICATION.md` - Complete product spec
- `SETUP_GUIDE.md` - Detailed setup guide

## Key Features

✅ Interactive verse study flow
✅ AI-powered feedback with theological framework
✅ 7-part structured explanations
✅ Self-check quizzes
✅ Progress tracking with streaks
✅ Spaced repetition review system

## Architecture

```
User → Next.js Frontend → API Routes → AI Service (OpenAI)
                                    ↓
                                PostgreSQL
```

## Theological Framework

The app enforces these boundaries in all AI-generated content:
- Unitarian Christology (God = Father; Jesus = human Messiah)
- Conditional immortality (no inherent immortal soul)
- Holistic anthropology (no body-soul dualism)
- Resurrection hope emphasized

See `SPECIFICATION.md` section 2 for complete framework details.

## Next Steps

1. Review `SPECIFICATION.md` for full features
2. Explore the code in `/src`
3. Customize theological prompts in `/src/lib/ai-service.ts`
4. Add more Bible translations or verses
5. Deploy to Vercel or your hosting platform

## Support

- Issues? Check `SETUP_GUIDE.md` troubleshooting section
- Questions? Review `SPECIFICATION.md` documentation
- Want to customize? See README.md developer section

---

**Happy studying!** 📖✨
