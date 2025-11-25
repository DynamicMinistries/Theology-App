import { NextResponse } from 'next/server'
import { bibleService } from '@/lib/bible-service'
import { z } from 'zod'

const verseQuerySchema = z.object({
  reference: z.string(),
  translation: z.string().optional(),
})

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const reference = searchParams.get('reference')
    const translation = searchParams.get('translation') || 'ESV'

    if (!reference) {
      return NextResponse.json({ error: 'Reference is required' }, { status: 400 })
    }

    const verse = await bibleService.getVerseText(reference, translation)

    if (!verse) {
      return NextResponse.json({ error: 'Verse not found' }, { status: 404 })
    }

    return NextResponse.json({ verse })
  } catch (error) {
    console.error('Error fetching verse:', error)
    return NextResponse.json({ error: 'Failed to fetch verse' }, { status: 500 })
  }
}
