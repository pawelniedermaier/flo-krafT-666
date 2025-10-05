"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Trophy, 
  Crown, 
  Shield, 
  Sword, 
  Eye, 
  Sparkles,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Zap,
  AlertTriangle
} from "lucide-react"

interface BetrayalEntry {
  id: string
  name: string
  role: string
  avatar: string
  betrayalScore: number
  loyaltyLevel: number
  backstabs: number
  betrayals: number
  rank: number
  status: "active" | "suspicious" | "trusted" | "dangerous"
  recentActivity: string
  badges: string[]
}

const BETRAYAL_RANKINGS: BetrayalEntry[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Senior Developer",
    avatar: "👩‍💻",
    betrayalScore: 95,
    loyaltyLevel: 15,
    backstabs: 12,
    betrayals: 8,
    rank: 1,
    status: "dangerous",
    recentActivity: "Took credit for team's work in yesterday's meeting",
    badges: ["Credit Thief", "Meeting Assassin", "Code Hijacker"]
  },
  {
    id: "2", 
    name: "Mike Rodriguez",
    role: "Project Manager",
    avatar: "👨‍💼",
    betrayalScore: 87,
    loyaltyLevel: 25,
    backstabs: 9,
    betrayals: 6,
    rank: 2,
    status: "suspicious",
    recentActivity: "Blamed team for his own missed deadline",
    badges: ["Blame Shifter", "Deadline Dodger"]
  },
  {
    id: "3",
    name: "Emily Watson",
    role: "Designer",
    avatar: "👩‍🎨",
    betrayalScore: 72,
    loyaltyLevel: 40,
    backstabs: 5,
    betrayals: 3,
    rank: 3,
    status: "suspicious",
    recentActivity: "Shared confidential designs with competitor",
    badges: ["Design Leaker", "Competitor Spy"]
  },
  {
    id: "4",
    name: "David Kim",
    role: "QA Engineer",
    avatar: "👨‍🔬",
    betrayalScore: 45,
    loyaltyLevel: 65,
    backstabs: 2,
    betrayals: 1,
    rank: 4,
    status: "active",
    recentActivity: "Reported minor issues as critical bugs",
    badges: ["Bug Exaggerator"]
  },
  {
    id: "5",
    name: "Lisa Thompson",
    role: "Marketing Manager",
    avatar: "👩‍💼",
    betrayalScore: 23,
    loyaltyLevel: 85,
    backstabs: 1,
    betrayals: 0,
    rank: 5,
    status: "trusted",
    recentActivity: "Actually helped a colleague with their presentation",
    badges: ["Team Player", "Loyal Ally"]
  }
]

const STATUS_COLORS = {
  active: "bg-blue-600",
  suspicious: "bg-yellow-600", 
  trusted: "bg-green-600",
  dangerous: "bg-red-600"
}

const STATUS_ICONS = {
  active: <Shield className="size-4" />,
  suspicious: <AlertTriangle className="size-4" />,
  trusted: <Crown className="size-4" />,
  dangerous: <Sword className="size-4" />
}

