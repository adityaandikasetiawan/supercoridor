import { useEffect, useState } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { apiFetch } from '../../utils/storage';

const fallbackArticles = [
  {
    title: '5 Key Benefits of Dedicated Internet Connectivity for Enterprises',
    date: 'December 15, 2025',
    category: 'Connectivity',
    excerpt: 'Discover how dedicated internet connections can transform your business operations with guaranteed bandwidth and superior performance.',
    color: 'orange',
  },
  {
    title: 'Understanding SD-WAN: The Future of Enterprise Networking',
    date: 'December 1, 2025',
    category: 'Technology',
    excerpt: 'Learn how Software-Defined WAN technology is revolutionizing the way businesses manage their network infrastructure.',
    color: 'blue',
  },
  {
    title: 'Cloud Interconnection: Best Practices for Multi-Cloud Deployments',
    date: 'November 20, 2025',
    category: 'Cloud',
    excerpt: 'Explore strategies for seamlessly connecting your infrastructure to multiple cloud providers for optimal performance.',
    color: 'green',
  },
  {
    title: 'Network Security in 2026: Trends and Predictions',
    date: 'November 10, 2025',
    category: 'Security',
    excerpt: 'Stay ahead of evolving cyber threats with our insights on the latest network security trends and technologies.',
    color: 'orange',
  },
  {
    title: 'The ROI of Upgrading Your Network Infrastructure',
    date: 'October 28, 2025',
    category: 'Business',
    excerpt: 'Calculate the real value of investing in modern, high-performance network infrastructure for your organization.',
    color: 'blue',
  },
  {
    title: 'Fiber vs. Traditional Connectivity: A Comprehensive Comparison',
    date: 'October 15, 2025',
    category: 'Infrastructure',
    excerpt: 'Understanding the advantages of fiber-optic connectivity over traditional copper-based solutions.',
    color: 'green',
  },
];

export function Insights() {
  const [articles, setArticles] = useState(fallbackArticles);

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
            const rawDate = typeof a.date === 'string' ? a.date : '';
            const date = rawDate
              ? new Date(rawDate).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : '';
            return { title, date, category, excerpt, color: colors[index % colors.length] };
          })
          .filter((a: any) => a.title && a.category);

        if (!cancelled && next.length > 0) {
          setArticles(next);
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
              <article
                key={index}
                className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div
                  className={`h-3 ${
                    article.color === 'orange'
                      ? 'bg-orange-500'
                      : article.color === 'blue'
                      ? 'bg-blue-600'
                      : 'bg-green-600'
                  }`}
                ></div>
                <div className="p-6">
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-sm mb-3 ${
                      article.color === 'orange'
                        ? 'bg-orange-100 text-orange-600'
                        : article.color === 'blue'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-green-100 text-green-600'
                    }`}
                  >
                    {article.category}
                  </div>
                  <h3 className="text-xl mb-3">{article.title}</h3>
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <Calendar className="w-4 h-4 mr-2" />
                    {article.date}
                  </div>
                  <p className="text-gray-600 mb-4">{article.excerpt}</p>
                  <a
                    href="#"
                    className={`inline-flex items-center ${
                      article.color === 'orange'
                        ? 'text-orange-500 hover:text-orange-600'
                        : article.color === 'blue'
                        ? 'text-blue-600 hover:text-blue-700'
                        : 'text-green-600 hover:text-green-700'
                    } transition-colors`}
                  >
                    Read More
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </div>
              </article>
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
