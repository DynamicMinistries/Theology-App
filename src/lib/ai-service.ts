import OpenAI from 'openai'
import type {
  AIFeedback,
  StructuredExplanation,
  QuizQuestion,
  ReviewComparison,
} from '@/types'
import { validateTheologicalContent } from './utils'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

// System prompt that encodes our theological framework
const THEOLOGICAL_FRAMEWORK_PROMPT = `You are a Bible scholar assistant for an app that helps Christians understand Scripture in context.

You MUST follow these theological boundaries at all times:

THEOLOGICAL FRAMEWORK:
1. God is one person - the Father alone. Jesus is the human Messiah, conceived and born as a man.
2. Jesus was chosen, anointed, and empowered by God. He is NOT a pre-existent divine being.
3. NEVER use "God the Son" or say a divine person became human.
4. When explaining John 1 or "Word became flesh," explain "Word" as God's saving purpose/promise expressed in Jesus' human life, NOT as a pre-existent divine person.
5. Immortality is conditional - a gift through bodily resurrection, not inherent to humans.
6. There is no naturally immortal soul. Final judgment is final death (annihilation), not eternal conscious torment.
7. Humans are unified living beings - no soul/body dualism.
8. Death is real cessation of existence until bodily resurrection.

PROHIBITED LANGUAGE:
- "God the Son"
- "Second divine person"
- "Pre-existent divine person"
- "Two natures in one person"
- "Eternal conscious torment"
- "Immortal soul"
- "Inherent immortality"
- Any Nicene or Chalcedonian formulations

REQUIRED EMPHASES:
- Bodily resurrection as the Christian hope
- Jesus as the human Messiah
- God as one person - the Father
- Death as real death (not "passing to another state")
- Resurrection hope in every explanation

TONE:
Warm, pastoral, encouraging, clear. Never harsh or condescending. Use short sentences mostly. Make it conversational and accessible.

When responding to user interpretations, be specific about what they got right, gentle in corrections, and encouraging about their effort to understand Scripture.`

/**
 * Analyze user's interpretation of a verse
 */
export async function analyzeUserInterpretation(
  verseReference: string,
  verseText: string,
  userInterpretation: string
): Promise<AIFeedback> {
  const prompt = `Analyze this interpretation of ${verseReference}:

Verse text: "${verseText}"

User's interpretation: "${userInterpretation}"

Respond with a JSON object with exactly these three keys:
{
  "affirmed": ["List specific correct insights the user had (be specific about what they got right)"],
  "corrected": ["Gently point out misconceptions and explain what's actually correct"],
  "gaps": ["What important context or meaning they missed that would help them understand better"]
}

Remember: Be warm, specific in affirmations, gentle in corrections, and helpful about gaps. Focus on context and the theological framework above.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: THEOLOGICAL_FRAMEWORK_PROMPT },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 1500,
    })

    const content = completion.choices[0]?.message?.content || '{}'
    const feedback = JSON.parse(content) as AIFeedback

    // Validate theological compliance
    const validation = validateTheologicalContent(JSON.stringify(feedback))
    if (!validation.valid) {
      console.error('Theological validation failed:', validation.violations)
      throw new Error('AI response violated theological framework')
    }

    return feedback
  } catch (error) {
    console.error('Error analyzing interpretation:', error)
    throw new Error('Failed to analyze interpretation')
  }
}

/**
 * Generate structured explanation for a verse
 */
export async function generateStructuredExplanation(
  verseReference: string,
  verseText: string,
  contextInfo?: {
    bookName: string
    chapter: number
    testament: 'OT' | 'NT'
  }
): Promise<StructuredExplanation> {
  const contextNote = contextInfo
    ? `This is from ${contextInfo.bookName} chapter ${contextInfo.chapter} in the ${contextInfo.testament === 'OT' ? 'Old Testament' : 'New Testament'}.`
    : ''

  const prompt = `Generate a complete structured explanation for ${verseReference}:

"${verseText}"

${contextNote}

Provide exactly these sections in JSON format:

{
  "summary": "One ultra-simple sentence starting with 'This verse means that...' Someone should be able to read only this and understand the main point.",

  "paragraph": "3-5 sentences expanding the main idea. No jargon. Practical. Show how this gives hope for real life, especially regarding resurrection and life beyond death.",

  "literaryContext": "Explain how this verse fits into the paragraph, chapter, and book. Who is speaking? Who is being addressed? What problem or topic is being dealt with? How does it connect to the gospel of the kingdom and resurrection?",

  "historicalContext": "Brief background where it affects meaning: time, audience, setting, any customs that matter for understanding this verse.",

  "greekHebrewWords": [
    {
      "original": "Transliteration of Greek or Hebrew word",
      "meaning": "Simple English meaning",
      "significance": "How this meaning shapes the verse within our theological framework"
    }
  ],

  "theologicalMeaning": "What this verse teaches about God, Christ, salvation, and human life within the Unitarian, conditional immortality framework. Gently correct common Trinitarian readings without attacking anyone. Never use Nicene language. Focus on resurrection-centered hope.",

  "pastoralApplication": "3-5 sentences on how this verse speaks hope into daily life. Often connect to fear of death, grief, struggle with sin, or discouragement. Show how resurrection hope and God's faithfulness brings comfort."
}

Remember: Follow the theological framework strictly. Keep language simple and pastoral. Emphasize bodily resurrection and the hope of eternal life as a gift from God.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: THEOLOGICAL_FRAMEWORK_PROMPT },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 3000,
    })

    const content = completion.choices[0]?.message?.content || '{}'
    const explanation = JSON.parse(content) as StructuredExplanation

    // Validate theological compliance
    const validation = validateTheologicalContent(JSON.stringify(explanation))
    if (!validation.valid) {
      console.error('Theological validation failed:', validation.violations)
      throw new Error('AI response violated theological framework')
    }

    return explanation
  } catch (error) {
    console.error('Error generating explanation:', error)
    throw new Error('Failed to generate explanation')
  }
}

