/**
 * Text Analysis Service for Corporate Culture Simulation
 * Provides satirical sentiment analysis and passive-aggressive pattern detection
 */

import type { 
  SentimentScore, 
  PassiveAggressivePattern, 
  TextAnalysisResult 
} from "@/lib/types"

// Corporate buzzword patterns for passive-aggressive detection
const CORPORATE_PATTERNS = {
  "backhanded-compliment": [
    /impressive.*for someone/i,
    /not bad.*considering/i,
    /better than expected/i,
    /surprisingly good/i,
    /actually.*quite good/i
  ],
  "false-enthusiasm": [
    /excited.*opportunity/i,
    /thrilled.*collaborate/i,
    /passionate.*excellence/i,
    /incredible.*journey/i,
    /amazing.*growth/i
  ],
  "corporate-speak": [
    /synergy/i,
    /leverage/i,
    /paradigm shift/i,
    /best practice/i,
    /circle back/i,
    /touch base/i,
    /deep dive/i,
    /low-hanging fruit/i
  ],
  "dismissive": [
    /just.*simple/i,
    /basic.*understanding/i,
    /obvious.*solution/i,
    /straightforward.*approach/i,
    /no big deal/i
  ],
  "sarcastic": [
    /wonderful.*feedback/i,
    /brilliant.*idea/i,
    /fantastic.*timing/i,
    /perfect.*as always/i,
    /exactly.*what we needed/i
  ]
}

// Word sentiment mappings (simplified)
const SENTIMENT_WORDS = {
  positive: [
    "good", "great", "excellent", "amazing", "wonderful", "fantastic", "brilliant",
    "outstanding", "superb", "perfect", "incredible", "awesome", "terrific",
    "successful", "effective", "efficient", "productive", "valuable", "helpful"
  ],
  negative: [
    "bad", "terrible", "awful", "horrible", "disappointing", "frustrating",
    "problematic", "concerning", "unacceptable", "inadequate", "poor", "weak",
    "failed", "broken", "wrong", "incorrect", "mistake", "error", "issue"
  ],
  neutral: [
    "okay", "fine", "acceptable", "standard", "normal", "typical", "average",
    "moderate", "reasonable", "adequate", "sufficient", "basic", "simple"
  ]
}

// Passive-aggressive transformation patterns
const TRANSFORMATION_PATTERNS = {
  "good": ["not terrible", "acceptable", "fine", "adequate", "passable"],
  "great": ["decent", "reasonable", "satisfactory", "tolerable", "manageable"],
  "excellent": ["good enough", "sufficient", "adequate", "acceptable", "fine"],
  "amazing": ["impressive", "noteworthy", "remarkable", "decent", "good"],
  "wonderful": ["nice", "pleasant", "adequate", "fine", "acceptable"],
  "fantastic": ["good", "decent", "reasonable", "satisfactory", "fine"],
  "brilliant": ["smart", "clever", "good", "decent", "reasonable"],
  "perfect": ["good", "fine", "acceptable", "adequate", "sufficient"],
  "outstanding": ["good", "decent", "satisfactory", "fine", "acceptable"],
  "superb": ["good", "decent", "fine", "acceptable", "adequate"]
}

/**
 * Calculate sentiment score for given text
 */
function calculateSentimentScore(text: string): SentimentScore {
  const words = text.toLowerCase().split(/\s+/)
  let positive = 0
  let negative = 0
  let neutral = 0

  words.forEach(word => {
    const cleanWord = word.replace(/[^\w]/g, '')
    if (SENTIMENT_WORDS.positive.includes(cleanWord)) {
      positive++
    } else if (SENTIMENT_WORDS.negative.includes(cleanWord)) {
      negative++
    } else if (SENTIMENT_WORDS.neutral.includes(cleanWord)) {
      neutral++
    }
  })

  const total = positive + negative + neutral
  if (total === 0) {
    return { positive: 0, negative: 0, neutral: 1, compound: 0 }
  }

  const positiveScore = positive / total
  const negativeScore = negative / total
  const neutralScore = neutral / total
  const compound = positiveScore - negativeScore

  return {
    positive: positiveScore,
    negative: negativeScore,
    neutral: neutralScore,
    compound
  }
}

