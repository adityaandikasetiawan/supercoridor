import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '../../utils/storage';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { usePageContent } from '../../hooks/usePageContent';
import { getHeroGradient } from '../../components/HeroGradient';

interface Article {
  id: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  image: string;
  color: string;
}

interface EventItem {
  id: string;
  title: string;
  location: string;
  date: string;
  image: string;
  registrationOpen?: boolean;
  maxParticipants?: number;
  formFields?: Array<{ id: string; label: string; type: string; required: boolean; placeholder?: string; options?: string[] }>;
}

const fallbackEvents: EventItem[] = [
  {
    id: 'event-1',
    title: 'Indonesia Digital Summit 2026',
    location: 'JCC Senayan | Jakarta',
    date: 'March 15, 2026',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
  },
  {
    id: 'event-2',
    title: 'Cloud & Connectivity Expo',
    location: 'ICE BSD | Tangerang',
    date: 'April 20, 2026',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80',
  },
  {
    id: 'event-3',
    title: 'Enterprise Network Forum',
    location: 'Ritz Carlton | Jakarta',
    date: 'May 8, 2026',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
  },
  {
    id: 'event-4',
    title: 'Cybersecurity Conference 2026',
    location: 'Grand Hyatt | Jakarta',
    date: 'June 12, 2026',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
  },
];

const fallbackArticles: Article[] = [
  {
    id: 'dedicated-connectivity-benefits',
    title: '5 Key Benefits of Dedicated Internet Connectivity for Enterprises',
    date: 'December 15, 2025',
    category: 'Connectivity',
    excerpt: 'Discover how dedicated internet connections can transform your business operations with guaranteed bandwidth and superior performance.',
    content: 'Dedicated internet connectivity provides enterprises with exclusive bandwidth...',
    author: 'SuperCorridor Team',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
    color: 'orange',
  },
  {
    id: 'sd-wan-future',
    title: 'Understanding SD-WAN: The Future of Enterprise Networking',
    date: 'December 1, 2025',
    category: 'Technology',
    excerpt: 'Learn how Software-Defined WAN technology is revolutionizing the way businesses manage their network infrastructure.',
    content: 'Software-Defined Wide Area Network (SD-WAN) is transforming how enterprises connect...',
    author: 'SuperCorridor Team',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80',
    color: 'blue',
  },
  {
    id: 'cloud-interconnection-best-practices',
    title: 'Cloud Interconnection: Best Practices for Multi-Cloud Deployments',
    date: 'November 20, 2025',
    category: 'Cloud',
    excerpt: 'Explore strategies for seamlessly connecting your infrastructure to multiple cloud providers for optimal performance.',
    content: 'Multi-cloud strategies are becoming the norm for enterprises...',
    author: 'SuperCorridor Team',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=80',
    color: 'green',
  },
  {
    id: 'network-security-2026',
    title: 'Network Security in 2026: Trends and Predictions',
    date: 'November 10, 2025',
    category: 'Security',
    excerpt: 'Stay ahead of evolving cyber threats with our insights on the latest network security trends and technologies.',
    content: 'The cybersecurity landscape continues to evolve rapidly...',
    author: 'SuperCorridor Team',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80',
    color: 'orange',
  },
  {
    id: 'roi-network-upgrade',
    title: 'The ROI of Upgrading Your Network Infrastructure',
    date: 'October 28, 2025',
    category: 'Business',
    excerpt: 'Calculate the real value of investing in modern, high-performance network infrastructure for your organization.',
    content: 'Investing in network infrastructure delivers measurable returns...',
    author: 'SuperCorridor Team',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    color: 'blue',
  },
  {
    id: 'fiber-vs-traditional',
    title: 'Fiber vs. Traditional Connectivity: A Comprehensive Comparison',
    date: 'October 15, 2025',
    category: 'Infrastructure',
    excerpt: 'Understanding the advantages of fiber-optic connectivity over traditional copper-based solutions.',
    content: 'Fiber-optic connectivity offers significant advantages over traditional copper-based solutions...',
    author: 'SuperCorridor Team',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80',
    color: 'green',
  },
];

