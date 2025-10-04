"use client"

import Image from "next/image"

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-background to-muted">
      <div className="flex flex-col items-center gap-12 animate-in fade-in zoom-in duration-500">
        <div className="relative w-[28rem] h-80 flex items-center justify-center mb-8">
          <Image
            src="/logo.png"
            alt="Logo"
            width={448}
            height={320}
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-4xl font-bold tracking-wide text-center mt-12 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent animate-pulse">
          🚀 THE BEST KORPO PROJECT TOOL EVER! 🚀
        </h1>
        <div className="flex gap-2">
          <div
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  )
}

