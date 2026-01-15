'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  Users,
  ArrowLeft,
  Fuel,
  Settings,
  Car,
  Calendar,
  CreditCard,
  Shield,
  Home,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Luggage,
  Share2,
  Heart,
  Gauge,
  History,
  Info,
  CheckCircle2,
  CircleDot,
  MessageSquare,
  Camera,
  Wind,
  Map,
  X
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CarDetailPage() {
  const params = useParams()
  const router = useRouter()
  const carSlug = params.slug

  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showStickyHeader, setShowStickyHeader] = useState(false)
  const [paymentType, setPaymentType] = useState('cash') // 'cash' or 'finance'
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('photos') // 'photos' or 'video'

  // Fetch car details by slug
  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/cars/slug/${carSlug}?public=true`)
        const data = await response.json()

        if (data.success) {
          setCar(data.car)
        } else {
          setError(data.error || 'Car not found')
        }
      } catch (error) {
        console.error('Error fetching car:', error)
        setError('Failed to load car details')
      } finally {
        setLoading(false)
      }
    }

    if (carSlug) {
      fetchCar()
    }
  }, [carSlug])

  // Handle sticky header visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowStickyHeader(true)
      } else {
        setShowStickyHeader(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const getAllImages = () => {
    const images = []
    if (car?.thumbnail_image) images.push(car.thumbnail_image)
    if (car?.gallery_images && car.gallery_images.length > 0) {
      images.push(...car.gallery_images)
    }
    return images.length > 0 ? images : ['https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&h=600&fit=crop']
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your ride...</p>
        </div>
      </div>
    )
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-sm border">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Car Not Found</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => router.back()} variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Link href="/" className="w-full">
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const images = getAllImages()
  const price = Math.round(car.price_per_day)
  const originalPrice = car.original_price ? Math.round(car.original_price) : Math.round(price * 1.1)
  const monthlyPayment = car.monthly_emi ? Math.round(car.monthly_emi) : Math.round(price * 0.4)

  return (
    <div className="min-h-screen bg-[#F0F2F5]" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      {/* Sticky Header */}
      <div className={`fixed top-0 left-0 right-0 bg-white shadow-md z-50 transition-transform duration-300 ${showStickyHeader ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{car.is_used ? 'Used' : 'New'} {car.year}</p>
              <h2 className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{car.brand} {car.model} {car.name}</h2>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-gray-500 line-through">₹{originalPrice.toLocaleString()}</p>
              <p className="text-lg font-bold text-orange-600">₹{price.toLocaleString()}</p>
            </div>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6">
              Request Info
            </Button>
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center gap-6 text-sm font-medium text-gray-600">
          <button onClick={() => router.back()} className="flex items-center gap-2 hover:text-orange-600 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </button>
          <div className="h-4 w-px bg-gray-300"></div>
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
            <span className="text-orange-600 border-b-2 border-orange-600 py-3">Overview</span>
            <span className="hover:text-orange-600 py-3 cursor-pointer">Pricing</span>
            <span className="hover:text-orange-600 py-3 cursor-pointer">Specs</span>
            <span className="hover:text-orange-600 py-3 cursor-pointer">Reviews</span>
            <span className="hover:text-orange-600 py-3 cursor-pointer">Dealer Info</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Layout Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT COLUMN (Primary Content) */}
          <div className="lg:col-span-8 space-y-6">

            {/* Image Gallery - Exact AutoTrader Style */}
            <div className="space-y-3">
              {/* Image Gallery */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-2 h-[300px] md:h-[450px] relative rounded-xl overflow-hidden group">
                {/* Main Large Image */}
                <div
                  className="md:col-span-2 relative bg-gray-100 flex items-center justify-center cursor-pointer"
                  onClick={() => setIsLightboxOpen(true)}
                >
                  <img
                    src={images[selectedImageIndex]}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-contain"
                  />

                  {/* Navigation Arrows */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1)
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0)
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight size={24} />
                  </button>

                  {/* Overlaid Action Icons */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button className="w-10 h-10 bg-white/90 hover:bg-white text-gray-900 rounded-full flex items-center justify-center shadow-lg transition-all">
                      <Share2 size={18} />
                    </button>
                    <button className="w-10 h-10 bg-white/90 hover:bg-white text-gray-900 rounded-full flex items-center justify-center shadow-lg transition-all">
                      <Heart size={18} />
                    </button>
                  </div>
                </div>

                {/* Right Stacked Images */}
                <div className="hidden md:flex flex-col gap-1 md:gap-2 h-full">
                  {/* Slot 1: index 1 */}
                  <div
                    className="flex-1 overflow-hidden relative bg-gray-100 flex items-center justify-center cursor-pointer"
                    onClick={() => setIsLightboxOpen(true)}
                  >
                    {images[1] ? (
                      <img src={images[1]} className="w-full h-full object-contain" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                        <Camera size={32} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">No Image</span>
                      </div>
                    )}
                  </div>
                  {/* Slot 2: index 2 or placeholder */}
                  <div
                    className="flex-1 overflow-hidden relative bg-gray-100 flex items-center justify-center cursor-pointer"
                    onClick={() => setIsLightboxOpen(true)}
                  >
                    {images[2] ? (
                      <>
                        <img src={images[2]} className="w-full h-full object-contain" />
                        {images.length > 3 && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/50 transition-colors">
                            <span className="text-white font-bold text-lg">+{images.length - 2} More</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400 gap-2 w-full h-full border-2 border-dashed border-gray-200">
                        <Camera size={32} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">No Image</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Gallery-wide Navigation Arrows */}
                <div className="absolute inset-y-0 -left-5 -right-5 flex items-center justify-between pointer-events-none px-4 md:px-0">
                  <button
                    onClick={() => setSelectedImageIndex(prev => (prev - 1 + images.length) % images.length)}
                    className="p-3 bg-white hover:bg-orange-50 rounded-full shadow-xl pointer-events-auto border border-gray-100 transition-all transform hover:scale-110 active:scale-95 group/btn"
                  >
                    <ChevronLeft size={24} className="text-gray-800 group-hover/btn:text-orange-600" />
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex(prev => (prev + 1) % images.length)}
                    className="p-3 bg-white hover:bg-orange-50 rounded-full shadow-xl pointer-events-auto border border-gray-100 transition-all transform hover:scale-110 active:scale-95 group/btn"
                  >
                    <ChevronRight size={24} className="text-gray-800 group-hover/btn:text-orange-600" />
                  </button>
                </div>
              </div>

              {/* Bottom Gallery Controls */}
              <div className="flex items-center gap-6 px-1">
                <button className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-orange-600 transition-colors">
                  <Camera size={18} className="text-orange-600" />
                  {images.length} Photos
                </button>
                {(car.video_url || car.video_count > 0) && (
                  <button className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-orange-600 transition-colors">
                    <div className="w-5 h-5 rounded-full border-2 border-orange-600 flex items-center justify-center">
                      <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[6px] border-l-orange-600 border-b-[3px] border-b-transparent ml-0.5"></div>
                    </div>
                    {car.video_count || (car.video_url ? 1 : 0)} Video{(car.video_count > 1) ? 's' : ''}
                  </button>
                )}
              </div>
            </div>

            {/* Vehicle Header Information */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="mb-6">
                {car.is_featured && (
                  <span className="inline-block px-3 py-1 bg-orange-50 text-orange-700 text-xs font-bold uppercase tracking-wider rounded-md mb-3">
                    Featured
                  </span>
                )}
                <h1 className="text-4xl font-extrabold text-[#1A1A1A] leading-tight">
                  {car.is_used ? 'Used' : 'New'} {car.year} {car.brand} {car.model} {car.name}
                </h1>
                <div className="flex items-center gap-4 mt-3 text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span className="text-sm font-medium">{car.location || "Location N/A"}</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <div className="flex items-center gap-1 font-bold text-orange-600">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{(car.rating || 4.8).toFixed(1)} ({(car.reviews_count || 120).toLocaleString()} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Key Highlights Row */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-10 py-8 border-y border-gray-100">
                <div className="space-y-1">
                  <Gauge className="text-orange-600 mb-2" size={24} />
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-tight">Mileage</p>
                  <p className="text-lg font-semibold text-gray-900">{(car.mileage || 0).toLocaleString()} <span className="text-xs font-medium">mi</span></p>
                </div>
                <div className="space-y-1">
                  <Fuel className="text-orange-600 mb-2" size={24} />
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-tight">Fuel Type</p>
                  <p className="text-lg font-semibold text-gray-900 capitalize">{car.fuel_type}</p>
                </div>
                <div className="space-y-1">
                  <Settings className="text-orange-600 mb-2" size={24} />
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-tight">Trans.</p>
                  <p className="text-lg font-semibold text-gray-900 capitalize">{car.transmission}</p>
                </div>
                <div className="space-y-1">
                  <CircleDot className="text-orange-600 mb-2" size={24} />
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-tight">Drive Type</p>
                  <p className="text-lg font-semibold text-gray-900 capitalize">{car.drive_type || "AWD"}</p>
                </div>
                <div className="space-y-1">
                  <Wind className="text-orange-600 mb-2" size={24} />
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-tight">AC</p>
                  <p className="text-lg font-semibold text-gray-900">{car.ac_available ? 'Available' : 'No'}</p>
                </div>
                <div className="space-y-1">
                  <Map className="text-orange-600 mb-2" size={24} />
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-tight">One Way</p>
                  <p className="text-lg font-semibold text-gray-900">{car.allow_one_way ? 'Allowed' : 'No'}</p>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 font-primary">Technical Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm">
                  {[
                    { label: "Engine", value: car.engine },
                    { label: "Exterior Color", value: car.exterior_color },
                    { label: "Interior Color", value: car.interior_color },
                    { label: "Seating", value: car.seating_capacity ? `${car.seating_capacity} Adults` : null },
                    { label: "Luggage", value: car.luggage_capacity },
                    { label: "Fuel MPG", value: car.mpg ? `${car.mpg} Combined` : (car.mpg_city ? `${car.mpg_city} City / ${car.mpg_highway} Hwy` : null) },
                    { label: "Security Deposit", value: car.security_deposit ? `₹${Math.round(car.security_deposit).toLocaleString()}` : null },
                    { label: "Fuel Policy", value: car.fuel_policy?.replace('-', ' '), class: "capitalize" },
                  ].filter(spec => spec.value).map((spec, i) => (
                    <div key={i} className="flex justify-between py-3 border-b border-gray-50">
                      <span className="text-gray-500 font-medium">{spec.label}</span>
                      <span className={`text-gray-900 font-bold ${spec.class || ''}`}>{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Consumer Reviews & Ratings */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900">{car.rating_title || "Consumer Ratings"}</h3>
                {car.rating_logo && (
                  <img src={car.rating_logo} alt="Rating Source" className="h-8 opacity-50 grayscale hover:grayscale-0 transition-all" />
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">{(car.rating || 4.8).toFixed(1)}</div>
                    <div>
                      <div className="flex text-yellow-500 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-5 w-5 ${i < Math.floor(car.rating || 4.8) ? 'fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <p className="text-sm font-bold text-gray-900">Consumer Rating</p>
                      <p className="text-xs text-gray-500">Based on {(car.reviews_count || 120).toLocaleString()} user submissions</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: "Reliability", rating: car.rating_reliability || 4.9 },
                      { label: "Comfort", rating: car.rating_comfort || 4.7 },
                      { label: "Value", rating: car.rating_value || 4.8 },
                      { label: "Performance", rating: car.rating_performance || 4.6 }
                    ].map((item, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-600">
                          <span>{item.label}</span>
                          <span>{item.rating} / 5.0</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-600 rounded-full transition-all duration-1000" style={{ width: `${(item.rating / 5) * 100}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100">
                    <div className="flex items-start gap-3 mb-4">
                      <History className="text-orange-600 mt-1" size={20} />
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">Vehicle History</h4>
                        <p className="text-xs text-gray-700 leading-relaxed mt-1">
                          {car.history_summary || `This vehicle is a ${car.is_certified ? 'Certified Pre-Owned' : 'verified'} car with ${car.previous_owners || 'limited'} previous owner(s) and zero reported accidents. Fully serviced and inspected by authorized technicians.`}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full bg-white border-orange-200 text-orange-700 hover:bg-orange-50 font-bold text-xs h-9">
                      {car.carfax_available ? 'View Free Carfax Report' : 'Request Vehicle History'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {car.premium_features?.length > 0 && (
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Premium Features</h3>
                <div className="flex flex-wrap gap-3">
                  {car.premium_features.map((feature, i) => (
                    <span key={i} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-green-600" />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN (Sidebar) */}
          <div className="lg:col-span-4 space-y-6">

            {/* Pricing Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-1 bg-gray-50 border-b flex">
                <button
                  onClick={() => setPaymentType('finance')}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-all ${paymentType === 'finance' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Finance
                </button>
                <button
                  onClick={() => setPaymentType('cash')}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-all ${paymentType === 'cash' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Cash
                </button>
              </div>

              <div className="p-8">
                {car.price_status && (
                  <div className="flex items-center gap-2 text-green-700 font-bold text-sm mb-4">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={12} />
                    </div>
                    {car.price_status}
                  </div>
                )}

                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-gray-900 tracking-tight">
                      ₹{paymentType === 'cash' ? price.toLocaleString() : (car.monthly_emi || monthlyPayment).toLocaleString()}
                    </span>
                    {paymentType === 'finance' && <span className="text-gray-500 font-bold text-lg">/mo</span>}
                  </div>
                  <p className="text-xs text-gray-500 font-medium mt-1">₹{car.down_payment || 0} down payment for well-qualified buyers</p>
                </div>

                <div className="space-y-4">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-6 text-lg font-black shadow-xl h-14 uppercase tracking-wider">
                    Reserve Now
                  </Button>
                  <Button variant="outline" className="w-full border-orange-600 text-orange-600 py-6 text-sm font-bold h-12">
                    Explore Financing
                  </Button>
                </div>

                {car.booking_benefits?.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                    {car.booking_benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-600 font-bold">
                        <CheckCircle2 size={14} className="text-green-600" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-[#FAFBFB] p-4 text-center">
                <button className="text-xs font-bold text-orange-600 hover:underline">Calculate My Monthly Payment</button>
              </div>
            </div>

            {/* Sticky Sidebar Container */}
            <div className="sticky top-24 space-y-6 self-start">
              {/* Dealer Contact Card */}
              <div className="bg-[#1A1A1A] rounded-xl p-8 shadow-sm text-white">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-1">Contact Dealer</h4>
                    <p className="text-lg font-bold">{car.dealer_name || "Premium Rental Motors"}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <MapPin className="text-white" />
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {car.dealer_phone && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <Phone size={16} className="text-orange-400" />
                      </div>
                      <p className="text-sm font-bold text-white tracking-widest">{car.dealer_phone}</p>
                    </div>
                  )}
                  {car.dealer_email && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <Mail size={16} className="text-orange-400" />
                      </div>
                      <p className="text-sm font-medium text-white/80">{car.dealer_email}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full bg-white/10 border-white/20 rounded-lg px-4 py-3 text-sm focus:bg-white focus:text-gray-900 transition-all placeholder:text-white/40 outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full bg-white/10 border-white/20 rounded-lg px-4 py-3 text-sm focus:bg-white focus:text-gray-900 transition-all placeholder:text-white/40 outline-none"
                  />
                  <textarea
                    rows="3"
                    placeholder="Message the dealer..."
                    className="w-full bg-white/10 border-white/20 rounded-lg px-4 py-3 text-sm focus:bg-white focus:text-gray-900 transition-all placeholder:text-white/40 outline-none resize-none"
                  ></textarea>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4 uppercase tracking-widest mt-2 h-12">
                    Request Info
                  </Button>
                </div>
              </div>

              {/* Cancellation Policy Box */}
              <div className="bg-orange-50 rounded-xl p-5 border border-orange-100 flex items-start gap-3">
                <div className="mt-1 shrink-0">
                  <Shield size={20} className="text-orange-600" />
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-bold text-orange-900">Cancellation Policy</h5>
                  <p className="text-xs text-orange-800 leading-relaxed mt-1">
                    {car.cancellation_policy || "Free cancellation up to 24 hours before your scheduled pick-up time. For cancellations within 24 hours, a small fee may apply based on the duration of your booking."}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Footer-like Bottom Banner */}
      <div className="bg-white border-t mt-12 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {(car.footer_banners || [
            { icon: 'shield', title: 'Buyer Protection', description: 'Every vehicle is inspected and comes with a 12-month secure purchase guarantee.' },
            { icon: 'message', title: 'Expert Support', description: 'Our concierge team is available 24/7 to help you with the buying process.' },
            { icon: 'calendar', title: 'Easy Scheduling', description: 'Book test drives and inspections directly through our digitized portal.' }
          ]).map((banner, i) => {
            const Icon = {
              shield: Shield,
              message: MessageSquare,
              calendar: Calendar
            }[banner.icon] || Shield

            return (
              <div key={i} className="space-y-3">
                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="text-orange-600" size={32} />
                </div>
                <h4 className="font-bold text-gray-900">{banner.title}</h4>
                <p className="text-sm text-gray-500 px-8">{banner.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div
            className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-gray-100">
              <div>
                <h3 className="font-primary font-bold text-gray-900 leading-tight">
                  {car?.is_used ? 'Used' : 'New'} {car?.year} {car?.brand} {car.name} — ₹{price.toLocaleString()}
                </h3>
              </div>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-all group"
              >
                <X size={20} className="text-gray-500 group-hover:text-gray-900 transition-colors" />
              </button>
            </div>

            {/* Controls Bar */}
            <div className="px-6 py-2 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-10">
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveTab('photos')}
                  className={`py-3 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'photos' ? 'text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Photos
                  {activeTab === 'photos' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-600 rounded-full" />}
                </button>
                <button
                  onClick={() => setActiveTab('video')}
                  className={`py-3 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'video' ? 'text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Video
                  {activeTab === 'video' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-600 rounded-full" />}
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:block text-right">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Est. Payment</span>
                  <span className="block text-sm font-black text-orange-600">₹{(car.monthly_emi || monthlyPayment).toLocaleString()}/mo*</span>
                </div>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-black px-6 h-10 uppercase tracking-widest">
                  Request Info
                </Button>
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4 md:p-8 custom-scrollbar">
              <div className="max-w-2xl mx-auto space-y-6">
                {activeTab === 'photos' ? (
                  <>
                    {images.map((img, i) => (
                      <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 animate-in slide-in-from-bottom-4 duration-500 delay-[50ms]">
                        <img
                          src={img}
                          className="w-full h-auto object-contain rounded-md"
                          alt={`Gallery image ${i + 1}`}
                        />
                      </div>
                    ))}
                    <div className="py-8 text-center">
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">End of Photos</p>
                    </div>
                  </>
                ) : (
                  <div className="aspect-video bg-black rounded-xl flex items-center justify-center text-white shadow-xl overflow-hidden ring-1 ring-white/10">
                    {car.video_url ? (
                      <iframe
                        src={car.video_url}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    ) : (
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                          <Camera size={32} className="text-gray-500" />
                        </div>
                        <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">No Video Available</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
