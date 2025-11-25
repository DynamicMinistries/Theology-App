import { PrismaClient } from '@prisma/client'
import { BIBLE_BOOKS } from '../src/types'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Seed Bible books
  console.log('Seeding Bible books...')
  for (const book of BIBLE_BOOKS) {
    await prisma.bibleBook.upsert({
      where: { id: book.id },
      update: {},
      create: {
        id: book.id,
        name: book.name,
        shortName: book.shortName,
        testament: book.testament,
        bookOrder: book.bookOrder,
        chapters: book.chapters,
      },
    })
  }

  // Seed some sample verses (for development)
  console.log('Seeding sample verses...')
  const sampleVerses = [
    {
      bookId: 43, // John
      chapter: 3,
      verseNumber: 16,
      translation: 'ESV',
      text: 'For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.',
    },
    {
      bookId: 45, // Romans
      chapter: 6,
      verseNumber: 23,
      translation: 'ESV',
      text: 'For the wages of sin is death, but the free gift of God is eternal life in Christ Jesus our Lord.',
    },
    {
      bookId: 1, // Genesis
      chapter: 2,
      verseNumber: 7,
      translation: 'ESV',
      text: 'Then the LORD God formed the man of dust from the ground and breathed into his nostrils the breath of life, and the man became a living creature.',
    },
    {
      bookId: 46, // 1 Corinthians
      chapter: 15,
      verseNumber: 53,
      translation: 'ESV',
      text: 'For this perishable body must put on the imperishable, and this mortal body must put on immortality.',
    },
    {
      bookId: 43, // John
      chapter: 1,
      verseNumber: 1,
      translation: 'ESV',
      text: 'In the beginning was the Word, and the Word was with God, and the Word was God.',
    },
    {
      bookId: 43, // John
      chapter: 1,
      verseNumber: 14,
      translation: 'ESV',
      text: 'And the Word became flesh and dwelt among us, and we have seen his glory, glory as of the only Son from the Father, full of grace and truth.',
    },
  ]

  for (const verse of sampleVerses) {
    await prisma.bibleVerse.create({
      data: verse,
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
