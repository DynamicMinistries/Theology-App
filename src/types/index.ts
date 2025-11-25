// Core Types for Bible Study App

export interface VerseReference {
  book: string
  chapter: number
  verse: number
  endVerse?: number
  fullReference: string // "John 3:16"
}

export interface BibleVerse {
  reference: VerseReference
  text: string
  translation: string
}

export interface AIFeedback {
  affirmed: string[]
  corrected: string[]
  gaps: string[]
}

export interface StructuredExplanation {
  summary: string // One sentence summary
  paragraph: string // Short paragraph for ordinary readers
  literaryContext: string // How verse fits in chapter/book
  historicalContext: string // Historical and cultural background
  greekHebrewWords: GreekHebrewWord[] // Key terms
  theologicalMeaning: string // Within our framework
  pastoralApplication: string // Practical application
}

export interface GreekHebrewWord {
  original: string // Transliteration
  meaning: string // Simple English meaning
  significance: string // How it shapes verse meaning
}

export interface QuizQuestion {
  id: string
  question: string
  type: 'multiple_choice' | 'short_answer'
  options?: string[] // For multiple choice
  correctAnswer: string | number // Index for MC, text for short answer
  explanation: string // Why this is the correct answer
}

export interface VerseStudyProgress {
  verseReference: string
  status: 'in_progress' | 'completed'
  userInterpretation: string
  aiFeedback?: AIFeedback
  structuredExplanation?: StructuredExplanation
  quizQuestions?: QuizQuestion[]
  quizAnswers?: (string | number)[]
  quizScore?: number
  completedAt?: Date
  nextReviewDate?: Date
}

export interface UserProgress {
  totalStudies: number
  totalReviews: number
  averageQuizScore: number | null
  currentStreak: number
  longestStreak: number
  lastStudyDate: Date | null
  versesStudied: string[]
  booksStudied: Record<string, number>
}

export interface ReviewSession {
  id: string
  verseStudyId: string
  newInterpretation: string
  comparisonResult: ReviewComparison
  improvementScore: number // -1 to 1
  submittedAt: Date
}

export interface ReviewComparison {
  improvements: string[]
  stillMissing: string[]
  retained: string[]
}

export interface TheoligicalFramework {
  // Enforcement rules for AI
  rules: {
    godIsOnePerson: boolean
    jesusIsHumanMessiah: boolean
    noPreexistence: boolean
    conditionalImmortality: boolean
    noEternalTorment: boolean
    holisticAnthropology: boolean
  }
  prohibitedLanguage: string[]
  requiredEmphases: string[]
}

export const THEOLOGICAL_FRAMEWORK: TheoligicalFramework = {
  rules: {
    godIsOnePerson: true,
    jesusIsHumanMessiah: true,
    noPreexistence: true,
    conditionalImmortality: true,
    noEternalTorment: true,
    holisticAnthropology: true,
  },
  prohibitedLanguage: [
    'God the Son',
    'second divine person',
    'pre-existent divine person',
    'two natures in one person',
    'eternal conscious torment',
    'immortal soul',
    'inherent immortality',
  ],
  requiredEmphases: [
    'bodily resurrection',
    'conditional immortality',
    'Jesus as human Messiah',
    'God as one person - the Father',
    'death as real cessation',
    'resurrection hope',
  ],
}

