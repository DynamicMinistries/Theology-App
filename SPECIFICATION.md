# Bible Study App - Complete Specification

## 1. Executive Summary

The Bible Study App is a mobile and web application designed to help users understand Bible verses in their proper context while maintaining a specific theological framework: Unitarian Christology, conditional immortality, and holistic anthropology.

### 1.1 Core Purpose
Help users understand any Bible verse through:
- Literary context (chapter, book, flow)
- Historical and cultural background
- Key Hebrew/Greek terminology
- Theological meaning within the specified framework
- Interactive learning with AI-powered feedback

### 1.2 Key Differentiators
- **Interactive Learning**: Users articulate their understanding before receiving explanations
- **AI-Powered Feedback**: Gentle, pastoral correction and affirmation
- **Theological Consistency**: All content aligns with Unitarian, conditional immortality framework
- **Progress Tracking**: Monitors learning journey and suggests reviews
- **Context-First Approach**: Every explanation emphasizes literary and historical context

---

## 2. Theological Framework (Non-Negotiable Boundaries)

### 2.1 View of God and Jesus Christ
- **God**: One person - the Father alone
- **Jesus**: Real human Messiah, conceived and born as a man
- **Relationship**: Jesus chosen, anointed, empowered by God
- **Prohibited Language**:
  - "God the Son"
  - "Second divine person"
  - "Pre-existent divine person became human"
  - Nicene/Chalcedonian formulations
  - "Two natures in one person"
- **John 1 Interpretation**: "Word" = God's saving purpose/promise expressed in Jesus' human life

### 2.2 Conditional Immortality
- Humans are naturally mortal
- Immortality is God's gift through bodily resurrection
- No naturally immortal soul
- No conscious eternal torment
- Final judgment = final death (annihilation), not endless suffering

### 2.3 Holistic Anthropology
- Human = unified living being (not soul + body)
- Death = real cessation of existence
- Hope = bodily resurrection at Christ's return
- No soul-body dualism
- No intermediate conscious state after death

### 2.4 AI Enforcement
- All AI-generated content must pass theological validation
- System prompts encode these boundaries
- Content flagging system for theological drift
- Regular review of AI outputs for compliance

---

## 3. Core User Flow: Verse Study Journey

### 3.1 Step-by-Step Process

#### Step 1: Verse Selection
- User searches or browses for a verse (e.g., "John 3:16", "Romans 6:23")
- App displays the verse in user's chosen translation
- Clean, readable typography
- Reference clearly displayed

#### Step 2: User's Initial Understanding
- Prompt: "In your own words, what do you think this verse means?"
- Large text input area
- Encouragement: "Don't worry about being perfect - this helps you learn!"
- Optional: Skip button (but encouragement to try)

#### Step 3: Storage & Processing
- Save user's response with timestamp
- Link to user profile and verse
- Trigger AI analysis

#### Step 4: AI Comparison & Feedback
- AI reads user's interpretation
- Generates response that:
  - **Affirms** correct understanding (specific points)
  - **Gently corrects** misconceptions (with explanation)
  - **Fills gaps** in understanding (what was missed)
- Tone: warm, pastoral, encouraging, never condescending

#### Step 5: Structured Explanation
Seven-part explanation, always in this order:

**A. One-Sentence Summary**
- Ultra-simple language
- Format: "This verse means that..."
- Standalone clarity

**B. Short Paragraph for Ordinary Readers**
- Expands main idea (3-5 sentences)
- No jargon
- Practical application
- Often connects to resurrection hope

**C. Literary Context**
- Paragraph/chapter/book flow
- Speaker, audience, topic
- Connection to broader gospel message
- How verse fits the argument

**D. Historical & Cultural Context**
- Time period, setting
- Audience background
- Cultural customs affecting meaning
- Brief and relevant only

**E. Key Hebrew/Greek Words**
- Most important terms (2-4 words typically)
- Original word in transliteration
- Basic meaning in simple English
- How it shapes verse meaning
- Theological alignment notes
- Minimal technical grammar

