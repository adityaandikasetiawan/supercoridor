import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, LogIn, Search } from 'lucide-react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10 text-sm">
            <div className="hidden md:flex items-center space-x-4">
              <a
                href="https://idplay.co.id"
                target="_blank"
                rel="noreferrer"
                className="text-gray-900 hover:text-orange-600"
              >
                Personal
              </a>
              <span className="text-gray-400">|</span>
              <span className="text-orange-600 font-medium">Business</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/contact" className="text-gray-700 hover:text-orange-600 transition-colors">
                Contact us
              </Link>
              <Link to="/resources/faq" className="text-gray-700 hover:text-orange-600 transition-colors">
                Support
              </Link>
              <Link to="/careers" className="text-gray-700 hover:text-orange-600 transition-colors">
                Karir
              </Link>
              <button className="text-gray-700 hover:text-orange-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="flex items-baseline">
              <div className="flex flex-col leading-none">
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-blue-600 to-green-500 bg-clip-text text-transparent">
                  SuperCorridor
                </span>
                <span className="mt-1 text-[12px] font-semibold tracking-tight bg-gradient-to-r from-orange-500 via-blue-600 to-green-500 bg-clip-text text-transparent">
                  Your Neutral Network Provider
                </span>
              </div>
              <span className="ml-2 text-sm text-gray-600">business</span>
            </div>
          </Link>

          {/* Desktop Menu - Horizontal */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-gray-900 hover:text-orange-600 transition-colors py-2">
              Home
            </Link>

            <div className="relative group">
              <button className="text-gray-900 hover:text-orange-600 transition-colors py-2">
                Technology
              </button>
              <div className="absolute top-full left-0 mt-0 w-64 bg-white shadow-lg rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border-t-2 border-orange-600">
                <Link
                  to="/solutions/backbone-network"
                  className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Fiber Optic Network
                </Link>
                <Link
                  to="/solutions/cloud-interconnection"
                  className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Cloud Infrastructure
                </Link>
                <Link
                  to="/solutions/value-added-services"
                  className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Network Security
                </Link>
              </div>
            </div>

            <div className="relative group">
              <button className="text-gray-900 hover:text-orange-600 transition-colors py-2">
                Solution
              </button>
              <div className="absolute top-full left-0 mt-0 w-64 bg-white shadow-lg rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border-t-2 border-orange-600">
                <Link
                  to="/solutions/dedicated-connectivity"
                  className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Dedicated Connectivity
                </Link>
                <Link
                  to="/solutions/backbone-network"
                  className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Backbone & Network Infrastructure
                </Link>
                <Link
                  to="/solutions/cloud-interconnection"
                  className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Cloud & Interconnection Services
                </Link>
                <Link
                  to="/solutions/value-added-services"
                  className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Value-Added Services
                </Link>
                <Link
                  to="/tgcs-project"
                  className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  TGCS
                </Link>
              </div>
            </div>

            <div className="relative group">
              <button className="text-gray-900 hover:text-orange-600 transition-colors py-2">
                About Us
              </button>
              <div className="absolute top-full left-0 mt-0 w-56 bg-white shadow-lg rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border-t-2 border-orange-600">
                <Link
                  to="/about/company-overview"
                  className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Company Overview
                </Link>
                <Link
                  to="/about/vision-mission"
                  className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Vision & Mission
                </Link>
                <Link
                  to="/about/leadership"
                  className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Leadership Team
                </Link>
                <Link
                  to="/about/milestones"
                  className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Milestones
                </Link>
              </div>
            </div>

            <Link to="/network-coverage" className="text-gray-900 hover:text-orange-600 transition-colors py-2">
              Network
            </Link>

            <div className="relative group">
              <button className="text-gray-900 hover:text-orange-600 transition-colors py-2">
                Resources
              </button>
              <div className="absolute top-full left-0 mt-0 w-56 bg-white shadow-lg rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border-t-2 border-orange-600">
                <Link
                  to="/resources/insights"
                  className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Articles & Insights
                </Link>
                <Link
                  to="/resources/case-studies"
                  className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Case Studies
                </Link>
                <Link
                  to="/resources/faq"
                  className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  FAQ
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              to="/admin/login"
              className="text-gray-900 hover:text-orange-600 transition-colors"
            >
              Log in
            </Link>
            
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex items-center text-gray-900 hover:text-orange-600 transition-colors"
            >
              Search SuperCorridor
              <Search className="w-4 h-4 ml-2" />
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Search Bar Dropdown */}
        {searchOpen && (
          <div className="absolute left-0 right-0 bg-white shadow-lg p-4 border-t">
            <div className="max-w-7xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="What can we help you find today?"
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-orange-600 focus:outline-none"
                  autoFocus
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <Link
              to="/"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>

            {/* Mobile Technology Dropdown */}
            <div>
              <button
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                onClick={() => toggleDropdown('technology')}
              >
                Technology
                <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'technology' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'technology' && (
                <div className="bg-gray-50">
                  <Link
                    to="/solutions/backbone-network"
                    className="block px-8 py-2 text-gray-600 hover:text-orange-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Fiber Optic Network
                  </Link>
                  <Link
                    to="/solutions/cloud-interconnection"
                    className="block px-8 py-2 text-gray-600 hover:text-orange-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Cloud Infrastructure
                  </Link>
                  <Link
                    to="/solutions/value-added-services"
                    className="block px-8 py-2 text-gray-600 hover:text-orange-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Network Security
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Solutions Dropdown */}
            <div>
              <button
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                onClick={() => toggleDropdown('solutions')}
              >
                Solution
                <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'solutions' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'solutions' && (
                <div className="bg-gray-50">
                  <Link
                    to="/solutions/dedicated-connectivity"
                    className="block px-8 py-2 text-gray-600 hover:text-orange-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dedicated Connectivity
                  </Link>
                  <Link
                    to="/solutions/backbone-network"
                    className="block px-8 py-2 text-gray-600 hover:text-orange-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Backbone & Network Infrastructure
                  </Link>
                  <Link
                    to="/solutions/cloud-interconnection"
                    className="block px-8 py-2 text-gray-600 hover:text-orange-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Cloud & Interconnection Services
                  </Link>
                  <Link
                    to="/solutions/value-added-services"
                    className="block px-8 py-2 text-gray-600 hover:text-orange-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Value-Added Services
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile About Us Dropdown */}
            <div>
              <button
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                onClick={() => toggleDropdown('about')}
              >
                About Us
                <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'about' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'about' && (
                <div className="bg-gray-50">
                  <Link
                    to="/about/company-overview"
                    className="block px-8 py-2 text-gray-600 hover:text-orange-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Company Overview
                  </Link>
                  <Link
                    to="/about/vision-mission"
                    className="block px-8 py-2 text-gray-600 hover:text-orange-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Vision & Mission
                  </Link>
                  <Link
                    to="/about/leadership"
                    className="block px-8 py-2 text-gray-600 hover:text-orange-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Leadership Team
                  </Link>
                  <Link
                    to="/about/milestones"
                    className="block px-8 py-2 text-gray-600 hover:text-orange-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Milestones
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/network-coverage"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Network
            </Link>

            {/* Mobile Resources Dropdown */}
            <div>
              <button
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                onClick={() => toggleDropdown('resources')}
              >
                Resources
                <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'resources' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'resources' && (
                <div className="bg-gray-50">
                  <Link
                    to="/resources/insights"
                    className="block px-8 py-2 text-gray-600 hover:text-green-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Insights / Articles
                  </Link>
                  <Link
                    to="/resources/case-studies"
                    className="block px-8 py-2 text-gray-600 hover:text-green-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Case Studies
                  </Link>
                  <Link
                    to="/resources/faq"
                    className="block px-8 py-2 text-gray-600 hover:text-green-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    FAQ
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/careers"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Careers
            </Link>
            <Link
              to="/contact"
              className="block px-4 py-2 mx-4 my-2 text-center bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/admin/login"
              className="flex items-center justify-center px-4 py-2 mx-4 my-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => setIsMenuOpen(false)}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
