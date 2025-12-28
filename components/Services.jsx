import { Card, CardContent } from "@/components/ui/card";

export default function Services() {
  const services = [
    {
      id: 1,
      title: "Weather Forecast",
      description: "Built Wicket Longer Admire Do Barton Vanity Itself Do In It.",
      icon: (
        <svg className="w-16 h-16 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1} style={{ color: '#8c8c8c' }}>
          {/* Umbrella */}
          <path d="M12 2C8 2 5 5 5 9c0 0 0 1 0 1h14s0-1 0-1c0-4-3-7-7-7z"/>
          <path d="M12 10v10"/>
          <path d="M10 20h4"/>
          {/* Luggage */}
          <rect x="7" y="15" width="3" height="4" rx="0.5"/>
          <rect x="14" y="15" width="3" height="4" rx="0.5"/>
          <path d="M7 17h3M14 17h3"/>
        </svg>
      )
    },
    {
      id: 2,
      title: "Flight Booking",
      description: "Engrossed Listening Park Gate Sell They West Hard For The.",
      icon: (
        <svg className="w-16 h-16 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1} style={{ color: '#8c8c8c' }}>
          {/* Airplane body */}
          <path d="M3 12h7l3-8h2l-2 8h6l2-3h1l-1 3 1 3h-1l-2-3h-6l2 8h-2l-3-8H3z"/>
          {/* Wing details */}
          <path d="M10 8l2 4M16 10l2 2M16 14l2-2"/>
        </svg>
      )
    },
    {
      id: 3,
      title: "Event Planning",
      description: "Barton Vanity Itself Do In It. Preferd To Men It Engrossed Listening.",
      icon: (
        <svg className="w-16 h-16 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1} style={{ color: '#8c8c8c' }}>
          {/* Calendar */}
          <rect x="3" y="4" width="18" height="16" rx="2"/>
          <path d="M8 2v4M16 2v4M3 10h18"/>
          {/* Event dots */}
          <circle cx="8" cy="14" r="1" fill="currentColor"/>
          <circle cx="12" cy="14" r="1" fill="currentColor"/>
          <circle cx="16" cy="17" r="1" fill="currentColor"/>
        </svg>
      )
    },
    {
      id: 4,
      title: "Custom Tours",
      description: "We Deliver Outsourced Aviation Services For.",
      icon: (
        <svg className="w-16 h-16 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1} style={{ color: '#8c8c8c' }}>
          {/* Map pin */}
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
          {/* Route lines */}
          <path d="M5 5l3 3M19 5l-3 3M5 19l3-3M19 19l-3-3"/>
        </svg>
      )
    }
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Subtle Map Texture Background */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none">
          <defs>
            <pattern id="mapPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="currentColor"/>
              <circle cx="80" cy="40" r="1" fill="currentColor"/>
              <circle cx="50" cy="70" r="1" fill="currentColor"/>
              <path d="M10,10 Q30,5 50,15 T90,20" stroke="currentColor" strokeWidth="0.5" fill="none"/>
              <path d="M20,80 Q40,75 60,85 T100,90" stroke="currentColor" strokeWidth="0.5" fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mapPattern)" className="text-gray-400"/>
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-px bg-orange-400"></div>
            <span className="text-orange-600 font-medium text-lg">What We Offer</span>
            <div className="w-16 h-px bg-orange-400"></div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 lg:text-5xl">
            We Offer The Best Service
          </h2>
        </div>

        {/* Feature Cards in One Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Card
              key={service.id}
              className="group cursor-pointer transition-all duration-300 hover:shadow-lg bg-white border border-gray-100 overflow-hidden shadow-sm hover:-translate-y-1"
              style={{
                borderRadius: '30px',
              }}
            >
              <CardContent className="p-6" style={{ borderRadius: '30px' }}>
                <div 
                  className="flex flex-col items-center text-center space-y-4 transition-all duration-300 p-6 -m-6 group-hover:text-white"
                  style={{
                    borderRadius: '30px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#eb911f';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {/* Icon Section */}
                  <div className="w-20 h-20 flex items-center justify-center transition-colors duration-300">
                    {service.icon}
                  </div>
                  
                  {/* Content Section */}
                  <div className="flex flex-col space-y-3">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-white transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 group-hover:text-white/90 leading-relaxed text-sm transition-colors duration-300">
                      {service.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <button 
            className="text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            style={{
              backgroundColor: '#eb911f',
              borderRadius: '30px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#d4820e';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#eb911f';
            }}
          >
            Explore All Services
          </button>
        </div>
      </div>
    </section>
  );
}