**F. Theological Meaning**
- What verse teaches about God, Christ, salvation, humanity
- Explicitly within the Unitarian framework
- Correct common Trinitarian misreadings (gently)
- No Nicene language
- Resurrection-centered hope

**G. Pastoral Application**
- One paragraph (3-5 sentences)
- How verse speaks to daily life
- Often addresses: fear of death, grief, sin, discouragement
- Resurrection hope as comfort
- Practical encouragement

#### Step 6: Self-Check Questions
- 2-3 multiple choice or short answer questions
- Test understanding of:
  - Main point
  - How context shaped meaning
  - Connection to resurrection gospel
- Immediate feedback on answers
- Explanation for incorrect answers

#### Step 7: Save & Track Progress
- Mark verse as "studied"
- Store user's answers and quiz results
- Update progress dashboard
- Calculate comprehension score

### 3.2 Review & Reinforcement

#### Review Sessions
- App suggests verses for review (spaced repetition algorithm)
- User tries to explain verse again (from memory or re-reading)
- Compare new explanation with:
  - Previous attempt
  - Correct explanation
  - Growth indicators

#### Progress Tracking
- Dashboard showing:
  - Verses studied
  - Comprehension trends
  - Areas needing review
  - Favorite/bookmarked verses
- Visual progress indicators
- Encouragement for consistent study

---

## 4. Technical Architecture

### 4.1 Technology Stack

#### Frontend (Web)
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + custom components
- **State Management**: React Context + Server Components
- **Forms**: React Hook Form + Zod validation

#### Frontend (Mobile)
- **Framework**: React Native / Expo
- **Shared**: Business logic, types, API client
- **Navigation**: React Navigation
- **Storage**: Expo SecureStore

#### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **API Pattern**: tRPC or REST
- **Validation**: Zod schemas

#### Database
- **Primary**: PostgreSQL
- **ORM**: Prisma
- **Migrations**: Prisma Migrate
- **Backup**: Automated daily backups

#### AI Integration
- **Primary Provider**: OpenAI GPT-4
- **Fallback**: Anthropic Claude (configurable)
- **Streaming**: Server-Sent Events for responses
- **Caching**: Redis for repeated verse queries

#### Authentication
- **Provider**: NextAuth.js (Auth.js)
- **Methods**: Email/password, Google OAuth (optional)
- **Sessions**: JWT with secure HTTP-only cookies

#### Bible Data
- **Source**: Bible API (API.Bible, ESV API, or self-hosted)
- **Cache**: Local database for popular verses
- **Translations**: Configurable (ESV, KJV, NKJV, NIV, etc.)

### 4.2 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────────┐              ┌──────────────────┐    │
│  │   Web App        │              │   Mobile App     │    │
│  │   (Next.js)      │              │   (React Native) │    │
│  └────────┬─────────┘              └─────────┬────────┘    │
│           │                                   │              │
└───────────┼───────────────────────────────────┼──────────────┘
            │                                   │
            └───────────────┬───────────────────┘
                            │
┌───────────────────────────▼───────────────────────────────────┐
│                      API LAYER                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              Next.js API Routes / tRPC                  │  │
│  │  - Authentication  - Verse Studies  - Progress         │  │
│  │  - User Management - Bible Data     - Reviews          │  │
│  └────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
            │                    │                    │
    ┌───────▼────────┐  ┌────────▼─────────┐  ┌─────▼──────┐
    │   PostgreSQL   │  │   AI Service     │  │  Bible API │
    │   (Prisma)     │  │   (OpenAI/Claude)│  │  (External)│
    └────────────────┘  └──────────────────┘  └────────────┘
            │
    ┌───────▼────────┐
    │  Redis Cache   │
    │  (Optional)    │
    └────────────────┘
