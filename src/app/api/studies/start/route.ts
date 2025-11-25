import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'
import { bibleService } from '@/lib/bible-service'
import { parseVerseReference, getBookId } from '@/lib/utils'
import { z } from 'zod'

const startStudySchema = z.object({
  verseReference: z.string(),
  translation: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { verseReference, translation = 'ESV' } = startStudySchema.parse(body)

    // Parse and validate verse reference
    const parsed = parseVerseReference(verseReference)
    if (!parsed) {
      return NextResponse.json({ error: 'Invalid verse reference' }, { status: 400 })
    }

    // Get verse text
    const verse = await bibleService.getVerseText(verseReference, translation)
    if (!verse) {
      return NextResponse.json({ error: 'Verse not found' }, { status: 404 })
    }

    const bookId = getBookId(parsed.book)
    if (!bookId) {
      return NextResponse.json({ error: 'Unknown book' }, { status: 400 })
    }

    // Check if user already has a study for this verse
    const existing = await prisma.verseStudy.findFirst({
      where: {
        userId: session.user.id,
        verseReference,
      },
    })

    if (existing) {
      return NextResponse.json({ study: existing }, { status: 200 })
    }

    // Create new study
    const study = await prisma.verseStudy.create({
      data: {
        userId: session.user.id,
        verseReference,
        bookName: parsed.book,
        bookId,
        chapter: parsed.chapter,
        verseNumber: parsed.verse,
        verseText: verse.text,
        translation,
        userInterpretation: '', // Will be filled in next step
      },
    })

    return NextResponse.json({ study }, { status: 201 })
  } catch (error) {
    console.error('Error starting study:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    return NextResponse.json({ error: 'Failed to start study' }, { status: 500 })
  }
}
