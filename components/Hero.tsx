"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

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

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024)
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
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
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
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
    setCurrentStep(2)
  }

  const handleDateSelect = (day: number) => {
    const date = new Date(currentYear, currentMonth, day)
    setSelectedDateObj(date)
    setSelectedDate(formatDate(date))
    setCurrentStep(3)
  }

  const handlePassengerDone = () => {
    setIsDialogOpen(false)
    setCurrentStep(1)
  }

  const openDialog = (step: number) => {
    setCurrentStep(step)
    setIsDialogOpen(true)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.23, 1, 0.82, 1],
      },
    },
  }

  const stepTransitionVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.23, 1, 0.82, 1],
      },
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: [0.23, 1, 0.82, 1],
      },
    }),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
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

              <motion.div
                className="flex items-center gap-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.7 }}
              >
                <Button
                  size="lg"
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full font-medium"
                >
                  Discover Now
                </Button>
              </motion.div>
            </div>

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
              <div className="relative h-full flex items-center justify-center">
                {/* Left Card */}
                <motion.div
                  className="absolute left-8 top-24"
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
                      <div className="absolute top-4 right-4 w-6 h-6 bg-white/30 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Center Card */}
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 -mt-12"
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
                      <div className="absolute top-4 right-4 w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Right Card */}
                <motion.div
                  className="absolute right-8 top-24"
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
                      <div className="absolute top-4 right-4 w-6 h-6 bg-white/30 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form Cards */}
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 mt-8">
          <div className="relative">
            <div className="bg-white/75 backdrop-blur-lg border-0 shadow-xl rounded-3xl overflow-hidden">
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                  <motion.div
                    className={`space-y-2 cursor-pointer p-3 rounded-lg transition-all duration-300 ${
                      focusedField === 1 ? "bg-blue-50 ring-2 ring-blue-400" : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setFocusedField(1)
                      openDialog(1)
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.label
                      className="text-gray-900 font-semibold text-lg block"
                      animate={{
                        color: focusedField === 1 ? "#1f2937" : "#6b7280",
                      }}
                    >
                      Location
                    </motion.label>
                    <div className="flex items-center text-gray-500 group">
                      <span className="transition-colors duration-300">
                        {selectedLocation || "Where are you going?"}
                      </span>
                      <motion.svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{ rotate: focusedField === 1 ? 90 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </motion.svg>
                    </div>
                  </motion.div>

                  <motion.div
                    className={`space-y-2 cursor-pointer p-3 rounded-lg transition-all duration-300 ${
                      focusedField === 2 ? "bg-blue-50 ring-2 ring-blue-400" : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setFocusedField(2)
                      openDialog(2)
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.9 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.label
                      className="text-gray-900 font-semibold text-lg block"
                      animate={{
                        color: focusedField === 2 ? "#1f2937" : "#6b7280",
                      }}
                    >
                      Date
                    </motion.label>
                    <div className="flex items-center text-gray-500 group">
                      <span className="transition-colors duration-300">{selectedDate || "When will you travel?"}</span>
                      <motion.svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{ rotate: focusedField === 2 ? 90 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </motion.svg>
                    </div>
                  </motion.div>

                  <motion.div
                    className={`space-y-2 cursor-pointer p-3 rounded-lg transition-all duration-300 ${
                      focusedField === 3 ? "bg-blue-50 ring-2 ring-blue-400" : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setFocusedField(3)
                      openDialog(3)
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 1.0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.label
                      className="text-gray-900 font-semibold text-lg block"
                      animate={{
                        color: focusedField === 3 ? "#1f2937" : "#6b7280",
                      }}
                    >
                      People
                    </motion.label>
                    <div className="flex items-center text-gray-500 group">
                      <span className="transition-colors duration-300">
                        {adults + children > 0
                          ? `${adults} Adult${adults > 1 ? "s" : ""}, ${children} Child${children !== 1 ? "ren" : ""}`
                          : "How many people?"}
                      </span>
                      <motion.svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{ rotate: focusedField === 3 ? 90 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </motion.svg>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex justify-center md:justify-end"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 1.1 }}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                  >
                    <Button className="bg-gray-900 hover:bg-gray-800 text-white w-14 h-14 rounded-2xl flex items-center justify-center transition-shadow duration-300 hover:shadow-lg">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </Button>
                  </motion.div>
                </div>

                {/* Multi-Step Dialog with Premium Animations */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogContent className="sm:max-w-2xl">
                    <AnimatePresence mode="wait" custom={currentStep}>
                      {currentStep === 1 && (
                        <motion.div
                          key="step-1"
                          variants={stepTransitionVariants}
                          custom={1}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          className="w-full"
                        >
                          <DialogHeader>
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <DialogTitle>Select Location</DialogTitle>
                            </motion.div>
                          </DialogHeader>
                          <motion.div
                            className="grid grid-cols-4 gap-4 py-6"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            {countries.map((country) => (
                              <motion.div
                                key={country.name}
                                variants={itemVariants}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                                onClick={() => handleLocationSelect(country.name)}
                                whileHover={{ scale: 1.06, backgroundColor: "#f3f4f6" }}
                                whileTap={{ scale: 0.94 }}
                              >
                                <span className="text-2xl">{country.flag}</span>
                                <span className="text-sm font-medium">{country.name}</span>
                              </motion.div>
                            ))}
                          </motion.div>
                          <motion.div
                            className="flex justify-end gap-3"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                          >
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button className="bg-blue-500 hover:bg-blue-600">Select</Button>
                          </motion.div>
                        </motion.div>
                      )}

                      {currentStep === 2 && (
                        <motion.div
                          key="step-2"
                          variants={stepTransitionVariants}
                          custom={2}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          className="w-full"
                        >
                          <DialogHeader>
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <DialogTitle>Select date</DialogTitle>
                            </motion.div>
                          </DialogHeader>
                          <motion.div
                            className="py-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="flex items-center justify-between mb-6">
                              <Button variant="ghost" size="sm" onClick={handlePrevMonth}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                  />
                                </svg>
                              </Button>
                              <span className="font-semibold">
                                {getMonthName(currentMonth)} {currentYear}
                              </span>
                              <Button variant="ghost" size="sm" onClick={handleNextMonth}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </Button>
                            </div>

                            <div className="grid grid-cols-7 gap-2 text-center text-sm mb-4">
                              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                <div key={day} className="p-2 text-gray-500 font-medium">
                                  {day}
                                </div>
                              ))}
                            </div>

                            <motion.div
                              className="grid grid-cols-7 gap-2 text-center"
                              variants={containerVariants}
                              initial="hidden"
                              animate="visible"
                              key={`${currentMonth}-${currentYear}`}
                            >
                              {generateCalendarDays().map(({ day, key }) => (
                                <motion.button
                                  key={key}
                                  variants={itemVariants}
                                  className={`p-2 rounded-lg transition-all duration-200 ${
                                    day === null
                                      ? "invisible"
                                      : isDateSelected(day, currentMonth, currentYear)
                                        ? "bg-blue-500 text-white"
                                        : "hover:bg-blue-50 text-gray-900"
                                  }`}
                                  onClick={() => day !== null && handleDateSelect(day)}
                                  disabled={day === null}
                                  whileHover={day !== null ? { scale: 1.1 } : {}}
                                  whileTap={day !== null ? { scale: 0.9 } : {}}
                                >
                                  {day}
                                </motion.button>
                              ))}
                            </motion.div>
                          </motion.div>
                          <motion.div
                            className="flex justify-end gap-3"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                          >
                            <Button variant="outline" onClick={() => setCurrentStep(1)}>
                              Back
                            </Button>
                            <Button className="bg-blue-500 hover:bg-blue-600">Select</Button>
                          </motion.div>
                        </motion.div>
                      )}

                      {currentStep === 3 && (
                        <motion.div
                          key="step-3"
                          variants={stepTransitionVariants}
                          custom={3}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          className="w-full"
                        >
                          <DialogHeader>
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <DialogTitle>Number of passengers</DialogTitle>
                            </motion.div>
                          </DialogHeader>
                          <motion.div
                            className="py-8 space-y-8"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <motion.div variants={itemVariants} className="flex items-center justify-between">
                              <div>
                                <div className="text-xl font-semibold">Adults</div>
                                <div className="text-gray-500">aged 16+</div>
                              </div>
                              <div className="flex items-center gap-4">
                                <motion.button
                                  onClick={() => setAdults(Math.max(1, adults - 1))}
                                  className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  −
                                </motion.button>
                                <motion.span
                                  className="text-lg font-semibold min-w-8 text-center"
                                  key={adults}
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  {adults}
                                </motion.span>
                                <motion.button
                                  onClick={() => setAdults(adults + 1)}
                                  className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  +
                                </motion.button>
                              </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex items-center justify-between">
                              <div>
                                <div className="text-xl font-semibold">Children</div>
                                <div className="text-gray-500">aged 2-15</div>
                              </div>
                              <div className="flex items-center gap-4">
                                <motion.button
                                  onClick={() => setChildren(Math.max(0, children - 1))}
                                  className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  −
                                </motion.button>
                                <motion.span
                                  className="text-lg font-semibold min-w-8 text-center"
                                  key={children}
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  {children}
                                </motion.span>
                                <motion.button
                                  onClick={() => setChildren(children + 1)}
                                  className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  +
                                </motion.button>
                              </div>
                            </motion.div>
                          </motion.div>

                          <motion.div
                            className="flex justify-end gap-3"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                          >
                            <Button variant="outline" onClick={() => setCurrentStep(2)}>
                              Back
                            </Button>
                            <Button className="bg-blue-500 hover:bg-blue-600" onClick={handlePassengerDone}>
                              Done
                            </Button>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
