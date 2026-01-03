"use client"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

export default function AdvertisementBanner() {
  return (
    <section className="py-16 bg-gray-50/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Card className="border border-gray-200/50 bg-white shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-0 relative">
              <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[400px]">
                {/* Left Image - Main Focus */}
                <div className="lg:col-span-3 relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=800&fit=crop&crop=center"
                    alt="Serene mountain lake destination"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />
                  
                  {/* Very subtle offer badge */}
                  <motion.div
                    className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1.5 rounded-md font-medium text-xs shadow-sm border border-gray-200/30"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    Premium Packages
                  </motion.div>
                </div>
                
                {/* Right Content */}
                <div className="lg:col-span-2 p-6 lg:p-8 flex flex-col justify-center bg-white relative">
                  <motion.div
                    className="mb-5"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <div className="inline-flex items-center gap-2 text-orange-600/80 text-xs font-medium mb-3 uppercase tracking-wide">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Curated Travel
                    </div>
                    
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight max-w-xs">
                      Discover Your Next
                      <br />
                      <span className="text-orange-500">Adventure</span>
                    </h2>
                  </motion.div>
                  
                  <motion.p
                    className="text-gray-600 mb-6 leading-relaxed text-sm max-w-sm"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    Explore handpicked destinations and create unforgettable memories with expertly crafted travel experiences.
                  </motion.p>
                  
                  <motion.div
                    className="space-y-3 mb-6"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    {/* Refined benefits */}
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <svg className="w-3 h-3 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Expert guides & premium stays
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <svg className="w-3 h-3 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Flexible booking & 24/7 support
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <svg className="w-3 h-3 text-orange-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <span>Special rates on select journeys</span>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    <motion.button
                      className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm shadow-sm hover:shadow-md transition-all duration-200"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Explore Packages
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}