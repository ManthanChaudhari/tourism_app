import { Card, CardContent } from "@/components/ui/card";

export default function Services() {
  const services = [
    {
      id: 1,
      title: "Calculated Weather",
      description: "Built Wicket Longer Admire Do Barton Vanity Itself Do In It.",
      icon: (
        <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.002 4.002 0 003 15z" />
        </svg>
      ),
      isHighlighted: false
    },
    {
      id: 2,
      title: "Best Flight",
      description: "Engrossed Listening Park Gate Sell They West Hard For The.",
      icon: (
        <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
      isHighlighted: false
    },
    {
      id: 3,
      title: "Local Events",
      description: "Barton Vanity Itself Do In It. Preferd To Men It Engrossed Listening.",
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      isHighlighted: true
    },
    {
      id: 4,
      title: "Customize Tour",
      description: "We Deliver Outsourced Aviation Services For.",
      icon: (
        <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      isHighlighted: false
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50/30 via-white to-blue-50/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-px bg-orange-400"></div>
            <span className="text-orange-600 font-medium text-lg">Who We Are</span>
            <div className="w-16 h-px bg-orange-400"></div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 lg:text-5xl">
            We Offer The Best Service
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <Card
              key={service.id}
              className={`group cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-xl border-0 ${
                service.isHighlighted
                  ? 'bg-orange-600 text-white shadow-xl'
                  : 'bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg'
              } rounded-3xl overflow-hidden`}
            >
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className={`p-4 rounded-2xl ${
                    service.isHighlighted 
                      ? 'bg-white/20 backdrop-blur-sm' 
                      : 'bg-orange-50 group-hover:bg-orange-100'
                  } transition-all duration-300`}>
                    {service.icon}
                  </div>
                </div>
                
                <h3 className={`text-xl font-bold mb-4 ${
                  service.isHighlighted ? 'text-white' : 'text-gray-900'
                }`}>
                  {service.title}
                </h3>
                
                <p className={`text-sm leading-relaxed ${
                  service.isHighlighted ? 'text-white/90' : 'text-gray-600'
                }`}>
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}