import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const study = await prisma.verseStudy.findUnique({
      where: { id: params.id },
    })

    if (!study) {
      return NextResponse.json({ error: 'Study not found' }, { status: 404 })
    }

    if (study.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    return NextResponse.json({ study })
  } catch (error) {
    console.error('Error fetching study:', error)
    return NextResponse.json({ error: 'Failed to fetch study' }, { status: 500 })
  }
}
