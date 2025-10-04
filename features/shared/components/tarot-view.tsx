"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

const tarotCards = [
  {
    name: "The Overwhelmed Developer",
    meaning: "Your team is drowning in technical debt and legacy code.",
    advice: "Hire more developers or lower your expectations. Preferably both.",
  },
  {
    name: "The Infinite Sprint",
    meaning: "This sprint will never end. Time is a flat circle.",
    advice: "Accept that deadlines are merely suggestions whispered by optimists.",
  },
  {
    name: "The Meeting Vortex",
    meaning: "All productivity shall be consumed by synchronous communication.",
    advice: "Schedule a meeting to discuss why there are too many meetings.",
  },
  {
    name: "The Scope Creep",
    meaning: "What started as a button is now an entire microservice architecture.",
    advice: "Just one more feature. What could go wrong?",
  },
  {
    name: "The Burning Budget",
    meaning: "Money flows like water through a colander.",
    advice: "Have you considered blaming the economy?",
  },
  {
    name: "The Mystical Deadline",
    meaning: "The deadline approaches, yet nothing is ready.",
    advice: "Move it to the next quarter. Nobody will remember.",
  },
  {
    name: "The Coffee Dependency",
    meaning: "Your team's blood is 80% caffeine.",
    advice: "Invest in a commercial espresso machine. It's cheaper than therapy.",
  },
  {
    name: "The Technical Debt Collector",
    meaning: "The sins of past shortcuts have come due.",
    advice: "Rewrite everything from scratch. What's another 6 months?",
  },
  {
    name: "The Bus Factor",
    meaning: "Only one person knows how the system works. They're on vacation.",
    advice: "Pray they don't win the lottery.",
  },
  {
    name: "The Stakeholder Paradox",
    meaning: "They want it fast, cheap, and perfect. Pick one.",
    advice: "Nod and smile. Then do whatever makes sense.",
  },
  {
    name: "The Documentation Void",
    meaning: "No one knows how anything works. The code is the documentation.",
    advice: "The real documentation was the friends we made along the way.",
  },
  {
    name: "The Production Incident",
    meaning: "Something is on fire. Possibly everything.",
    advice: "Have you tried turning it off and on again?",
  },
]

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

