import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Building2, Briefcase } from 'lucide-react';
import { apiFetch } from '../../utils/storage';

interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string;
  image: string;
}

export function CaseStudyDetail() {
  const { id } = useParams<{ id: string }>();
  const [study, setStudy] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch('/api/content/resources/case-studies');
        if (res.ok) {
          const data = await res.json();
          if (data?.ok && Array.isArray(data.caseStudies)) {
            const found = data.caseStudies.find((cs: CaseStudy) => cs.id === id);
            if (found) setStudy(found);
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

  if (!study) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl text-gray-900 mb-4">Case Study Not Found</h1>
          <p className="text-gray-600 mb-8">The case study you're looking for doesn't exist.</p>
          <Link to="/resources/case-studies" className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Case Studies
          </Link>
        </div>
      </div>
    );
  }

  const resultsList = typeof study.results === 'string'
    ? (study.results.includes(';') ? study.results.split(';') : study.results.includes('\n') ? study.results.split('\n') : study.results.split(',')).map(r => r.trim()).filter(Boolean)
    : [];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/resources/case-studies" className="inline-flex items-center text-gray-500 hover:text-blue-600 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Case Studies
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">{study.industry}</span>
          </div>
          <h1 className="text-3xl md:text-5xl mb-6 leading-tight">{study.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-blue-100">
            <span className="flex items-center gap-2"><Building2 className="w-5 h-5" /> {study.client}</span>
            <span className="flex items-center gap-2"><Briefcase className="w-5 h-5" /> {study.industry}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        {/* Image */}
        {study.image && (
          <div className="mb-8">
            <img src={study.image} alt={study.title} className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-lg" />
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Challenge */}
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-lg">1</span>
                </div>
                <h2 className="text-xl md:text-2xl text-gray-900">The Challenge</h2>
              </div>
              <div className="prose prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: study.challenge }} />
            </div>

            {/* Solution */}
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-lg">2</span>
                </div>
                <h2 className="text-xl md:text-2xl text-gray-900">Our Solution</h2>
              </div>
              <div className="prose prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: study.solution }} />
            </div>
          </div>

          {/* Sidebar - Results */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 sticky top-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl text-gray-900">Results</h2>
              </div>
              {resultsList.length > 0 ? (
                <ul className="space-y-4">
                  {resultsList.map((result, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{result}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700">{study.results}</p>
              )}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 mb-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-10 text-center text-white">
          <h3 className="text-2xl md:text-3xl mb-3">Want Similar Results?</h3>
          <p className="text-blue-100 mb-6 text-lg">Let's discuss how SuperCorridor can transform your connectivity.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium">
              Contact Us
            </Link>
            <Link to="/resources/case-studies" className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white/10 transition-colors">
              More Case Studies
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