```

### 4.3 Database Schema

#### Users Table
```prisma
model User {
  id                String   @id @default(cuid())
  email             String   @unique
  name              String?
  passwordHash      String?
  preferredTranslation String @default("ESV")
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  verseStudies      VerseStudy[]
  reviewSessions    ReviewSession[]
  progress          UserProgress[]
}
```

#### VerseStudy Table
```prisma
model VerseStudy {
  id                String   @id @default(cuid())
  userId            String
  verseReference    String   // "John 3:16"
  bookName          String
  chapter           Int
  verseNumber       Int

  // User's understanding
  userInterpretation String
  submittedAt       DateTime @default(now())

  // AI Response
  aiFeedback        Json     // {affirmed: [], corrected: [], gaps: []}
  structuredExplanation Json  // {summary, paragraph, context, ...}

  // Quiz results
  quizAnswers       Json?
  quizScore         Float?

  // Metadata
  completedAt       DateTime?
  reviewedCount     Int      @default(0)
  lastReviewedAt    DateTime?

  user              User     @relation(fields: [userId], references: [id])
  reviewSessions    ReviewSession[]

  @@index([userId, verseReference])
  @@index([userId, completedAt])
}
```

#### ReviewSession Table
```prisma
model ReviewSession {
  id                String   @id @default(cuid())
  userId            String
  verseStudyId      String

  newInterpretation String
  comparisonResult  Json     // How it compares to original & correct answer
  improvementScore  Float?   // -1 to 1 scale

  createdAt         DateTime @default(now())

  user              User       @relation(fields: [userId], references: [id])
  verseStudy        VerseStudy @relation(fields: [verseStudyId], references: [id])

  @@index([userId, createdAt])
}
```

#### UserProgress Table
```prisma
model UserProgress {
  id                String   @id @default(cuid())
  userId            String

  totalStudies      Int      @default(0)
  averageQuizScore  Float?
  currentStreak     Int      @default(0)
  longestStreak     Int      @default(0)
  lastStudyDate     DateTime?

  versesStudied     Json     // Array of verse references
  booksStudied      Json     // Array of book names with counts

  updatedAt         DateTime @updatedAt

  user              User     @relation(fields: [userId], references: [id])

  @@unique([userId])
}
```

#### BibleVerse Table (Cache)
```prisma
model BibleVerse {
  id                String   @id @default(cuid())
  reference         String   @unique
  bookName          String
  chapter           Int
  verseNumber       Int
  translation       String
  text              String

  createdAt         DateTime @default(now())

  @@index([bookName, chapter, verseNumber])
}
```

### 4.4 API Endpoints

#### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/logout` - End session
- `GET /api/auth/session` - Get current session

#### Verse Studies
- `POST /api/studies/start` - Begin new verse study
- `POST /api/studies/:id/submit-interpretation` - Submit user's understanding
- `GET /api/studies/:id/feedback` - Get AI feedback (SSE)
- `POST /api/studies/:id/quiz-answers` - Submit quiz answers
- `GET /api/studies/:id` - Get complete study
- `GET /api/studies/` - List user's studies (paginated)

#### Reviews
- `GET /api/reviews/suggestions` - Get verses to review
- `POST /api/reviews/start` - Begin review session
- `POST /api/reviews/:id/submit` - Submit review interpretation

#### Progress
- `GET /api/progress` - Get user progress summary
- `GET /api/progress/streak` - Get current streak
- `GET /api/progress/stats` - Detailed statistics

#### Bible Data
- `GET /api/bible/verse` - Get verse text (query: reference, translation)
- `GET /api/bible/search` - Search verses (query: term)
- `GET /api/bible/books` - List available books

#### AI Service
- `POST /api/ai/analyze-interpretation` - Analyze user's interpretation
- `POST /api/ai/generate-explanation` - Generate structured explanation
- `POST /api/ai/generate-quiz` - Generate self-check questions

### 4.5 AI Service Integration

