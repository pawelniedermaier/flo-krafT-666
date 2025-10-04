"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Brain, 
  TrendingDown, 
  AlertTriangle, 
  Lightbulb, 
  Copy,
  RotateCcw,
  Info
} from "lucide-react"
import { analyzeText, getEducationalExplanation } from "@/lib/services/text-analysis"
import type { TextAnalysisResult } from "@/lib/types"

/**
 * Text Analysis View Component
 * Provides satirical sentiment analysis and passive-aggressive pattern detection
 */
export function TextAnalysisView() {
  const [inputText, setInputText] = useState("")
  const [analysisResult, setAnalysisResult] = useState<TextAnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleAnalyze = async () => {
    if (!inputText.trim()) return

    setIsAnalyzing(true)
    try {
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 1000))
      const result = analyzeText(inputText)
      setAnalysisResult(result)
    } catch (error) {
      console.error("Analysis failed:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleCopyAlternative = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (error) {
      console.error("Failed to copy text:", error)
    }
  }

  const handleReset = () => {
    setInputText("")
    setAnalysisResult(null)
    setCopiedIndex(null)
  }

  const getSentimentColor = (compound: number) => {
    if (compound > 0.1) return "text-green-600"
    if (compound < -0.1) return "text-red-600"
    return "text-gray-600"
  }

  const getManipulationColor = (level: string) => {
    switch (level) {
      case "subtle": return "bg-yellow-100 text-yellow-800"
      case "moderate": return "bg-orange-100 text-orange-800"
      case "aggressive": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPatternIcon = (type: string) => {
    switch (type) {
      case "backhanded-compliment": return "😏"
      case "false-enthusiasm": return "😊"
      case "corporate-speak": return "📊"
      case "dismissive": return "😐"
      case "sarcastic": return "😏"
      default: return "📝"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Brain className="h-8 w-8 text-blue-600" />
          Corporate Text Analysis
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Analyze text for sentiment manipulation and passive-aggressive patterns. 
          This is purely educational to demonstrate how language can be subtly manipulated in corporate environments.
        </p>
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Text Input
          </CardTitle>
          <CardDescription>
            Enter text to analyze for sentiment and passive-aggressive patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your text here... (e.g., 'Your report is good')"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[120px]"
          />
          <div className="flex gap-2">
            <Button 
              onClick={handleAnalyze} 
              disabled={!inputText.trim() || isAnalyzing}
              className="flex-1"
            >
              {isAnalyzing ? (
                <>
                  <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Analyze Text
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Sentiment Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                Sentiment Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getSentimentColor(analysisResult.sentimentScore.compound)}`}>
                    {(analysisResult.sentimentScore.compound * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Compound Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {(analysisResult.sentimentScore.positive * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Positive</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {(analysisResult.sentimentScore.negative * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Negative</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {(analysisResult.sentimentScore.neutral * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Neutral</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Passive-Aggressive Index */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Passive-Aggressive Index
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Manipulation Level</span>
                <Badge className={getManipulationColor(analysisResult.manipulationLevel)}>
                  {analysisResult.manipulationLevel.toUpperCase()}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Passive-Aggressive Score</span>
                  <span className="font-medium">{analysisResult.passiveAggressiveIndex}/100</span>
                </div>
                <Progress 
                  value={analysisResult.passiveAggressiveIndex} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Detected Patterns */}
          {analysisResult.detectedPatterns.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Detected Patterns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysisResult.detectedPatterns.map((pattern, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <span className="text-2xl">{getPatternIcon(pattern.type)}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="capitalize">
                            {pattern.type.replace('-', ' ')}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Intensity: {pattern.intensity}/10
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {pattern.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Suggested Alternatives */}
          {analysisResult.suggestedAlternatives.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Suggested Alternatives
                </CardTitle>
                <CardDescription>
                  Alternative phrasings with reduced positivity or increased passive-aggressiveness
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysisResult.suggestedAlternatives.map((alternative, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm">{alternative}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyAlternative(alternative, index)}
                        className="shrink-0"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Copy className="h-3 w-3 mr-1" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Educational Information */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              {getEducationalExplanation(analysisResult)}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Sample Texts */}
      <Card>
        <CardHeader>
          <CardTitle>Sample Texts to Try</CardTitle>
          <CardDescription>
            Click on any sample to analyze it
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {[
              "Your report is good",
              "Great job on the presentation",
              "I'm excited about this opportunity",
              "This is a brilliant idea",
              "The team did an outstanding job",
              "I'm thrilled to collaborate with you",
              "This is exactly what we needed"
            ].map((sample, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start h-auto p-3 text-left"
                onClick={() => setInputText(sample)}
              >
                <span className="text-sm">{sample}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