export function TarotView() {
  const [tarotCard, setTarotCard] = useState<typeof tarotCards[0] | null>(null)
  const [destinyCard, setDestinyCard] = useState<typeof destinyCards[0] | null>(null)
  const [isDestinyModalOpen, setIsDestinyModalOpen] = useState(false)

  const drawTarotCard = () => {
    const randomCard = tarotCards[Math.floor(Math.random() * tarotCards.length)]
    setTarotCard(randomCard)
    setDestinyCard(null)
    setIsDestinyModalOpen(false)
  }

  const drawDestinyCard = () => {
    const randomCard = destinyCards[Math.floor(Math.random() * destinyCards.length)]
    setDestinyCard(randomCard)
    setIsDestinyModalOpen(true)
  }

  return (
    <>
      <div className="space-y-6">
        {/* Warning Banner */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 border-2 border-purple-500 rounded-lg p-6 text-white shadow-2xl">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🔮</span>
            <h3 className="text-2xl font-bold">TAROT AI BOOST™</h3>
            <span className="text-3xl">✨</span>
          </div>
          <p className="text-purple-200 text-sm italic">
            "When data-driven decisions fail, consult the ancient arts of middle management mysticism."
          </p>
        </div>

        {/* Destiny - Decision Feature */}
        <Card className="bg-gradient-to-r from-indigo-950 to-purple-950 border-purple-500 border-2 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-purple-200 flex items-center gap-2">
              <span>⚖️</span> Destiny - Decision
            </CardTitle>
            <p className="text-purple-300 text-sm mt-2">
              Consult the ancient cards to determine your project's fate: Go, Stop, or Process?
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Draw Card Section */}
              <div className="space-y-4">
                <Button
                  onClick={drawDestinyCard}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-6 text-lg shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  <span className="mr-2">✨</span>
                  REVEAL YOUR DESTINY
                  <span className="ml-2">✨</span>
                </Button>

                {!destinyCard && (
                  <div className="text-center py-12 border-2 border-dashed border-purple-700 rounded-lg bg-purple-950/30">
                    <p className="text-purple-400 text-sm italic">The fates await your query...</p>
                    <p className="text-purple-500 text-xs mt-2">🎴 Will you receive the green light? 🎴</p>
                  </div>
                )}
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-purple-700">
              <div className="bg-green-950/30 p-4 rounded-lg border border-green-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🟢</span>
                  <p className="text-green-300 font-semibold text-sm">The Magician</p>
                </div>
                <p className="text-green-400 text-xs">Green Light - Full speed ahead!</p>
              </div>
              <div className="bg-red-950/30 p-4 rounded-lg border border-red-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🔴</span>
                  <p className="text-red-300 font-semibold text-sm">The Hanged Man</p>
                </div>
                <p className="text-red-400 text-xs">No Go - Suspended indefinitely</p>
              </div>
              <div className="bg-yellow-950/30 p-4 rounded-lg border border-yellow-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🟡</span>
                  <p className="text-yellow-300 font-semibold text-sm">Justice</p>
                </div>
                <p className="text-yellow-400 text-xs">Process - Think and decide</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tarot Card Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Tarot Draw */}
          <Card className="bg-gradient-to-br from-purple-950 to-indigo-950 border-purple-500 border-2 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-purple-200 flex items-center gap-2">
                <span>🌙</span> Divine Your Project's Fate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-purple-300 text-sm">
                  Harness the power of corporate mysticism. Click below to reveal what the universe (and your quarterly reports) have in store.
                </p>
                <Button
                  onClick={drawTarotCard}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-6 text-lg shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  <span className="mr-2">🎴</span>
                  DRAW A CARD OF DESTINY
                  <span className="ml-2">🎴</span>
                </Button>
              </div>

              {!tarotCard && (
                <div className="text-center py-12 border-2 border-dashed border-purple-700 rounded-lg bg-purple-950/30">
                  <p className="text-purple-400 text-sm italic">The cards await your command...</p>
                  <p className="text-purple-500 text-xs mt-2">⭐ 100% accuracy guaranteed* ⭐</p>
                  <p className="text-purple-600 text-xs mt-1">*Not actually guaranteed</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right: Card Reading */}
          {tarotCard && (
            <Card className="bg-gradient-to-br from-indigo-950 to-purple-950 border-purple-500 border-2 shadow-2xl animate-in fade-in zoom-in duration-500">
              <CardHeader>
                <CardTitle className="text-purple-200 flex items-center gap-2">
                  <span>✨</span> Your Reading
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Card Display */}
                <div className="bg-gradient-to-b from-purple-900 to-indigo-900 p-8 rounded-lg border-2 border-purple-400 shadow-xl">
                  <div className="text-center space-y-4">
                    <div className="text-6xl mb-4">🎴</div>
                    <h3 className="text-2xl font-bold text-purple-100">{tarotCard.name}</h3>
                  </div>
                </div>

                {/* Meaning */}
                <div className="space-y-2">
                  <h4 className="text-purple-300 font-semibold flex items-center gap-2">
                    <span>🌟</span> The Meaning:
                  </h4>
                  <p className="text-purple-200 bg-purple-950/50 p-4 rounded border border-purple-700">
                    {tarotCard.meaning}
                  </p>
                </div>

                {/* Advice */}
                <div className="space-y-2">
                  <h4 className="text-purple-300 font-semibold flex items-center gap-2">
                    <span>💡</span> The Wisdom:
                  </h4>
                  <p className="text-purple-200 bg-purple-950/50 p-4 rounded border border-purple-700 italic">
                    "{tarotCard.advice}"
                  </p>
                </div>

                <Button
                  onClick={drawTarotCard}
                  variant="outline"
                  className="w-full border-purple-500 text-purple-300 hover:bg-purple-900/50"
                >
                  Draw Another Card
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Disclaimer */}
        <div className="bg-purple-950/30 border border-purple-800 rounded-lg p-4">
          <p className="text-purple-400 text-xs text-center italic">
            ⚠️ DISCLAIMER: TAROT AI BOOST™ is for entertainment purposes only. Any resemblance to actual
            project management advice is purely coincidental.
            Side effects may include: existential dread, imposter syndrome, and an urge to update your LinkedIn profile.
            Consult your Scrum Master before making any life-altering decisions based on mystical card readings. ⚠️
          </p>
        </div>
      </div>

      {/* Destiny Card Modal - Fullscreen */}
      {destinyCard && isDestinyModalOpen && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-950 to-indigo-950">
          {/* Close Button - Top Right */}
          <button
            onClick={() => setIsDestinyModalOpen(false)}
            className="absolute top-6 right-6 z-50 w-16 h-16 flex items-center justify-center bg-purple-600 hover:bg-purple-500 rounded-full border-4 border-purple-400 shadow-2xl hover:shadow-purple-500/50 transition-all group"
          >
            <span className="text-4xl text-white font-bold group-hover:scale-110 transition-transform">×</span>
          </button>

          {/* Full Screen Grid Layout */}
          <div className="grid grid-cols-[1fr_600px] h-full">
            {/* Left Side - Full Height Image */}
            <div className="flex items-center justify-center bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-12 border-r-4 border-purple-500">
              <div className="w-full h-full max-w-[800px] max-h-[90vh] flex items-center justify-center bg-gradient-to-b from-purple-900 to-indigo-900 rounded-2xl border-4 border-purple-400 shadow-2xl p-8">
                {destinyCard.image && (
                  <img
                    src={destinyCard.image}
                    alt={destinyCard.name}
                    className="w-full h-full object-contain drop-shadow-2xl"
                    onError={(e) => {
                      console.error("Image failed to load:", destinyCard.image)
                      e.currentTarget.style.display = "none"
                    }}
                  />
                )}
              </div>
            </div>

            {/* Right Side - Fixed Width Info Panel */}
            <div className="flex flex-col bg-gradient-to-br from-purple-950 to-indigo-950 overflow-y-auto">
              {/* Header */}
              <div className="p-8 border-b-4 border-purple-500">
                <h2 className="text-3xl text-purple-100 text-center font-bold flex items-center justify-center gap-3">
                  <span className="text-4xl">⚖️</span>
                  Your Destiny
                  <span className="text-4xl">⚖️</span>
                </h2>
              </div>

              {/* Content */}
              <div className="flex-1 p-8 space-y-8 overflow-y-auto">
                {/* Card Title */}
                <div className="bg-gradient-to-r from-purple-900/80 to-indigo-900/80 rounded-xl p-8 border-4 border-purple-500">
                  <h3 className="text-5xl font-bold text-purple-100 text-center mb-4 drop-shadow-lg">
                    {destinyCard.name}
                  </h3>
                  <div className="flex justify-center">
                    <p className="text-3xl text-purple-300 font-bold bg-purple-900/80 px-8 py-3 rounded-full border-2 border-purple-400">
                      {destinyCard.subtitle}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-gradient-to-br from-purple-950/90 to-indigo-950/90 p-8 rounded-xl border-4 border-purple-600 shadow-xl">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-purple-700">
                    <span className="text-4xl">📜</span>
                    <h4 className="text-3xl text-purple-200 font-bold">The Prophecy</h4>
                  </div>
                  <p className="text-purple-100 leading-relaxed text-2xl font-medium">
                    {destinyCard.description}
                  </p>
                </div>
              </div>

              {/* Footer - Close Button */}
              <div className="p-8 border-t-4 border-purple-500">
                <Button
                  onClick={() => setIsDestinyModalOpen(false)}
                  className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold py-8 text-2xl shadow-lg hover:shadow-purple-500/50 transition-all border-4 border-purple-400"
                >
                  <span className="mr-3 text-3xl">✨</span>
                  Accept Your Fate
                  <span className="ml-3 text-3xl">✨</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

