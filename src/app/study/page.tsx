'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import type {
  AIFeedback,
  StructuredExplanation,
  QuizQuestion,
  GreekHebrewWord,
} from '@/types'

type StudyStep =
  | 'input-verse'
  | 'display-verse'
  | 'user-interpretation'
  | 'ai-feedback'
  | 'explanation'
  | 'quiz'
  | 'completed'

export default function StudyPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const verseParam = searchParams.get('verse')

  const [step, setStep] = useState<StudyStep>('input-verse')
  const [verseReference, setVerseReference] = useState(verseParam || '')
  const [verseText, setVerseText] = useState('')
  const [userInterpretation, setUserInterpretation] = useState('')
  const [studyId, setStudyId] = useState('')
  const [aiFeedback, setAiFeedback] = useState<AIFeedback | null>(null)
  const [explanation, setExplanation] = useState<StructuredExplanation | null>(null)
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [quizAnswers, setQuizAnswers] = useState<(string | number)[]>([])
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0)
  const [quizResults, setQuizResults] = useState<{
    score: number
    correctCount: number
    totalQuestions: number
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (verseParam) {
      handleStartStudy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleStartStudy = async () => {
    if (!verseReference) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/studies/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verseReference }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to start study')
        return
      }

      setStudyId(data.study.id)
      setVerseText(data.study.verseText)
      setStep('display-verse')
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitInterpretation = async () => {
    if (!userInterpretation.trim() || userInterpretation.length < 10) {
      setError('Please write at least 10 characters')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/studies/${studyId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInterpretation }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to submit interpretation')
        return
      }

      setAiFeedback(data.aiFeedback)
      setExplanation(data.explanation)
      setQuizQuestions(data.quizQuestions)
      setQuizAnswers(new Array(data.quizQuestions.length).fill(null))
      setStep('ai-feedback')
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitQuiz = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/studies/${studyId}/quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: quizAnswers }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to submit quiz')
        return
      }

      setQuizResults({
        score: data.score,
        correctCount: data.correctCount,
        totalQuestions: data.totalQuestions,
      })
      setStep('completed')
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStepProgress = () => {
    const steps: StudyStep[] = [
      'input-verse',
      'display-verse',
      'user-interpretation',
      'ai-feedback',
      'explanation',
      'quiz',
      'completed',
    ]
    const currentIndex = steps.indexOf(step)
    return ((currentIndex + 1) / steps.length) * 100
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-sm text-muted-foreground">Back to Dashboard</span>
          </Link>
          <div className="text-sm text-muted-foreground">
            {verseReference && `Studying: ${verseReference}`}
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      {step !== 'input-verse' && (
        <div className="border-b bg-muted/50 px-4 py-3">
          <div className="container">
            <Progress value={getStepProgress()} className="h-2" />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container max-w-4xl py-8">
        {error && (
          <div className="mb-6 rounded-md bg-destructive/10 p-4 text-destructive">{error}</div>
        )}

        {/* Step 1: Input Verse */}
        {step === 'input-verse' && (
          <Card>
            <CardHeader>
              <CardTitle>Choose a Verse to Study</CardTitle>
              <CardDescription>Enter a Bible verse reference to begin your study</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="verse-input">Verse Reference</Label>
                  <input
                    id="verse-input"
                    type="text"
                    placeholder="e.g., John 3:16"
                    value={verseReference}
                    onChange={(e) => setVerseReference(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleStartStudy()
                    }}
                    className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <Button onClick={handleStartStudy} disabled={loading || !verseReference}>
                  {loading ? 'Loading...' : 'Start Study'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Display Verse */}
        {step === 'display-verse' && (
          <Card>
            <CardHeader>
              <CardTitle>{verseReference}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border-l-4 border-primary bg-muted/50 p-6">
                <p className="verse-text">{verseText}</p>
              </div>
              <div className="flex justify-center">
                <Button onClick={() => setStep('user-interpretation')}>
                  Continue to Next Step
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: User Interpretation */}
        {step === 'user-interpretation' && (
          <Card>
            <CardHeader>
              <CardTitle>What Do You Think This Means?</CardTitle>
              <CardDescription>
                Write in your own words what you think this verse means. Don&apos;t worry about
                being perfect!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border-l-4 border-primary bg-muted/50 p-4">
                <p className="verse-text text-base">{verseText}</p>
                <p className="mt-2 text-sm text-muted-foreground">{verseReference}</p>
              </div>

              <div>
                <Label htmlFor="interpretation">Your Interpretation</Label>
                <Textarea
                  id="interpretation"
                  rows={6}
                  placeholder="Start writing what you think this verse means..."
                  value={userInterpretation}
                  onChange={(e) => setUserInterpretation(e.target.value)}
                  className="mt-2"
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  {userInterpretation.length} characters (minimum 10)
                </p>
              </div>

              <Button
                onClick={handleSubmitInterpretation}
                disabled={loading || userInterpretation.length < 10}
              >
                {loading ? 'Analyzing...' : 'Submit My Understanding'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 4: AI Feedback */}
        {step === 'ai-feedback' && aiFeedback && (
          <Card>
            <CardHeader>
              <CardTitle>Feedback on Your Understanding</CardTitle>
              <CardDescription>Here&apos;s what you understood well and what to consider</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {aiFeedback.affirmed.length > 0 && (
                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-accent">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    What You Understood Well
                  </h3>
                  <ul className="space-y-2">
                    {aiFeedback.affirmed.map((item, i) => (
                      <li key={i} className="ml-7 text-sm leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {aiFeedback.corrected.length > 0 && (
                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-secondary">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    Areas to Reconsider
                  </h3>
                  <ul className="space-y-2">
                    {aiFeedback.corrected.map((item, i) => (
                      <li key={i} className="ml-7 text-sm leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {aiFeedback.gaps.length > 0 && (
                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-primary">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    What the Context Adds
                  </h3>
                  <ul className="space-y-2">
                    {aiFeedback.gaps.map((item, i) => (
                      <li key={i} className="ml-7 text-sm leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-center pt-4">
                <Button onClick={() => setStep('explanation')}>
                  Continue to Full Explanation
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Structured Explanation */}
        {step === 'explanation' && explanation && (
          <Card>
            <CardHeader>
              <CardTitle>Complete Explanation: {verseReference}</CardTitle>
              <CardDescription>Explore the full context and meaning</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Summary - Always Visible */}
              <div className="mb-6 rounded-lg border-2 border-primary bg-primary/5 p-6">
                <h3 className="mb-2 text-sm font-semibold uppercase text-primary">Summary</h3>
                <p className="text-lg font-medium leading-relaxed">{explanation.summary}</p>
              </div>

              {/* Tabbed Content */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="context">Context</TabsTrigger>
                  <TabsTrigger value="words">Words</TabsTrigger>
                  <TabsTrigger value="meaning">Meaning</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div>
                    <h3 className="mb-3 font-semibold">For Ordinary Readers</h3>
                    <p className="explanation-text">{explanation.paragraph}</p>
                  </div>
                  <div>
                    <h3 className="mb-3 font-semibold">Pastoral Application</h3>
                    <p className="explanation-text">{explanation.pastoralApplication}</p>
                  </div>
                </TabsContent>

                <TabsContent value="context" className="space-y-6">
                  <div>
                    <h3 className="mb-3 font-semibold">Literary Context</h3>
                    <p className="explanation-text">{explanation.literaryContext}</p>
                  </div>
                  <div>
                    <h3 className="mb-3 font-semibold">Historical & Cultural Context</h3>
                    <p className="explanation-text">{explanation.historicalContext}</p>
                  </div>
                </TabsContent>

                <TabsContent value="words" className="space-y-4">
                  <h3 className="mb-4 font-semibold">Key Hebrew/Greek Words</h3>
                  {explanation.greekHebrewWords.map((word: GreekHebrewWord, i: number) => (
                    <div key={i} className="rounded-lg border bg-muted/50 p-4">
                      <div className="mb-2 flex items-baseline gap-2">
                        <span className="text-lg font-semibold text-primary">
                          {word.original}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          meaning: {word.meaning}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{word.significance}</p>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="meaning" className="space-y-6">
                  <div>
                    <h3 className="mb-3 font-semibold">Theological Meaning</h3>
                    <p className="explanation-text">{explanation.theologicalMeaning}</p>
                  </div>
                  <div>
                    <h3 className="mb-3 font-semibold">Pastoral Application</h3>
                    <p className="explanation-text">{explanation.pastoralApplication}</p>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 flex justify-center">
                <Button onClick={() => setStep('quiz')}>Take the Quiz</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 6: Quiz */}
        {step === 'quiz' && quizQuestions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Self-Check Quiz</CardTitle>
              <CardDescription>
                Question {currentQuizQuestion + 1} of {quizQuestions.length}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Progress value={((currentQuizQuestion + 1) / quizQuestions.length) * 100} />

              <div>
                <h3 className="mb-4 text-lg font-medium">
                  {quizQuestions[currentQuizQuestion].question}
                </h3>
                <div className="space-y-2">
                  {quizQuestions[currentQuizQuestion].options?.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const newAnswers = [...quizAnswers]
                        newAnswers[currentQuizQuestion] = i
                        setQuizAnswers(newAnswers)
                      }}
                      className={`w-full rounded-lg border-2 p-4 text-left transition-colors ${
                        quizAnswers[currentQuizQuestion] === i
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="mr-2 font-semibold">{String.fromCharCode(65 + i)}.</span>
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                {currentQuizQuestion > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuizQuestion((prev) => prev - 1)}
                  >
                    Previous
                  </Button>
                )}
                {currentQuizQuestion < quizQuestions.length - 1 ? (
                  <Button
                    onClick={() => setCurrentQuizQuestion((prev) => prev + 1)}
                    disabled={quizAnswers[currentQuizQuestion] === null}
                    className="ml-auto"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmitQuiz}
                    disabled={loading || quizAnswers.some((a) => a === null)}
                    className="ml-auto"
                  >
                    {loading ? 'Submitting...' : 'Submit Quiz'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 7: Completed */}
        {step === 'completed' && quizResults && (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Study Complete! 🎉</CardTitle>
              <CardDescription className="text-center">
                You&apos;ve finished studying {verseReference}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border-2 border-accent bg-accent/5 p-6 text-center">
                <div className="mb-2 text-4xl font-bold text-accent">
                  {Math.round(quizResults.score)}%
                </div>
                <p className="text-lg text-muted-foreground">
                  {quizResults.correctCount} out of {quizResults.totalQuestions} correct
                </p>
              </div>

              <div className="space-y-3">
                <Link href={`/study?verse=${verseReference}`} className="block">
                  <Button variant="outline" className="w-full">
                    Review This Verse
                  </Button>
                </Link>
                <Link href="/study" className="block">
                  <Button className="w-full">Study Another Verse</Button>
                </Link>
                <Link href="/dashboard" className="block">
                  <Button variant="ghost" className="w-full">
                    Return to Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
