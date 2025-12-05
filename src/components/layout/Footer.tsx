import Link from 'next/link'
import { Home, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-secondary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Home className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold">Houlnd Realty</span>
            </Link>
            <p className="text-secondary-400 mb-4 max-w-md">
              Zero brokerage real estate marketplace. Connect directly with property
              owners and find your dream home with transparent pricing and verified
              listings.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-secondary-400">
                <Mail className="h-4 w-4 mr-2" />
                <span>contact@houlnd.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/properties"
                  className="text-secondary-400 hover:text-white transition-colors"
                >
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?type=APARTMENT"
                  className="text-secondary-400 hover:text-white transition-colors"
                >
                  Apartments
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?type=PLOT"
                  className="text-secondary-400 hover:text-white transition-colors"
                >
                  Plots
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?type=VILLA"
                  className="text-secondary-400 hover:text-white transition-colors"
                >
                  Villas
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?type=COMMERCIAL"
                  className="text-secondary-400 hover:text-white transition-colors"
                >
                  Commercial
                </Link>
              </li>
            </ul>
          </div>

          {/* For Sellers */}
          <div>
            <h3 className="text-lg font-semibold mb-4">For Sellers</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/register?role=PROMOTER"
                  className="text-secondary-400 hover:text-white transition-colors"
                >
                  Register as Promoter
                </Link>
              </li>
              <li>
                <Link
                  href="/properties/new"
                  className="text-secondary-400 hover:text-white transition-colors"
                >
                  Post Property Free
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-secondary-400 hover:text-white transition-colors"
                >
                  Commission Rates
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-secondary-400 hover:text-white transition-colors"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-secondary-400 text-sm">
            © {new Date().getFullYear()} Houlnd Realty. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="text-secondary-400 hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-secondary-400 hover:text-white text-sm transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