function RegBanner({ events, onRegister }: { events: EventItem[]; onRegister: (ev: EventItem) => void }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (events.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % events.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [events.length]);

  const event = events[current];
  if (!event) return null;

  return (
    <section className="relative h-[280px] md:h-[340px] overflow-hidden">
      {events.map((ev, idx) => (
        <div
          key={ev.id}
          className={`absolute inset-0 transition-opacity duration-700 ${idx === current ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <ImageWithFallback
            src={ev.image}
            alt={ev.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-xl">
                <span className="inline-block bg-orange-600 text-white text-xs font-medium px-3 py-1 rounded-full mb-3">
                  Open Registration
                </span>
                <h2 className="font-bold text-3xl md:text-4xl text-white mb-3">{ev.title}</h2>
                <div className="flex items-center gap-4 text-gray-200 text-sm mb-4">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{ev.location}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{ev.date}</span>
                </div>
                <button
                  onClick={() => onRegister(ev)}
                  className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-full font-medium transition-colors"
                >
                  Daftar Sekarang
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Dots */}
      {events.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {events.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${idx === current ? 'bg-white w-6' : 'bg-white/50'}`}
              aria-label={`Go to banner ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export function Insights() {
  const pageHeader = usePageContent('page-insights', {
    heroTitle: 'Articles & Events',
    heroSubtitle: 'Expert perspectives on enterprise connectivity, network technology, and digital transformation.',
    heroGradient: 'green',
  });
  const [articles, setArticles] = useState<Article[]>(fallbackArticles);
  const [events, setEvents] = useState<EventItem[]>(fallbackEvents);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [regModalEvent, setRegModalEvent] = useState<EventItem | null>(null);
  const [regForm, setRegForm] = useState<Record<string, string>>({});
  const [regSubmitting, setRegSubmitting] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch('/api/content/resources/insights');
        if (!res.ok) return;
        const data = await res.json();
        if (!data?.ok || !Array.isArray(data.articles)) return;

        const colors: Array<'orange' | 'blue' | 'green'> = ['orange', 'blue', 'green'];
        const next = data.articles
          .filter((a: any) => a && typeof a === 'object')
          .map((a: any, index: number) => {
            const title = typeof a.title === 'string' ? a.title : '';
            const excerpt = typeof a.excerpt === 'string' ? a.excerpt : '';
            const category = typeof a.category === 'string' ? a.category : '';
            const content = typeof a.content === 'string' ? a.content : '';
            const author = typeof a.author === 'string' ? a.author : 'SuperCorridor Team';
            const rawDate = typeof a.date === 'string' ? a.date : '';
            const date = rawDate
              ? new Date(rawDate).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : '';
            return { id: typeof a.id === 'string' ? a.id : String(index + 1), title, date, category, excerpt, content, author, image: typeof a.image === 'string' ? a.image : '', color: colors[index % colors.length] };
          })
          .filter((a: any) => a.title && a.excerpt);

        if (!cancelled && next.length > 0) {
          const hasRealContent = next.some((a: { excerpt: string }) => a.excerpt && !a.excerpt.includes('Full article content'));
          if (hasRealContent || next.length > 2) {
            setArticles(next);
          }
        }
      } catch (err) {
        void err;
      }

      // Load events
      try {
        const evRes = await apiFetch('/api/content/pages/page-events');
        if (evRes.ok) {
          const evData = await evRes.json();
          if (!cancelled && evData.data?.events && Array.isArray(evData.data.events) && evData.data.events.length > 0) {
            setEvents(evData.data.events);
          }
        }
      } catch { /* use defaults */ }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const scrollSlider = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const scrollAmount = 400;
    if (direction === 'right') {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    } else {
      const { scrollLeft } = sliderRef.current;
      if (scrollLeft <= 10) {
        const { scrollWidth, clientWidth } = sliderRef.current;
        sliderRef.current.scrollTo({ left: scrollWidth - clientWidth, behavior: 'smooth' });
      } else {
        sliderRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    }
  };

  // Auto-loop events slider
  useEffect(() => {
    const interval = setInterval(() => {
      scrollSlider('right');
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleRegSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regModalEvent) return;
    setRegSubmitting(true);
    try {
      const res = await fetch(`/api/events/${regModalEvent.id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regForm.name ?? regForm['Nama Lengkap'] ?? '',
          email: regForm.email ?? regForm['Email'] ?? '',
          phone: regForm.phone ?? regForm['No. Telepon'] ?? '',
          company: regForm.company ?? regForm['Perusahaan'] ?? '',
          notes: regForm.notes ?? '',
          customFields: regForm,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Pendaftaran berhasil! Kami akan menghubungi Anda.');
        setRegModalEvent(null);
        setRegForm({});
      } else {
        toast.error(data.error === 'Already registered with this email' ? 'Email sudah terdaftar untuk event ini.' : data.error === 'Event is full' ? 'Event sudah penuh.' : 'Pendaftaran gagal. Coba lagi.');
      }
    } catch {
      toast.error('Pendaftaran gagal. Periksa koneksi internet.');
    } finally {
      setRegSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className={`${getHeroGradient(pageHeader.heroGradient)} text-white py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-bold text-4xl lg:text-5xl mb-6">{pageHeader.heroTitle}</h1>
            <p className="text-xl opacity-90">
              {pageHeader.heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Registration Open Banner Slider */}
      {(() => {
        const regEvents = events.filter(ev => ev.registrationOpen);
        if (regEvents.length === 0) return null;
        return <RegBanner events={regEvents} onRegister={(ev) => setRegModalEvent(ev)} />;
      })()}

      {/* Events Slider */}
      <section className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-2xl text-white">Events</h2>
          </div>
          {/* Year Filter */}
          <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => { setSelectedYear('all'); sliderRef.current?.scrollTo({ left: 0, behavior: 'smooth' }); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${selectedYear === 'all' ? 'bg-orange-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
            >
              Semua
            </button>
            {(() => {
              const years = [...new Set(events.map(ev => {
                const match = ev.date.match(/\b(20\d{2})\b/);
                return match ? match[1] : null;
              }).filter(Boolean) as string[])].sort((a, b) => Number(b) - Number(a));
              return years.map(year => (
                <button
                  key={year}
                  onClick={() => { setSelectedYear(year); sliderRef.current?.scrollTo({ left: 0, behavior: 'smooth' }); }}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${selectedYear === year ? 'bg-orange-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
                >
                  {year}
                </button>
              ));
            })()}
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Left Arrow */}
          <button
            onClick={() => scrollSlider('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/30 backdrop-blur-sm rounded-full text-white transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Slider */}
          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory mx-12 pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {[...events]
              .filter(ev => {
                if (selectedYear === 'all') return true;
                const match = ev.date.match(/\b(20\d{2})\b/);
                return match ? match[1] === selectedYear : false;
              })
              .sort((a, b) => {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                if (isNaN(dateA) && isNaN(dateB)) return 0;
                if (isNaN(dateA)) return 1;
                if (isNaN(dateB)) return -1;
                return dateA - dateB;
              }).map((event) => (
              <div
                key={event.id}
                className="relative flex-shrink-0 w-[320px] md:w-[420px] h-[260px] rounded-2xl overflow-hidden snap-start group cursor-pointer"
              >
                <ImageWithFallback
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-xl text-white">{event.title}</h3>
                    {event.registrationOpen && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setRegModalEvent(event); }}
                        className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium rounded-full transition-colors"
                      >
                        Register
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-gray-200 text-sm mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-300 text-sm">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{event.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scrollSlider('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/30 backdrop-blur-sm rounded-full text-white transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <Link
                key={index}
                to={`/resources/insights/${article.id}`}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  {article.image ? (
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className={`w-full h-full ${article.color === 'orange' ? 'bg-gradient-to-br from-orange-400 to-orange-600' : article.color === 'blue' ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-green-400 to-green-600'}`} />
                  )}
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${article.color === 'orange' ? 'bg-orange-500/90 text-white' : article.color === 'blue' ? 'bg-blue-600/90 text-white' : 'bg-green-600/90 text-white'}`}>
                      {article.category}
                    </span>
                  </div>
                </div>
                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-lg font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">{article.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{article.date}</span>
                    </div>
                    <span className="flex items-center gap-1 text-orange-600 font-medium group-hover:gap-2 transition-all">
                      Read <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-bold text-3xl mb-4">Stay Informed</h2>
          <p className="text-xl text-gray-600 mb-6">
            Subscribe to our newsletter for the latest insights on enterprise connectivity and network technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      {regModalEvent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900">Event Registration</h2>
                <p className="text-sm text-gray-600 mt-1">{regModalEvent.title}</p>
                <p className="text-xs text-gray-500">{regModalEvent.date} • {regModalEvent.location}</p>
              </div>
              <form onSubmit={handleRegSubmit} className="space-y-4">
                {(regModalEvent.formFields && regModalEvent.formFields.length > 0
                  ? regModalEvent.formFields
                  : [
                      { id: 'name', label: 'Nama Lengkap', type: 'text', required: true, placeholder: 'John Doe' },
                      { id: 'email', label: 'Email', type: 'email', required: true, placeholder: 'john@company.com' },
                      { id: 'phone', label: 'No. Telepon', type: 'tel', required: false, placeholder: '08123456789' },
                      { id: 'company', label: 'Perusahaan', type: 'text', required: false, placeholder: 'PT ABC' },
                    ]
                ).map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm text-gray-700 mb-1">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        required={field.required}
                        value={regForm[field.id] ?? ''}
                        onChange={(e) => setRegForm({ ...regForm, [field.id]: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder={field.placeholder}
                      />
                    ) : field.type === 'select' ? (
                      <select
                        required={field.required}
                        value={regForm[field.id] ?? ''}
                        onChange={(e) => setRegForm({ ...regForm, [field.id]: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">{field.placeholder || 'Pilih...'}</option>
                        {(field.options ?? []).map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type || 'text'}
                        required={field.required}
                        value={regForm[field.id] ?? ''}
                        onChange={(e) => setRegForm({ ...regForm, [field.id]: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder={field.placeholder}
                      />
                    )}
                  </div>
                ))}
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={regSubmitting} className="flex-1 bg-orange-600 text-white py-2.5 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 font-medium">
                    {regSubmitting ? 'Mendaftar...' : 'Daftar Sekarang'}
                  </button>
                  <button type="button" onClick={() => { setRegModalEvent(null); setRegForm({}); }} className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 transition-colors">
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
