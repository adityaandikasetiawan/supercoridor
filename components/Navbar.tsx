import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, LogIn, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { lang, toggleLang, t } = useLanguage();

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery('');
  };

  const searchItems = useMemo(() => {
    const groups =
      lang === 'id'
        ? {
            general: 'Umum',
            careers: 'Karir',
            solutions: 'Solusi',
            about: 'Tentang',
            resources: 'Sumber Daya',
            projects: 'Proyek',
          }
        : {
            general: 'General',
            careers: 'Careers',
            solutions: 'Solutions',
            about: 'About',
            resources: 'Resources',
            projects: 'Projects',
          };

    return [
      { label: t('nav.home'), to: '/', group: groups.general },
      { label: lang === 'id' ? 'Cakupan Jaringan' : 'Network Coverage', to: '/network-coverage', group: groups.general },
      { label: t('nav.contactUs'), to: '/contact', group: groups.general },
      { label: t('nav.careers'), to: '/careers', group: groups.careers },
      { label: t('nav.dedicatedConnectivity'), to: '/solutions/dedicated-connectivity', group: groups.solutions },
      { label: t('nav.backboneNetworkInfrastructure'), to: '/solutions/backbone-network', group: groups.solutions },
      { label: t('nav.cloudInterconnectionServices'), to: '/solutions/cloud-interconnection', group: groups.solutions },
      { label: t('nav.valueAddedServices'), to: '/solutions/value-added-services', group: groups.solutions },
      { label: t('nav.companyOverview'), to: '/about/company-overview', group: groups.about },
      { label: t('nav.visionMission'), to: '/about/vision-mission', group: groups.about },
      { label: t('nav.leadershipTeam'), to: '/about/leadership', group: groups.about },
      { label: t('nav.milestones'), to: '/about/milestones', group: groups.about },
      { label: t('nav.articlesInsights'), to: '/resources/insights', group: groups.resources },
      { label: t('nav.caseStudies'), to: '/resources/case-studies', group: groups.resources },
      { label: t('nav.faq'), to: '/resources/faq', group: groups.resources },
      { label: t('nav.tgcs'), to: '/tgcs-project', group: groups.projects },
    ];
  }, [lang, t]);

  const filteredSearchItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const tokens = q.split(/\s+/g).filter(Boolean);
    return searchItems.filter((item) => {
      const hay = `${item.label} ${item.group}`.toLowerCase();
      return tokens.every((t) => hay.includes(t));
    });
  }, [searchItems, searchQuery]);

  useEffect(() => {
    if (!searchOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch();
    };

    const onPointerDown = (e: PointerEvent) => {
      const el = searchRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) closeSearch();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [searchOpen]);

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
                {t('nav.personal')}
              </a>
              <span className="text-gray-400">|</span>
              <span className="text-orange-600 font-medium">{t('nav.business')}</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/contact" className="text-gray-700 hover:text-orange-600 transition-colors">
                {t('nav.contactUs')}
              </Link>
              <Link to="/resources/faq" className="text-gray-700 hover:text-orange-600 transition-colors">
                {t('nav.support')}
              </Link>
              <Link to="/careers" className="text-gray-700 hover:text-orange-600 transition-colors">
                {t('nav.careers')}
              </Link>
              <button
                className="text-gray-700 hover:text-orange-600 flex items-center gap-2"
                onClick={() => toggleLang()}
                aria-label="Change language"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span className="text-xs font-semibold">{lang.toUpperCase()}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
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
              {t('nav.home')}
            </Link>

            <div className="relative group">
              <button className="text-gray-900 hover:text-orange-600 transition-colors py-2">
                {t('nav.technology')}
              </button>
              <div className="absolute top-full left-0 mt-0 w-64 bg-white shadow-lg rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border-t-2 border-orange-600">
                <Link
                  to="/solutions/backbone-network"
                  className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  {t('nav.fiberOpticNetwork')}
                </Link>
                <Link
                  to="/solutions/cloud-interconnection"
                  className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  {t('nav.cloudInfrastructure')}
                </Link>
                <Link
                  to="/solutions/value-added-services"
                  className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  {t('nav.networkSecurity')}
                </Link>
              </div>
            </div>

            <div className="relative group">
              <button className="text-gray-900 hover:text-orange-600 transition-colors py-2">
                {t('nav.solution')}
              </button>
              <div className="absolute top-full left-0 mt-0 w-64 bg-white shadow-lg rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border-t-2 border-orange-600">
                <Link
                  to="/solutions/dedicated-connectivity"
                  className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  {t('nav.dedicatedConnectivity')}
                </Link>
                <Link
                  to="/solutions/backbone-network"
                  className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  {t('nav.backboneNetworkInfrastructure')}
                </Link>
                <Link
                  to="/solutions/cloud-interconnection"
                  className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  {t('nav.cloudInterconnectionServices')}
                </Link>
                <Link
                  to="/solutions/value-added-services"
                  className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  {t('nav.valueAddedServices')}
                </Link>
                <Link
                  to="/tgcs-project"
                  className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  {t('nav.tgcs')}
                </Link>
              </div>
            </div>

            <div className="relative group">
              <button className="text-gray-900 hover:text-orange-600 transition-colors py-2">
                {t('nav.aboutUs')}
              </button>
              <div className="absolute top-full left-0 mt-0 w-56 bg-white shadow-lg rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border-t-2 border-orange-600">
                <Link
                  to="/about/company-overview"
                  className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  {t('nav.companyOverview')}
                </Link>
                <Link
                  to="/about/vision-mission"
                  className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  {t('nav.visionMission')}
                </Link>
                <Link
                  to="/about/leadership"
                  className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  {t('nav.leadershipTeam')}
                </Link>
                <Link
                  to="/about/milestones"
                  className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  {t('nav.milestones')}
                </Link>
              </div>
            </div>

            <Link to="/network-coverage" className="text-gray-900 hover:text-orange-600 transition-colors py-2">
              {t('nav.network')}
            </Link>

            <div className="relative group">
              <button className="text-gray-900 hover:text-orange-600 transition-colors py-2">
                {t('nav.resources')}
              </button>
              <div className="absolute top-full left-0 mt-0 w-56 bg-white shadow-lg rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border-t-2 border-orange-600">
                <Link
                  to="/resources/insights"
                  className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  {t('nav.articlesInsights')}
                </Link>
                <Link
                  to="/resources/case-studies"
                  className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  {t('nav.caseStudies')}
                </Link>
                <Link
                  to="/resources/faq"
                  className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  {t('nav.faq')}
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
              {t('nav.login')}
            </Link>
            
            <button
              onClick={() => (searchOpen ? closeSearch() : setSearchOpen(true))}
              className="flex items-center text-gray-900 hover:text-orange-600 transition-colors"
            >
              {t('nav.search')}
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
          <div ref={searchRef} className="absolute left-0 right-0 bg-white shadow-lg p-4 border-t">
            <div className="max-w-7xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('nav.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const first = filteredSearchItems[0];
                      if (!first) return;
                      closeSearch();
                      navigate(first.to);
                    }
                    if (e.key === 'Escape') closeSearch();
                  }}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-orange-600 focus:outline-none"
                  autoFocus
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {filteredSearchItems.length > 0 && (
                <div className="mt-3 bg-white border border-gray-200 rounded-lg overflow-hidden">
                  {filteredSearchItems.slice(0, 8).map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="block px-4 py-3 hover:bg-orange-50 transition-colors"
                      onClick={() => closeSearch()}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900">{item.label}</span>
                        <span className="text-sm text-gray-500">{item.group}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <button
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center justify-between"
              onClick={() => toggleLang()}
            >
              <span>{lang === 'id' ? 'Bahasa' : 'Language'}</span>
              <span className="text-xs font-semibold">{lang.toUpperCase()}</span>
            </button>
            <Link
              to="/"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.home')}
            </Link>

            {/* Mobile Technology Dropdown */}
            <div>
              <button
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                onClick={() => toggleDropdown('technology')}
              >
                {t('nav.technology')}
                <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'technology' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'technology' && (
                <div className="bg-gray-50">
                  <Link
                    to="/solutions/backbone-network"
                    className="block px-8 py-2 text-gray-600 hover:text-orange-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.fiberOpticNetwork')}
                  </Link>
                  <Link
                    to="/solutions/cloud-interconnection"
                    className="block px-8 py-2 text-gray-600 hover:text-orange-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.cloudInfrastructure')}
                  </Link>
                  <Link
                    to="/solutions/value-added-services"
                    className="block px-8 py-2 text-gray-600 hover:text-orange-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.networkSecurity')}
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
                {t('nav.solution')}
                <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'solutions' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'solutions' && (
                <div className="bg-gray-50">
                  <Link
                    to="/solutions/dedicated-connectivity"
                    className="block px-8 py-2 text-gray-600 hover:text-orange-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.dedicatedConnectivity')}
                  </Link>
                  <Link
                    to="/solutions/backbone-network"
                    className="block px-8 py-2 text-gray-600 hover:text-orange-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.backboneNetworkInfrastructure')}
                  </Link>
                  <Link
                    to="/solutions/cloud-interconnection"
                    className="block px-8 py-2 text-gray-600 hover:text-orange-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.cloudInterconnectionServices')}
                  </Link>
                  <Link
                    to="/solutions/value-added-services"
                    className="block px-8 py-2 text-gray-600 hover:text-orange-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.valueAddedServices')}
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
                {t('nav.aboutUs')}
                <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'about' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'about' && (
                <div className="bg-gray-50">
                  <Link
                    to="/about/company-overview"
                    className="block px-8 py-2 text-gray-600 hover:text-orange-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.companyOverview')}
                  </Link>
                  <Link
                    to="/about/vision-mission"
                    className="block px-8 py-2 text-gray-600 hover:text-orange-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.visionMission')}
                  </Link>
                  <Link
                    to="/about/leadership"
                    className="block px-8 py-2 text-gray-600 hover:text-orange-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.leadershipTeam')}
                  </Link>
                  <Link
                    to="/about/milestones"
                    className="block px-8 py-2 text-gray-600 hover:text-orange-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.milestones')}
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/network-coverage"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.network')}
            </Link>

            {/* Mobile Resources Dropdown */}
            <div>
              <button
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                onClick={() => toggleDropdown('resources')}
              >
                {t('nav.resources')}
                <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'resources' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'resources' && (
                <div className="bg-gray-50">
                  <Link
                    to="/resources/insights"
                    className="block px-8 py-2 text-gray-600 hover:text-green-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.articlesInsights')}
                  </Link>
                  <Link
                    to="/resources/case-studies"
                    className="block px-8 py-2 text-gray-600 hover:text-green-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.caseStudies')}
                  </Link>
                  <Link
                    to="/resources/faq"
                    className="block px-8 py-2 text-gray-600 hover:text-green-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.faq')}
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/careers"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.careers')}
            </Link>
            <Link
              to="/contact"
              className="block px-4 py-2 mx-4 my-2 text-center bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              onClick={() => setIsMenuOpen(false)}
            >
              {lang === 'id' ? 'Kontak' : 'Contact'}
            </Link>
            <Link
              to="/admin/login"
              className="flex items-center justify-center px-4 py-2 mx-4 my-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => setIsMenuOpen(false)}
            >
              <LogIn className="w-4 h-4 mr-2" />
              {t('nav.login')}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
