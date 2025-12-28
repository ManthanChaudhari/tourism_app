import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Destinations() {
  const destinations = [
    {
      id: 1,
      title: "Dubai - United Arab Emirates",
      duration: "5 Days - 4 Nights",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop",
      location: "Dubai - United Arab Emirates",
      price: "$1,299"
    },
    {
      id: 2,
      title: "Best Of Switzerland Package",
      duration: "6 Days - 5 Nights",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      location: "Switzerland",
      price: "$1,899"
    },
    {
      id: 3,
      title: "Best Of London Package",
      duration: "4 Days - 3 Nights",
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop",
      location: "London - United Kingdom",
      price: "$999"
    },
    {
      id: 4,
      title: "Best Of Africa Package",
      duration: "7 Days - 6 Nights",
      image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=300&fit=crop",
      location: "Africa - Safari Experience",
      price: "$2,199"
    },
    {
      id: 5,
      title: "Asia Tours",
      duration: "8 Days - 7 Nights",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      location: "Asia - Multi Country",
      price: "$1,599"
    },
    {
      id: 6,
      title: "Best Of Sweden Package",
      duration: "5 Days - 4 Nights",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
      location: "Sweden - Scandinavia",
      price: "$1,399"
    },
    {
      id: 7,
      title: "Best Of Canada Package",
      duration: "6 Days - 5 Nights",
      image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=400&h=300&fit=crop",
      location: "Canada - Natural Wonders",
      price: "$1,699"
    },
    {
      id: 8,
      title: "Best Of Hongkong Package",
      duration: "4 Days - 3 Nights",
      image: "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=400&h=300&fit=crop",
      location: "Hong Kong - City Experience",
      price: "$1,199"
    }
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none">
          <defs>
            <pattern id="destinationPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1" fill="currentColor"/>
              <circle cx="10" cy="10" r="0.5" fill="currentColor"/>
              <circle cx="50" cy="50" r="0.5" fill="currentColor"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#destinationPattern)" className="text-gray-400"/>
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {destinations.map((destination) => (
            <Card
              key={destination.id}
              className="group cursor-pointer transition-all duration-300 hover:shadow-xl bg-white border border-gray-100 overflow-hidden hover:-translate-y-2"
              style={{ borderRadius: '24px' }}
            >
              <CardContent className="p-0">
                <div className="relative">
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden" style={{ borderRadius: '24px 24px 0 0' }}>
                    <img 
                      src={destination.image} 
                      alt={destination.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    
                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-sm font-bold text-gray-900">{destination.price}</span>
                    </div>
                    
                    {/* Location Badge */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium drop-shadow-md">{destination.location}</span>
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">
                      {destination.title}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm">{destination.duration}</span>
                      </div>
                      
                      {/* Arrow Icon */}
                      <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center group-hover:bg-orange-100 transition-colors duration-300">
                        <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button 
            className="text-white px-8 py-3 rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            style={{ backgroundColor: '#eb911f', borderRadius: '30px' }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#d4820e';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#eb911f';
            }}
          >
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