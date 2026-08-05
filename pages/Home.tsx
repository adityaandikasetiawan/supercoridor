import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Network, Headphones, Smartphone, ChevronRight, ChevronLeft, Cable } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { AnimatedStat } from '../components/AnimatedStat';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
  order: number;
}

export function Home() {
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => [
    {
      id: 1,
      title: 'Empowering Business Connectivity',
      subtitle: 'Across Indonesia',
      description: 'Enterprise-grade internet solutions with 99.99% uptime guarantee',
      ctaText: 'Get Started',
      ctaLink: '/contact-us',
      backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80',
      order: 1,
    },
    {
      id: 2,
      title: 'Ultra-Fast Fiber Network',
      subtitle: 'Nationwide Coverage',
      description: 'Connect your business with speeds up to 100Gbps',
      ctaText: 'Explore Solutions',
      ctaLink: '/solutions/dedicated-connectivity',
      backgroundImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=80',
      order: 2,
    },
    {
      id: 3,
      title: 'Enterprise Security',
      subtitle: '24/7 Protection',
      description: 'Advanced DDoS protection and network monitoring',
      ctaText: 'Learn More',
      ctaLink: '/solutions/value-added-services',
      backgroundImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1920&q=80',
      order: 3,
    },
  ]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<'small' | 'enterprise'>('small');
  const [homeStats, setHomeStats] = useState([
    { label: 'Network Coverage', value: '50+', suffix: 'Cities' },
    { label: 'Enterprise Clients', value: '1,000+', suffix: 'Companies' },
    { label: 'Network Uptime', value: '99.99%', suffix: 'SLA' },
    { label: 'Data Centers', value: '15+', suffix: 'Locations' },
  ]);
  const [homeFeatures, setHomeFeatures] = useState([
    { title: 'Ultra-Fast Connectivity', description: 'Dedicated fiber optic infrastructure with speeds up to 100Gbps' },
    { title: '24/7 Support', description: 'Round-the-clock technical support and monitoring' },
    { title: 'Scalable Solutions', description: 'Flexible bandwidth options that grow with your business' },
    { title: 'Enterprise Security', description: 'Advanced DDoS protection and network security' },
  ]);
  const [solutionsSection, setSolutionsSection] = useState({
    title: 'Solutions designed for your business',
    subtitle: 'Choose your business type to see relevant solutions',
    small: {
      featuredBadge: 'Featured',
      featuredTitle: 'Reliable connectivity for growing businesses',
      featuredDesc: 'Fast, affordable internet solutions to help your small business stay connected and competitive.',
      featuredLink: '/solutions/dedicated-connectivity',
      cards: [
        { title: 'Business Internet', desc: 'High-speed fiber internet up to 1 Gbps with dedicated bandwidth.', link: '/solutions/dedicated-connectivity', icon: 'Smartphone' },
        { title: 'Security Solutions', desc: 'Protect your business with firewall and DDoS protection.', link: '/solutions/value-added-services', icon: 'Shield' },
      ],
      image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80',
    },
    enterprise: {
      featuredBadge: 'Featured',
      featuredTitle: 'Helping enterprises scale and innovate',
      featuredDesc: 'Enterprise-grade connectivity and network infrastructure designed for digital transformation.',
      featuredLink: '/solutions/dedicated-connectivity',
      cards: [
        { title: 'Dedicated Connectivity', desc: 'Private fiber connections up to 100 Gbps with 99.99% uptime SLA.', link: '/solutions/dedicated-connectivity', icon: 'Network', badge: 'Popular' },
        { title: 'Cloud Connect', desc: 'Direct, secure connectivity to AWS, Azure, and Google Cloud.', link: '/solutions/cloud-interconnection', icon: 'Zap', badge: 'New' },
      ],
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    },
  });

  const [tgcsData, setTgcsData] = useState(() => ({
    hero: {
      title: '',
      subtitle: '',
      description: '',
      enabled: true,
    },
    statistics: {
      cableLength: '',
      fiberPairs: '',
      capacity: '',
      rfsSchedule: '',
    },
  }));

  useEffect(() => {
    const load = async () => {
      const cacheBust = `_t=${Date.now()}`;
      try {
        const [slidesRes, tgcsRes, homeRes] = await Promise.all([
          fetch(`/api/content/hero-slides?${cacheBust}`, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' } }),
          fetch(`/api/content/tgcs?${cacheBust}`, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' } }),
          fetch(`/api/content/home-management?${cacheBust}`, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' } }),
        ]);
        if (slidesRes.ok) {
          const data = (await slidesRes.json()) as { ok: true; heroSlides: HeroSlide[] };
          setHeroSlides(data.heroSlides);
          setCurrentSlide((prev) => Math.min(prev, Math.max(data.heroSlides.length - 1, 0)));
        }
        if (tgcsRes.ok) {
          const data = await tgcsRes.json();
          if (data.tgcs) {
            setTgcsData(prev => ({
              hero: { ...prev.hero, ...data.tgcs.hero },
              statistics: { ...prev.statistics, ...data.tgcs.statistics },
            }));
          }
        } else {
          // Retry TGCS fetch if failed
          const retryRes = await fetch(`/api/content/tgcs?_t=${Date.now()}`);
          if (retryRes.ok) {
            const data = await retryRes.json();
            if (data.tgcs) {
              setTgcsData(prev => ({
                hero: { ...prev.hero, ...data.tgcs.hero },
                statistics: { ...prev.statistics, ...data.tgcs.statistics },
              }));
            }
          }
        }
        if (homeRes.ok) {
          const data = (await homeRes.json()) as { ok: true; homeManagement: { heroData: { title: string; subtitle: string; ctaText: string; ctaLink: string; backgroundImage: string }; stats: { label: string; value: string; suffix: string }[]; features?: { title: string; description: string }[]; solutionsSection?: typeof solutionsSection } | null };
          if (data.homeManagement?.stats) {
            setHomeStats(data.homeManagement.stats);
          }
          if (data.homeManagement?.features && data.homeManagement.features.length > 0) {
            setHomeFeatures(data.homeManagement.features);
          }
          if (data.homeManagement?.solutionsSection) {
            const ss = data.homeManagement.solutionsSection;
            setSolutionsSection(prev => ({
              ...prev,
              ...ss,
              // Deep merge small & enterprise tabs so cards/image are fully replaced
              small: ss.small ? { ...prev.small, ...ss.small, cards: ss.small.cards ?? prev.small.cards } : prev.small,
              enterprise: ss.enterprise ? { ...prev.enterprise, ...ss.enterprise, cards: ss.enterprise.cards ?? prev.enterprise.cards } : prev.enterprise,
            }));
          }
        }
      } catch (e) {
        // Retry TGCS fetch on network error
        try {
          const retryRes = await fetch(`/api/content/tgcs?_t=${Date.now()}`);
          if (retryRes.ok) {
            const data = await retryRes.json();
            if (data.tgcs) {
              setTgcsData(prev => ({
                hero: { ...prev.hero, ...data.tgcs.hero },
                statistics: { ...prev.statistics, ...data.tgcs.statistics },
              }));
            }
          }
        } catch (_) { /* ignore */ }
      }
    };
    void load();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="bg-white">
      {/* Hero Carousel */}
      <section className="relative h-[450px] md:h-[600px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0">
              <ImageWithFallback
                src={slide.backgroundImage}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
            </div>

            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
              <div className="text-white max-w-2xl">
                <h1 className="font-bold text-5xl lg:text-6xl mb-4">{slide.title}</h1>
                <h2 className="font-bold text-3xl lg:text-4xl mb-6">{slide.subtitle}</h2>
                <p className="text-xl mb-8 text-gray-200">{slide.description}</p>
                <Link
                  to={slide.ctaLink}
                  className="inline-flex items-center px-8 py-4 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors"
                >
                  {slide.ctaText}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-colors z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-colors z-10"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Flagship Project Section - TGCS */}
      {tgcsData.hero.enabled && tgcsData.statistics.cableLength && (
        <section className="py-12 bg-gradient-to-br from-blue-900 via-blue-800 to-teal-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1558494949-ef010cbdcc31)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Left Content */}
              <div>
                <div className="inline-flex items-center gap-2 bg-orange-600 text-white px-3 py-1.5 rounded-full mb-3">
                  <Cable className="w-4 h-4" />
                  <span className="text-xs">Flagship Project</span>
                </div>
                <h2 className="font-bold text-3xl lg:text-4xl mb-2">{tgcsData.hero.title}</h2>
                <p className="text-lg text-blue-100 mb-2">{tgcsData.hero.subtitle}</p>
                <p className="text-sm text-blue-200 mb-6">{tgcsData.hero.description}</p>
                <Link
                  to="/subsea-cable-system"
                  className="inline-flex items-center px-6 py-3 bg-white text-blue-900 rounded-full hover:bg-gray-100 transition-colors"
                >
                  Find Out More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>

              {/* Right Statistics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
                  <AnimatedStat value={tgcsData.statistics.cableLength} className="text-3xl mb-1 text-orange-400" />
                  <div className="text-xs text-blue-100">Cable Length</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
                  <AnimatedStat value={tgcsData.statistics.fiberPairs} className="text-3xl mb-1 text-orange-400" />
                  <div className="text-xs text-blue-100">Fiber Pairs</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
                  <AnimatedStat value={tgcsData.statistics.capacity} className="text-3xl mb-1 text-orange-400" />
                  <div className="text-xs text-blue-100">Total Capacity</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
                  <AnimatedStat value={tgcsData.statistics.rfsSchedule} className="text-3xl mb-1 text-orange-400" />
                  <div className="text-xs text-blue-100">RFS Schedule</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Solutions Tabs */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl lg:text-4xl text-gray-900 mb-4">{solutionsSection.title}</h2>
            <p className="text-xl text-gray-600">{solutionsSection.subtitle}</p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => setActiveTab('small')}
              className={`px-8 py-3 rounded-full transition-colors ${
                activeTab === 'small'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Small Business
            </button>
            <button
              onClick={() => setActiveTab('enterprise')}
              className={`px-8 py-3 rounded-full transition-colors ${
                activeTab === 'enterprise'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Enterprise
            </button>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'small' && (
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                <div>
                  <div className="bg-stone-50 p-8 rounded-2xl mb-4">
                    <span className="inline-block bg-blue-600 text-white px-3 py-1 text-sm mb-3 rounded">
                      {solutionsSection.small.featuredBadge}
                    </span>
                    <h3 className="font-bold text-2xl mb-3">{solutionsSection.small.featuredTitle}</h3>
                    <p className="text-gray-700 mb-4">{solutionsSection.small.featuredDesc}</p>
                    <Link to={solutionsSection.small.featuredLink} className="inline-flex items-center text-blue-600 hover:text-blue-700">
                      Learn more
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {solutionsSection.small.cards.map((card, idx) => (
                      <Link key={idx} to={card.link} className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-colors block">
                        {card.icon === 'Shield' ? <Shield className="w-8 h-8 text-blue-600 mb-3" /> : card.icon === 'Network' ? <Network className="w-8 h-8 text-blue-600 mb-3" /> : card.icon === 'Zap' ? <Zap className="w-8 h-8 text-blue-600 mb-3" /> : card.icon === 'Headphones' ? <Headphones className="w-8 h-8 text-blue-600 mb-3" /> : card.icon === 'Cable' ? <Cable className="w-8 h-8 text-blue-600 mb-3" /> : <Smartphone className="w-8 h-8 text-blue-600 mb-3" />}
                        <h4 className="text-lg mb-2">{card.title}</h4>
                        <p className="text-gray-600 text-sm mb-3">{card.desc}</p>
                        <span className="text-blue-600 text-sm inline-flex items-center">
                          Learn more <ChevronRight className="w-3 h-3 ml-1" />
                        </span>
                      </Link>
                    ))}
                  </div>

                </div>

                <div>
                  <ImageWithFallback
                    src={solutionsSection.small.image}
                    alt="Small Business"
                    className="rounded-2xl w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {activeTab === 'enterprise' && (
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                <div>
                  <div className="bg-stone-50 p-8 rounded-2xl mb-4">
                    <span className="inline-block bg-orange-600 text-white px-3 py-1 text-sm mb-3 rounded">
                      {solutionsSection.enterprise.featuredBadge}
                    </span>
                    <h3 className="font-bold text-2xl mb-3">{solutionsSection.enterprise.featuredTitle}</h3>
                    <p className="text-gray-700 mb-4">{solutionsSection.enterprise.featuredDesc}</p>
                    <Link to={solutionsSection.enterprise.featuredLink} className="inline-flex items-center text-orange-600 hover:text-orange-700">
                      Learn more
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {solutionsSection.enterprise.cards.map((card, idx) => (
                      <Link key={idx} to={card.link} className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-orange-500 transition-colors block">
                        {'badge' in card && card.badge && (
                          <span className="inline-block bg-orange-600 text-white px-2 py-1 text-xs mb-2 rounded">{card.badge}</span>
                        )}
                        {card.icon === 'Zap' ? <Zap className="w-8 h-8 text-orange-600 mb-3" /> : card.icon === 'Shield' ? <Shield className="w-8 h-8 text-orange-600 mb-3" /> : card.icon === 'Smartphone' ? <Smartphone className="w-8 h-8 text-orange-600 mb-3" /> : card.icon === 'Headphones' ? <Headphones className="w-8 h-8 text-orange-600 mb-3" /> : card.icon === 'Cable' ? <Cable className="w-8 h-8 text-orange-600 mb-3" /> : <Network className="w-8 h-8 text-orange-600 mb-3" />}
                        <h4 className="text-lg mb-2">{card.title}</h4>
                        <p className="text-gray-600 text-sm mb-3">{card.desc}</p>
                        <span className="text-orange-600 text-sm inline-flex items-center">
                          Learn more <ChevronRight className="w-3 h-3 ml-1" />
                        </span>
                      </Link>
                    ))}
                  </div>

                </div>

                <div>
                  <ImageWithFallback
                    src={solutionsSection.enterprise.image}
                    alt="Enterprise"
                    className="rounded-2xl w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Stats Counter */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {homeStats.map((stat, index) => (
              <div key={index} className="text-center">
                <AnimatedStat value={stat.value} className="text-3xl lg:text-4xl text-orange-600 mb-1" />
                <div className="text-gray-600">{stat.label}</div>
                <div className="text-sm text-gray-500">{stat.suffix}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl lg:text-4xl text-gray-900 mb-4">Why Choose SuperCorridor</h2>
            <p className="text-xl text-gray-600">Industry-leading infrastructure and support</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {homeFeatures.map((feature, index) => {
              const icons = [Zap, Headphones, Network, Shield];
              const colors = [
                { bg: 'bg-orange-100', text: 'text-orange-600' },
                { bg: 'bg-blue-100', text: 'text-blue-600' },
                { bg: 'bg-green-100', text: 'text-green-600' },
                { bg: 'bg-purple-100', text: 'text-purple-600' },
              ];
              const Icon = icons[index % icons.length];
              const color = colors[index % colors.length];

              return (
                <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-16 h-16 ${color.bg} rounded-full flex items-center justify-center mb-4`}>
                    <Icon className={`w-8 h-8 ${color.text}`} />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-bold text-3xl lg:text-4xl mb-4">Ready to Transform Your Connectivity?</h2>
          <p className="text-xl mb-8 text-orange-100">Get started with SuperCorridor today</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact-us"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-orange-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              Contact Sales
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/solutions/dedicated-connectivity"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-full hover:bg-white/10 transition-colors"
            >
              View Solutions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
