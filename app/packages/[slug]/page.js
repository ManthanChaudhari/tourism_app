'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Users,
  Star,
  Check,
  X,
  Phone,
  Mail,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Home,
  ShieldCheck,
  Smartphone,
  Globe,
  Info,
  ChevronDown,
  Camera,
  MessageSquare,
  Facebook,
  Twitter,
  CalendarCheck2,
  Medal,
  ThumbsUp,
  Tag,
  Bus,
  Laptop,
  Navigation
} from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PackageDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const packageSlug = params.slug

  const [packageData, setPackageData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [showScrollNav, setShowScrollNav] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedDate, setSelectedDate] = useState('')
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)
  const [isDateOpen, setIsDateOpen] = useState(false)
  const [isTravelersOpen, setIsTravelersOpen] = useState(false)

  const travelers = adults + children + infants

  useEffect(() => {
    fetchPackageData()

    const handleClickOutside = (event) => {
      if (!event.target.closest('#date-dropdown') && !event.target.closest('#date-trigger')) {
        setIsDateOpen(false)
      }
      if (!event.target.closest('#travelers-dropdown') && !event.target.closest('#travelers-trigger')) {
        setIsTravelersOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [packageSlug])

  useEffect(() => {

    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollNav(true)
      } else {
        setShowScrollNav(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [packageSlug])

  const fetchPackageData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/packages/slug/${packageSlug}?public=true`)

      if (!response.ok) {
        if (response.status === 404) {
          setError('Package not found')
        } else {
          throw new Error('Failed to fetch package details')
        }
        return
      }

      const data = await response.json()

      if (data.success) {
        setPackageData(data.package)
      } else {
        setError(data.error || 'Failed to fetch package details')
      }
    } catch (error) {
      console.error('Error fetching package:', error)
      setError('Failed to load package details')
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: packageData.title,
          text: `Check out this amazing travel package: ${packageData.title}`,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#F97316] mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading details...</p>
        </div>
      </div>
    )
  }

  if (error || !packageData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Package Not Found</h1>
          <p className="text-gray-500 mb-6">{error}</p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => router.back()} variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Link href="/" className="w-full">
              <Button className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const images = packageData.images || []
  const mainImage = images[currentImageIndex] || packageData.image || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop"

  const scrollToSection = (id) => {
    setActiveTab(id)
    const element = document.getElementById(id)
    if (element) {
      const offset = 80
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  // Dynamic values from API with sensible fallbacks if fields are missing in DB
  const rating = packageData.rating || 4.9
  const reviewCount = packageData.review_count || 18695
  const recommendedPercentage = packageData.recommended_percentage || 98
  const hasBadgeOfExcellence = packageData.has_badge_of_excellence !== false
  const isLikelyToSellOut = packageData.is_likely_to_sell_out || false
  const languages = packageData.languages || 'English'
  const cancellationPolicy = packageData.cancellation_policy || 'Free cancellation up to 24 hours before the experience starts (local time)'
  const bookAheadStat = packageData.book_ahead_stat || '33'
  const hasMobileTicket = packageData.has_mobile_ticket !== false
  const offersPickup = !!packageData.pickupLocation

  return (
    <div className="min-h-screen bg-white font-sans text-[#212121]">
      {/* Sticky Header Nav */}
      <div className={`fixed top-0 left-0 right-0 bg-white border-b z-50 transition-all duration-300 ${showScrollNav ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h2 className="text-sm font-bold truncate max-w-[200px] md:max-w-md">{packageData.title}</h2>
            <div className="hidden md:flex items-center gap-6">
              {['overview', 'inclusions', 'itinerary', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => scrollToSection(tab)}
                  className={`text-xs font-bold uppercase tracking-wider h-16 border-b-2 transition-all ${activeTab === tab ? 'border-[#F97316] text-[#F97316]' : 'border-transparent text-gray-500 hover:text-black'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">From</p>
              <p className="text-lg font-bold">₹{packageData.discountedPrice?.toLocaleString() || packageData.price?.toLocaleString()}</p>
            </div>
            <Button
              className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold px-6 h-10 rounded-full"
              onClick={() => scrollToSection('booking')}
            >
              Reserve
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-6 pb-12">
        {/* Title Section */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#212121] leading-tight mb-4">
            {packageData.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-[13px] text-gray-600">
            <div className="flex items-center gap-1 font-bold">
              <div className="flex text-[#F97316]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < Math.floor(rating) ? "currentColor" : "none"}
                    className={i >= Math.floor(rating) ? "text-gray-300" : ""}
                  />
                ))}
              </div>
              <span className="hover:underline cursor-pointer ml-1 underline underline-offset-2">{reviewCount.toLocaleString()} Reviews</span>
            </div>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-1.5 font-medium">
              <div className="w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center">
                <ThumbsUp size={10} className="text-[#F97316] fill-[#F97316]" />
              </div>
              <span>Recommended by {recommendedPercentage}% of travelers <Info size={12} className="inline-block text-gray-400 cursor-pointer" /></span>
            </div>
            {hasBadgeOfExcellence && (
              <>
                <span className="text-gray-300">|</span>
                <div className="flex items-center gap-1.5 font-medium">
                  <div className="w-5 h-5 rounded-full bg-[#F97316] flex items-center justify-center">
                    <Medal size={12} className="text-white fill-white" />
                  </div>
                  <span>Badge of Excellence</span>
                </div>
              </>
            )}
            <span className="text-gray-300">|</span>
            <div className="font-medium text-gray-500">{packageData.destination}</div>

            <div className="ml-auto flex items-center gap-2 bg-orange-50 text-[#F97316] px-2 py-1 rounded text-[11px] font-bold">
              <Tag size={12} className="fill-[#F97316]" />
              Lowest Price Guarantee
            </div>
          </div>
        </div>

        {/* Persistent Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* LEFT SIDE - Content */}
          <div className="lg:col-span-8">
            {/* Gallery Section */}
            <div className="flex flex-col md:flex-row gap-4 h-[400px] md:h-[520px] mb-8">
              {/* Left Thumbnails */}
              <div className="hidden md:flex flex-col gap-2 w-32 shrink-0 h-full overflow-y-auto no-scrollbar">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`aspect-[4/3] rounded-lg overflow-hidden cursor-pointer border-2 transition-all shrink-0 ${currentImageIndex === idx ? 'border-[#F97316]' : 'border-transparent hover:border-gray-200'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt="" />
                  </div>
                ))}
                {images.length > 5 && (
                  <div className="aspect-[4/3] bg-black/60 rounded-lg flex items-center justify-center text-white text-[11px] font-bold cursor-pointer relative overflow-hidden shrink-0">
                    <img src={images[5] || images[0]} className="absolute inset-0 w-full h-full object-cover opacity-40 z-0" alt="" />
                    <span className="relative z-10">See More</span>
                  </div>
                )}
              </div>

              {/* Large Main Image */}
              <div className="flex-1 relative rounded-xl overflow-hidden bg-gray-100 group">
                <img
                  src={mainImage}
                  alt={packageData.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1)
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 z-10"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0)
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 z-10"
                >
                  <ChevronRight size={24} />
                </button>

                <div className="absolute top-4 right-4 flex gap-2 z-10">
                  <button className="bg-white/90 hover:bg-white px-3 py-1.5 rounded-full text-[12px] font-bold flex items-center gap-1.5 shadow-sm" onClick={handleShare}>
                    <Share2 size={14} /> Share
                  </button>
                </div>
              </div>
            </div>

            {/* Icons Bar */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 px-2 mb-12">
              <div className="flex items-center gap-2.5">
                <Clock size={20} className="text-[#F97316]" />
                <span className="text-[14px] font-medium text-gray-800">{packageData.duration} (approx.)</span>
              </div>
              {packageData.pickupLocation && (
                <div className="flex items-center gap-2.5">
                  <MapPin size={20} className="text-[#F97316]" />
                  <span className="text-[14px] font-medium text-gray-800">Pickup: {packageData.pickupLocation}</span>
                </div>
              )}
              {packageData.dropLocation && (
                <div className="flex items-center gap-2.5">
                  <Navigation size={20} className="text-[#F97316]" />
                  <span className="text-[14px] font-medium text-gray-800">Drop: {packageData.dropLocation}</span>
                </div>
              )}
              {hasMobileTicket && (
                <div className="flex items-center gap-2.5">
                  <Smartphone size={20} className="text-[#F97316]" />
                  <span className="text-[14px] font-medium text-gray-800">Mobile ticket</span>
                </div>
              )}
            </div>

            {/* Detailed Content */}
            <section id="overview" className="mb-10">
              <h2 className="text-2xl font-bold text-[#212121] mb-4">About this activity</h2>
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed text-[15px]">
                {packageData.description?.split('\n').map((para, i) => (
                  <p key={i} className="mb-4">{para}</p>
                ))}
              </div>
            </section>

            <section id="inclusions" className="mb-10 pt-8 border-t border-gray-100">
              <h2 className="text-2xl font-bold text-[#212121] mb-6">What's Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <Check size={18} className="text-[#F97316]" />
                    Inclusions
                  </h3>
                  <ul className="space-y-3">
                    {(packageData.inclusions || []).map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                        <Check size={14} className="text-[#F97316] mt-1 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                    {(!packageData.inclusions || packageData.inclusions.length === 0) && (
                      <li className="text-sm text-gray-400 italic">No inclusions specified</li>
                    )}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <X size={18} className="text-red-500" />
                    Exclusions
                  </h3>
                  <ul className="space-y-3">
                    {(packageData.exclusions || []).map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                        <X size={14} className="text-red-400 mt-1 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                    {(!packageData.exclusions || packageData.exclusions.length === 0) && (
                      <li className="text-sm text-gray-400 italic">No exclusions specified</li>
                    )}
                  </ul>
                </div>
              </div>
            </section>

            <section id="itinerary" className="mb-10 pt-8 border-t border-gray-100">
              <h2 className="text-2xl font-bold text-[#212121] mb-6">What to expect</h2>
              <div className="space-y-8">
                {(packageData.itinerary || []).map((day, i) => (
                  <div key={i} className="relative pl-12 pb-8">
                    {i !== (packageData.itinerary.length - 1) && (
                      <div className="absolute left-5 top-8 bottom-0 w-[2px] bg-gray-100"></div>
                    )}
                    <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center font-bold text-[#F97316] z-10 border-4 border-white">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-[#212121] mb-2">{day.title || `Day ${i + 1}`}</h3>
                      {day.duration && <p className="text-xs font-bold text-[#F97316] uppercase tracking-wider mb-2">{day.duration}</p>}
                      <p className="text-[15px] text-gray-600 leading-relaxed">
                        {day.description}
                      </p>
                    </div>
                  </div>
                ))}
                {(!packageData.itinerary || packageData.itinerary.length === 0) && (
                  <p className="text-sm text-gray-400 italic">No itinerary available</p>
                )}
              </div>
            </section>

            <section id="reviews" className="mb-10 pt-8 border-t border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-[#212121]">Reviews</h2>
                <Button variant="outline" className="text-sm font-bold border-gray-300">Newest first <ChevronDown size={14} className="ml-2" /></Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                <div className="text-center p-6 bg-gray-50 rounded-2xl">
                  <p className="text-5xl font-black text-[#212121] mb-2">{rating.toFixed(1)}</p>
                  <div className="flex justify-center text-[#F97316] mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={20} fill={i < Math.floor(rating) ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <p className="text-sm font-bold text-gray-500">Based on {reviewCount.toLocaleString()} reviews</p>
                </div>
                <div className="md:col-span-2 space-y-2 py-2">
                  {[5, 4, 3, 2, 1].map((r) => (
                    <div key={r} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-500 w-10">{r} stars</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#F97316]"
                          style={{ width: r === 5 ? '85%' : r === 4 ? '10%' : '2%' }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-gray-400 w-10">{r === 5 ? '85%' : r === 4 ? '10%' : '2%'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews are placeholder until a real review API is connected */}
              <div className="bg-gray-50 p-6 rounded-xl text-center border border-dashed border-gray-300">
                <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm font-medium">Actual reviews from travelers will appear here once available.</p>
              </div>
            </section>
          </div>

          {/* RIGHT SIDE - Sticky Widget */}
          <div className="lg:col-span-4 lg:sticky lg:top-20 z-20" id="booking">
            <Card className="shadow-lg border-gray-100 rounded-xl overflow-visible relative">
              <CardContent className="p-6">
                {isLikelyToSellOut && (
                  <div className="bg-red-50 text-[#FF5A5F] px-2 py-1 rounded text-[11px] font-bold w-fit mb-4">
                    Likely to Sell Out
                  </div>
                )}

                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className="text-[13px] font-medium text-gray-500">From</span>
                  <span className="text-3xl font-extrabold text-[#212121]">₹{packageData.discountedPrice?.toLocaleString() || packageData.price?.toLocaleString()}</span>
                  <span className="text-[13px] font-medium text-gray-500">per person</span>
                </div>

                <div className="flex items-center gap-1.5 text-[#F97316] text-[12px] font-bold mb-6 hover:underline cursor-pointer group">
                  <div className="w-4 h-4 rounded-full border border-[#F97316] flex items-center justify-center group-hover:bg-[#F97316] group-hover:text-white transition-colors">
                    <Check size={10} />
                  </div>
                  Discounted rates for infants
                </div>

                <div className="grid grid-cols-2 border border-gray-300 rounded-lg mb-4 overflow-visible relative">
                  {/* Date Selector */}
                  <div
                    id="date-trigger"
                    className="p-3 border-r border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors relative"
                    onClick={() => {
                      setIsDateOpen(!isDateOpen)
                      setIsTravelersOpen(false)
                    }}
                  >
                    <p className="text-[11px] font-bold text-gray-400 uppercase mb-1">Date</p>
                    <div className="flex items-center justify-between text-[14px] font-bold text-[#212121]">
                      {selectedDate ? new Date(selectedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Select Date'}
                      <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isDateOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {isDateOpen && (
                      <div
                        id="date-dropdown"
                        className="absolute top-full left-0 right-[-100%] mt-2 bg-white border border-gray-200 shadow-xl rounded-xl p-4 z-50 animate-in fade-in slide-in-from-top-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <p className="text-sm font-bold mb-3">Select travel date</p>
                        <input
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          value={selectedDate}
                          onChange={(e) => {
                            setSelectedDate(e.target.value)
                            setIsDateOpen(false)
                          }}
                          className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-[#F97316]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Travelers Selector */}
                  <div
                    id="travelers-trigger"
                    className="p-3 hover:bg-gray-50 cursor-pointer transition-colors relative"
                    onClick={() => {
                      setIsTravelersOpen(!isTravelersOpen)
                      setIsDateOpen(false)
                    }}
                  >
                    <p className="text-[11px] font-bold text-gray-400 uppercase mb-1">Travelers</p>
                    <div className="flex items-center justify-between text-[14px] font-bold text-[#212121]">
                      <div className="flex items-center gap-2 pt-0.5">
                        <Users size={16} className="text-gray-500" /> {travelers || 1}
                      </div>
                      <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isTravelersOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {isTravelersOpen && (
                      <div
                        id="travelers-dropdown"
                        className="absolute top-full right-0 mt-2 bg-white border border-gray-200 shadow-xl rounded-xl p-5 z-50 min-w-[320px] animate-in fade-in slide-in-from-top-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <p className="text-sm text-gray-600 mb-4">Select up to 12 travelers in total.</p>

                        {/* Adults */}
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                          <div>
                            <p className="text-sm font-bold text-gray-900">Adult (Age 13-100)</p>
                            <p className="text-[11px] text-gray-500">Minimum: 1, Maximum: 12</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setAdults(Math.max(1, adults - 1))}
                              className="w-8 h-8 rounded-full border-2 border-[#F97316] flex items-center justify-center hover:bg-orange-50 text-[#F97316] disabled:opacity-30 disabled:border-gray-300 disabled:text-gray-300"
                              disabled={adults <= 1}
                            >
                              <span className="text-lg font-bold">−</span>
                            </button>
                            <span className="text-base font-bold w-6 text-center">{adults}</span>
                            <button
                              onClick={() => setAdults(Math.min(12, adults + 1))}
                              className="w-8 h-8 rounded-full border-2 border-[#F97316] flex items-center justify-center hover:bg-orange-50 text-[#F97316]"
                            >
                              <span className="text-lg font-bold">+</span>
                            </button>
                          </div>
                        </div>

                        {/* Children */}
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                          <div>
                            <p className="text-sm font-bold text-gray-900">Child (Age 1-12)</p>
                            <p className="text-[11px] text-gray-500">Minimum: 0, Maximum: 12</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setChildren(Math.max(0, children - 1))}
                              className="w-8 h-8 rounded-full border-2 border-[#F97316] flex items-center justify-center hover:bg-orange-50 text-[#F97316] disabled:opacity-30 disabled:border-gray-300 disabled:text-gray-300"
                              disabled={children <= 0}
                            >
                              <span className="text-lg font-bold">−</span>
                            </button>
                            <span className="text-base font-bold w-6 text-center">{children}</span>
                            <button
                              onClick={() => setChildren(Math.min(12, children + 1))}
                              className="w-8 h-8 rounded-full border-2 border-[#F97316] flex items-center justify-center hover:bg-orange-50 text-[#F97316]"
                            >
                              <span className="text-lg font-bold">+</span>
                            </button>
                          </div>
                        </div>

                        {/* Infants */}
                        <div className="flex items-center justify-between mb-5">
                          <div>
                            <p className="text-sm font-bold text-gray-900">Infant (Age 0-0) <span className="text-[#F97316] text-[10px] font-bold">FREE*</span></p>
                            <p className="text-[11px] text-gray-500">Minimum: 0, Maximum: 12</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setInfants(Math.max(0, infants - 1))}
                              className="w-8 h-8 rounded-full border-2 border-[#F97316] flex items-center justify-center hover:bg-orange-50 text-[#F97316] disabled:opacity-30 disabled:border-gray-300 disabled:text-gray-300"
                              disabled={infants <= 0}
                            >
                              <span className="text-lg font-bold">−</span>
                            </button>
                            <span className="text-base font-bold w-6 text-center">{infants}</span>
                            <button
                              onClick={() => setInfants(Math.min(12, infants + 1))}
                              className="w-8 h-8 rounded-full border-2 border-[#F97316] flex items-center justify-center hover:bg-orange-50 text-[#F97316]"
                            >
                              <span className="text-lg font-bold">+</span>
                            </button>
                          </div>
                        </div>

                        <Button
                          className="w-full bg-[#F97316] hover:bg-[#EA580C] h-12 font-bold text-base"
                          onClick={() => setIsTravelersOpen(false)}
                        >
                          Apply
                        </Button>

                        <p className="text-[10px] text-gray-500 text-center mt-3">*Maximum discount rates shown may vary by date.</p>
                      </div>
                    )}
                  </div>
                </div>

                <Button className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white py-4 h-11 rounded-lg text-[15px] font-bold mb-6 transition-all active:scale-[0.98]">
                  Check Availability
                </Button>

                <div className="bg-orange-50 p-4 rounded-lg flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#F97316] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Check size={12} className="text-white font-bold" />
                  </div>
                  <p className="text-[13px] text-gray-700 leading-tight font-medium">
                    {cancellationPolicy}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="p-4 border border-gray-100 rounded-xl flex items-start gap-4 bg-white mt-4">
              <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center shrink-0">
                <Medal size={20} className="text-[#F97316]" />
              </div>
              <div className="py-0.5">
                <p className="text-[14px] font-bold mb-0.5 text-[#212121]">Book ahead!</p>
                <p className="text-[13px] text-gray-500">On average, this is booked {bookAheadStat} days in advance.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Footer */}
      <div className="bg-[#f7f8f9] py-16 border-t mt-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <MessageSquare className="w-12 h-12 text-[#F97316] mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-8 text-lg">Check out our FAQ or reach out to our team. We're here to help.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="bg-[#F97316] hover:bg-[#EA580C] text-white px-10 h-14 rounded-full font-bold text-lg shadow-lg">Message Us</Button>
            <Button variant="outline" className="border-gray-300 px-10 h-14 rounded-full font-bold bg-white text-gray-700 text-lg hover:bg-gray-50">Call Support</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