export interface User {
  id: string
  email: string
  name: string | null
  preferredTranslation: string
  theme: 'light' | 'dark'
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced'
  studyReminders: boolean
  reminderTime: string | null
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Bible data types
export interface BibleBook {
  id: number
  name: string
  shortName: string
  testament: 'OT' | 'NT'
  bookOrder: number
  chapters: number
}

export const BIBLE_BOOKS: BibleBook[] = [
  // Old Testament
  { id: 1, name: 'Genesis', shortName: 'Gen', testament: 'OT', bookOrder: 1, chapters: 50 },
  { id: 2, name: 'Exodus', shortName: 'Exod', testament: 'OT', bookOrder: 2, chapters: 40 },
  { id: 3, name: 'Leviticus', shortName: 'Lev', testament: 'OT', bookOrder: 3, chapters: 27 },
  { id: 4, name: 'Numbers', shortName: 'Num', testament: 'OT', bookOrder: 4, chapters: 36 },
  { id: 5, name: 'Deuteronomy', shortName: 'Deut', testament: 'OT', bookOrder: 5, chapters: 34 },
  { id: 6, name: 'Joshua', shortName: 'Josh', testament: 'OT', bookOrder: 6, chapters: 24 },
  { id: 7, name: 'Judges', shortName: 'Judg', testament: 'OT', bookOrder: 7, chapters: 21 },
  { id: 8, name: 'Ruth', shortName: 'Ruth', testament: 'OT', bookOrder: 8, chapters: 4 },
  { id: 9, name: '1 Samuel', shortName: '1Sam', testament: 'OT', bookOrder: 9, chapters: 31 },
  { id: 10, name: '2 Samuel', shortName: '2Sam', testament: 'OT', bookOrder: 10, chapters: 24 },
  { id: 11, name: '1 Kings', shortName: '1Kgs', testament: 'OT', bookOrder: 11, chapters: 22 },
  { id: 12, name: '2 Kings', shortName: '2Kgs', testament: 'OT', bookOrder: 12, chapters: 25 },
  { id: 13, name: '1 Chronicles', shortName: '1Chr', testament: 'OT', bookOrder: 13, chapters: 29 },
  { id: 14, name: '2 Chronicles', shortName: '2Chr', testament: 'OT', bookOrder: 14, chapters: 36 },
  { id: 15, name: 'Ezra', shortName: 'Ezra', testament: 'OT', bookOrder: 15, chapters: 10 },
  { id: 16, name: 'Nehemiah', shortName: 'Neh', testament: 'OT', bookOrder: 16, chapters: 13 },
  { id: 17, name: 'Esther', shortName: 'Esth', testament: 'OT', bookOrder: 17, chapters: 10 },
  { id: 18, name: 'Job', shortName: 'Job', testament: 'OT', bookOrder: 18, chapters: 42 },
  { id: 19, name: 'Psalms', shortName: 'Ps', testament: 'OT', bookOrder: 19, chapters: 150 },
  { id: 20, name: 'Proverbs', shortName: 'Prov', testament: 'OT', bookOrder: 20, chapters: 31 },
  { id: 21, name: 'Ecclesiastes', shortName: 'Eccl', testament: 'OT', bookOrder: 21, chapters: 12 },
  { id: 22, name: 'Song of Solomon', shortName: 'Song', testament: 'OT', bookOrder: 22, chapters: 8 },
  { id: 23, name: 'Isaiah', shortName: 'Isa', testament: 'OT', bookOrder: 23, chapters: 66 },
  { id: 24, name: 'Jeremiah', shortName: 'Jer', testament: 'OT', bookOrder: 24, chapters: 52 },
  { id: 25, name: 'Lamentations', shortName: 'Lam', testament: 'OT', bookOrder: 25, chapters: 5 },
  { id: 26, name: 'Ezekiel', shortName: 'Ezek', testament: 'OT', bookOrder: 26, chapters: 48 },
  { id: 27, name: 'Daniel', shortName: 'Dan', testament: 'OT', bookOrder: 27, chapters: 12 },
  { id: 28, name: 'Hosea', shortName: 'Hos', testament: 'OT', bookOrder: 28, chapters: 14 },
  { id: 29, name: 'Joel', shortName: 'Joel', testament: 'OT', bookOrder: 29, chapters: 3 },
  { id: 30, name: 'Amos', shortName: 'Amos', testament: 'OT', bookOrder: 30, chapters: 9 },
  { id: 31, name: 'Obadiah', shortName: 'Obad', testament: 'OT', bookOrder: 31, chapters: 1 },
  { id: 32, name: 'Jonah', shortName: 'Jonah', testament: 'OT', bookOrder: 32, chapters: 4 },
  { id: 33, name: 'Micah', shortName: 'Mic', testament: 'OT', bookOrder: 33, chapters: 7 },
  { id: 34, name: 'Nahum', shortName: 'Nah', testament: 'OT', bookOrder: 34, chapters: 3 },
  { id: 35, name: 'Habakkuk', shortName: 'Hab', testament: 'OT', bookOrder: 35, chapters: 3 },
  { id: 36, name: 'Zephaniah', shortName: 'Zeph', testament: 'OT', bookOrder: 36, chapters: 3 },
  { id: 37, name: 'Haggai', shortName: 'Hag', testament: 'OT', bookOrder: 37, chapters: 2 },
  { id: 38, name: 'Zechariah', shortName: 'Zech', testament: 'OT', bookOrder: 38, chapters: 14 },
  { id: 39, name: 'Malachi', shortName: 'Mal', testament: 'OT', bookOrder: 39, chapters: 4 },

  // New Testament
  { id: 40, name: 'Matthew', shortName: 'Matt', testament: 'NT', bookOrder: 40, chapters: 28 },
  { id: 41, name: 'Mark', shortName: 'Mark', testament: 'NT', bookOrder: 41, chapters: 16 },
  { id: 42, name: 'Luke', shortName: 'Luke', testament: 'NT', bookOrder: 42, chapters: 24 },
  { id: 43, name: 'John', shortName: 'John', testament: 'NT', bookOrder: 43, chapters: 21 },
  { id: 44, name: 'Acts', shortName: 'Acts', testament: 'NT', bookOrder: 44, chapters: 28 },
  { id: 45, name: 'Romans', shortName: 'Rom', testament: 'NT', bookOrder: 45, chapters: 16 },
  { id: 46, name: '1 Corinthians', shortName: '1Cor', testament: 'NT', bookOrder: 46, chapters: 16 },
  { id: 47, name: '2 Corinthians', shortName: '2Cor', testament: 'NT', bookOrder: 47, chapters: 13 },
  { id: 48, name: 'Galatians', shortName: 'Gal', testament: 'NT', bookOrder: 48, chapters: 6 },
  { id: 49, name: 'Ephesians', shortName: 'Eph', testament: 'NT', bookOrder: 49, chapters: 6 },
  { id: 50, name: 'Philippians', shortName: 'Phil', testament: 'NT', bookOrder: 50, chapters: 4 },
  { id: 51, name: 'Colossians', shortName: 'Col', testament: 'NT', bookOrder: 51, chapters: 4 },
  { id: 52, name: '1 Thessalonians', shortName: '1Thess', testament: 'NT', bookOrder: 52, chapters: 5 },
  { id: 53, name: '2 Thessalonians', shortName: '2Thess', testament: 'NT', bookOrder: 53, chapters: 3 },
  { id: 54, name: '1 Timothy', shortName: '1Tim', testament: 'NT', bookOrder: 54, chapters: 6 },
  { id: 55, name: '2 Timothy', shortName: '2Tim', testament: 'NT', bookOrder: 55, chapters: 4 },
  { id: 56, name: 'Titus', shortName: 'Titus', testament: 'NT', bookOrder: 56, chapters: 3 },
  { id: 57, name: 'Philemon', shortName: 'Phlm', testament: 'NT', bookOrder: 57, chapters: 1 },
  { id: 58, name: 'Hebrews', shortName: 'Heb', testament: 'NT', bookOrder: 58, chapters: 13 },
  { id: 59, name: 'James', shortName: 'Jas', testament: 'NT', bookOrder: 59, chapters: 5 },
  { id: 60, name: '1 Peter', shortName: '1Pet', testament: 'NT', bookOrder: 60, chapters: 5 },
  { id: 61, name: '2 Peter', shortName: '2Pet', testament: 'NT', bookOrder: 61, chapters: 3 },
  { id: 62, name: '1 John', shortName: '1John', testament: 'NT', bookOrder: 62, chapters: 5 },
  { id: 63, name: '2 John', shortName: '2John', testament: 'NT', bookOrder: 63, chapters: 1 },
  { id: 64, name: '3 John', shortName: '3John', testament: 'NT', bookOrder: 64, chapters: 1 },
  { id: 65, name: 'Jude', shortName: 'Jude', testament: 'NT', bookOrder: 65, chapters: 1 },
  { id: 66, name: 'Revelation', shortName: 'Rev', testament: 'NT', bookOrder: 66, chapters: 22 },
]
