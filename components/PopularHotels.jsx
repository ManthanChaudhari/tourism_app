'use client'

import { useState } from 'react'
import { Star, MapPin, Wifi, Car, Coffee, Utensils, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PopularHotels() {
  // Dummy hotel data
  const hotels = [
    {
      id: 1,
      name: "Grand Palace Hotel",
      location: "Mumbai, Maharashtra",
      rating: 4.8,
      reviews: 1250,
      price: 8500,
      originalPrice: 12000,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      amenities: ["Free WiFi", "Parking", "Restaurant", "Room Service"],
      discount: 29
    },
    {
      id: 2,
      name: "Seaside Resort & Spa",
      location: "Goa, India",
      rating: 4.6,
      reviews: 890,
      price: 6200,
      originalPrice: 8500,
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      amenities: ["Beach Access", "Spa", "Pool", "Free WiFi"],
      discount: 27
    },
    {
      id: 3,
      name: "Mountain View Lodge",
      location: "Manali, Himachal Pradesh",
      rating: 4.7,
      reviews: 650,
      price: 4500,
      originalPrice: 6000,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      amenities: ["Mountain View", "Heating", "Restaurant", "Parking"],
      discount: 25
    },
    {
      id: 4,
      name: "Heritage Palace",
      location: "Jaipur, Rajasthan",
      rating: 4.9,
      reviews: 1580,
      price: 9800,
      originalPrice: 14000,
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      amenities: ["Heritage Property", "Pool", "Spa", "Fine Dining"],
      discount: 30
    },
    {
      id: 5,
      name: "Lake View Resort",
      location: "Udaipur, Rajasthan",
      rating: 4.5,
      reviews: 720,
      price: 7200,
      originalPrice: 9600,
      image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      amenities: ["Lake View", "Boat Rides", "Restaurant", "Free WiFi"],
      discount: 25
    },
    {
      id: 6,
      name: "Business Hotel Central",
      location: "Delhi, India",
      rating: 4.4,
      reviews: 980,
      price: 5500,
      originalPrice: 7500,
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      amenities: ["Business Center", "Metro Access", "Gym", "Free WiFi"],
      discount: 27
    },
    {
      id: 7,
      name: "Backwater Paradise",
      location: "Alleppey, Kerala",
      rating: 4.6,
      reviews: 540,
      price: 5800,
      originalPrice: 8000,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      amenities: ["Backwater View", "Houseboat", "Ayurveda Spa", "Local Cuisine"],
      discount: 28
    },
    {
      id: 8,
      name: "Hill Station Retreat",
      location: "Shimla, Himachal Pradesh",
      rating: 4.3,
      reviews: 430,
      price: 4200,
      originalPrice: 5600,
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      amenities: ["Hill View", "Fireplace", "Local Tours", "Parking"],
      discount: 25
    },
    {
      id: 9,
      name: "Royal Beach Resort",
      location: "Kovalam, Kerala",
      rating: 4.7,
      reviews: 820,
      price: 6800,
      originalPrice: 9200,
      image: "https://images.unsplash.com/photo-1520637836862-4d197d17c90a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      amenities: ["Beach Front", "Spa", "Water Sports", "Fine Dining"],
      discount: 26
    }
  ]

  const getAmenityIcon = (amenity) => {
    if (amenity.toLowerCase().includes('wifi')) return <Wifi className="h-3 w-3" />
    if (amenity.toLowerCase().includes('parking') || amenity.toLowerCase().includes('car')) return <Car className="h-3 w-3" />
    if (amenity.toLowerCase().includes('restaurant') || amenity.toLowerCase().includes('dining') || amenity.toLowerCase().includes('cuisine')) return <Utensils className="h-3 w-3" />
    return <Coffee className="h-3 w-3" />
  }

  // Get hotels for single row display (8-9 hotels)
  const getHotelsForDisplay = () => {
    return hotels.slice(0, 9)
  }

  return (
    <>
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <section className="pb-12 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none">
            <defs>
              <pattern id="hotelPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="1" fill="currentColor" />
                <circle cx="10" cy="10" r="0.5" fill="currentColor" />
                <circle cx="50" cy="50" r="0.5" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hotelPattern)" className="text-gray-400" />
          </svg>
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          {/* Header */}
          {/* <div className="mb-6">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-16 h-px bg-orange-400"></div>
                <span className="text-orange-600 font-medium text-lg">Top Hotels</span>
                <div className="w-16 h-px bg-orange-400"></div>
              </div>
              <p className="text-gray-700 text-lg max-w-2xl mx-auto">
                Discover handpicked hotels offering exceptional comfort, luxury amenities, and unforgettable experiences across India's most sought-after destinations.
              </p>
            </div>
          </div> */}
          
          {/* Single Row Display */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Popular Hotels</h2>
            <Link href="/hotels">
              <Button
                className="text-orange-600 border-orange-600 hover:bg-orange-600 hover:text-white px-6 py-2 rounded-full font-medium transition-all duration-300 hover:shadow-lg border-2 bg-transparent"
              >
                Explore All
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </Link>
          </div>
          
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
              {getHotelsForDisplay().map((hotel) => (
                <Card key={hotel.id} className="group overflow-hidden flex-shrink-0 w-72 h-96 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <CardContent className="p-0 relative h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden flex-shrink-0">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"
                        }}
                      />
                      {/* Discount Badge */}
                      {hotel.discount && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                          -{hotel.discount}%
                        </div>
                      )}
                      {/* Rating Badge */}
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-gray-900">{hotel.rating}</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-white to-gray-50 group-hover:from-orange-50 group-hover:to-white transition-all duration-500 flex-1 flex flex-col">
                      <div className="flex-1 min-h-0">
                        <div className="flex items-center gap-2 text-gray-600 mb-3">
                          <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-3 h-3 text-orange-600" />
                          </div>
                          <span className="text-sm font-semibold truncate">{hotel.location}</span>
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300 leading-tight overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', minHeight: '2.5rem'}}>
                          {hotel.name}
                        </h3>
                        
                        {/* Amenities */}
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1">
                            {hotel.amenities.slice(0, 2).map((amenity, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs text-gray-600"
                              >
                                {getAmenityIcon(amenity)}
                                <span className="truncate">{amenity}</span>
                              </div>
                            ))}
                            {hotel.amenities.length > 2 && (
                              <div className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">
                                +{hotel.amenities.length - 2}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200 mt-auto">
                        <div className="flex items-center gap-1 text-gray-700">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.floor(hotel.rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-600">({hotel.reviews})</span>
                        </div>
                        <div className="text-right">
                          {hotel.originalPrice ? (
                            <div className="flex flex-col items-end">
                              <span className="text-xs text-gray-500 line-through">₹{hotel.originalPrice.toLocaleString()}</span>
                              <span className="text-base font-bold text-orange-600">₹{hotel.price.toLocaleString()}</span>
                            </div>
                          ) : (
                            <span className="text-base font-bold text-orange-600">₹{hotel.price.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}