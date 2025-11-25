import prisma from './db'
import { parseVerseReference, getBookId } from './utils'
import type { BibleVerse, VerseReference } from '@/types'
import { BIBLE_BOOKS } from '@/types'

/**
 * Fetch verse text from database cache or external API
 */
export async function getVerseText(
  reference: string,
  translation: string = 'ESV'
): Promise<BibleVerse | null> {
  // Parse the reference
  const parsed = parseVerseReference(reference)
  if (!parsed) {
    throw new Error(`Invalid verse reference: ${reference}`)
  }

  const bookId = getBookId(parsed.book)
  if (!bookId) {
    throw new Error(`Unknown book: ${parsed.book}`)
  }

  // Try to get from cache first
  const cached = await prisma.bibleVerse.findFirst({
    where: {
      bookId,
      chapter: parsed.chapter,
      verseNumber: parsed.verse,
      translation,
    },
    include: {
      book: true,
    },
  })

  if (cached) {
    return {
      reference: parsed,
      text: cached.text,
      translation: cached.translation,
    }
  }

  // If not in cache, fetch from external API
  const verseText = await fetchFromExternalAPI(parsed, translation)

  if (verseText) {
    // Cache it for future use
    await prisma.bibleVerse.create({
      data: {
        bookId,
        chapter: parsed.chapter,
        verseNumber: parsed.verse,
        translation,
        text: verseText,
      },
    })

    return {
      reference: parsed,
      text: verseText,
      translation,
    }
  }

  return null
}

/**
 * Fetch verse from external Bible API
 * This is a placeholder - you would implement actual API calls here
 */
async function fetchFromExternalAPI(
  reference: VerseReference,
  translation: string
): Promise<string | null> {
  // For now, return sample verses for development
  // In production, you would call an actual Bible API
  const sampleVerses: Record<string, string> = {
    'John 3:16':
      'For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.',
    'Romans 6:23':
      'For the wages of sin is death, but the free gift of God is eternal life in Christ Jesus our Lord.',
    'Genesis 2:7':
      'Then the LORD God formed the man of dust from the ground and breathed into his nostrils the breath of life, and the man became a living creature.',
    '1 Corinthians 15:53':
      'For this perishable body must put on the imperishable, and this mortal body must put on immortality.',
    'John 1:1': 'In the beginning was the Word, and the Word was with God, and the Word was God.',
    'John 1:14':
      'And the Word became flesh and dwelt among us, and we have seen his glory, glory as of the only Son from the Father, full of grace and truth.',
  }

  const key = `${reference.book} ${reference.chapter}:${reference.verse}`
  return sampleVerses[key] || null

  // PRODUCTION IMPLEMENTATION EXAMPLE:
  // For API.Bible:
  /*
  const bibleApiKey = process.env.BIBLE_API_KEY
  const bibleApiUrl = process.env.BIBLE_API_URL

  if (!bibleApiKey || !bibleApiUrl) {
    console.error('Bible API credentials not configured')
    return null
  }

  try {
    // Find the Bible ID for the translation
    const bibleId = await getBibleId(translation)
    if (!bibleId) return null

    // Construct verse ID (e.g., "JHN.3.16")
    const bookAbbr = getBookAbbreviation(reference.book)
    const verseId = `${bookAbbr}.${reference.chapter}.${reference.verse}`

    const response = await fetch(
      `${bibleApiUrl}/bibles/${bibleId}/verses/${verseId}`,
      {
        headers: {
          'api-key': bibleApiKey,
        },
      }
    )

    if (!response.ok) {
      console.error('Bible API error:', response.statusText)
      return null
    }

    const data = await response.json()
    return data.data.content // Returns HTML, may need to strip tags

  } catch (error) {
    console.error('Error fetching from Bible API:', error)
    return null
  }
  */
}

/**
 * Get multiple verses at once (for ranges)
 */
