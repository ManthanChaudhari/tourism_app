'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useUser } from '@/lib/supabase/hooks'
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  Users,
  Bed,
  ArrowLeft,
  AlertCircle,
  Wifi,
  Car,
  Coffee,
  Utensils,
  Calendar,
  CreditCard,
  Shield,
  Home,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
  Copy,
  QrCode,
  Share2,
  Mail as MailIcon,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Wind,
  Droplets,
  Sparkles,
  Tv,
  Waves,
  ChefHat,
  Dumbbell,
  Building,
  Image as ImageIcon
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function HotelDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useUser()
  const hotelSlug = params.slug

  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isImageContain, setIsImageContain] = useState(false) // Toggle for Cover/Contain

  // Helper to get local date strings in YYYY-MM-DD format
  const getLocalDate = (daysOffset = 0) => {
    const date = new Date()
    date.setDate(date.getDate() + daysOffset)
    return date.toLocaleDateString('en-CA')
  }

  const [checkIn, setCheckIn] = useState(getLocalDate(0))
  const [checkOut, setCheckOut] = useState(getLocalDate(2))
  const [selectedGuests, setSelectedGuests] = useState(1)
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false)
  const [isAmenitiesModalOpen, setIsAmenitiesModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isLinkCopied, setIsLinkCopied] = useState(false)

  // Fetch hotel details by slug
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/hotels/slug/${hotelSlug}?public=true`)
        const data = await response.json()

        if (data.success) {
          setHotel(data.hotel)
        } else {
          setError(data.error || 'Hotel not found')
        }
      } catch (error) {
        console.error('Error fetching hotel:', error)
        setError('Failed to load hotel details')
      } finally {
        setLoading(false)
      }
    }

    if (hotelSlug) {
      fetchHotel()
    }
  }, [hotelSlug])

  // Automatically update checkout if checkin changes to a later date
  useEffect(() => {
    if (checkIn && checkOut && new Date(checkOut) <= new Date(checkIn)) {
      const nextDay = new Date(checkIn)
      nextDay.setDate(nextDay.getDate() + 1)
      setCheckOut(nextDay.toLocaleDateString('en-CA'))
    }
  }, [checkIn])


  const getAmenityIcon = (amenity) => {
    const amenityLower = amenity.toLowerCase()
    if (amenityLower.includes('wifi')) return <Wifi className="h-5 w-5" />
    if (amenityLower.includes('parking') || amenityLower.includes('car')) return <Car className="h-5 w-5" />
    if (amenityLower.includes('restaurant') || amenityLower.includes('dining')) return <Utensils className="h-5 w-5" />
    if (amenityLower.includes('pool') || amenityLower.includes('waves')) return <Waves className="h-5 w-5" />
    if (amenityLower.includes('gym') || amenityLower.includes('fitness')) return <Dumbbell className="h-5 w-5" />
    if (amenityLower.includes('tv') || amenityLower.includes('entertainment')) return <Tv className="h-5 w-5" />
    if (amenityLower.includes('shampoo') || amenityLower.includes('conditioner') || amenityLower.includes('soap')) return <Droplets className="h-5 w-5" />
    if (amenityLower.includes('clean') || amenityLower.includes('sparkl')) return <Sparkles className="h-5 w-5" />
    if (amenityLower.includes('view') || amenityLower.includes('skyline')) return <Building className="h-5 w-5" />
    if (amenityLower.includes('hair dryer') || amenityLower.includes('air')) return <Wind className="h-5 w-5" />
    if (amenityLower.includes('safe') || amenityLower.includes('security')) return <Shield className="h-5 w-5" />
    if (amenityLower.includes('kitchen') || amenityLower.includes('food')) return <ChefHat className="h-5 w-5" />
    if (amenityLower.includes('bed') || amenityLower.includes('bedroom')) return <Bed className="h-5 w-5" />
    return <Coffee className="h-5 w-5" />
  }

  const generateReviewsCount = (rating) => {
    const baseReviews = Math.floor(rating * 200)
    const randomFactor = Math.floor(Math.random() * 500) + 100
    return baseReviews + randomFactor
  }

  const getMinPrice = () => {
    if (!hotel?.rooms || hotel.rooms.length === 0) return null
    const validRooms = hotel.rooms.filter(room => room.price_per_night && room.price_per_night > 0)
    return validRooms.length > 0 ? Math.min(...validRooms.map(room => room.price_per_night)) : null
  }

  const getAllImages = () => {
    const images = []
    if (hotel?.thumbnail_image) images.push(hotel.thumbnail_image)
    if (hotel?.gallery_images && hotel.gallery_images.length > 0) {
      images.push(...hotel.gallery_images)
    }
    return images.length > 0 ? images : ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop']
  }

  // Calculated stats from API data
  const maxGuests = hotel?.rooms?.length > 0
    ? Math.max(...hotel.rooms.map(r => r.max_guests || 0))
    : 2
  const bedroomCount = hotel?.rooms?.length || 1
  const bedCount = hotel?.rooms?.reduce((acc, r) => acc + (r.bed_type ? 1 : 1), 0) || 1
  const bathroomCount = 1 // API doesn't provide this yet

  const yearsHosting = hotel?.created_at
    ? Math.max(1, new Date().getFullYear() - new Date(hotel.created_at).getFullYear())
    : 1
  const isSuperhost = (hotel?.star_rating || 0) >= 4.5

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setIsLinkCopied(true)
    setTimeout(() => setIsLinkCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: hotel.name,
          text: `Check out this amazing place: ${hotel.name}`,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
        setIsShareModalOpen(true)
      }
    } else {
      setIsShareModalOpen(true)
    }
  }

  const nextImage = () => {
    const images = getAllImages()
    setSelectedImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    const images = getAllImages()
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Loading hotel details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Hotel Not Found</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex items-center justify-center gap-4">
              <Button onClick={() => router.back()} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
              <Link href="/">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const images = getAllImages()
  const minPrice = getMinPrice()
  const reviewsCount = generateReviewsCount(hotel.star_rating || 4)

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button Row */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-6">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:bg-gray-100 -ml-30"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Header with Hotel Name */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-6 pb-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase tracking-tight">{hotel.name}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 h-9"
            >
              <Share2 className="h-4 w-4 mr-2" strokeWidth={2} />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Bento Grid 1+4 Layout */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-0 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] gap-2 h-[400px] md:h-[500px] rounded-xl overflow-hidden">

          {/* Main Large Image (Left) */}
          <div className="relative h-full w-full group overflow-hidden min-w-0 bg-gray-50 flex items-center justify-center">
            <img
              src={images[selectedImageIndex]}
              alt={hotel.name}
              className={`w-full h-full object-${isImageContain ? 'contain' : 'cover'} transition-transform duration-700 hover:scale-105`}
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"
              }}
            />

            {/* Fit Toggle Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsImageContain(!isImageContain)
              }}
              className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20"
              title={isImageContain ? "Fill space" : "Sho full image"}
            >

              {isImageContain ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
              )}
            </button>

            {/* Arrows for main image navigation */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                prevImage()
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ChevronLeft className="h-6 w-6 text-gray-900" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                nextImage()
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ChevronRight className="h-6 w-6 text-gray-900" />
            </button>
          </div>

          {/* Side Images Grid (Right - 2x2 with Flexbox) */}
          <div className="flex flex-col gap-2 h-full min-w-0">
            {/* Top Row (0, 1) */}
            <div className="flex gap-2 h-1/2 min-h-0">
              {[0, 1].map((offset) => {
                const candidates = images.filter((_, idx) => idx !== selectedImageIndex)
                const item = candidates[offset] ? { img: candidates[offset], idx: images.indexOf(candidates[offset]) } : null

                return (
                  <div
                    key={offset}
                    className="relative w-1/2 h-full cursor-pointer group overflow-hidden"
                    onClick={() => {
                      if (item) setSelectedImageIndex(item.idx)
                    }}
                  >
                    {item ? (
                      <img
                        src={item.img}
                        alt={`${hotel.name} side ${offset + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Bottom Row (2, 3) */}
            <div className="flex gap-2 h-1/2 min-h-0">
              {[2, 3].map((offset) => {
                const candidates = images.filter((_, idx) => idx !== selectedImageIndex)
                const item = candidates[offset] ? { img: candidates[offset], idx: images.indexOf(candidates[offset]) } : null

                return (
                  <div
                    key={offset}
                    className="relative w-1/2 h-full cursor-pointer group overflow-hidden"
                    onClick={() => {
                      if (item) setSelectedImageIndex(item.idx)
                    }}
                  >
                    {item ? (
                      <img
                        src={item.img}
                        alt={`${hotel.name} side ${offset + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}

                    {/* "Show all photos" button on the last side image (offset 3) */}
                    {offset === 3 && (
                      <div className="absolute bottom-4 right-4 z-10">
                        <button
                          className="bg-white text-gray-900 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-all flex items-center gap-2 shadow-sm scale-95 hover:scale-100"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Logic to show all photos modal would go here
                          }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="hidden sm:inline">Show all photos</span>
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-0 pb-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content (Left) */}
          <div className="flex-1 space-y-8">
            {/* Title & Stats */}
            <div className="border-b pb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                Entire {hotel.property_type || 'apartment'} in {hotel.city || 'local area'}, {hotel.country || 'India'}
              </h2>
              <div className="flex items-center text-gray-600 text-[15px]">
                <span>{maxGuests} guests</span>
                <span className="mx-1.5">·</span>
                <span>{bedroomCount} {bedroomCount === 1 ? 'bedroom' : 'bedrooms'}</span>
                <span className="mx-1.5">·</span>
                <span>{bedCount} {bedCount === 1 ? 'bed' : 'beds'}</span>
                <span className="mx-1.5">·</span>
                <span>{bathroomCount} {bathroomCount === 1 ? 'bathroom' : 'bathrooms'}</span>
              </div>
            </div>

            {/* Guest Favourite Badge */}
            <div className="border rounded-2xl p-6 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Star className="h-8 w-8 text-yellow-500 fill-none" strokeWidth={1.5} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-bold mt-1">GUEST</span>
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Guest favourite</div>
                  <div className="text-gray-500 text-sm">{hotel.tagline || "One of the most loved homes on Airbnb, according to guests"}</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="font-bold text-gray-900 text-lg">{hotel.star_rating || 4.9}</div>
                  <div className="flex text-yellow-500 -mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-2.5 w-2.5 fill-current" />
                    ))}
                  </div>
                </div>
                <div className="h-10 w-px bg-gray-200"></div>
                <div className="text-center">
                  <div className="font-bold text-gray-900 text-lg">{reviewsCount}</div>
                  <div className="text-xs text-gray-500 underline">Reviews</div>
                </div>
              </div>
            </div>

            {/* Highlights Section */}
            <div className="space-y-6 border-b pb-8">
              {hotel.check_in_time && (
                <div className="flex gap-4">
                  <div className="mt-1">
                    <Clock className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Flexible Check-in</div>
                    <div className="text-gray-500 text-sm">Arrive after {hotel.check_in_time} and relax.</div>
                  </div>
                </div>
              )}
              {hotel.amenities?.some(a => a.toLowerCase().includes('check-in')) && (
                <div className="flex gap-4">
                  <div className="mt-1">
                    <Home className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Self check-in</div>
                    <div className="text-gray-500 text-sm">Check in with the building staff or smart lock.</div>
                  </div>
                </div>
              )}
              {hotel.cancellation_policy && (
                <div className="flex gap-4">
                  <div className="mt-1">
                    <Calendar className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Cancellation Policy</div>
                    <div className="text-gray-500 text-sm">{hotel.cancellation_policy}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="pb-8 border-b">
              <p className="text-gray-700 leading-7 text-base whitespace-pre-line">
                {hotel.short_description || "Experience comfort and style in this beautiful space. Perfect for travelers looking for a unique stay."}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="pt-2">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">What this place offers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                {(hotel.amenities || ['Wifi', 'Kitchen', 'Workspace', 'TV']).slice(0, 10).map((amenity, i) => (
                  <div key={i} className="flex items-center gap-4">
                    {getAmenityIcon(amenity)}
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="mt-8 px-6 border-gray-900 font-semibold text-gray-900 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsAmenitiesModalOpen(true)}
              >
                Show all {hotel.amenities?.length || 0} amenities
              </Button>
            </div>
          </div>

          {/* Sidebar Booking Card (Right) */}
          <div className="w-full lg:w-[370px]">
            <div className="sticky top-28">
              {/* Rare find banner */}
              <div className="bg-white border rounded-xl overflow-hidden shadow-xl mb-4">
                <div className="p-4 flex items-center justify-between border-b bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <span className="text-orange-500 text-xl font-bold italic">❤</span>
                    <span className="font-semibold text-gray-900">Rare find!</span>
                  </div>
                  <span className="text-gray-600 text-[13px]">This place is usually booked</span>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900">₹{Math.round(minPrice || 3878).toLocaleString()}</span>
                    <span className="text-gray-600">for 2 nights</span>
                  </div>

                  <div className="border border-gray-300 rounded-xl focus-within:ring-2 focus-within:ring-black transition-shadow">
                    <div className="grid grid-cols-2 border-b">
                      <label className="p-3 border-r hover:bg-gray-50 cursor-pointer group rounded-tl-xl overflow-hidden">
                        <div className="text-[10px] font-bold text-gray-900 uppercase">Check-in</div>
                        <input
                          type="date"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          className="w-full text-sm bg-transparent focus:outline-none cursor-pointer placeholder-gray-400"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </label>
                      <label className="p-3 hover:bg-gray-50 cursor-pointer group rounded-tr-xl overflow-hidden">
                        <div className="text-[10px] font-bold text-gray-900 uppercase">Checkout</div>
                        <input
                          type="date"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="w-full text-sm bg-transparent focus:outline-none cursor-pointer placeholder-gray-400"
                          min={checkIn || new Date().toISOString().split('T')[0]}
                        />
                      </label>
                    </div>
                    <div className="relative border-t">
                      <button
                        onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}
                        className="w-full p-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between group transition-colors rounded-b-xl"
                      >
                        <div className="text-left">
                          <div className="text-[10px] font-bold text-gray-900 uppercase">Guests</div>
                          <div className="text-sm text-gray-900">{selectedGuests} {selectedGuests === 1 ? 'guest' : 'guests'}</div>
                        </div>
                        <svg
                          className={`w-4 h-4 text-gray-500 group-hover:text-gray-900 transition-transform duration-200 ${isGuestDropdownOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {isGuestDropdownOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsGuestDropdownOpen(false)}
                          ></div>
                          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-xl rounded-xl mt-1 z-20 py-2">
                            {[...Array(maxGuests)].map((_, i) => (
                              <button
                                key={i + 1}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${selectedGuests === i + 1 ? 'font-bold text-orange-600 bg-orange-50' : 'text-gray-700'}`}
                                onClick={() => {
                                  setSelectedGuests(i + 1)
                                  setIsGuestDropdownOpen(false)
                                }}
                              >
                                {i + 1} {i + 1 === 1 ? 'guest' : 'guests'}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <Button className="w-full py-6 text-base font-semibold bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-sm transition-all">
                    Reserve
                  </Button>

                  <div className="text-center space-y-3">
                    <div className="text-gray-600 text-sm">You won't be charged yet</div>
                    {hotel.cancellation_policy && (
                      <div className="text-sm text-gray-500 bg-gray-50 py-3 px-2 rounded-lg leading-snug">
                        {hotel.cancellation_policy}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 text-gray-500 text-sm hover:underline py-4 font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
                Report this listing
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Amenities Modal */}
      {isAmenitiesModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsAmenitiesModalOpen(false)}
          ></div>
          <div
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200 text-left"
            style={{ fontFamily: 'Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif' }}
          >
            {/* Modal Header */}
            <div className="p-6 sticky top-0 bg-white z-10 flex items-center">
              <button
                onClick={() => setIsAmenitiesModalOpen(false)}
                className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-gray-900" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-8 pb-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <h2 className="text-2xl font-[540] text-gray-900 mb-8">What this place offers</h2>

              <div className="border-t border-gray-200">
                {(hotel.amenities || []).map((amenity, i) => (
                  <div key={i} className="flex items-center gap-6 py-6 border-b border-gray-200">
                    <div className="text-gray-900 shrink-0">
                      {getAmenityIcon(amenity)}
                    </div>
                    <span className="text-[17px] font-normal text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsShareModalOpen(false)}
          ></div>
          <div className="relative w-full max-w-[500px] bg-[#F3F4F6] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Share2 className="h-5 w-5 text-gray-700" />
                <h2 className="text-lg font-medium text-gray-900">Share link</h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-white border-2">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop" alt="User" className="w-full h-full object-cover" />
                </div>
                <button onClick={() => setIsShareModalOpen(false)} className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
                  <X className="h-6 w-6 text-gray-700" />
                </button>
              </div>
            </div>

            <div className="px-5 pb-8 space-y-6 overflow-y-auto max-h-[80vh]">
              {/* Link Card */}
              <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-700">
                    <LinkIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 truncate max-w-[200px]">{hotel.name}</div>
                    <div className="text-gray-500 text-xs truncate max-w-[200px]">{typeof window !== 'undefined' ? window.location.href : '/'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 bg-white shadow-sm">
                    <QrCode className="h-5 w-5 text-gray-700" />
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 bg-white shadow-sm relative"
                  >
                    <Copy className="h-5 w-5 text-gray-700" />
                    {isLinkCopied && (
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">Copied!</div>
                    )}
                  </button>
                </div>
              </div>

              {/* Personal Shortcuts */}
              <div className="flex gap-8 px-2">
                <div className="flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500 shadow-md flex items-center justify-center transform transition-all group-hover:-translate-y-1">
                    <div className="w-10 h-10 bg-white/20 rounded-md"></div>
                  </div>
                  <span className="text-[11px] font-medium text-gray-700 text-center">My Phone</span>
                </div>
                <div className="flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-600 border-2 border-white shadow-sm">
                      {user?.user_metadata?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || user?.email?.[0].toUpperCase() || 'U'}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-gray-100">
                      <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold">
                        {user?.user_metadata?.full_name?.[0].toUpperCase() || user?.email?.[0].toUpperCase() || 'M'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-gray-700 text-center leading-tight">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}<br />(You)
                  </span>
                </div>
              </div>

              <div className="h-px bg-gray-200 -mx-5 px-5"></div>

              {/* Social Grid */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-6 px-2">Share using</h3>
                <div className="grid grid-cols-4 md:grid-cols-5 gap-y-8">
                  <SocialItem icon={<Share2 className="text-blue-600" />} label="Nearby Sharing" />
                  <SocialItem icon={<MessageCircle className="text-indigo-500" />} label="Discord" color="#5865F2" />
                  <SocialItem icon={<MailIcon className="text-blue-500" />} label="Outlook" color="#0078D4" />
                  <SocialItem icon={<Users className="text-indigo-600" />} label="Microsoft Teams" color="#6264A7" />
                  <SocialItem icon={<Shield className="text-blue-400" />} label="Copilot" color="#00A1F1" />

                  <SocialItem icon={<MessageCircle className="text-green-500" />} label="WhatsApp" color="#25D366" />
                  <SocialItem icon={<MailIcon className="text-red-500" />} label="Gmail" color="#EA4335" />
                  <SocialItem icon={<Facebook className="text-blue-600" />} label="Facebook" color="#1877F2" />
                  <SocialItem icon={<Twitter className="text-black" />} label="Twitter" color="#000000" />
                  <SocialItem icon={<Linkedin className="text-blue-700" />} label="LinkedIn" color="#0A66C2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SocialItem({ icon, label, color }) {
  return (
    <div className="flex flex-col items-center gap-2 group cursor-pointer text-center">
      <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 transition-all group-hover:shadow-md group-hover:-translate-y-1`}>
        <div className="scale-125">
          {icon}
        </div>
      </div>
      <span className="text-[10px] sm:text-[11px] text-gray-600 font-medium px-1 line-clamp-2 leading-tight h-7">{label}</span>
    </div>
  )
}