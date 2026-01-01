"use client"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

export default function AdvertisementBanner() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Card className="border-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-2xl rounded-3xl overflow-hidden group">
            <CardContent className="p-0 relative">
              <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[300px]">
                {/* Left Content */}
                <div className="p-8 lg:p-12 flex flex-col justify-center text-white relative z-10">
                  <motion.div
                    className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 w-fit"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Special Offer
                  </motion.div>
                  
                  <motion.h2
                    className="text-3xl lg:text-4xl font-bold mb-4 leading-tight"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    Save 40% on
                    <br />
                    <span className="text-yellow-300">Dream Destinations</span>
                  </motion.h2>
                  
                  <motion.p
                    className="text-lg opacity-90 mb-8 leading-relaxed"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    Limited time offer on premium travel packages. Book your next adventure with exclusive discounts.
                  </motion.p>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                  >
                    <motion.button
                      className="inline-flex items-center gap-3 bg-white text-purple-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Book Now
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </motion.button>
                  </motion.div>
                </div>
                
                {/* Right Image */}
                <div className="relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&crop=center"
                    alt="Beautiful tropical destination"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-purple-600/20 to-purple-600/40" />
                  
                  {/* Floating discount badge */}
                  <motion.div
                    className="absolute top-8 right-8 bg-yellow-400 text-purple-900 px-6 py-3 rounded-2xl font-bold text-xl shadow-lg"
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  >
                    40% OFF
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