export async function getVerseRange(
  book: string,
  chapter: number,
  startVerse: number,
  endVerse: number,
  translation: string = 'ESV'
): Promise<BibleVerse[]> {
  const verses: BibleVerse[] = []

  for (let v = startVerse; v <= endVerse; v++) {
    const reference = `${book} ${chapter}:${v}`
    const verse = await getVerseText(reference, translation)
    if (verse) {
      verses.push(verse)
    }
  }

  return verses
}

/**
 * Get the context around a verse (previous and next verses)
 */
export async function getVerseContext(
  reference: string,
  contextSize: number = 2,
  translation: string = 'ESV'
): Promise<{
  target: BibleVerse | null
  before: BibleVerse[]
  after: BibleVerse[]
}> {
  const parsed = parseVerseReference(reference)
  if (!parsed) {
    return { target: null, before: [], after: [] }
  }

  const target = await getVerseText(reference, translation)
  const before: BibleVerse[] = []
  const after: BibleVerse[] = []

  // Get verses before
  for (let i = 1; i <= contextSize; i++) {
    const v = parsed.verse - i
    if (v >= 1) {
      const ref = `${parsed.book} ${parsed.chapter}:${v}`
      const verse = await getVerseText(ref, translation)
      if (verse) before.unshift(verse)
    }
  }

  // Get verses after
  for (let i = 1; i <= contextSize; i++) {
    const v = parsed.verse + i
    const ref = `${parsed.book} ${parsed.chapter}:${v}`
    const verse = await getVerseText(ref, translation)
    if (verse) after.push(verse)
  }

  return { target, before, after }
}

/**
 * Search verses by keyword
 */
export async function searchVerses(
  query: string,
  translation: string = 'ESV',
  limit: number = 20
): Promise<BibleVerse[]> {
  const results = await prisma.bibleVerse.findMany({
    where: {
      translation,
      text: {
        contains: query,
        mode: 'insensitive',
      },
    },
    include: {
      book: true,
    },
    take: limit,
  })

  return results.map((v) => ({
    reference: {
      book: v.book.name,
      chapter: v.chapter,
      verse: v.verseNumber,
      fullReference: `${v.book.name} ${v.chapter}:${v.verseNumber}`,
    },
    text: v.text,
    translation: v.translation,
  }))
}

/**
 * Get available translations
 */
export function getAvailableTranslations(): string[] {
  // In a full implementation, this would query available translations
  return ['ESV', 'KJV', 'NKJV', 'NIV', 'NASB']
}

/**
 * Validate that a book exists
 */
export function isValidBook(bookName: string): boolean {
  return BIBLE_BOOKS.some(
    (b) =>
      b.name.toLowerCase() === bookName.toLowerCase() ||
      b.shortName.toLowerCase() === bookName.toLowerCase()
  )
}

/**
 * Get book info
 */
export function getBookInfo(bookName: string) {
  return BIBLE_BOOKS.find(
    (b) =>
      b.name.toLowerCase() === bookName.toLowerCase() ||
      b.shortName.toLowerCase() === bookName.toLowerCase()
  )
}

/**
 * Get all books in order
 */
export function getAllBooks() {
  return BIBLE_BOOKS
}

/**
 * Initialize Bible database with books
 */
export async function initializeBibleBooks() {
  const existingBooks = await prisma.bibleBook.count()

  if (existingBooks === 0) {
    // Insert all books
    for (const book of BIBLE_BOOKS) {
      await prisma.bibleBook.create({
        data: {
          id: book.id,
          name: book.name,
          shortName: book.shortName,
          testament: book.testament,
          bookOrder: book.bookOrder,
          chapters: book.chapters,
        },
      })
    }
    console.log('Initialized Bible books in database')
  }
}

export const bibleService = {
  getVerseText,
  getVerseRange,
  getVerseContext,
  searchVerses,
  getAvailableTranslations,
  isValidBook,
  getBookInfo,
  getAllBooks,
  initializeBibleBooks,
}
