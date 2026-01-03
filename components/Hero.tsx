"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AnimatedCar } from "./animated-car"
import { AnimatedRoute } from "./animated-route"

export default function Hero() {
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [currentStep, setCurrentStep] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [focusedField, setFocusedField] = useState<number | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [selectedDateObj, setSelectedDateObj] = useState<Date | null>(null)
  const [isSticky, setIsSticky] = useState(false)
  const [successState, setSuccessState] = useState<number | null>(null)

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024)
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const heroHeight = window.innerHeight * 0.8
      setIsSticky(scrollY > heroHeight)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const countries = [
    { name: "Brazil", flag: "🇧🇷" },
    { name: "United States", flag: "🇺🇸" },
    { name: "Turkey", flag: "🇹🇷" },
    { name: "Egypt", flag: "🇪🇬" },
    { name: "United Kingdom", flag: "🇬🇧" },
    { name: "Canada", flag: "🇨🇦" },
    { name: "Ireland", flag: "🇮🇪" },
    { name: "Finland", flag: "🇫🇮" },
    { name: "Italy", flag: "🇮🇹" },
    { name: "France", flag: "🇫🇷" },
    { name: "Russia", flag: "🇷🇺" },
    { name: "Israel", flag: "🇮🇱" },
    { name: "Germany", flag: "🇩🇪" },
    { name: "South Korea", flag: "🇰🇷" },
    { name: "Swaziland", flag: "🇸🇿" },
    { name: "Bahrain", flag: "🇧🇭" },
    { name: "Argentina", flag: "🇦🇷" },
    { name: "Australia", flag: "🇦🇺" },
    { name: "China", flag: "🇨🇳" },
    { name: "Saudi Arabia", flag: "🇸🇦" },
  ]

  const getMonthName = (month: number) => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ]
    return monthNames[month]
  }

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const formatDate = (date: Date) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  }

  const isDateSelected = (day: number, month: number, year: number) => {
    if (!selectedDateObj) return false
    return (
      selectedDateObj.getDate() === day &&
      selectedDateObj.getMonth() === month &&
      selectedDateObj.getFullYear() === year
    )
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear)
    const startOffset = firstDay
    const days = []

    for (let i = 0; i < startOffset; i++) {
      days.push({ day: null, key: `empty-${i}` })
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ day, key: `day-${day}` })
    }

    return days
  }

  const handleLocationSelect = (country: string) => {
    setSelectedLocation(country)
    setSuccessState(1)
    setTimeout(() => {
      setCurrentStep(2)
      setSuccessState(null)
    }, 300)
  }

  const handleDateSelect = (day: number) => {
    const date = new Date(currentYear, currentMonth, day)
    setSelectedDateObj(date)
    setSelectedDate(formatDate(date))
    setSuccessState(2)
    setTimeout(() => {
      setCurrentStep(3)
      setSuccessState(null)
    }, 300)
  }

  const handlePassengerDone = () => {
    setSuccessState(3)
    setTimeout(() => {
      setIsDialogOpen(false)
      setCurrentStep(1)
      setSuccessState(null)
    }, 300)
  }

  const openDialog = (step: number) => {
    setCurrentStep(step)
    setIsDialogOpen(true)
  }

  return (
    <div className="relative bg-gradient-to-br from-orange-50 via-white to-blue-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-32">
        <AnimatedRoute startX={-200} startY={205} endX={1000} endY={180} duration={20} className="-z-10" />
        <AnimatedCar startX={-200} startY={187} endX={1300} endY={184} duration={20} className="-z-10" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <motion.h1
                  className="text-5xl font-bold tracking-tight text-gray-900 lg:text-6xl leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  Lets Plan Your
                  <br />
                  Perfect{" "}
                  <motion.span
                    className="text-orange-600 inline-block"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
                  >
                    Journey
                  </motion.span>
                </motion.h1>

                <motion.p
                  className="text-lg text-gray-600 max-w-lg leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                >
                  Plan and book your perfect trip with expert advice, travel tips, destination information and
                  inspiration from us.
                </motion.p>
              </div>
            </div>

            {/* Right side - Travel Cards */}
            <div className="relative h-96 w-full" style={{ perspective: "1000px" }}>
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-orange-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute top-1/2 -left-8 w-16 h-16 bg-blue-400 rounded-full opacity-20 animate-bounce"></div>

              {/* Airplane Icon */}
              <div className="absolute -top-8 right-1/4 text-orange-500 animate-pulse">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </div>

              {/* Travel Cards */}
              <div className="relative h-full flex items-center justify-center translate-x-8 -translate-y-4">
                {/* Left Card */}
                <motion.div
                  className="absolute left-12 top-16 z-20"
                  initial={{ opacity: 0, x: -60, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                  whileHover={
                    isDesktop
                      ? {
                          scale: 1.05,
                          y: -10,
                          rotateY: 5,
                          rotateX: -5,
                          transition: { duration: 0.3 },
                        }
                      : {}
                  }
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Card className="bg-white border-0 overflow-hidden w-44 h-72 rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <CardContent className="p-0 h-full">
                      <img
                        src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=600&fit=crop"
                        alt="Rome Colosseum"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-6 left-4 text-white">
                        <h3 className="text-sm font-bold drop-shadow-md">Paris</h3>
                        <p className="text-xs opacity-90 drop-shadow-md">Arc de Triomphe</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Center Card */}
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 -mt-20 z-20"
                  initial={{ opacity: 0, y: 60, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.9, ease: "easeOut", delay: 0.5 }}
                  whileHover={
                    isDesktop
                      ? {
                          scale: 1.08,
                          y: -20,
                          rotateY: 0,
                          rotateX: -8,
                          transition: { duration: 0.3 },
                        }
                      : {}
                  }
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Card className="bg-white border-0 overflow-hidden w-52 h-80 rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <CardContent className="p-0 h-full">
                      <img
                        src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=600&fit=crop"
                        alt="Rome Colosseum"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-6 left-4 text-white">
                        <h3 className="text-lg font-bold drop-shadow-md">Rome</h3>
                        <p className="text-sm opacity-90 drop-shadow-md">Colosseum</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Right Card */}
                <motion.div
                  className="absolute right-4 top-16 z-20"
                  initial={{ opacity: 0, x: 60, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
                  whileHover={
                    isDesktop
                      ? {
                          scale: 1.05,
                          y: -10,
                          rotateY: -5,
                          rotateX: -5,
                          transition: { duration: 0.3 },
                        }
                      : {}
                  }
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Card className="bg-white border-0 overflow-hidden w-44 h-72 rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <CardContent className="p-0 h-full">
                      <img
                        src="https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400&h=600&fit=crop"
                        alt="Eiffel Tower Paris"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-6 left-4 text-white">
                        <h3 className="text-sm font-bold drop-shadow-md">Paris</h3>
                        <p className="text-xs opacity-90 drop-shadow-md">Eiffel Tower</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar with Integrated Discover Now Button */}
        <motion.div
          className="absolute bottom-12 left-0 right-0 z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.9 }}
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="relative">
              {/* Discover Now Button - Integrated with search bar */}
              <motion.div
                className="absolute -top-6 left-6 z-20"
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 1.4 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Discover Now
                </Button>
              </motion.div>
              
              <div className="bg-white/75 backdrop-blur-lg border-0 overflow-hidden rounded-4xl shadow-md hover:shadow-lg transition-all duration-500">
                <motion.div
                  initial={{ scale: 0.98 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 1.5 }}
                  className="p-5 pt-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <motion.div
                      className={`space-y-1 cursor-pointer p-3 rounded-lg transition-all duration-300 ${
                        focusedField === 1 ? "bg-blue-50 ring-2 ring-blue-400 shadow-sm" : "hover:bg-gray-50 hover:shadow-sm"
                      }`}
                      onClick={() => {
                        setFocusedField(1)
                        openDialog(1)
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut", delay: 1.0 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <label className="text-gray-900 font-semibold text-base block">
                        Location
                      </label>
                      <div className="flex items-center text-gray-500 group">
                        <motion.span
                          key={selectedLocation}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className="transition-colors duration-300 text-sm"
                        >
                          {selectedLocation || "Where are you going?"}
                        </motion.span>
                        <motion.svg
                          className="w-3 h-3 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          whileHover={{ x: 2 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </motion.svg>
                      </div>
                    </motion.div>

                    <motion.div
                      className={`space-y-1 cursor-pointer p-3 rounded-lg transition-all duration-300 ${
                        focusedField === 2 ? "bg-blue-50 ring-2 ring-blue-400 shadow-sm" : "hover:bg-gray-50 hover:shadow-sm"
                      }`}
                      onClick={() => {
                        setFocusedField(2)
                        openDialog(2)
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut", delay: 1.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <label className="text-gray-900 font-semibold text-base block">
                        Date
                      </label>
                      <div className="flex items-center text-gray-500 group">
                        <motion.span
                          key={selectedDate}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className="transition-colors duration-300 text-sm"
                        >
                          {selectedDate || "When will you travel?"}
                        </motion.span>
                        <motion.svg
                          className="w-3 h-3 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          whileHover={{ x: 2 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </motion.svg>
                      </div>
                    </motion.div>

                    <motion.div
                      className={`space-y-1 cursor-pointer p-3 rounded-lg transition-all duration-300 ${
                        focusedField === 3 ? "bg-blue-50 ring-2 ring-blue-400 shadow-sm" : "hover:bg-gray-50 hover:shadow-sm"
                      }`}
                      onClick={() => {
                        setFocusedField(3)
                        openDialog(3)
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut", delay: 1.2 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <label className="text-gray-900 font-semibold text-base block">
                        People
                      </label>
                      <div className="flex items-center text-gray-500 group">
                        <motion.span
                          key={`${adults}-${children}`}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className="transition-colors duration-300 text-sm"
                        >
                          {adults + children > 0
                            ? `${adults} Adult${adults > 1 ? "s" : ""}, ${children} Child${children !== 1 ? "ren" : ""}`
                            : "How many people?"}
                        </motion.span>
                        <motion.svg
                          className="w-3 h-3 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          whileHover={{ x: 2 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </motion.svg>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex justify-center md:justify-end"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut", delay: 1.3 }}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                    >
                      <Button className="bg-gray-900 hover:bg-gray-800 text-white w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:shadow-lg group">
                        <motion.svg
                          className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          whileHover={{ rotate: 15 }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </motion.svg>
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Sticky Search Bar */}
      <motion.div
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-out ${
          isSticky ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
        initial={false}
        animate={{
          opacity: isSticky ? 1 : 0,
          y: isSticky ? 0 : -16,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="bg-white/90 backdrop-blur-xl border border-gray-200/50 overflow-hidden rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="px-4 py-2">
            <div className="flex items-center gap-3">
              <motion.div
                className={`cursor-pointer px-3 py-2 rounded-full transition-all duration-300 ${
                  focusedField === 1 ? "bg-blue-50 ring-1 ring-blue-300" : "hover:bg-gray-50"
                }`}
                onClick={() => {
                  setFocusedField(1)
                  openDialog(1)
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">{selectedLocation || "Location"}</span>
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.div>

              <div className="w-px h-6 bg-gray-200"></div>

              <motion.div
                className={`cursor-pointer px-3 py-2 rounded-full transition-all duration-300 ${
                  focusedField === 2 ? "bg-blue-50 ring-1 ring-blue-300" : "hover:bg-gray-50"
                }`}
                onClick={() => {
                  setFocusedField(2)
                  openDialog(2)
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">{selectedDate || "Date"}</span>
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.div>

              <div className="w-px h-6 bg-gray-200"></div>

              <motion.div
                className={`cursor-pointer px-3 py-2 rounded-full transition-all duration-300 ${
                  focusedField === 3 ? "bg-blue-50 ring-1 ring-blue-300" : "hover:bg-gray-50"
                }`}
                onClick={() => {
                  setFocusedField(3)
                  openDialog(3)
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    {adults + children > 0
                      ? `${adults + children} Guest${adults + children > 1 ? "s" : ""}`
                      : "Guests"}
                  </span>
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-gray-900 hover:bg-gray-800 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-lg group">
                  <motion.svg
                    className="w-3 h-3 transition-transform duration-300 group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    whileHover={{ rotate: 15 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </motion.svg>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Dialog for search interactions */}
      <AnimatePresence>
        {isDialogOpen && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-2xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <DialogHeader className="">
                  <DialogTitle className="">
                    <motion.span
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="flex items-center gap-2"
                    >
                      {successState === currentStep && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                        >
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                      )}
                      {currentStep === 1 && "Select Location"}
                      {currentStep === 2 && "Select Date"}
                      {currentStep === 3 && "Number of Passengers"}
                    </motion.span>
                  </DialogTitle>
                  {/* Progress indicator */}
                  <div className="flex items-center gap-2 mt-4">
                    {[1, 2, 3].map((step) => (
                      <motion.div
                        key={step}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          step <= currentStep ? "bg-blue-500" : "bg-gray-200"
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: step <= currentStep ? "2rem" : "1rem" }}
                        transition={{ duration: 0.3, delay: step * 0.1 }}
                      />
                    ))}
                  </div>
                </DialogHeader>
                <div className="py-6">
                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <motion.div
                        key="location"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="grid grid-cols-4 gap-4"
                      >
                        {countries.map((country, index) => (
                          <motion.div
                            key={country.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.02, ease: "easeOut" }}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-sm"
                            onClick={() => handleLocationSelect(country.name)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="text-2xl">{country.flag}</span>
                            <span className="text-sm font-medium">{country.name}</span>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                    {currentStep === 2 && (
                      <motion.div
                        key="date"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <div className="flex items-center justify-between mb-6">
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="ghost" size="sm" onClick={handlePrevMonth} className="hover:bg-gray-100 transition-all duration-200">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </Button>
                          </motion.div>
                          <motion.span
                            key={`${currentMonth}-${currentYear}`}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className="font-semibold"
                          >
                            {getMonthName(currentMonth)} {currentYear}
                          </motion.span>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="ghost" size="sm" onClick={handleNextMonth} className="hover:bg-gray-100 transition-all duration-200">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Button>
                          </motion.div>
                        </div>
                        <div className="grid grid-cols-7 gap-2 text-center text-sm mb-4">
                          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                            <div key={day} className="p-2 text-gray-500 font-medium">
                              {day}
                            </div>
                          ))}
                        </div>
                        <motion.div
                          key={`calendar-${currentMonth}-${currentYear}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="grid grid-cols-7 gap-2 text-center"
                        >
                          {generateCalendarDays().map(({ day, key }, index) => (
                            <motion.button
                              key={key}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.2, delay: index * 0.01 }}
                              className={`p-2 rounded-lg transition-all duration-200 ${
                                day === null
                                  ? "invisible"
                                  : isDateSelected(day, currentMonth, currentYear)
                                    ? "bg-blue-500 text-white shadow-md"
                                    : "hover:bg-blue-50 text-gray-900 hover:scale-110"
                              }`}
                              onClick={() => day !== null && handleDateSelect(day)}
                              disabled={day === null}
                              whileHover={day !== null ? { scale: 1.1 } : {}}
                              whileTap={day !== null ? { scale: 0.95 } : {}}
                            >
                              {day}
                            </motion.button>
                          ))}
                        </motion.div>
                      </motion.div>
                    )}
                    {currentStep === 3 && (
                      <motion.div
                        key="passengers"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="space-y-8"
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <div className="text-xl font-semibold">Adults</div>
                            <div className="text-gray-500">aged 16+</div>
                          </div>
                          <div className="flex items-center gap-4">
                            <motion.button
                              onClick={() => setAdults(Math.max(1, adults - 1))}
                              className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              −
                            </motion.button>
                            <motion.span
                              key={adults}
                              initial={{ scale: 1.2 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.2 }}
                              className="text-lg font-semibold min-w-8 text-center"
                            >
                              {adults}
                            </motion.span>
                            <motion.button
                              onClick={() => setAdults(adults + 1)}
                              className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              +
                            </motion.button>
                          </div>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <div className="text-xl font-semibold">Children</div>
                            <div className="text-gray-500">aged 2-15</div>
                          </div>
                          <div className="flex items-center gap-4">
                            <motion.button
                              onClick={() => setChildren(Math.max(0, children - 1))}
                              className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              −
                            </motion.button>
                            <motion.span
                              key={children}
                              initial={{ scale: 1.2 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.2 }}
                              className="text-lg font-semibold min-w-8 text-center"
                            >
                              {children}
                            </motion.span>
                            <motion.button
                              onClick={() => setChildren(children + 1)}
                              className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              +
                            </motion.button>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="flex justify-end gap-3"
                >
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-gray-300 hover:bg-gray-50 transition-all duration-200">
                      Cancel
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button onClick={handlePassengerDone} className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200">
                      Done
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  )
}