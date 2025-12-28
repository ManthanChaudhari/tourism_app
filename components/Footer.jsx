import { Button } from "@/components/ui/button";

export default function Footer() {
  const menuItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Destinations", href: "/destinations" },
    { name: "Contact", href: "/contact" }
  ];

  const socialLinks = [
    {
      name: "Facebook",
      href: "#",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      name: "Twitter",
      href: "#",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      )
    },
    {
      name: "Instagram",
      href: "#",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323C6.001 8.198 7.152 7.708 8.449 7.708s2.448.49 3.323 1.416c.875.875 1.365 2.026 1.365 3.323s-.49 2.448-1.365 3.323c-.875.807-2.026 1.218-3.323 1.218zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.875-.875-1.365-2.026-1.365-3.323s.49-2.448 1.365-3.323c.875-.926 2.026-1.416 3.323-1.416s2.448.49 3.323 1.416c.875.875 1.365 2.026 1.365 3.323s-.49 2.448-1.365 3.323z"/>
        </svg>
      )
    },
    {
      name: "LinkedIn",
      href: "#",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    }
  ];

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="w-full h-full" viewBox="0 0 1200 400" fill="none">
          <defs>
            <pattern id="footerPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="40" cy="40" r="1" fill="currentColor"/>
              <circle cx="20" cy="20" r="0.5" fill="currentColor"/>
              <circle cx="60" cy="60" r="0.5" fill="currentColor"/>
              <path d="M10,10 Q30,5 50,15 T90,20" stroke="currentColor" strokeWidth="0.3" fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footerPattern)" className="text-white"/>
        </svg>
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            
            {/* Left Side - Logo & Description */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-white">BookingAdventures</span>
              </div>
              
              <p className="text-gray-300 leading-relaxed max-w-sm">
                Plan and book your perfect trip with expert advice, travel tips, destination 
                information and inspiration from us. Your adventure starts here.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 hover:bg-orange-600 rounded-lg flex items-center justify-center transition-colors duration-300"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>

              {/* Newsletter Signup - Moved from center */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-white">Stay Updated</h4>
                <div className="flex flex-col gap-3 max-w-sm">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors duration-300"
                  />
                  <Button 
                    className="text-white px-6 py-2 font-medium transition-all duration-300 hover:shadow-lg w-full"
                    style={{ backgroundColor: '#eb911f', borderRadius: '8px' }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#d4820e';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#eb911f';
                    }}
                  >
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>

            {/* Center - Navigation Menu */}
            <div className="lg:text-center">
              <h3 className="text-lg font-bold text-white mb-6">Quick Links</h3>
              <nav className="space-y-4">
                {menuItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block text-gray-300 hover:text-orange-400 transition-colors duration-300 font-medium"
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>

            {/* Right Side - Contact & Location */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white mb-6">Contact Info</h3>
              
              {/* Location */}
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 text-orange-400 mt-1">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-300">
                    123 Travel Street, Adventure City<br />
                    New York, NY 10001<br />
                    United States
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 text-orange-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <p className="text-gray-300">+1 (555) 123-4567</p>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 text-orange-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-300">info@bookingadventures.com</p>
              </div>

              {/* Working Hours */}
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 text-orange-400 mt-1">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-300">
                    Mon - Fri: 9:00 AM - 6:00 PM<br />
                    Sat - Sun: 10:00 AM - 4:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-sm">
                © 2024 BookingAdventures. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}