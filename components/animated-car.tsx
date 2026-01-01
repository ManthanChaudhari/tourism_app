"use client"
import { useEffect, useRef } from "react"
import gsap from "gsap"

interface AnimatedCarProps {
  startX?: number
  startY?: number
  endX?: number
  endY?: number
  duration?: number
  className?: string // added className prop
}

export function AnimatedCar({
  startX = -100,
  startY = 140,
  endX = 512,
  endY = 100,
  duration = 8,
  className, // destructure className
}: AnimatedCarProps) {
  const carRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!carRef.current) return

    gsap.set(carRef.current, { x: 0, y: 0, opacity: 0 })

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 })

    // to match the SVG path exactly.
    const midX = (startX + endX) / 2
    const midY = startY - 80

    tl.to(
      carRef.current,
      {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      },
      0,
    )

    // using GSAP's ability to animate custom properties or just splitting x and y
    tl.to(
      carRef.current,
      {
        x: endX,
        duration: duration,
        ease: "none", // Linear for X to maintain constant forward speed
      },
      0,
    )

    // Since X is linear, we can use a custom ease for Y to simulate the curve
    tl.to(
      carRef.current,
      {
        y: midY - startY, // Relative to startY
        duration: duration * 0.5,
        ease: "power2.out",
      },
      0,
    )

    tl.to(
      carRef.current,
      {
        y: endY - startY, // Relative to startY
        duration: duration * 0.5,
        ease: "power2.in",
      },
      duration * 0.5,
    )

    // Gentle deceleration near the destination card
    tl.to(
      carRef.current,
      {
        duration: 1.2,
        ease: "power3.inOut",
      },
      duration - 1.2,
    )

    // Fade out before looping
    tl.to(
      carRef.current,
      {
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
      },
      duration - 0.3,
    )

    return () => {
      tl.kill()
    }
  }, [endX, endY, duration])

  return (
    <div
      ref={carRef}
      className={`absolute pointer-events-none z-0 ${className || ""}`}
      style={{ left: startX, top: startY }}
    >
      {/* Flat, minimalist car SVG in brand colors (orange & blue) */}
      <svg
        width="60"
        height="32"
        viewBox="0 0 60 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* Shadow for depth */}
        <ellipse cx="30" cy="28" rx="25" ry="3" fill="black" opacity="0.1" />

        {/* Main Body - Sleek Modern SUV/Crossover shape */}
        <path
          d="M4 22C4 20 6 18 10 17L15 11C17 9 20 8 24 8H40C44 8 47 9 49 11L54 17C58 18 60 20 60 22V25C60 27 58 28 56 28H8C6 28 4 27 4 25V22Z"
          fill="#1e293b"
        />
        <path
          d="M8 22C8 21 9 20 11 19.5L16 13C17.5 11.5 20 11 23 11H41C44 11 46.5 11.5 48 13L53 19.5C55 20 56 21 56 22V24H8V22Z"
          fill="#334155"
        />

        {/* Windshield & Windows */}
        <path
          d="M24 11.5H40C42.5 11.5 44 12 45 13L49 18.5H15L19 13C20 12 21.5 11.5 24 11.5Z"
          fill="#94a3b8"
          opacity="0.8"
        />
        <rect x="29" y="11.5" width="2" height="7" fill="#334155" />

        {/* Headlights - Modern LED Strips */}
        <rect x="6" y="20" width="8" height="2" rx="1" fill="#fef08a" />
        <rect x="50" y="20" width="8" height="2" rx="1" fill="#fef08a" />

        {/* Branding Accent */}
        <rect x="25" y="22" width="10" height="1.5" rx="0.75" fill="#f97316" />

        {/* Wheels */}
        <rect x="12" y="24" width="8" height="6" rx="2" fill="#0f172a" />
        <rect x="44" y="24" width="8" height="6" rx="2" fill="#0f172a" />
      </svg>
    </div>
  )
}
