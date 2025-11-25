import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'
import { calculateStreak } from '@/lib/utils'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user progress
    const progress = await prisma.userProgress.findUnique({
      where: { userId: session.user.id },
    })

    // Get all study dates for streak calculation
    const studies = await prisma.verseStudy.findMany({
      where: {
        userId: session.user.id,
        status: 'completed',
      },
      select: {
        completedAt: true,
      },
      orderBy: {
        completedAt: 'desc',
      },
    })

    const studyDates = studies
      .map((s) => s.completedAt)
      .filter((d): d is Date => d !== null)

    const streaks = calculateStreak(studyDates)

    // Update streak if needed
    if (progress && (streaks.current !== progress.currentStreak || streaks.longest !== progress.longestStreak)) {
      await prisma.userProgress.update({
        where: { userId: session.user.id },
        data: {
          currentStreak: streaks.current,
          longestStreak: streaks.longest,
        },
      })
    }

    return NextResponse.json({
      progress: progress
        ? {
            ...progress,
            currentStreak: streaks.current,
            longestStreak: streaks.longest,
          }
        : null,
    })
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}
