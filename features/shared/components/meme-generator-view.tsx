"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Image, 
  Download, 
  Share2, 
  Sparkles, 
  Smile, 
  Heart,
  MessageCircle,
  TrendingUp,
  Zap,
  Palette,
  Wand2
} from "lucide-react"

interface MemeTemplate {
  id: string
  name: string
  emoji: string
  description: string
  category: "corporate" | "tech" | "meeting" | "deadline" | "boss"
  popularity: number
}

const MEME_TEMPLATES: MemeTemplate[] = [
  {
    id: "1",
    name: "Distracted Boyfriend",
    emoji: "😍",
    description: "Perfect for showing project priorities",
    category: "corporate",
    popularity: 95
  },
  {
    id: "2", 
    name: "Drake Pointing",
    emoji: "👆",
    description: "This vs That comparisons",
    category: "tech",
    popularity: 88
  },
  {
    id: "3",
    name: "Woman Yelling at Cat",
    emoji: "😤",
    description: "Client vs Developer situations",
    category: "meeting",
    popularity: 92
  },
  {
    id: "4",
    name: "This is Fine Dog",
    emoji: "🐕",
    description: "When everything is on fire",
    category: "deadline",
    popularity: 90
  },
  {
    id: "5",
    name: "Expanding Brain",
    emoji: "🧠",
    description: "Levels of understanding",
    category: "boss",
    popularity: 85
  }
]

const MEME_CATEGORIES = [
  { id: "corporate", name: "Corporate Life", emoji: "🏢", color: "bg-blue-600" },
  { id: "tech", name: "Tech Problems", emoji: "💻", color: "bg-green-600" },
  { id: "meeting", name: "Meeting Drama", emoji: "📊", color: "bg-purple-600" },
  { id: "deadline", name: "Deadline Panic", emoji: "⏰", color: "bg-red-600" },
  { id: "boss", name: "Boss Moments", emoji: "👔", color: "bg-yellow-600" }
]

function MemeGeneratorView() {
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate | null>(null)
  const [topText, setTopText] = useState("")
  const [bottomText, setBottomText] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isGenerating, setIsGenerating] = useState(false)

  const filteredTemplates = selectedCategory === "all" 
    ? MEME_TEMPLATES 
    : MEME_TEMPLATES.filter(template => template.category === selectedCategory)

  const handleGenerateMeme = async () => {
    if (!selectedTemplate) return
    
    setIsGenerating(true)
    // Simulate meme generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsGenerating(false)
  }

  const getCategoryColor = (category: string) => {
    const cat = MEME_CATEGORIES.find(c => c.id === category)
    return cat?.color || "bg-gray-600"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 text-white p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center">
            <Smile className="size-5 text-white" />
          </div>
          <h1 className="text-4xl font-bold">🤡 MEME GENERATOR</h1>
          <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center">
            <Image className="size-5 text-white" />
          </div>
        </div>
        <p className="text-xl text-pink-200 mb-2">
          Turn your corporate frustrations into viral content
        </p>
        <p className="text-pink-300 flex items-center justify-center gap-2">
          <Sparkles className="size-4" />
          Generate memes that make your team laugh (or cry)
          <Sparkles className="size-4" />
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-pink-600/50 border-pink-500">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-pink-200">{MEME_TEMPLATES.length}</div>
            <div className="text-sm text-pink-100">Templates</div>
          </CardContent>
        </Card>
        <Card className="bg-purple-600/50 border-purple-500">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-200">1,337</div>
            <div className="text-sm text-purple-100">Memes Created</div>
          </CardContent>
        </Card>
        <Card className="bg-indigo-600/50 border-indigo-500">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-indigo-200">42K</div>
            <div className="text-sm text-indigo-100">Likes Received</div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-600/50 border-yellow-500">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-200">99%</div>
            <div className="text-sm text-yellow-100">Happiness Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <Card className="bg-white/10 border-white/20 mb-6">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Palette className="size-5" />
            Choose Your Meme Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              All Categories
            </Button>
            {MEME_CATEGORIES.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`${getCategoryColor(category.id)} hover:opacity-80 text-white border-transparent`}
              >
                {category.emoji} {category.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Template Selection */}
      <Card className="bg-white/10 border-white/20 mb-6">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Wand2 className="size-5" />
            Select Your Meme Template
          </CardTitle>
          <CardDescription className="text-pink-200">
            Choose from our collection of corporate-approved meme templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <Card 
                key={template.id}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  selectedTemplate?.id === template.id 
                    ? "bg-pink-600/50 border-pink-400" 
                    : "bg-white/10 border-white/20"
                }`}
                onClick={() => setSelectedTemplate(template)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{template.emoji}</span>
                      <span className="font-semibold text-white">{template.name}</span>
                    </div>
                    <Badge className="bg-pink-600 text-white">
                      {template.popularity}% hot
                    </Badge>
                  </div>
                  <p className="text-pink-200 text-sm">{template.description}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="size-3 text-pink-300" />
                    <span className="text-xs text-pink-300">
                      {template.popularity}% popularity
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Meme Generator */}
      {selectedTemplate && (
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="size-5" />
              Generate Your {selectedTemplate.name} Meme
              <Zap className="size-5" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white font-medium mb-2 block">Top Text</label>
                <Input
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                  placeholder="Enter your top text..."
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                />
              </div>
              <div>
                <label className="text-white font-medium mb-2 block">Bottom Text</label>
                <Input
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                  placeholder="Enter your bottom text..."
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={handleGenerateMeme}
                disabled={isGenerating}
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="size-5 mr-2 animate-spin" />
                    GENERATING MEME...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-5 mr-2" />
                    GENERATE VIRAL MEME
                    <Sparkles className="size-5 ml-2" />
                  </>
                )}
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Download className="size-4 mr-2" />
                Download
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Share2 className="size-4 mr-2" />
                Share
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <Heart className="size-4 mr-2" />
                Like
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bottom Section */}
      <div className="mt-8 text-center">
        <h3 className="text-xl font-semibold text-pink-300 mb-2">
          Classics of Meme Culture - Corporate Edition
        </h3>
        <p className="text-pink-200">
          "A meme a day keeps the burnout away"
        </p>
      </div>
    </div>
  )
}

export default MemeGeneratorView
