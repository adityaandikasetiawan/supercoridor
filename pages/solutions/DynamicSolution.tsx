import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { getHeroGradient } from '../../components/HeroGradient';

interface SolutionData {
  title: string;
  subtitle: string;
  heroImage: string;
  heroGradient?: string;
  description: string;
  features: { title: string; description: string }[];
  packages?: { name: string; speed: string; price: string; features: string[] }[];
  published?: boolean;
}

export function DynamicSolution() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<SolutionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const res = await fetch(`/api/content/pages/solutions-${slug}`, { cache: 'no-store' });
        if (res.ok) {
          const result = await res.json();
          if (result.data) {
            setData(result.data);
          }
        }
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600 mb-4">The solution page you're looking for doesn't exist.</p>
          <Link to="/" className="text-orange-600 hover:text-orange-700">← Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className={`${getHeroGradient(data.heroGradient)} text-white py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-bold text-4xl lg:text-5xl mb-6">{data.title}</h1>
            <p className="text-xl opacity-90">{data.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="font-bold text-3xl mb-6">{data.title}</h2>
              <p className="text-gray-600 mb-6">{data.description}</p>
              {data.features && data.features.length > 0 && (
                <ul className="space-y-4">
                  {data.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-6 h-6 text-orange-500 mr-3 flex-shrink-0 mt-1" />
                      <div>
                        <span className="font-semibold text-gray-900">{feature.title}</span>
                        {feature.description && (
                          <p className="text-gray-600 text-sm mt-1">{feature.description}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              {data.heroImage && (
                <ImageWithFallback
                  src={data.heroImage}
                  alt={data.title}
                  className="rounded-lg w-full"
                />
              )}
            </div>
          </div>

          {/* Packages */}
          {data.packages && data.packages.length > 0 && (
            <div className="mb-16">
              <h2 className="font-bold text-3xl mb-8 text-center">Pricing Packages</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {data.packages.map((pkg, index) => {
                  const colors = ['orange', 'blue', 'green'] as const;
                  const color = colors[index % 3];
                  const borderColor = color === 'orange' ? 'border-orange-500' : color === 'blue' ? 'border-blue-600' : 'border-green-600';
                  const textColor = color === 'orange' ? 'text-orange-600' : color === 'blue' ? 'text-blue-600' : 'text-green-600';

                  return (
                    <div key={index} className={`border-2 ${borderColor} rounded-lg p-6 text-center`}>
                      <h3 className={`text-xl font-bold mb-2 ${textColor}`}>{pkg.name}</h3>
                      <div className="text-3xl font-bold text-gray-900 mb-1">{pkg.speed}</div>
                      <div className="text-gray-600 mb-4">{pkg.price}</div>
                      {pkg.features && pkg.features.length > 0 && (
                        <ul className="text-left space-y-2">
                          {pkg.features.map((f, i) => (
                            <li key={i} className="flex items-center text-gray-700">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className={`py-16 ${getHeroGradient(data.heroGradient)} text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Interested in {data.title}?</h2>
          <p className="text-xl mb-8 opacity-90">Get in touch with our team to learn more</p>
          <Link
            to="/contact-us"
            className="inline-flex items-center px-8 py-4 bg-white text-orange-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            Contact Us
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
