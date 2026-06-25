import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Shield, Zap, CheckCircle } from 'lucide-react';
import { apiFetch } from '../../utils/storage';

const fallbackCaseStudies = [
  {
    id: '1',
    client: 'Global Financial Services Corp',
    industry: 'Financial Services',
    challenge: 'Required ultra-low latency connectivity for high-frequency trading operations across multiple locations.',
    solution: 'Deployed 10 Gbps dedicated fiber connections with sub-5ms latency between trading centers and data centers.',
    results: [
      '99.999% uptime achieved',
      '60% reduction in network latency',
      '40% increase in trading efficiency',
    ],
    icon: TrendingUp,
    color: 'orange',
  },
  {
    id: '2',
    client: 'National Healthcare Network',
    industry: 'Healthcare',
    challenge: 'Needed secure, HIPAA-compliant connectivity to transfer large medical imaging files between hospitals.',
    solution: 'Implemented dedicated network with managed firewall and DDoS protection, plus cloud interconnection to AWS.',
    results: [
      'HIPAA compliance achieved',
      '80% faster file transfers',
      'Enhanced patient data security',
    ],
    icon: Shield,
    color: 'blue',
  },
  {
    id: '3',
    client: 'E-Commerce Leader',
    industry: 'Retail',
    challenge: 'Experienced network congestion during peak shopping seasons, affecting customer experience.',
    solution: 'Upgraded to 100 Gbps backbone with SD-WAN for intelligent traffic routing and direct cloud connections.',
    results: [
      'Zero downtime during peak seasons',
      '50% improvement in page load times',
      '35% increase in conversion rates',
    ],
    icon: Zap,
    color: 'green',
  },
];

export function CaseStudies() {
  const [caseStudies, setCaseStudies] = useState(fallbackCaseStudies);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch('/api/content/resources/case-studies');
        if (!res.ok) return;
        const data = await res.json();
        if (!data?.ok || !Array.isArray(data.caseStudies)) return;

        const colors: Array<'orange' | 'blue' | 'green'> = ['orange', 'blue', 'green'];
        const icons = [TrendingUp, Shield, Zap] as const;
        const next = data.caseStudies
          .filter((cs: any) => cs && typeof cs === 'object')
          .map((cs: any, index: number) => {
            const client = typeof cs.client === 'string' ? cs.client : '';
            const industry = typeof cs.industry === 'string' ? cs.industry : '';
            const challenge = typeof cs.challenge === 'string' ? cs.challenge : '';
            const solution = typeof cs.solution === 'string' ? cs.solution : '';
            const image = typeof cs.image === 'string' ? cs.image : '';
            const resultsRaw = cs.results;
            let results: string[] = [];
            if (Array.isArray(resultsRaw)) {
              results = resultsRaw.filter((r: unknown) => typeof r === 'string' && r.trim());
            } else if (typeof resultsRaw === 'string' && resultsRaw) {
              // Split by semicolon first (preferred), fallback to newline, then comma
              if (resultsRaw.includes(';')) {
                results = resultsRaw.split(';').map((r: string) => r.trim()).filter(Boolean);
              } else if (resultsRaw.includes('\n')) {
                results = resultsRaw.split('\n').map((r: string) => r.trim()).filter(Boolean);
              } else {
                results = resultsRaw.split(',').map((r: string) => r.trim()).filter(Boolean);
              }
            }
            return {
              id: typeof cs.id === 'string' ? cs.id : String(index + 1),
              client,
              industry,
              challenge,
              solution,
              results: results.length > 0 ? results : ['Learn more about results'],
              image,
              icon: icons[index % icons.length],
              color: colors[index % colors.length],
            };
          })
          .filter((cs: any) => cs.client && cs.industry);

        if (!cancelled && next.length > 0) {
          // Only replace fallbacks if data is from admin (not server placeholder defaults)
          const hasRealContent = next.some((cs: { challenge: string }) => cs.challenge && cs.challenge.length > 30);
          if (hasRealContent || next.length > 1) {
            setCaseStudies(next);
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
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl mb-6">Case Studies</h1>
            <p className="text-xl opacity-90">
              Real-world success stories of how SuperCorridor's connectivity solutions transformed businesses.
            </p>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {caseStudies.map((study, index) => (
              <Link
                key={index}
                to={`/resources/case-studies/${study.id ?? index + 1}`}
                className="group block bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-72 h-48 md:h-auto flex-shrink-0 relative overflow-hidden">
                    {'image' in study && (study as any).image ? (
                      <img
                        src={(study as any).image}
                        alt={study.client}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden'); }}
                      />
                    ) : null}
                    <div className={`w-full h-full ${study.color === 'orange' ? 'bg-gradient-to-br from-orange-400 to-orange-600' : study.color === 'blue' ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-green-400 to-green-600'} ${'image' in study && (study as any).image ? 'hidden absolute inset-0' : ''}`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <study.icon className="w-16 h-16 text-white/30" />
                      </div>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">{study.industry}</span>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="flex-1 p-6 md:p-8">
                    <h2 className="text-xl md:text-2xl text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">{study.client}</h2>
                    <p className="text-gray-600 mb-4 line-clamp-2">{study.challenge}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {study.results.slice(0, 3).map((result, ri) => (
                        <span key={ri} className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                          <CheckCircle className="w-3 h-3" /> {result}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center text-sm font-medium text-orange-600 group-hover:gap-2 transition-all">
                      Read Full Case Study <ArrowRight className="ml-1 w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl opacity-90 mb-6">
            Let's discuss how SuperCorridor can help you achieve similar results.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Get in Touch
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      </section>
    </div>
  );
}