#### System Prompt Template
```
You are a Bible scholar assistant for an app that helps Christians understand
Scripture in context. You MUST follow these theological boundaries:

THEOLOGICAL FRAMEWORK:
1. God is one person - the Father alone. Jesus is the human Messiah.
2. Jesus was conceived and born as a man, not a pre-existent divine being.
3. Never use "God the Son" or say a divine person became human.
4. Immortality is conditional - a gift through resurrection, not innate.
5. No eternal conscious torment - final judgment is final death.
6. Humans are unified beings - no soul/body dualism.
7. Death is real death until bodily resurrection.

TONE: Warm, pastoral, encouraging, clear. Never harsh or condescending.

WHEN EXPLAINING JOHN 1: "Word" = God's saving purpose/promise expressed
in Jesus' human life, not a pre-existent divine person.

Your task: [specific instruction for this API call]
```

#### AI Service Methods

1. **analyzeUserInterpretation(verseRef, verseText, userInterpretation)**
   - Returns: `{affirmed: string[], corrected: string[], gaps: string[]}`
   - Tone: Encouraging and gentle

2. **generateStructuredExplanation(verseRef, verseText, context)**
   - Returns: Object with keys: summary, paragraph, literaryContext,
     historicalContext, greekHebrewWords, theologicalMeaning, pastoralApplication
   - Enforces theological framework in all sections

3. **generateQuizQuestions(verseRef, explanation)**
   - Returns: Array of 2-3 questions with answer options
   - Tests: main point, context influence, resurrection connection

4. **compareReviewAttempt(verseRef, originalAttempt, newAttempt, correctAnswer)**
   - Returns: Comparison showing growth or areas still needing work
   - Improvement score: -1 (worse) to +1 (much better)

---

## 5. User Interface Design

### 5.1 Design Principles
- **Clarity**: Information hierarchy, readable typography
- **Simplicity**: No clutter, focused workflows
- **Warmth**: Soft colors, encouraging copy, pastoral tone
- **Accessibility**: WCAG AA compliance, keyboard navigation, screen reader support

