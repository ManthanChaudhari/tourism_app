export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-xl text-gray-300">
            Last updated: January 2, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          
          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to BookingAdventures. These Terms and Conditions ("Terms") govern your use of our website 
              and services. By accessing or using our services, you agree to be bound by these Terms.
            </p>
            <p className="text-gray-700 leading-relaxed">
              If you do not agree with any part of these Terms, you may not access or use our services.
            </p>
          </section>

          {/* Definitions */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Definitions</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-700 leading-relaxed">
                  <strong>"Company"</strong> refers to BookingAdventures, the provider of travel booking services.
                </p>
              </div>
              <div>
                <p className="text-gray-700 leading-relaxed">
                  <strong>"Services"</strong> refers to all travel-related services, bookings, and content provided through our platform.
                </p>
              </div>
              <div>
                <p className="text-gray-700 leading-relaxed">
                  <strong>"User"</strong> refers to any individual who accesses or uses our services.
                </p>
              </div>
            </div>
          </section>

          {/* Booking Terms */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Booking Terms</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">3.1 Reservations</h3>
                <p className="text-gray-700 leading-relaxed">
                  All bookings are subject to availability and confirmation. A booking is only confirmed when you receive 
                  a confirmation email from us with your booking details.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">3.2 Payment</h3>
                <p className="text-gray-700 leading-relaxed">
                  Full payment is required at the time of booking unless otherwise specified. We accept major credit cards 
                  and other payment methods as indicated on our website.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">3.3 Pricing</h3>
                <p className="text-gray-700 leading-relaxed">
                  All prices are displayed in USD and include applicable taxes unless otherwise stated. Prices are subject 
                  to change without notice until booking is confirmed.
                </p>
              </div>
            </div>
          </section>

          {/* Cancellation Policy */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Cancellation & Refund Policy</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">4.1 Cancellation by Customer</h3>
                <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
                  <li>Cancellations made 30+ days before departure: Full refund minus processing fee</li>
                  <li>Cancellations made 15-29 days before departure: 50% refund</li>
                  <li>Cancellations made less than 15 days before departure: No refund</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">4.2 Cancellation by Company</h3>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to cancel any booking due to circumstances beyond our control. In such cases, 
                  we will provide a full refund or offer alternative arrangements.
                </p>
              </div>
            </div>
          </section>

          {/* User Responsibilities */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">5. User Responsibilities</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                As a user of our services, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
                <li>Provide accurate and complete information when making bookings</li>
                <li>Ensure you have valid travel documents (passport, visa, etc.)</li>
                <li>Comply with all local laws and regulations at your destination</li>
                <li>Behave respectfully towards other travelers and service providers</li>
                <li>Follow safety guidelines and instructions provided by tour guides</li>
              </ul>
            </div>
          </section>

          {/* Liability */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Limitation of Liability</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                BookingAdventures acts as an intermediary between customers and service providers. We are not liable for:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
                <li>Acts or omissions of third-party service providers</li>
                <li>Natural disasters, weather conditions, or force majeure events</li>
                <li>Personal injury, illness, or loss of personal property</li>
                <li>Flight delays, cancellations, or schedule changes</li>
                <li>Political instability or security issues at destinations</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                We strongly recommend purchasing comprehensive travel insurance to protect against unforeseen circumstances.
              </p>
            </div>
          </section>

          {/* Privacy */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Privacy & Data Protection</h2>
            <p className="text-gray-700 leading-relaxed">
              We are committed to protecting your privacy and personal information. Our collection, use, and protection 
              of your data is governed by our Privacy Policy, which forms part of these Terms.
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              All content on our website, including text, images, logos, and software, is the property of BookingAdventures 
              or our licensors and is protected by copyright and other intellectual property laws.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting 
              on our website. Your continued use of our services after changes are posted constitutes acceptance of the 
              modified Terms.
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">10. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms are governed by and construed in accordance with the laws of the jurisdiction in which 
              BookingAdventures operates, without regard to conflict of law principles.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">11. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about these Terms & Conditions, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> legal@bookingadventures.com</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p><strong>Address:</strong> 123 Adventure Street, Travel City, TC 12345</p>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* Bottom Notice */}
      <div className="bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            By using BookingAdventures services, you acknowledge that you have read, understood, 
            and agree to be bound by these Terms & Conditions.
          </p>
        </div>
      </div>
    </div>
  )
}