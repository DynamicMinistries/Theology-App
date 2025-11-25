import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'
import { calculateNextReviewDate } from '@/lib/utils'
import { z } from 'zod'

const quizSchema = z.object({
  answers: z.array(z.union([z.string(), z.number()])),
})

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { answers } = quizSchema.parse(body)

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

    // Calculate score
    const quizQuestions = study.quizQuestions as any[]
    let correctCount = 0

    for (let i = 0; i < quizQuestions.length; i++) {
      const question = quizQuestions[i]
      const userAnswer = answers[i]

      if (question.correctAnswer === userAnswer) {
        correctCount++
      }
    }

    const score = (correctCount / quizQuestions.length) * 100

    // Calculate next review date
    const nextReviewDate = calculateNextReviewDate(new Date(), 0, score)

    // Update study
    const updatedStudy = await prisma.verseStudy.update({
      where: { id: params.id },
      data: {
        quizAnswers: answers as any,
        quizScore: score,
        status: 'completed',
        completedAt: new Date(),
        nextReviewDate,
      },
    })

    // Update user progress
    const progress = await prisma.userProgress.findUnique({
      where: { userId: session.user.id },
    })

    if (progress) {
      const versesStudied = (progress.versesStudied as string[]) || []
      if (!versesStudied.includes(study.verseReference)) {
        versesStudied.push(study.verseReference)
      }

      const booksStudied = (progress.booksStudied as Record<string, number>) || {}
      booksStudied[study.bookName] = (booksStudied[study.bookName] || 0) + 1

      const totalStudies = progress.totalStudies + 1
      const oldAvg = progress.averageQuizScore || 0
      const newAvg = (oldAvg * progress.totalStudies + score) / totalStudies

      await prisma.userProgress.update({
        where: { userId: session.user.id },
        data: {
          totalStudies,
          averageQuizScore: newAvg,
          versesStudied: versesStudied as any,
          booksStudied: booksStudied as any,
          lastStudyDate: new Date(),
        },
      })
    }

    return NextResponse.json({
      study: updatedStudy,
      score,
      correctCount,
      totalQuestions: quizQuestions.length,
      nextReviewDate,
    })
  } catch (error) {
    console.error('Error submitting quiz:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    return NextResponse.json({ error: 'Failed to submit quiz' }, { status: 500 })
  }
}
