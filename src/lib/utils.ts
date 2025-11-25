import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { BIBLE_BOOKS } from '@/types'
import type { VerseReference } from '@/types'

/**
 * Utility for merging Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parse a verse reference string like "John 3:16" or "Genesis 1:1-3"
 */
export function parseVerseReference(reference: string): VerseReference | null {
  // Remove extra whitespace
  reference = reference.trim()

  // Patterns to match:
  // - "John 3:16"
  // - "1 John 3:16"
  // - "John 3:16-18"
  // - "Genesis 1:1"
  const pattern = /^(\d?\s?\w+)\s+(\d+):(\d+)(?:-(\d+))?$/i

  const match = reference.match(pattern)
  if (!match) return null

  const [, bookName, chapterStr, verseStr, endVerseStr] = match

  // Find the book in BIBLE_BOOKS
  const book = BIBLE_BOOKS.find(
    (b) => b.name.toLowerCase() === bookName.trim().toLowerCase() ||
           b.shortName.toLowerCase() === bookName.trim().toLowerCase()
  )

  if (!book) return null

  const chapter = parseInt(chapterStr, 10)
  const verse = parseInt(verseStr, 10)
  const endVerse = endVerseStr ? parseInt(endVerseStr, 10) : undefined

  // Validate chapter and verse numbers
  if (chapter < 1 || chapter > book.chapters) return null
  if (verse < 1) return null
  if (endVerse && endVerse <= verse) return null

  return {
    book: book.name,
    chapter,
    verse,
    endVerse,
    fullReference: reference,
  }
}

/**
 * Format a verse reference object back to a string
 */
export function formatVerseReference(ref: VerseReference): string {
  if (ref.endVerse) {
    return `${ref.book} ${ref.chapter}:${ref.verse}-${ref.endVerse}`
  }
  return `${ref.book} ${ref.chapter}:${ref.verse}`
}

/**
 * Get book ID from book name
 */
export function getBookId(bookName: string): number | null {
  const book = BIBLE_BOOKS.find(
    (b) => b.name.toLowerCase() === bookName.toLowerCase() ||
           b.shortName.toLowerCase() === bookName.toLowerCase()
  )
  return book ? book.id : null
}

/**
 * Calculate next review date using spaced repetition algorithm
 * Based on simplified SM-2 algorithm
 */
export function calculateNextReviewDate(
  lastReviewDate: Date,
  reviewCount: number,
  quizScore: number // 0-100
): Date {
  const nextReview = new Date(lastReviewDate)

  // Convert quiz score to quality (0-5 scale)
  const quality = Math.floor((quizScore / 100) * 5)

  // Calculate interval in days
  let interval: number

  if (reviewCount === 0) {
    // First review
    if (quality >= 4) interval = 3 // 3 days if good score
    else if (quality >= 3) interval = 1 // 1 day if ok score
    else interval = 0.5 // 12 hours if poor score
  } else if (reviewCount === 1) {
    // Second review
    if (quality >= 4) interval = 7 // 1 week
    else if (quality >= 3) interval = 3 // 3 days
    else interval = 1 // 1 day
  } else {
    // Subsequent reviews
    const previousInterval = Math.pow(2, reviewCount - 1)
    if (quality >= 4) interval = previousInterval * 2
    else if (quality >= 3) interval = previousInterval * 1.5
    else interval = 1 // Reset if poor score
  }

  // Add interval to current date
  nextReview.setDate(nextReview.getDate() + Math.ceil(interval))

  return nextReview
}

/**
 * Calculate study streak
 */
export function calculateStreak(studyDates: Date[]): { current: number; longest: number } {
  if (studyDates.length === 0) return { current: 0, longest: 0 }

  // Sort dates in descending order
  const sorted = studyDates
    .map((d) => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime())

  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 1

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Check if last study was today or yesterday
  const lastStudy = new Date(sorted[0])
  lastStudy.setHours(0, 0, 0, 0)

  const daysDiff = Math.floor((today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24))

  if (daysDiff <= 1) {
    currentStreak = 1

    // Count consecutive days
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1])
      prev.setHours(0, 0, 0, 0)

      const curr = new Date(sorted[i])
      curr.setHours(0, 0, 0, 0)

      const diff = Math.floor((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24))

      if (diff === 1) {
        currentStreak++
        tempStreak++
      } else if (diff === 0) {
        // Same day, continue
        continue
      } else {
        // Streak broken
        longestStreak = Math.max(longestStreak, tempStreak)
        tempStreak = 1
      }
    }
  } else {
    currentStreak = 0
  }

  longestStreak = Math.max(longestStreak, tempStreak, currentStreak)

  return { current: currentStreak, longest: longestStreak }
}

/**
 * Validate theological content against framework
 */
export function validateTheologicalContent(content: string): {
  valid: boolean
  violations: string[]
} {
  const violations: string[] = []

  const prohibitedPhrases = [
    'god the son',
    'second divine person',
    'pre-existent divine person',
    'two natures in one person',
    'eternal conscious torment',
    'immortal soul',
    'inherent immortality',
    'eternal suffering',
    'tormented forever',
  ]

  const contentLower = content.toLowerCase()

  for (const phrase of prohibitedPhrases) {
    if (contentLower.includes(phrase)) {
      violations.push(`Contains prohibited phrase: "${phrase}"`)
    }
  }

  return {
    valid: violations.length === 0,
    violations,
  }
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)

  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`
  if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  return 'Just now'
}

/**
 * Generate a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

/**
 * Sanitize user input (basic XSS prevention)
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Calculate reading time estimate
 */
export function calculateReadingTime(text: string): number {
  // Average reading speed: 200 words per minute
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.substring(0, length).trim() + '...'
}
