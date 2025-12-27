"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

export default function Hero() {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    { name: "Saudi Arabia", flag: "🇸🇦" }
  ];

  const handleLocationSelect = (country) => {
    setSelectedLocation(country);
    setCurrentStep(2);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setCurrentStep(3);
  };

  const handlePassengerDone = () => {
    setIsDialogOpen(false);
    setCurrentStep(1);
  };

  const openDialog = (step) => {
    setCurrentStep(step);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl font-bold tracking-tight text-gray-900 lg:text-6xl leading-tight">
                  Lets Plan Your
                  <br />
                  Perfect <span className="text-orange-600">Journey</span>
                </h1>
                <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                  Plan and book your perfect trip with expert advice, travel tips, destination 
                  information and inspiration from us.
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full font-medium">
                  Discover Now
                </Button>
              </div>
            </div>

            {/* Right Content - Animated Cards */}
            <div className="relative h-96 w-full">
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-orange-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute top-1/2 -left-8 w-16 h-16 bg-blue-400 rounded-full opacity-20 animate-bounce"></div>
              
              {/* Airplane Icon */}
              <div className="absolute -top-8 right-1/4 text-orange-500 animate-pulse">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                </svg>
              </div>

              {/* Travel Cards - Overlapping Stacked Layout */}
              <div className="relative h-full flex items-center justify-center">
                {/* Left Card - Arc de Triomphe (Behind, rotated slightly) */}
                <Card className="absolute left-8 top-12 group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-white/95 backdrop-blur-sm border-0 shadow-lg overflow-hidden w-44 h-72 rounded-3xl transform -rotate-12 z-0">
                  <CardContent className="p-0 h-full">
                    <div className="relative h-full overflow-hidden rounded-3xl">
                      <div className="absolute inset-0 bg-gradient-to-b from-amber-200 to-orange-300"></div>
                      <div className="absolute inset-0 bg-black/5"></div>
                      <div className="absolute bottom-6 left-4 text-white">
                        <h3 className="text-sm font-bold drop-shadow-md">Paris</h3>
                        <p className="text-xs opacity-90 drop-shadow-md">Arc de Triomphe</p>
                      </div>
                      <div className="absolute top-4 right-4 w-6 h-6 bg-white/30 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Center Card - Rome Colosseum (Front and center, largest) */}
                <Card className="absolute left-1/2 transform -translate-x-1/2 top-4 group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white/95 backdrop-blur-sm border-0 shadow-2xl overflow-hidden w-52 h-80 rounded-3xl z-20">
                  <CardContent className="p-0 h-full">
                    <div className="relative h-full overflow-hidden rounded-3xl">
                      <div className="absolute inset-0 bg-gradient-to-b from-sky-200 to-blue-400"></div>
                      <div className="absolute inset-0 bg-black/5"></div>
                      <div className="absolute bottom-6 left-4 text-white">
                        <h3 className="text-lg font-bold drop-shadow-md">Rome</h3>
                        <p className="text-sm opacity-90 drop-shadow-md">Colosseum</p>
                      </div>
                      <div className="absolute top-4 right-4 w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Right Card - Eiffel Tower (Behind, rotated slightly) */}
                <Card className="absolute right-8 top-20 group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-white/95 backdrop-blur-sm border-0 shadow-lg overflow-hidden w-44 h-72 rounded-3xl transform rotate-12 z-10">
                  <CardContent className="p-0 h-full">
                    <div className="relative h-full overflow-hidden rounded-3xl">
                      <div className="absolute inset-0 bg-gradient-to-b from-emerald-200 to-teal-400"></div>
                      <div className="absolute inset-0 bg-black/5"></div>
                      <div className="absolute bottom-6 left-4 text-white">
                        <h3 className="text-sm font-bold drop-shadow-md">Paris</h3>
                        <p className="text-xs opacity-90 drop-shadow-md">Eiffel Tower</p>
                      </div>
                      <div className="absolute top-4 right-4 w-6 h-6 bg-white/30 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Floating Action Button */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer z-20">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>

              {/* Play Button */}
              <div className="absolute top-4 right-8 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer animate-pulse">
                <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 5v10l7-5z"/>
                </svg>
              </div>

              {/* Decorative Dotted Lines */}
              <div className="absolute top-1/4 right-1/4 w-32 h-32 opacity-30">
                <svg viewBox="0 0 100 100" className="w-full h-full text-orange-400">
                  <defs>
                    <pattern id="dots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                      <circle cx="5" cy="5" r="1" fill="currentColor"/>
                    </pattern>
                  </defs>
                  <path d="M20,20 Q50,10 80,40 Q70,70 40,80" stroke="url(#dots)" strokeWidth="2" fill="none" className="animate-pulse"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form Cards */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-8">
          <div className="relative">
            {/* Decorative Elements */}
            <div className="absolute -top-8 left-8 w-12 h-12 bg-pink-400 rounded-full opacity-60"></div>
            <div className="absolute -bottom-4 right-12 w-8 h-8 bg-pink-300 rounded-full opacity-50"></div>
            
            {/* Booking Form Container */}
            <div className="bg-white/75 backdrop-blur-lg border-0 shadow-xl rounded-3xl overflow-hidden">
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                  {/* Location Card */}
                  <div 
                    className="space-y-2 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                    onClick={() => openDialog(1)}
                  >
                    <label className="text-gray-900 font-semibold text-lg">Location</label>
                    <div className="flex items-center text-gray-500">
                      <span>{selectedLocation || "Where are you going?"}</span>
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Date Card */}
                  <div 
                    className="space-y-2 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                    onClick={() => openDialog(2)}
                  >
                    <label className="text-gray-900 font-semibold text-lg">Date</label>
                    <div className="flex items-center text-gray-500">
                      <span>{selectedDate || "When will you travel?"}</span>
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* People Card */}
                  <div 
                    className="space-y-2 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                    onClick={() => openDialog(3)}
                  >
                    <label className="text-gray-900 font-semibold text-lg">People</label>
                    <div className="flex items-center text-gray-500">
                      <span>
                        {adults + children > 0 
                          ? `${adults} Adult${adults > 1 ? 's' : ''}, ${children} Child${children !== 1 ? 'ren' : ''}`
                          : "How many people?"
                        }
                      </span>
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Search Button */}
                  <div className="flex justify-center md:justify-end">
                    <Button className="bg-gray-900 hover:bg-gray-800 text-white w-14 h-14 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </Button>
                  </div>
                </div>

                {/* Multi-Step Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogContent className="sm:max-w-2xl">
                    {/* Step 1: Location Selector */}
                    {currentStep === 1 && (
                      <>
                        <DialogHeader>
                          <DialogTitle>Select Location</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-4 gap-4 py-6">
                          {countries.map((country) => (
                            <div
                              key={country.name}
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                              onClick={() => handleLocationSelect(country.name)}
                            >
                              <span className="text-2xl">{country.flag}</span>
                              <span className="text-sm font-medium">{country.name}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-end gap-3">
                          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button className="bg-blue-500 hover:bg-blue-600">
                            Select
                          </Button>
                        </div>
                      </>
                    )}

                    {/* Step 2: Date Selector */}
                    {currentStep === 2 && (
                      <>
                        <DialogHeader>
                          <DialogTitle>Select date</DialogTitle>
                        </DialogHeader>
                        <div className="py-6">
                          <div className="flex items-center justify-between mb-6">
                            <Button variant="ghost" size="sm">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </Button>
                            <div className="flex gap-8">
                              <span className="font-semibold">November</span>
                              <span className="font-semibold">December</span>
                              <span className="font-semibold">January</span>
                            </div>
                            <Button variant="ghost" size="sm">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-7 gap-2 text-center text-sm mb-4">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                              <div key={day} className="p-2 text-gray-500 font-medium">{day}</div>
                            ))}
                          </div>
                          
                          <div className="grid grid-cols-7 gap-2 text-center">
                            {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                              <button
                                key={day}
                                className={`p-2 rounded-lg hover:bg-blue-100 transition-colors ${
                                  day === 7 ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                                }`}
                                onClick={() => handleDateSelect(`2024-12-${day.toString().padStart(2, '0')}`)}
                              >
                                {day}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-end gap-3">
                          <Button variant="outline" onClick={() => setCurrentStep(1)}>
                            Cancel
                          </Button>
                          <Button className="bg-blue-500 hover:bg-blue-600">
                            Select
                          </Button>
                        </div>
                      </>
                    )}

                    {/* Step 3: Passenger Selector */}
                    {currentStep === 3 && (
                      <>
                        <DialogHeader>
                          <DialogTitle>Number of passengers</DialogTitle>
                        </DialogHeader>
                        <div className="py-8 space-y-8">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xl font-semibold">Adults</div>
                              <div className="text-gray-500">aged 16+</div>
                            </div>
                            <div className="flex items-center gap-4">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-10 h-10 rounded-lg"
                                onClick={() => setAdults(Math.max(1, adults - 1))}
                                disabled={adults <= 1}
                              >
                                -
                              </Button>
                              <span className="text-xl font-semibold w-8 text-center">{adults}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-10 h-10 rounded-lg"
                                onClick={() => setAdults(adults + 1)}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xl font-semibold">Children</div>
                              <div className="text-gray-500">Aged 0 to 15</div>
                            </div>
                            <div className="flex items-center gap-4">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-10 h-10 rounded-lg"
                                onClick={() => setChildren(Math.max(0, children - 1))}
                                disabled={children <= 0}
                              >
                                -
                              </Button>
                              <span className="text-xl font-semibold w-8 text-center">{children}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-10 h-10 rounded-lg"
                                onClick={() => setChildren(children + 1)}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                          
                          <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                            Your age at the time of travel must be valid for the age category booked. 
                            Airlines have restrictions on people under the age of 18 traveling alone.
                          </div>
                        </div>
                        <div className="flex justify-end gap-3">
                          <Button variant="outline" onClick={() => setCurrentStep(2)}>
                            Cancel
                          </Button>
                          <Button className="bg-blue-500 hover:bg-blue-600" onClick={handlePassengerDone}>
                            Done
                          </Button>
                        </div>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}