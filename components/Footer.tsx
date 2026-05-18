import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="inline-flex items-baseline">
              <div className="flex flex-col leading-none">
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-blue-600 to-green-500 bg-clip-text text-transparent">
                  SuperCorridor
                </span>
                <span className="mt-1 text-[12px] font-semibold tracking-tight bg-gradient-to-r from-orange-500 via-blue-600 to-green-500 bg-clip-text text-transparent">
                  Your Neutral Network Provider
                </span>
              </div>
              <span className="ml-2 text-sm text-gray-400">business</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Leading provider of enterprise-grade internet connectivity and network solutions.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4">Solutions</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/solutions/dedicated-connectivity" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Dedicated Connectivity
                </Link>
              </li>
              <li>
                <Link to="/solutions/backbone-network" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Backbone & Network
                </Link>
              </li>
              <li>
                <Link to="/solutions/cloud-interconnection" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Cloud & Interconnection
                </Link>
              </li>
              <li>
                <Link to="/solutions/value-added-services" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Value-Added Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about/company-overview" className="text-gray-400 hover:text-blue-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/network-coverage" className="text-gray-400 hover:text-green-500 transition-colors">
                  Network & Coverage
                </Link>
              </li>
              <li>
                <Link to="/customers" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Customers
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-400 hover:text-green-500 transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start text-gray-400">
                <MapPin className="w-5 h-5 mr-2 mt-1 flex-shrink-0 text-orange-500" />
                <span>Artha Gading Niaga Blok E 11, 12, 15A Kelapa Gading, Jakarta 14240 Indonesia</span>
              </li>
              <li className="flex items-center text-gray-400">
                <Phone className="w-5 h-5 mr-2 flex-shrink-0 text-blue-500" />
                <span>021-4587 8409</span>
              </li>
              <li className="flex items-center text-gray-400">
                <Mail className="w-5 h-5 mr-2 flex-shrink-0 text-green-500" />
                <span>ask@supercorridor.co.id</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} SuperCorridor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
