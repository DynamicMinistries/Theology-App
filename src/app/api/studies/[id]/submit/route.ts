import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'
import { aiService } from '@/lib/ai-service'
import { z } from 'zod'

const submitSchema = z.object({
  userInterpretation: z.string().min(10, 'Please write at least 10 characters'),
})

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { userInterpretation } = submitSchema.parse(body)

    // Get the study
    const study = await prisma.verseStudy.findUnique({
      where: { id: params.id },
    })

    if (!study) {
      return NextResponse.json({ error: 'Study not found' }, { status: 404 })
    }

    if (study.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Get AI feedback
    const startTime = Date.now()
    const aiFeedback = await aiService.analyzeUserInterpretation(
      study.verseReference,
      study.verseText,
      userInterpretation
    )
    const responseTime = Date.now() - startTime

    // Generate structured explanation
    const bookInfo = await prisma.bibleBook.findUnique({
      where: { id: study.bookId },
    })

    const explanation = await aiService.generateStructuredExplanation(
      study.verseReference,
      study.verseText,
      bookInfo
        ? {
            bookName: bookInfo.name,
            chapter: study.chapter,
            testament: bookInfo.testament as 'OT' | 'NT',
          }
        : undefined
    )

    // Generate quiz questions
    const quizQuestions = await aiService.generateQuizQuestions(
      study.verseReference,
      study.verseText,
      explanation
    )

    // Update study
    const updatedStudy = await prisma.verseStudy.update({
      where: { id: params.id },
      data: {
        userInterpretation,
        aiFeedback: aiFeedback as any,
        structuredExplanation: explanation as any,
        quizQuestions: quizQuestions as any,
      },
    })

    // Log AI usage (optional)
    await aiService.logAIUsage(
      session.user.id,
      study.verseReference,
      'analyze',
      { prompt: 0, completion: 0, total: 0 }, // Would track actual tokens
      responseTime
    )

    return NextResponse.json({
      study: updatedStudy,
      aiFeedback,
      explanation,
      quizQuestions,
    })
  } catch (error) {
    console.error('Error submitting interpretation:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    return NextResponse.json({ error: 'Failed to submit interpretation' }, { status: 500 })
  }
}