### 5.2 Color Palette
- **Primary**: Warm blue (#3B82F6) - trustworthy, peaceful
- **Secondary**: Soft gold (#F59E0B) - hope, light
- **Accent**: Gentle green (#10B981) - growth, life
- **Text**: Slate (#1E293B) on white background
- **Background**: Off-white (#FAFAFA), pure white cards

### 5.3 Typography
- **Headings**: Inter or Source Sans Pro (clean, modern)
- **Body**: Georgia or Source Serif Pro (readable, classical)
- **Bible Text**: Crimson Text or EB Garamond (traditional, dignified)
- **UI Elements**: Inter (consistent with headings)

### 5.4 Key Screens

#### Home / Dashboard
- Welcome message with user's name
- Current streak display
- Quick verse search bar
- "Continue studying" section (recent/in-progress studies)
- Progress summary (verses studied, current streak)
- "Verses to review" section with suggestions
- Browse by book navigation

#### Verse Study Flow (Multi-step)

**Screen 1: Verse Display**
- Large, centered verse text
- Reference prominently displayed
- Translation name noted
- "Next" button

**Screen 2: Your Understanding**
- Prompt: "What do you think this verse means?"
- Large textarea (autofocus)
- Character count (encourage 50+ words)
- Encouraging help text
- "Submit" button (disabled until minimum length)

**Screen 3: AI Feedback**
- Three sections (collapsible):
  - ✅ What you understood well
  - 💡 Areas to reconsider
  - 📖 What the context adds
- Warm, specific feedback
- "Continue to full explanation" button

**Screen 4: Structured Explanation**
- Tabbed or accordion interface:
  - Summary (always visible at top)
  - For Ordinary Readers
  - Literary Context
  - Historical Context
  - Hebrew/Greek Words
  - Theological Meaning
  - Pastoral Application
- Smooth scrolling
- Bookmark button
- "Take the quiz" button

**Screen 5: Self-Check Quiz**
- One question at a time
- Multiple choice or short answer
- Immediate feedback
- Explanation for incorrect answers
- Progress bar (question 1 of 3)
- Final score screen with encouragement

**Screen 6: Completion**
- Celebration animation
- Summary: "You've studied [verse]"
- Key insight recap
- Options:
  - Study another verse
  - Review this verse
  - Return to dashboard

#### Progress Dashboard
- Visual progress chart (verses over time)
- Current & longest streak
- Total verses studied
- Average quiz score
- Books of Bible (heatmap showing coverage)
- Recent studies list
- Achievement badges (optional)

#### Review Session
- Similar flow to initial study
- Shows previous attempt for comparison
- Highlights growth
- Encouragement for improvement

### 5.5 Mobile-Specific Considerations
- Bottom navigation (Home, Search, Progress, Profile)
- Swipe gestures for navigation
- Optimized for one-handed use
- Offline mode for previously studied verses
- Push notifications for review reminders (opt-in)

---

## 6. AI Prompt Engineering

### 6.1 Prompt Structure for Analysis

```
SYSTEM: [Theological framework + tone guidelines]

USER: Analyze this interpretation of [VERSE_REFERENCE]:

Verse text: "[VERSE_TEXT]"
User's interpretation: "[USER_INTERPRETATION]"

Respond with:
1. AFFIRMED: List specific correct insights (be specific about what they got right)
2. CORRECTED: Gently point out misconceptions (explain why and what's correct)
3. GAPS: What important context or meaning they missed

Remember: Be warm, encouraging, and specific. Never harsh.
```

### 6.2 Prompt for Structured Explanation

```
SYSTEM: [Theological framework + guidelines]

USER: Generate a complete structured explanation for [VERSE_REFERENCE]:
"[VERSE_TEXT]"

Provide exactly these sections:

A. ONE_SENTENCE_SUMMARY: Ultra-simple, starts with "This verse means that..."

B. SHORT_PARAGRAPH: 3-5 sentences, no jargon, practical, mention resurrection hope

C. LITERARY_CONTEXT: How verse fits paragraph/chapter/book flow, speaker/audience,
   connection to gospel message

D. HISTORICAL_CULTURAL_CONTEXT: Time, audience, setting, customs (brief, relevant only)

E. KEY_WORDS: 2-4 most important Hebrew/Greek terms
   - Transliteration
   - Simple meaning
   - How it shapes verse meaning
   - Theological alignment notes

F. THEOLOGICAL_MEANING: Within Unitarian/conditional immortality framework
   - What it teaches about God, Christ, salvation
   - Correct Trinitarian misreadings (gently)
   - Resurrection-centered

G. PASTORAL_APPLICATION: 3-5 sentences, practical daily life, addresses
   fear/grief/sin/discouragement, resurrection hope as comfort

Format as JSON with these exact keys.
```

### 6.3 Quality Assurance

#### Theological Validation Checklist
After each AI response, validate:
- [ ] No "God the Son" language
- [ ] No pre-existence claims for Jesus
- [ ] No eternal torment references
- [ ] No soul-body dualism
- [ ] Resurrection hope emphasized
- [ ] Jesus presented as human Messiah
- [ ] God identified as Father alone

#### Tone Validation
- [ ] Warm and encouraging
- [ ] No condescending language
- [ ] Specific affirmations
- [ ] Gentle corrections with explanation
- [ ] Age-appropriate clarity

---

## 7. Learning & Engagement Features

### 7.1 Spaced Repetition Algorithm
- Review suggested based on:
  - Time since last study (1 day, 3 days, 7 days, 30 days)
  - Initial quiz score (lower scores trigger earlier reviews)
  - Number of previous reviews
- Algorithm: Modified SM-2 (SuperMemo 2)
- User can manually mark verses for review

### 7.2 Progress Tracking Metrics
- **Verses Studied**: Total count, breakdown by book
- **Comprehension Score**: Average quiz performance
- **Study Streak**: Consecutive days with at least one study
- **Review Rate**: Percentage of suggested reviews completed
- **Growth Indicators**: Comparison of review attempts vs. original

### 7.3 Gamification (Subtle)
- **Streaks**: Visual streak counter, encouragement to maintain
- **Milestones**: Celebrate 10, 25, 50, 100 verses studied
- **Book Completion**: Recognition for studying significant portions of a book
- **No pressure**: Emphasis on learning, not competition

### 7.4 Personalization
- Preferred Bible translation
- Study reminders (time of day, frequency)
- Theme preference (light/dark mode)
- Difficulty level (beginner, intermediate, advanced) - affects explanation depth

---

## 8. Bible Data Integration

### 8.1 Data Sources

#### Option 1: External API
- **API.Bible**: 1,600+ translations, free tier available
- **ESV API**: High-quality text, theological conservative
- **Bible Brain**: Extensive language support
- **Pros**: No data management, always updated
- **Cons**: API rate limits, internet dependency

#### Option 2: Self-Hosted Database
- **Source**: Public domain translations (KJV, ASV, WEB)
- **Format**: SQLite or PostgreSQL
- **Structure**: books, chapters, verses tables
- **Pros**: No limits, offline capable, fast
- **Cons**: Limited translations, update responsibility

#### Recommendation: Hybrid
- Primary: Self-hosted for common translations (ESV, KJV, NKJV)
- Fallback: External API for other translations
- Cache: Store fetched verses locally

### 8.2 Data Schema for Bible Text

```sql
CREATE TABLE bible_books (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  testament VARCHAR(2) NOT NULL, -- 'OT' or 'NT'
  book_order INT NOT NULL,
  chapters INT NOT NULL
);

CREATE TABLE bible_verses (
  id SERIAL PRIMARY KEY,
  book_id INT REFERENCES bible_books(id),
  chapter INT NOT NULL,
  verse INT NOT NULL,
  translation VARCHAR(10) NOT NULL,
  text TEXT NOT NULL,

  UNIQUE(book_id, chapter, verse, translation)
);

CREATE INDEX idx_bible_verses_lookup
  ON bible_verses(book_id, chapter, verse, translation);
```

### 8.3 Verse Reference Parsing
- Input: "John 3:16", "Genesis 1:1-3", "Psalm 23"
- Parse to: {book, chapter, startVerse, endVerse}
- Handle common abbreviations
- Support range references (fetch multiple verses)

---

## 9. Development & Deployment

### 9.1 Development Setup
```bash
# Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

# Installation
git clone <repo>
cd bible-study-app
npm install

# Environment setup
cp .env.example .env
# Configure: DATABASE_URL, OPENAI_API_KEY, NEXTAUTH_SECRET

# Database setup
npx prisma generate
npx prisma migrate dev

# Seed Bible data (optional)
npm run seed:bible

# Run development server
npm run dev
```

### 9.2 Environment Variables
```
DATABASE_URL="postgresql://user:password@localhost:5432/bibleapp"
OPENAI_API_KEY="sk-..."
NEXTAUTH_SECRET="<generated-secret>"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional
ANTHROPIC_API_KEY="sk-ant-..."
BIBLE_API_KEY="<api-key-if-using-external-api>"
REDIS_URL="redis://localhost:6379"
```

### 9.3 Deployment Options

#### Option 1: Vercel (Easiest)
- Deploy Next.js app to Vercel
- Connect Vercel Postgres or external PostgreSQL
- Environment variables in Vercel dashboard
- Automatic CI/CD from GitHub

#### Option 2: Docker + VPS
- Dockerfile for Next.js app
- Docker Compose with PostgreSQL
- Nginx reverse proxy
- SSL with Let's Encrypt

#### Option 3: AWS/GCP/Azure
- App on ECS/Cloud Run/App Service
- Managed PostgreSQL (RDS/Cloud SQL/Azure Database)
- CDN for static assets
- Auto-scaling configuration

### 9.4 Testing Strategy
- **Unit Tests**: Jest for utilities, parsing, validation
- **Integration Tests**: API routes with test database
- **E2E Tests**: Playwright for critical user flows
- **AI Tests**: Validate theological compliance with sample verses
- **Coverage Target**: 80%+ for critical paths

---

## 10. Future Enhancements

### Phase 2
- **Social Features**: Share insights, study groups
- **Annotations**: Personal notes on verses
- **Study Plans**: Guided multi-day topical studies
- **Audio**: Text-to-speech for verses and explanations

### Phase 3
- **Mobile Apps**: Native iOS/Android with React Native
- **Offline Mode**: Full functionality without internet
- **Multi-language**: UI and Bible texts in multiple languages
- **Export**: Generate PDF study guides

### Phase 4
- **Community**: Discussion forums moderated for theological consistency
- **Resources**: Integration with theological articles, sermons
- **Advanced Search**: Topical, linguistic, theological queries
- **Teacher Dashboard**: Track progress of study groups

---

## 11. Success Metrics

### User Engagement
- Daily Active Users (DAU)
- Average verses studied per week
- Review completion rate
- Session duration

### Learning Effectiveness
- Average quiz score improvement over time
- Review attempt improvement vs. original
- User self-reported understanding (surveys)

### Retention
- 7-day, 30-day, 90-day retention rates
- Streak maintenance (% of users maintaining 7+ day streaks)
- Return rate after initial study

### Technical
- API response time (< 2s for AI generation)
- Error rate (< 0.1%)
- Uptime (99.9%)

---

## 12. Risk Mitigation

### Theological Drift
- **Risk**: AI generates content outside framework
- **Mitigation**:
  - Strong system prompts
  - Automated theological validation
  - Manual review of flagged content
  - Regular prompt refinement

### AI Cost
- **Risk**: OpenAI API costs become unsustainable
- **Mitigation**:
  - Aggressive caching of common verses
  - Rate limiting per user
  - Usage tiers (free tier with limits)
  - Consider fine-tuned smaller models

### User Misuse
- **Risk**: Users submit inappropriate content
- **Mitigation**:
  - Content filtering on inputs
  - Rate limiting
  - Report/block functionality
  - Automated profanity detection

### Data Privacy
- **Risk**: Sensitive user data exposure
- **Mitigation**:
  - Minimal data collection
  - Encrypted storage of sensitive fields
  - GDPR compliance (data export, deletion)
  - Regular security audits

---

## 13. Support & Documentation

### User Documentation
- Quick start guide
- Video tutorials for main features
- FAQ section
- Theological framework explanation

### Developer Documentation
- API documentation (auto-generated)
- Architecture decision records
- Contribution guidelines
- Setup troubleshooting guide

### Support Channels
- In-app help
- Email support
- Community forum (moderated)
- GitHub issues for bugs

---

## Appendix A: Sample Verses for Testing

Test across different verse types to ensure robustness:

1. **John 3:16** - Classic gospel summary
2. **Romans 6:23** - Life/death contrast
3. **John 1:1-3** - High Christology challenge
4. **Philippians 2:5-11** - Pre-existence debate
5. **Genesis 2:7** - Human nature
6. **1 Corinthians 15:51-53** - Resurrection
7. **Matthew 25:46** - Final judgment
8. **2 Corinthians 5:8** - Intermediate state
9. **Hebrews 1:3** - Jesus' nature
10. **1 Timothy 6:16** - Immortality

Each should produce explanations consistent with the framework.

---

## Appendix B: Glossary

- **Conditional Immortality**: The belief that immortality is not inherent but granted by God
- **Unitarian Christology**: Belief that God is one person (the Father) and Jesus is the human Messiah
- **Holistic Anthropology**: View of humans as unified beings, not dualistic soul + body
- **Spaced Repetition**: Learning technique that schedules reviews at increasing intervals
- **Literary Context**: How a passage fits within its immediate textual surroundings
- **System Prompt**: Initial instructions given to AI model to guide its behavior

---

**End of Specification Document**
**Version 1.0**
**Date: 2025-11-25**
