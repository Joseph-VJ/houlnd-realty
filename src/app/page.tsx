import Link from 'next/link'
import { Search, Shield, IndianRupee, Users, ArrowRight, CheckCircle } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6">
              Find Your Dream Property
              <span className="text-primary-600"> Zero Brokerage</span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8 max-w-2xl mx-auto">
              Connect directly with property owners. No middlemen, no hidden fees.
              Transparent pricing with our unique Sq.ft price filter.
            </p>

            {/* Quick Search */}
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm text-secondary-600 mb-1 text-left">
                    Property Type
                  </label>
                  <select className="input-field">
                    <option>All Types</option>
                    <option>Apartment</option>
                    <option>Plot</option>
                    <option>Villa</option>
                    <option>Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-secondary-600 mb-1 text-left">
                    City
                  </label>
                  <select className="input-field">
                    <option>All Cities</option>
                    <option>Bangalore</option>
                    <option>Mumbai</option>
                    <option>Delhi</option>
                    <option>Chennai</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-secondary-600 mb-1 text-left">
                    Price per Sq.ft
                  </label>
                  <select className="input-field">
                    <option>Any</option>
                    <option>₹999 - ₹2,999</option>
                    <option>₹3,000 - ₹5,999</option>
                    <option>₹6,000 - ₹9,999</option>
                    <option>₹10,000 - ₹19,999</option>
                    <option>₹20,000+</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Link
                    href="/properties"
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <Search className="h-5 w-5" />
                    Search
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* USP Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Why Choose Houlnd Realty?</h2>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              We&apos;re disrupting the traditional real estate market with transparency,
              trust, and technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Zero Brokerage */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <IndianRupee className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Zero Brokerage
              </h3>
              <p className="text-secondary-600">
                Save up to 20% by connecting directly with property owners.
                No middlemen, no hidden fees.
              </p>
            </div>

            {/* Verified Listings */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Verified Listings
              </h3>
              <p className="text-secondary-600">
                All properties are verified. No fake or litigated listings.
                100% authentic and trustworthy.
              </p>
            </div>

            {/* Sq.ft Price Filter */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Sq.ft Price Filter
              </h3>
              <p className="text-secondary-600">
                Compare properties easily with our unique price per square foot
                filter. Make informed decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Search Properties',
                description: 'Use our Sq.ft price filter to find properties that match your budget.',
              },
              {
                step: '02',
                title: 'Shortlist Favorites',
                description: 'Save properties you like to your shortlist for easy comparison.',
              },
              {
                step: '03',
                title: 'Unlock Contact',
                description: 'Pay a small fee to unlock seller contact details.',
              },
              {
                step: '04',
                title: 'Schedule Visit',
                description: 'Book an appointment and visit the property directly.',
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <span className="text-4xl font-bold text-primary-100">
                    {item.step}
                  </span>
                  <h3 className="text-lg font-semibold text-secondary-900 mt-2 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-secondary-600 text-sm">{item.description}</p>
                </div>
                {index < 3 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 h-8 w-8 text-primary-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Sellers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title mb-6">
                Are You a Property Owner?
              </h2>
              <p className="text-secondary-600 mb-6">
                List your property for FREE and pay only when you sell.
                Get verified buyer leads directly without any brokerage.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Free property listing',
                  'Pay commission only on successful sale',
                  'Verified and serious buyer leads',
                  'Direct buyer connection - no middlemen',
                  'Full control over your listing',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary-600" />
                    <span className="text-secondary-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register?role=PROMOTER"
                className="btn-primary inline-flex items-center gap-2"
              >
                Register as Promoter
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl p-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                  Commission Structure
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-secondary-600">Listing Fee</span>
                    <span className="text-2xl font-bold text-primary-600">FREE</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-secondary-600">Commission on Sale</span>
                    <span className="text-xl font-semibold text-secondary-900">2%</span>
                  </div>
                </div>
                <p className="text-sm text-secondary-500 mt-4">
                  * Commission is charged only when your property is successfully sold
                  through our platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers who found their perfect property
            through Houlnd Realty.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/properties"
              className="bg-white text-primary-600 hover:bg-primary-50 font-medium py-3 px-8 rounded-lg transition-colors"
            >
              Browse Properties
            </Link>
            <Link
              href="/register"
              className="border-2 border-white text-white hover:bg-white/10 font-medium py-3 px-8 rounded-lg transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