/**
 * Detect passive-aggressive patterns in text
 */
function detectPassiveAggressivePatterns(text: string): PassiveAggressivePattern[] {
  const patterns: PassiveAggressivePattern[] = []

  Object.entries(CORPORATE_PATTERNS).forEach(([type, regexes]) => {
    regexes.forEach(regex => {
      if (regex.test(text)) {
        const intensity = Math.min(10, Math.max(1, text.match(regex)?.length || 1))
        patterns.push({
          type: type as PassiveAggressivePattern["type"],
          description: getPatternDescription(type as PassiveAggressivePattern["type"]),
          intensity
        })
      }
    })
  })

  return patterns
}

/**
 * Get description for passive-aggressive pattern type
 */
function getPatternDescription(type: PassiveAggressivePattern["type"]): string {
  const descriptions = {
    "backhanded-compliment": "Compliment that subtly undermines or diminishes",
    "false-enthusiasm": "Overly enthusiastic language that feels insincere",
    "corporate-speak": "Jargon-heavy language that obscures meaning",
    "dismissive": "Language that minimizes or trivializes",
    "sarcastic": "Sarcastic tone that conveys opposite meaning"
  }
  return descriptions[type]
}

/**
 * Generate alternative phrasings with reduced positivity
 */
function generateAlternativePhrasings(text: string): string[] {
  const alternatives: string[] = []
  const words = text.split(/\s+/)

  // Try different transformation strategies
  const strategies = [
    () => transformPositiveWords(text),
    () => addCorporateSpeak(text),
    () => addQualifiers(text),
    () => addBackhandedElements(text),
    () => addDismissiveElements(text)
  ]

  strategies.forEach(strategy => {
    const result = strategy()
    if (result && result !== text && !alternatives.includes(result)) {
      alternatives.push(result)
    }
  })

  return alternatives.slice(0, 5) // Return top 5 alternatives
}

/**
 * Transform positive words to more neutral/negative alternatives
 */
function transformPositiveWords(text: string): string {
  let result = text
  Object.entries(TRANSFORMATION_PATTERNS).forEach(([positive, alternatives]) => {
    const regex = new RegExp(`\\b${positive}\\b`, 'gi')
    if (regex.test(result)) {
      const randomAlternative = alternatives[Math.floor(Math.random() * alternatives.length)]
      result = result.replace(regex, randomAlternative)
    }
  })
  return result
}

/**
 * Add corporate speak to make text more passive-aggressive
 */
function addCorporateSpeak(text: string): string {
  const corporateAdditions = [
    "from a strategic perspective",
    "in terms of optimization",
    "leveraging our resources",
    "synergistically speaking",
    "paradigm-wise",
    "best practice approach"
  ]
  
  const randomAddition = corporateAdditions[Math.floor(Math.random() * corporateAdditions.length)]
  return `${text} ${randomAddition}.`
}

/**
 * Add qualifiers to reduce impact
 */
function addQualifiers(text: string): string {
  const qualifiers = [
    "somewhat",
    "relatively",
    "fairly",
    "reasonably",
    "adequately",
    "sufficiently"
  ]
  
  const randomQualifier = qualifiers[Math.floor(Math.random() * qualifiers.length)]
  return text.replace(/\b(good|great|excellent|amazing|wonderful|fantastic|brilliant|perfect|outstanding|superb)\b/gi, 
    `${randomQualifier} $1`)
}

/**
 * Add backhanded elements
 */
