"use client"
import { useEffect, useRef } from "react"
import gsap from "gsap"

interface AnimatedRouteProps {
  startX?: number
  startY?: number
  endX?: number
  endY?: number
  duration?: number
  className?: string // added className prop
}

export function AnimatedRoute({
  startX = -100,
  startY = 140,
  endX = 512,
  endY = 100,
  duration = 8,
  className, // destructure className
}: AnimatedRouteProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    if (!pathRef.current) return

    const path = pathRef.current
    const pathLength = path.getTotalLength()

    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
      opacity: 0,
    })

    // Create timeline for looping route animation
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 })

    // Fade in the route
    tl.to(
      path,
      {
        opacity: 0.5,
        duration: 0.4,
        ease: "power2.out",
      },
      0,
    )

    // Draw the route with smooth easing
    tl.to(
      path,
      {
        strokeDashoffset: 0,
        duration: duration * 0.85,
        ease: "sine.inOut",
      },
      0.2,
    )

    // Fade out before looping
    tl.to(
      path,
      {
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
      },
      duration - 0.5,
    )

    return () => {
      tl.kill()
    }
  }, [duration])

  // Calculate arc path (matches car's curved motion) - extended to reach center card
  const midX = (startX + endX) / 2
  const midY = Math.min(startY, endY) - 80 // Adjusted midpoint and curve
  const pathD = `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`

  return (
    <svg
      ref={svgRef}
      className={`absolute pointer-events-none ${className || ""}`}
      style={{ left: 0, top: 0, width: "100%", height: "100%", zIndex: 1 }} // Removed absolute inset-0 and overflow:visible
      preserveAspectRatio="none"
    >
      <path
        ref={pathRef}
        d={pathD}
        stroke="#3b82f6" // Modern gradient-like stroke
        strokeWidth="2.5"
        fill="none"
        strokeDasharray="10,6"
        strokeLinecap="round"
        opacity="0.6" // Clean blue dash
      />
    </svg>
  )
}
