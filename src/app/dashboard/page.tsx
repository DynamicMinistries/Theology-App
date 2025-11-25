import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import prisma from '@/lib/db'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  // Get user progress
  const progress = await prisma.userProgress.findUnique({
    where: { userId: session.user.id },
  })

  // Get recent studies
  const recentStudies = await prisma.verseStudy.findMany({
    where: {
      userId: session.user.id,
      status: 'completed',
    },
    orderBy: { completedAt: 'desc' },
    take: 5,
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span className="text-lg font-semibold">Bible Study</span>
            </Link>
            <nav className="flex items-center gap-6 text-sm">
              <Link href="/dashboard" className="font-medium text-primary">
                Dashboard
              </Link>
              <Link href="/study" className="text-muted-foreground hover:text-foreground">
                Study
              </Link>
              <Link href="/progress" className="text-muted-foreground hover:text-foreground">
                Progress
              </Link>
            </nav>
          </div>
          <Link href="/api/auth/signout">
            <Button variant="ghost">Sign Out</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">
            Welcome back, {session.user.name || 'friend'}!
          </h1>
          <p className="text-muted-foreground">
            Ready to grow in your understanding of Scripture?
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{progress?.totalStudies || 0}</CardTitle>
              <CardDescription>Verses Studied</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{progress?.currentStreak || 0}</CardTitle>
              <CardDescription>Day Streak</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {progress?.averageQuizScore ? Math.round(progress.averageQuizScore) : 0}%
              </CardTitle>
              <CardDescription>Average Score</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Quick Study */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Start a New Study</CardTitle>
            <CardDescription>Enter a verse reference to begin</CardDescription>
          </CardHeader>
          <CardContent>
            <form action="/study" method="get" className="flex gap-4">
              <input
                type="text"
                name="verse"
                placeholder="e.g., John 3:16"
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              />
              <Button type="submit">Study This Verse</Button>
            </form>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Popular verses:</span>
              <Link href="/study?verse=John 3:16">
                <Button variant="outline" size="sm">
                  John 3:16
                </Button>
              </Link>
              <Link href="/study?verse=Romans 6:23">
                <Button variant="outline" size="sm">
                  Romans 6:23
                </Button>
              </Link>
              <Link href="/study?verse=Genesis 2:7">
                <Button variant="outline" size="sm">
                  Genesis 2:7
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Studies */}
        {recentStudies.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Studies</CardTitle>
              <CardDescription>Your recent verse studies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentStudies.map((study) => (
                  <Link
                    key={study.id}
                    href={`/study/${study.id}`}
                    className="block rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{study.verseReference}</div>
                        <div className="text-sm text-muted-foreground">
                          Score: {study.quizScore ? Math.round(study.quizScore) : 'N/A'}%
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {study.completedAt &&
                          new Date(study.completedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