function BetrayalRankingView() {
  const [selectedPerson, setSelectedPerson] = useState<BetrayalEntry | null>(null)
  const [sortBy, setSortBy] = useState<"betrayal" | "loyalty" | "rank">("betrayal")

  const sortedRankings = [...BETRAYAL_RANKINGS].sort((a, b) => {
    switch (sortBy) {
      case "betrayal":
        return b.betrayalScore - a.betrayalScore
      case "loyalty":
        return b.loyaltyLevel - a.loyaltyLevel
      case "rank":
        return a.rank - b.rank
      default:
        return 0
    }
  })

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="size-5 text-yellow-400" />
      case 2: return <Trophy className="size-5 text-gray-400" />
      case 3: return <Trophy className="size-5 text-orange-400" />
      default: return <span className="text-lg font-bold">#{rank}</span>
    }
  }

  const getBetrayalColor = (score: number) => {
    if (score >= 80) return "text-red-400"
    if (score >= 60) return "text-orange-400"
    if (score >= 40) return "text-yellow-400"
    return "text-green-400"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black text-white p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
            <Trophy className="size-5 text-white" />
          </div>
          <h1 className="text-4xl font-bold">🫢 THE BETRAYAL RANKING</h1>
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
            <Sword className="size-5 text-white" />
          </div>
        </div>
        <p className="text-xl text-red-200 mb-2">
          Track who's stabbing whom in the corporate back
        </p>
        <p className="text-red-300 flex items-center justify-center gap-2">
          <Sparkles className="size-4" />
          Rank the most treacherous colleagues in your organization
          <Sparkles className="size-4" />
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-red-900/50 border-red-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{BETRAYAL_RANKINGS.length}</div>
            <div className="text-sm text-red-200">Total Players</div>
          </CardContent>
        </Card>
        <Card className="bg-orange-900/50 border-orange-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">
              {BETRAYAL_RANKINGS.reduce((sum, p) => sum + p.backstabs, 0)}
            </div>
            <div className="text-sm text-orange-200">Total Backstabs</div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-900/50 border-yellow-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {BETRAYAL_RANKINGS.filter(p => p.status === "dangerous").length}
            </div>
            <div className="text-sm text-yellow-200">Dangerous</div>
          </CardContent>
        </Card>
        <Card className="bg-green-900/50 border-green-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {BETRAYAL_RANKINGS.filter(p => p.status === "trusted").length}
            </div>
            <div className="text-sm text-green-200">Trusted</div>
          </CardContent>
        </Card>
      </div>

      {/* Sort Controls */}
      <Card className="bg-white/10 border-white/20 mb-6">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="size-5" />
            Ranking Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={sortBy === "betrayal" ? "default" : "outline"}
              onClick={() => setSortBy("betrayal")}
              className="bg-red-600 hover:bg-red-700 text-white border-transparent"
            >
              Sort by Betrayal Score
            </Button>
            <Button
              variant={sortBy === "loyalty" ? "default" : "outline"}
              onClick={() => setSortBy("loyalty")}
              className="bg-green-600 hover:bg-green-700 text-white border-transparent"
            >
              Sort by Loyalty
            </Button>
            <Button
              variant={sortBy === "rank" ? "default" : "outline"}
              onClick={() => setSortBy("rank")}
              className="bg-blue-600 hover:bg-blue-700 text-white border-transparent"
            >
              Sort by Rank
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Ranking Chamber */}
      <Card className="bg-gray-800/80 border-gray-600 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Eye className="size-5" />
            Betrayal Leaderboard
            <Eye className="size-5" />
          </CardTitle>
          <CardDescription className="text-gray-300">
            The most treacherous colleagues ranked by betrayal score
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedRankings.map((person) => (
              <Card 
                key={person.id}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  selectedPerson?.id === person.id 
                    ? "bg-red-900/50 border-red-500" 
                    : "bg-gray-700/50 border-gray-600"
                }`}
                onClick={() => setSelectedPerson(person)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getRankIcon(person.rank)}
                        <span className="text-2xl">{person.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-white">{person.name}</span>
                          <Badge className={STATUS_COLORS[person.status]}>
                            {STATUS_ICONS[person.status]}
                            {person.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{person.role}</p>
                        <p className="text-gray-400 text-xs">{person.recentActivity}</p>
                        <div className="flex gap-2 mt-2">
                          {person.badges.map((badge, index) => (
                            <Badge key={index} className="bg-gray-600 text-white text-xs">
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getBetrayalColor(person.betrayalScore)}`}>
                        {person.betrayalScore}%
                      </div>
                      <div className="text-xs text-gray-400">Betrayal Score</div>
                      <div className="text-sm text-green-400 mt-1">
                        {person.loyaltyLevel}% Loyalty
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bars */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Betrayal Level</span>
                      <span className="text-red-400">{person.betrayalScore}%</span>
                    </div>
                    <Progress 
                      value={person.betrayalScore} 
                      className="h-2 bg-gray-700"
                    />
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Loyalty Level</span>
                      <span className="text-green-400">{person.loyaltyLevel}%</span>
                    </div>
                    <Progress 
                      value={person.loyaltyLevel} 
                      className="h-2 bg-gray-700"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed View */}
      {selectedPerson && (
        <Card className="bg-red-900/50 border-red-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="size-5" />
              Detailed Analysis: {selectedPerson.name}
              <Zap className="size-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-semibold mb-2">Betrayal Statistics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Backstabs Committed:</span>
                    <span className="text-red-400 font-bold">{selectedPerson.backstabs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Betrayals Recorded:</span>
                    <span className="text-orange-400 font-bold">{selectedPerson.betrayals}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Current Rank:</span>
                    <span className="text-yellow-400 font-bold">#{selectedPerson.rank}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Risk Assessment</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Threat Level:</span>
                    <span className={`font-bold ${
                      selectedPerson.betrayalScore >= 80 ? "text-red-400" :
                      selectedPerson.betrayalScore >= 60 ? "text-orange-400" :
                      selectedPerson.betrayalScore >= 40 ? "text-yellow-400" :
                      "text-green-400"
                    }`}>
                      {selectedPerson.betrayalScore >= 80 ? "EXTREME" :
                       selectedPerson.betrayalScore >= 60 ? "HIGH" :
                       selectedPerson.betrayalScore >= 40 ? "MODERATE" :
                       "LOW"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Trust Factor:</span>
                    <span className="text-green-400 font-bold">{selectedPerson.loyaltyLevel}%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bottom Section */}
      <div className="mt-8 text-center">
        <h3 className="text-xl font-semibold text-red-300 mb-2">
          Classics of Corporate Betrayal - Office Politics
        </h3>
        <p className="text-gray-400">
          "Keep your friends close, and your enemies closer... but track them all"
        </p>
      </div>
    </div>
  )
}

export default BetrayalRankingView
