import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { apiFetch } from '../../utils/storage';

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

export function Insights() {
  const [articles, setArticles] = useState<Article[]>(fallbackArticles);

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
          // Only replace fallbacks if articles have real content (not server placeholder defaults)
          const hasRealContent = next.some((a: { excerpt: string }) => a.excerpt && !a.excerpt.includes('Full article content'));
          if (hasRealContent || next.length > 2) {
            setArticles(next);
          }
        }
      } catch (err) {
        void err;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl mb-6">Insights & Articles</h1>
            <p className="text-xl opacity-90">
              Expert perspectives on enterprise connectivity, network technology, and digital transformation.
            </p>
          </div>
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">{article.title}</h3>
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
          <h2 className="text-3xl mb-4">Stay Informed</h2>
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
    </div>
  );
}
