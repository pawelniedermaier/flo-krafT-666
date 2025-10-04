"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Moon, Star, Zap, Eye } from "lucide-react"


const destinyCards = [
  {
    name: "I The Magician",
    subtitle: "Green Light (Go For It)",
    image: "/go.png",
    description:
      'You\'ve received the "green light"! It\'s time to hit the ground running, as this is a perfect opportunity for you to prove the project makes sense yourself. Good luck, because from now on, everything depends solely on you.',
  },
  {
    name: "XII The Hanged Man",
    subtitle: "The Justification (No Go)",
    image: "/stop.png",
    description:
      'Your project is "suspended" awaiting... better times. Prepare for acrobatics to justify why it didn\'t work. Most likely, you\'ll end up being blamed, but at least you\'ll gain a "new perspective."',
  },
  {
    name: "VIII Justice",
    subtitle: "The Process (Stop)",
    image: "/process.png",
    description:
      'Hold on a moment! Your decision requires "further analysis" and going through "necessary procedures." Expect your idea to be trapped in bureaucratic limbo, where truth is relative and the process is eternal.',
  },
]

const mordorCards = [
  {
    name: "XVI The Tower",
    subtitle: "Outplacement",
    image: "/users tarot/emperor.png", // Using emperor as placeholder for tower
    description:
      "Your career has just collided with reality. Expect a sudden shock and a painful, albeit 'professionally managed,' catastrophe.",
  },
  {
    name: "IX The Hermit",
    subtitle: "Isolated Desk",
    image: "/users tarot/emperor.png", // Using emperor as placeholder for hermit
    description:
      "You've just been assigned to the 'Special Focus' zone. Enjoy the solitude, as it's the perfect time to calmly ponder the meaning of your existence in this company.",
  },
  {
    name: "VII The Chariot",
    subtitle: "The Workhorse",
    image: "/users tarot/work horse.png",
    description:
      "Congratulations, you're the driving force! You'll be rushing headlong, pulling others' ambitions until exhaustion.",
  },
  {
    name: "IV The Emperor",
    subtitle: "VP of Control",
    image: "/users tarot/emperor.png",
    description:
      "Beware, for Big Brother in the next office just raised an eyebrow. His power is absolute, and his lack of involvement in anything beyond control is impressive.",
  },
  {
    name: "XV The Devil",
    subtitle: "KPI",
    image: "/users tarot/kpi.png",
    description:
      "Welcome to the golden cage of data and metrics! You are shackled to numbers that seemingly offer control, but in reality, they are your sole master and ruler.",
  },
  {
    name: "III The Empress",
    subtitle: "HR, Mother of Control",
    image: "/users tarot/mother.png",
    description:
      "HR extends its maternal care over you – so maternal, in fact, that you can barely breathe. Remember that its concern always serves the company, not you.",
  },
  {
    name: "X Wheel of Fortune",
    subtitle: "Employee Turnover",
    image: "/users tarot/wheel.png",
    description:
      "Prepare for a carousel of changes from which no one exits in the same place. When your round is over, someone else will take your spot.",
  },
]

