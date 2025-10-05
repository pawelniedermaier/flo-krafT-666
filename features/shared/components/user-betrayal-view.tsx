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
  Eye, 
  Sparkles,
  Users,
  Target,
  Zap,
  TrendingUp,
  Heart,
  Star
} from "lucide-react"

interface UserScore {
  id: string
  name: string
  role: string
  avatar: string
  teamSpirit: number
  helpfulness: number
  collaboration: number
  rank: number
  status: "team-player" | "collaborator" | "rising-star" | "mentor"
  recentActivity: string
  achievements: string[]
}

const USER_SCORES: UserScore[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Senior Developer",
    avatar: "👩‍💻",
    teamSpirit: 95,
    helpfulness: 88,
    collaboration: 92,
    rank: 1,
    status: "mentor",
    recentActivity: "Helped 3 team members with their code reviews this week",
    achievements: ["Team Player", "Code Mentor", "Collaboration Champion"]
  },
  {
    id: "2", 
    name: "Mike Rodriguez",
    role: "Project Manager",
    avatar: "👨‍💼",
    teamSpirit: 87,
    helpfulness: 85,
    collaboration: 89,
    rank: 2,
    status: "rising-star",
    recentActivity: "Organized successful team building event",
    achievements: ["Event Organizer", "Team Builder"]
  },
  {
    id: "3",
    name: "Emily Watson",
    role: "Designer",
    avatar: "👩‍🎨",
    teamSpirit: 82,
    helpfulness: 90,
    collaboration: 85,
    rank: 3,
    status: "collaborator",
    recentActivity: "Shared design resources with the entire team",
    achievements: ["Resource Sharer", "Design Helper"]
  },
  {
    id: "4",
    name: "David Kim",
    role: "QA Engineer",
    avatar: "👨‍🔬",
    teamSpirit: 78,
    helpfulness: 75,
    collaboration: 80,
    rank: 4,
    status: "team-player",
    recentActivity: "Found critical bugs before production release",
    achievements: ["Bug Hunter"]
  },
  {
    id: "5",
    name: "Lisa Thompson",
    role: "Marketing Manager",
    avatar: "👩‍💼",
    teamSpirit: 85,
    helpfulness: 88,
    collaboration: 87,
    rank: 5,
    status: "collaborator",
    recentActivity: "Created amazing presentation for the team",
    achievements: ["Presentation Master", "Team Supporter"]
  }
]

const STATUS_COLORS = {
  "team-player": "bg-blue-600",
  "collaborator": "bg-green-600", 
  "rising-star": "bg-yellow-600",
  "mentor": "bg-purple-600"
}

const STATUS_ICONS = {
  "team-player": <Shield className="size-4" />,
  "collaborator": <Users className="size-4" />,
  "rising-star": <Star className="size-4" />,
  "mentor": <Crown className="size-4" />
}

