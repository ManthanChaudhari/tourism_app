import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Destinations() {
  const destinations = [
    {
      id: 1,
      title: "Dubai - United Arab Emirates",
      duration: "5 Days - 4 Nights",
      image: "bg-gradient-to-br from-orange-400 to-amber-600",
      location: "Dubai - United Arab Emirates"
    },
    {
      id: 2,
      title: "Best Of Switzerland Package",
      duration: "6 Days - 5 Nights",
      image: "bg-gradient-to-br from-emerald-400 to-teal-600",
      location: "Switzerland"
    },
    {
      id: 3,
      title: "Best Of London Package",
      duration: "4 Days - 3 Nights",
      image: "bg-gradient-to-br from-purple-400 to-indigo-600",
      location: "London - United Kingdom"
    },
    {
      id: 4,
      title: "Best Of Africa Package",
      duration: "7 Days - 6 Nights",
      image: "bg-gradient-to-br from-amber-500 to-orange-700",
      location: "Africa - Safari Experience"
    },
    {
      id: 5,
      title: "Asia Tours",
      duration: "8 Days - 7 Nights",
      image: "bg-gradient-to-br from-rose-400 to-pink-600",
      location: "Asia - Multi Country"
    },
    {
      id: 6,
      title: "Best Of Sweden Package",
      duration: "5 Days - 4 Nights",
      image: "bg-gradient-to-br from-green-400 to-emerald-600",
      location: "Sweden - Scandinavia"
    },
    {
      id: 7,
      title: "Best Of Canada Package",
      duration: "6 Days - 5 Nights",
      image: "bg-gradient-to-br from-blue-400 to-cyan-600",
      location: "Canada - Natural Wonders"
    },
    {
      id: 8,
      title: "Best Of Hongkong Package",
      duration: "4 Days - 3 Nights",
      image: "bg-gradient-to-br from-violet-400 to-purple-600",
      location: "Hong Kong - City Experience"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50/30 via-white to-blue-50/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-px bg-orange-400"></div>
            <span className="text-orange-600 font-medium text-lg">Top Destination</span>
            <div className="w-16 h-px bg-orange-400"></div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 lg:text-5xl">
            Discover The Tours & Travels From
            <br />
            <span className="text-orange-600">BookingAdventures</span>
          </h2>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {destinations.map((destination) => (
            <Card
              key={destination.id}
              className="group cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-xl border-0 bg-white/95 backdrop-blur-sm shadow-lg rounded-3xl overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="relative h-64 overflow-hidden">
                  {/* Background Image Placeholder */}
                  <div className={`absolute inset-0 ${destination.image}`}></div>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                  
                  {/* Arrow Icon - Shows on hover for all cards */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                    <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                  
                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm opacity-90">{destination.location}</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2 drop-shadow-md">
                      {destination.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm opacity-90">{destination.duration}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-full font-medium transition-all duration-200">
            VIEW ALL DESTINATIONS
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Button>
        </div>
      </div>
    </section>
  );
}