export function TarotView() {
  const [destinyCard, setDestinyCard] = useState<typeof destinyCards[0] | null>(null)
  const [mordorCard, setMordorCard] = useState<typeof mordorCards[0] | null>(null)
  const [isDestinyModalOpen, setIsDestinyModalOpen] = useState(false)
  const [isMordorModalOpen, setIsMordorModalOpen] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [showParticles, setShowParticles] = useState(false)


  const drawDestinyCard = async () => {
    setIsDrawing(true)
    setShowParticles(true)
    
    // Simulate drawing animation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const randomCard = destinyCards[Math.floor(Math.random() * destinyCards.length)]
    setDestinyCard(randomCard)
    setIsDestinyModalOpen(true)
    setIsDrawing(false)
    
    // Hide particles after animation
    setTimeout(() => setShowParticles(false), 1000)
  }

  const drawMordorCard = async () => {
    setIsDrawing(true)
    setShowParticles(true)
    
    // Simulate drawing animation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const randomCard = mordorCards[Math.floor(Math.random() * mordorCards.length)]
    setMordorCard(randomCard)
    setIsMordorModalOpen(true)
    setIsDrawing(false)
    
    // Hide particles after animation
    setTimeout(() => setShowParticles(false), 1000)
  }

  return (
    <>
      {/* Particle Effects */}
      {showParticles && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-purple-400 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,_var(--tw-gradient-stops))] from-purple-600/10 via-transparent to-purple-600/10"></div>
        
        <div className="relative z-10 p-6 space-y-8">
          {/* Hero Header */}
          <div className="text-center space-y-6 py-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-purple-400 animate-pulse" />
              <h1 className="text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                TAROT AI BOOST™
              </h1>
              <div className="w-12 h-12 rounded-full bg-purple-400 animate-pulse" />
            </div>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto leading-relaxed">
              When data-driven decisions fail, consult the ancient arts of middle management mysticism.
            </p>
            <div className="flex items-center justify-center gap-2 text-purple-300">
              <Star className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
              <span className="text-sm font-medium">Mystical insights for the enlightened leader</span>
              <Star className="w-5 h-5 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
            </div>
          </div>

          {/* Destiny Decision Section */}
          <div className="max-w-6xl mx-auto">
            <Card className="bg-gradient-to-br from-slate-800/50 to-purple-900/50 backdrop-blur-sm border border-purple-500/30 shadow-2xl">
              <CardHeader className="text-center pb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Eye className="w-8 h-8 text-purple-400" />
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                    Destiny Decision
                  </CardTitle>
                  <Eye className="w-8 h-8 text-purple-400" />
                </div>
                <p className="text-purple-200 text-lg max-w-2xl mx-auto">
                  Consult the ancient cards to determine your project's fate: Go, Stop, or Process?
                </p>
              </CardHeader>
              
              <CardContent className="space-y-8">
                {/* Main Action Button */}
                <div className="text-center">
                  <Button
                    onClick={drawDestinyCard}
                    disabled={isDrawing}
                    className="group relative px-12 py-6 text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 text-white rounded-2xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDrawing ? (
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Consulting the Fates...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-6 h-6 group-hover:animate-pulse" />
                        <span>REVEAL YOUR DESTINY</span>
                        <Sparkles className="w-6 h-6 group-hover:animate-pulse" />
                      </div>
                    )}
                  </Button>
                </div>

                {/* Legend Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="group bg-gradient-to-br from-green-900/30 to-emerald-900/30 p-6 rounded-xl border border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-green-300 font-bold text-lg">The Magician</h3>
                    </div>
                    <p className="text-green-200 text-sm">Green Light - Full speed ahead!</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-red-900/30 to-rose-900/30 p-6 rounded-xl border border-red-500/30 hover:border-red-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <Moon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-red-300 font-bold text-lg">The Hanged Man</h3>
                    </div>
                    <p className="text-red-200 text-sm">No Go - Suspended indefinitely</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-yellow-900/30 to-amber-900/30 p-6 rounded-xl border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Star className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-yellow-300 font-bold text-lg">Justice</h3>
                    </div>
                    <p className="text-yellow-200 text-sm">Process - Think and decide</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Classics of Tarot - Shadow of a Mordor Section */}
          <div className="max-w-6xl mx-auto">
            <Card className="bg-gradient-to-br from-slate-800/50 to-red-900/50 backdrop-blur-sm border border-red-500/30 shadow-2xl">
              <CardHeader className="text-center pb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Eye className="w-8 h-8 text-red-400" />
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-red-300 to-orange-300 bg-clip-text text-transparent">
                    Classics of Tarot - Shadow of a Mordor
                  </CardTitle>
                  <Eye className="w-8 h-8 text-red-400" />
                </div>
                <p className="text-red-200 text-lg max-w-2xl mx-auto">
                  Peer into the dark depths of corporate Mordor. Discover what shadowy fate awaits your professional soul.
                </p>
              </CardHeader>
              
              <CardContent className="space-y-8">
                {/* Main Action Button */}
                <div className="text-center">
                  <Button
                    onClick={drawMordorCard}
                    disabled={isDrawing}
                    className="group relative px-12 py-6 text-xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-red-600 hover:from-red-500 hover:via-orange-500 hover:to-red-500 text-white rounded-2xl shadow-2xl hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDrawing ? (
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Consulting the Dark Arts...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-6 h-6 group-hover:animate-pulse" />
                        <span>REVEAL YOUR SHADOW</span>
                        <Sparkles className="w-6 h-6 group-hover:animate-pulse" />
                      </div>
                    )}
                  </Button>
                </div>

                {/* Legend Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="group bg-gradient-to-br from-red-900/30 to-rose-900/30 p-4 rounded-xl border border-red-500/30 hover:border-red-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-red-300 font-bold text-sm">The Tower</h3>
                    </div>
                    <p className="text-red-200 text-xs">Outplacement - Career Collision</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-orange-900/30 to-amber-900/30 p-4 rounded-xl border border-orange-500/30 hover:border-orange-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                        <Moon className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-orange-300 font-bold text-sm">The Hermit</h3>
                    </div>
                    <p className="text-orange-200 text-xs">Isolated Desk - Special Focus</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-yellow-900/30 to-amber-900/30 p-4 rounded-xl border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-yellow-300 font-bold text-sm">The Chariot</h3>
                    </div>
                    <p className="text-yellow-200 text-xs">The Workhorse - Driving Force</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-4 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-purple-300 font-bold text-sm">The Emperor</h3>
                    </div>
                    <p className="text-purple-200 text-xs">VP of Control - Big Brother</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-gray-900/30 to-slate-900/30 p-4 rounded-xl border border-gray-500/30 hover:border-gray-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-gray-300 font-bold text-sm">The Devil</h3>
                    </div>
                    <p className="text-gray-200 text-xs">KPI - Golden Cage</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-pink-900/30 to-rose-900/30 p-4 rounded-xl border border-pink-500/30 hover:border-pink-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-pink-300 font-bold text-sm">The Empress</h3>
                    </div>
                    <p className="text-pink-200 text-xs">HR Mother - Maternal Control</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>


          {/* Disclaimer */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-slate-800/30 to-purple-900/30 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
              <p className="text-purple-300 text-sm text-center leading-relaxed">
                <span className="font-bold text-purple-200">⚠️ DISCLAIMER:</span> TAROT AI BOOST™ is for entertainment purposes only. 
                Any resemblance to actual project management advice is purely coincidental.
                Side effects may include: existential dread, imposter syndrome, and an urge to update your LinkedIn profile.
                Consult your Scrum Master before making any life-altering decisions based on mystical card readings.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Destiny Card Modal */}
      {destinyCard && isDestinyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl border border-purple-500/30 shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-purple-500/30">
              <div className="flex items-center gap-3">
                <Eye className="w-8 h-8 text-purple-400" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                  Your Destiny
                </h2>
              </div>
              <button
                onClick={() => setIsDestinyModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center bg-purple-600/20 hover:bg-purple-600/40 rounded-full border border-purple-500/30 transition-all duration-300 group"
              >
                <span className="text-2xl text-purple-300 group-hover:text-white transition-colors">×</span>
              </button>
            </div>

            {/* Content - Two Column Layout */}
            <div className="flex flex-col lg:flex-row h-[calc(90vh-120px)]">
              {/* Left Side - Image */}
              <div className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-gradient-to-br from-purple-800/20 to-pink-800/20">
                <div className="relative max-w-md lg:max-w-none">
                  <img
                    src={destinyCard.image}
                    alt={destinyCard.name}
                    className="max-w-full max-h-full object-contain drop-shadow-2xl"
                    onLoad={() => console.log("Image loaded successfully:", destinyCard.image)}
                    onError={(e) => {
                      console.error("Image failed to load:", destinyCard.image)
                      console.error("Error details:", e)
                      e.currentTarget.style.display = "none"
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement
                      if (fallback) fallback.style.display = "flex"
                    }}
                  />
                  <div className="w-64 h-64 bg-purple-600/30 rounded-lg flex items-center justify-center hidden">
                    <span className="text-6xl">🎴</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Description */}
              <div className="flex-1 p-4 lg:p-8 flex flex-col justify-center space-y-6 lg:space-y-8 overflow-y-auto">
                {/* Card Title */}
                <div className="text-center">
                  <h3 className="text-2xl lg:text-4xl font-bold text-purple-100 mb-2 lg:mb-3">{destinyCard.name}</h3>
                  <p className="text-lg lg:text-2xl text-purple-300 font-semibold">{destinyCard.subtitle}</p>
                </div>

                {/* Description */}
                <div className="bg-gradient-to-br from-slate-800/50 to-purple-900/50 p-4 lg:p-8 rounded-xl border border-purple-500/30">
                  <div className="flex items-center gap-3 mb-4 lg:mb-6">
                    <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-purple-400" />
                    <h4 className="text-lg lg:text-2xl font-bold text-purple-200">The Prophecy</h4>
                  </div>
                  <p className="text-purple-100 leading-relaxed text-base lg:text-xl">
                    {destinyCard.description}
                  </p>
                </div>

                {/* Action Button */}
                <div className="pt-2 lg:pt-4">
                  <Button
                    onClick={() => setIsDestinyModalOpen(false)}
                    className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 text-white font-bold py-4 lg:py-6 text-lg lg:text-xl rounded-xl shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
                  >
                    <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 mr-2 lg:mr-3" />
                    Accept Your Fate
                    <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 ml-2 lg:ml-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mordor Card Modal */}
      {mordorCard && isMordorModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 rounded-2xl border border-red-500/30 shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-red-500/30">
              <div className="flex items-center gap-3">
                <Eye className="w-8 h-8 text-red-400" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-red-300 to-orange-300 bg-clip-text text-transparent">
                  Shadow of a Mordor
                </h2>
              </div>
              <button
                onClick={() => setIsMordorModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center bg-red-600/20 hover:bg-red-600/40 rounded-full border border-red-500/30 transition-all duration-300 group"
              >
                <span className="text-2xl text-red-300 group-hover:text-white transition-colors">×</span>
              </button>
            </div>

            {/* Content - Two Column Layout */}
            <div className="flex flex-col lg:flex-row h-[calc(90vh-120px)]">
              {/* Left Side - Image */}
              <div className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-gradient-to-br from-red-800/20 to-orange-800/20">
                <div className="relative max-w-md lg:max-w-none">
                  <img
                    src={mordorCard.image}
                    alt={mordorCard.name}
                    className="max-w-full max-h-full object-contain drop-shadow-2xl"
                    onLoad={() => console.log("Mordor image loaded successfully:", mordorCard.image)}
                    onError={(e) => {
                      console.error("Mordor image failed to load:", mordorCard.image)
                      console.error("Error details:", e)
                      e.currentTarget.style.display = "none"
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement
                      if (fallback) fallback.style.display = "flex"
                    }}
                  />
                  <div className="w-64 h-64 bg-red-600/30 rounded-lg flex items-center justify-center hidden">
                    <span className="text-6xl">🎴</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Description */}
              <div className="flex-1 p-4 lg:p-8 flex flex-col justify-center space-y-6 lg:space-y-8 overflow-y-auto">
                {/* Card Title */}
                <div className="text-center">
                  <h3 className="text-2xl lg:text-4xl font-bold text-red-100 mb-2 lg:mb-3">{mordorCard.name}</h3>
                  <p className="text-lg lg:text-2xl text-red-300 font-semibold">{mordorCard.subtitle}</p>
                </div>

                {/* Description */}
                <div className="bg-gradient-to-br from-slate-800/50 to-red-900/50 p-4 lg:p-8 rounded-xl border border-red-500/30">
                  <div className="flex items-center gap-3 mb-4 lg:mb-6">
                    <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-red-400" />
                    <h4 className="text-lg lg:text-2xl font-bold text-red-200">The Shadow Prophecy</h4>
                  </div>
                  <p className="text-red-100 leading-relaxed text-base lg:text-xl">
                    {mordorCard.description}
                  </p>
                </div>

                {/* Action Button */}
                <div className="pt-2 lg:pt-4">
                  <Button
                    onClick={() => setIsMordorModalOpen(false)}
                    className="w-full bg-gradient-to-r from-red-600 via-orange-600 to-red-600 hover:from-red-500 hover:via-orange-500 hover:to-red-500 text-white font-bold py-4 lg:py-6 text-lg lg:text-xl rounded-xl shadow-lg hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105"
                  >
                    <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 mr-2 lg:mr-3" />
                    Embrace Your Shadow
                    <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 ml-2 lg:ml-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