function addBackhandedElements(text: string): string {
  const backhandedAdditions = [
    "for what it's worth",
    "considering the circumstances",
    "given the constraints",
    "under the circumstances",
    "all things considered"
  ]
  
  const randomAddition = backhandedAdditions[Math.floor(Math.random() * backhandedAdditions.length)]
  return `${text}, ${randomAddition}.`
}

/**
 * Add dismissive elements
 */
function addDismissiveElements(text: string): string {
  const dismissiveAdditions = [
    "nothing special",
    "pretty standard",
    "as expected",
    "nothing groundbreaking",
    "run of the mill"
  ]
  
  const randomAddition = dismissiveAdditions[Math.floor(Math.random() * dismissiveAdditions.length)]
  return `${text} - ${randomAddition}.`
}

/**
 * Calculate passive-aggressive index (0-100)
 */
function calculatePassiveAggressiveIndex(text: string, patterns: PassiveAggressivePattern[]): number {
  let index = 0
  
  // Base score from detected patterns
  patterns.forEach(pattern => {
    index += pattern.intensity * 5
  })
  
  // Additional scoring based on text characteristics
  const corporateWords = (text.match(/\b(synergy|leverage|paradigm|best practice|circle back|touch base|deep dive|low-hanging fruit)\b/gi) || []).length
  index += corporateWords * 3
  
  const qualifiers = (text.match(/\b(somewhat|relatively|fairly|reasonably|adequately|sufficiently)\b/gi) || []).length
  index += qualifiers * 2
  
  const backhanded = (text.match(/\b(for what it's worth|considering|given|under the circumstances|all things considered)\b/gi) || []).length
  index += backhanded * 4
  
  return Math.min(100, Math.max(0, index))
}

/**
 * Determine manipulation level based on passive-aggressive index
 */
function determineManipulationLevel(index: number): "subtle" | "moderate" | "aggressive" {
  if (index < 30) return "subtle"
  if (index < 70) return "moderate"
  return "aggressive"
}

/**
 * Main text analysis function
 */
export function analyzeText(text: string): TextAnalysisResult {
  if (!text.trim()) {
    return {
      originalText: text,
      sentimentScore: { positive: 0, negative: 0, neutral: 1, compound: 0 },
      passiveAggressiveIndex: 0,
      suggestedAlternatives: [],
      detectedPatterns: [],
      manipulationLevel: "subtle"
    }
  }

  const sentimentScore = calculateSentimentScore(text)
  const detectedPatterns = detectPassiveAggressivePatterns(text)
  const passiveAggressiveIndex = calculatePassiveAggressiveIndex(text, detectedPatterns)
  const suggestedAlternatives = generateAlternativePhrasings(text)
  const manipulationLevel = determineManipulationLevel(passiveAggressiveIndex)

  return {
    originalText: text,
    sentimentScore,
    passiveAggressiveIndex,
    suggestedAlternatives,
    detectedPatterns,
    manipulationLevel
  }
}

/**
 * Get educational explanation about text manipulation
 */
export function getEducationalExplanation(result: TextAnalysisResult): string {
  const { manipulationLevel, passiveAggressiveIndex, detectedPatterns } = result
  
  let explanation = `This text analysis demonstrates how language can be subtly manipulated in corporate environments. `
  
  if (manipulationLevel === "subtle") {
    explanation += `The text shows subtle manipulation techniques with a passive-aggressive index of ${passiveAggressiveIndex}. `
  } else if (manipulationLevel === "moderate") {
    explanation += `The text demonstrates moderate manipulation with a passive-aggressive index of ${passiveAggressiveIndex}. `
  } else {
    explanation += `The text shows aggressive manipulation techniques with a passive-aggressive index of ${passiveAggressiveIndex}. `
  }
  
  if (detectedPatterns.length > 0) {
    explanation += `Detected patterns include: ${detectedPatterns.map(p => p.type).join(", ")}. `
  }
  
  explanation += `This is purely educational to help identify and understand how language can be used to convey hidden meanings or manipulate perception.`
  
  return explanation
}