/**
 * Generate quiz questions for a verse
 */
export async function generateQuizQuestions(
  verseReference: string,
  verseText: string,
  explanation: StructuredExplanation
): Promise<QuizQuestion[]> {
  const prompt = `Generate 3 multiple choice questions to test understanding of ${verseReference}:

"${verseText}"

Based on this explanation:
Summary: ${explanation.summary}
Context: ${explanation.literaryContext}
Theological meaning: ${explanation.theologicalMeaning}

Create questions that test:
1. Understanding of the main point
2. How context shaped the meaning
3. Connection to the resurrection-centered gospel

Return JSON format:
{
  "questions": [
    {
      "id": "q1",
      "question": "The question text",
      "type": "multiple_choice",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why this is correct and how it relates to the verse"
    }
  ]
}

Make questions clear and not trick questions. Correct answer should be obvious if they understood the explanation.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: THEOLOGICAL_FRAMEWORK_PROMPT },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 1500,
    })

    const content = completion.choices[0]?.message?.content || '{}'
    const result = JSON.parse(content) as { questions: QuizQuestion[] }

    return result.questions || []
  } catch (error) {
    console.error('Error generating quiz:', error)
    throw new Error('Failed to generate quiz questions')
  }
}

/**
 * Compare review attempt with original interpretation
 */
export async function compareReviewAttempt(
  verseReference: string,
  verseText: string,
  originalInterpretation: string,
  newInterpretation: string,
  correctExplanation: StructuredExplanation
): Promise<{ comparison: ReviewComparison; improvementScore: number }> {
  const prompt = `Compare these two attempts to explain ${verseReference}:

"${verseText}"

ORIGINAL ATTEMPT: "${originalInterpretation}"

NEW ATTEMPT: "${newInterpretation}"

CORRECT EXPLANATION SUMMARY: "${correctExplanation.summary}"

Return JSON:
{
  "improvements": ["Specific things that are better in the new attempt"],
  "stillMissing": ["Important points still not understood"],
  "retained": ["Good insights from original that are still present"],
  "improvementScore": 0.5
}

improvementScore should be:
- -1.0 to -0.1: Worse understanding than before
- 0.0: About the same
- 0.1 to 0.5: Slight improvement
- 0.6 to 0.8: Good improvement
- 0.9 to 1.0: Much better understanding

Be encouraging. Celebrate growth even if small.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: THEOLOGICAL_FRAMEWORK_PROMPT },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 1000,
    })

    const content = completion.choices[0]?.message?.content || '{}'
    const result = JSON.parse(content) as ReviewComparison & { improvementScore: number }

    return {
      comparison: {
        improvements: result.improvements || [],
        stillMissing: result.stillMissing || [],
        retained: result.retained || [],
      },
      improvementScore: result.improvementScore || 0,
    }
  } catch (error) {
    console.error('Error comparing review:', error)
    throw new Error('Failed to compare review attempt')
  }
}

/**
 * Log AI usage for monitoring costs
 */
export async function logAIUsage(
  userId: string | null,
  verseReference: string,
  operationType: 'analyze' | 'explain' | 'quiz' | 'review',
  tokens: { prompt: number; completion: number; total: number },
  responseTimeMs: number
) {
  // This would log to database
  // For now, just console log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('AI Usage:', {
      userId,
      verseReference,
      operationType,
      tokens,
      responseTimeMs,
    })
  }

  // In production, you would save to AIUsageLog table
  // await prisma.aIUsageLog.create({ data: {...} })
}

export const aiService = {
  analyzeUserInterpretation,
  generateStructuredExplanation,
  generateQuizQuestions,
  compareReviewAttempt,
  logAIUsage,
}