export default function UserBetrayalView() {
  const [selectedPerson, setSelectedPerson] = useState<UserScore | null>(null)
  const [sortBy, setSortBy] = useState<"teamSpirit" | "helpfulness" | "collaboration" | "rank">("teamSpirit")

  const sortedScores = [...USER_SCORES].sort((a, b) => {
    switch (sortBy) {
      case "teamSpirit":
        return b.teamSpirit - a.teamSpirit
      case "helpfulness":
        return b.helpfulness - a.helpfulness
      case "collaboration":
        return b.collaboration - a.collaboration
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

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400"
    if (score >= 80) return "text-blue-400"
    if (score >= 70) return "text-yellow-400"
    return "text-orange-400"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-green-900 to-purple-900 text-white p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
            <Trophy className="size-5 text-white" />
          </div>
          <h1 className="text-4xl font-bold">🫢 TEAM COLLABORATION RANKING</h1>
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
            <Heart className="size-5 text-white" />
          </div>
        </div>
        <p className="text-xl text-green-200 mb-2">
          Celebrate the most collaborative and helpful team members
        </p>
        <p className="text-green-300 flex items-center justify-center gap-2">
          <Sparkles className="size-4" />
          Rank the most supportive colleagues in your organization
          <Sparkles className="size-4" />
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-green-900/50 border-green-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{USER_SCORES.length}</div>
            <div className="text-sm text-green-200">Team Members</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-900/50 border-blue-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {USER_SCORES.reduce((sum, p) => sum + p.helpfulness, 0) / USER_SCORES.length}
            </div>
            <div className="text-sm text-blue-200">Avg Helpfulness</div>
          </CardContent>
        </Card>
        <Card className="bg-purple-900/50 border-purple-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {USER_SCORES.filter(p => p.status === "mentor").length}
            </div>
            <div className="text-sm text-purple-200">Mentors</div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-900/50 border-yellow-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {USER_SCORES.filter(p => p.status === "rising-star").length}
            </div>
            <div className="text-sm text-yellow-200">Rising Stars</div>
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
              variant={sortBy === "teamSpirit" ? "default" : "outline"}
              onClick={() => setSortBy("teamSpirit")}
              className="bg-green-600 hover:bg-green-700 text-white border-transparent"
            >
              Sort by Team Spirit
            </Button>
            <Button
              variant={sortBy === "helpfulness" ? "default" : "outline"}
              onClick={() => setSortBy("helpfulness")}
              className="bg-blue-600 hover:bg-blue-700 text-white border-transparent"
            >
              Sort by Helpfulness
            </Button>
            <Button
              variant={sortBy === "collaboration" ? "default" : "outline"}
              onClick={() => setSortBy("collaboration")}
              className="bg-purple-600 hover:bg-purple-700 text-white border-transparent"
            >
              Sort by Collaboration
            </Button>
            <Button
              variant={sortBy === "rank" ? "default" : "outline"}
              onClick={() => setSortBy("rank")}
              className="bg-yellow-600 hover:bg-yellow-700 text-white border-transparent"
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
            Team Collaboration Leaderboard
            <Eye className="size-5" />
          </CardTitle>
          <CardDescription className="text-gray-300">
            The most collaborative and helpful team members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedScores.map((person) => (
              <Card 
                key={person.id}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  selectedPerson?.id === person.id 
                    ? "bg-green-900/50 border-green-500" 
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
                            {person.status.replace("-", " ").toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{person.role}</p>
                        <p className="text-gray-400 text-xs">{person.recentActivity}</p>
                        <div className="flex gap-2 mt-2">
                          {person.achievements.map((achievement, index) => (
                            <Badge key={index} className="bg-green-600 text-white text-xs">
                              {achievement}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(person.teamSpirit)}`}>
                        {person.teamSpirit}%
                      </div>
                      <div className="text-xs text-gray-400">Team Spirit</div>
                      <div className="text-sm text-blue-400 mt-1">
                        {person.helpfulness}% Helpful
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bars */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Team Spirit</span>
                      <span className="text-green-400">{person.teamSpirit}%</span>
                    </div>
                    <Progress 
                      value={person.teamSpirit} 
                      className="h-2 bg-gray-700"
                    />
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Helpfulness</span>
                      <span className="text-blue-400">{person.helpfulness}%</span>
                    </div>
                    <Progress 
                      value={person.helpfulness} 
                      className="h-2 bg-gray-700"
                    />
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Collaboration</span>
                      <span className="text-purple-400">{person.collaboration}%</span>
                    </div>
                    <Progress 
                      value={person.collaboration} 
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
        <Card className="bg-green-900/50 border-green-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="size-5" />
              Team Member Spotlight: {selectedPerson.name}
              <Zap className="size-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-semibold mb-2">Collaboration Stats</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Team Spirit:</span>
                    <span className="text-green-400 font-bold">{selectedPerson.teamSpirit}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Helpfulness:</span>
                    <span className="text-blue-400 font-bold">{selectedPerson.helpfulness}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Collaboration:</span>
                    <span className="text-purple-400 font-bold">{selectedPerson.collaboration}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Current Rank:</span>
                    <span className="text-yellow-400 font-bold">#{selectedPerson.rank}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Recognition</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Status:</span>
                    <span className={`font-bold ${
                      selectedPerson.status === "mentor" ? "text-purple-400" :
                      selectedPerson.status === "rising-star" ? "text-yellow-400" :
                      selectedPerson.status === "collaborator" ? "text-green-400" :
                      "text-blue-400"
                    }`}>
                      {selectedPerson.status.replace("-", " ").toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Achievements:</span>
                    <span className="text-green-400 font-bold">{selectedPerson.achievements.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bottom Section */}
      <div className="mt-8 text-center">
        <h3 className="text-xl font-semibold text-green-300 mb-2">
          Classics of Team Collaboration - Positive Recognition
        </h3>
        <p className="text-gray-400">
          "Great teams are built on great relationships and mutual support"
        </p>
      </div>
    </div>
  )
}
