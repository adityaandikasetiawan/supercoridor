import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Clock, Share2 } from 'lucide-react';
import { apiFetch } from '../../utils/storage';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
}

export function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch('/api/content/resources/insights');
        if (res.ok) {
          const data = await res.json();
          if (data?.ok && Array.isArray(data.articles)) {
            const found = data.articles.find((a: Article) => a.id === id);
            if (found) setArticle(found);
          }
        }
      } catch {
        // not found
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-bold text-4xl text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">The article you're looking for doesn't exist or has been removed.</p>
          <Link to="/resources/insights" className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = article.date
    ? new Date(article.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  // Estimate reading time (200 words per minute)
  const wordCount = article.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/resources/insights" className="inline-flex items-center text-gray-500 hover:text-orange-600 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Insights
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      {article.image && (
        <div className="w-full h-[300px] md:h-[400px] relative">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 md:p-10 pb-0">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">{article.category}</span>
              <span className="flex items-center gap-1 text-gray-500 text-sm"><Clock className="w-3.5 h-3.5" /> {readingTime} min read</span>
            </div>
            <h1 className="font-bold text-3xl md:text-4xl text-gray-900 leading-tight mb-6">{article.title}</h1>
            
            {/* Author & Meta */}
            <div className="flex items-center justify-between pb-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {article.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{article.author}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3" /> {formattedDate}</p>
                </div>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                title="Copy link"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Excerpt */}
          <div className="px-6 md:px-10 py-6">
            <blockquote className="text-lg text-gray-600 italic border-l-4 border-orange-500 pl-4 mb-0">
              {article.excerpt}
            </blockquote>
          </div>

          {/* Body */}
          <div className="px-6 md:px-10 pb-10">
            <div className="prose prose-lg prose-gray max-w-none prose-headings:text-gray-900 prose-a:text-orange-600 prose-strong:text-gray-900 prose-img:rounded-lg" dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>
        </article>

        {/* Related / CTA */}
        <div className="mt-8 mb-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-center text-white">
          <h3 className="font-bold text-2xl mb-3">Need Enterprise Connectivity?</h3>
          <p className="text-orange-100 mb-6">Contact our team to discuss your requirements</p>
          <Link to="/contact-us" className="inline-flex items-center bg-white text-orange-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
