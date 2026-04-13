import { useEffect, useState } from 'react';
import { ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';
import { apiFetch } from '../../utils/storage';

const fallbackCaseStudies = [
  {
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
            const resultsRaw = typeof cs.results === 'string' ? cs.results : '';
            const results = resultsRaw
              ? resultsRaw
                  .split(',')
                  .map((r: string) => r.trim())
                  .filter(Boolean)
              : [];
            return {
              client,
              industry,
              challenge,
              solution,
              results: results.length > 0 ? results : ['Learn more about results'],
              icon: icons[index % icons.length],
              color: colors[index % colors.length],
            };
          })
          .filter((cs: any) => cs.client && cs.industry);

        if (!cancelled && next.length > 0) {
          setCaseStudies(next);
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
          <div className="space-y-12">
            {caseStudies.map((study, index) => (
              <div
                key={index}
                className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div
                  className={`h-2 ${
                    study.color === 'orange'
                      ? 'bg-orange-500'
                      : study.color === 'blue'
                      ? 'bg-blue-600'
                      : 'bg-green-600'
                  }`}
                ></div>
                <div className="p-8">
                  <div className="flex items-start mb-6">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-full mr-6 flex-shrink-0 ${
                        study.color === 'orange'
                          ? 'bg-orange-100 text-orange-500'
                          : study.color === 'blue'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-green-100 text-green-600'
                      }`}
                    >
                      <study.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl mb-2">{study.client}</h2>
                      <div
                        className={`inline-block px-3 py-1 rounded-full text-sm ${
                          study.color === 'orange'
                            ? 'bg-orange-100 text-orange-600'
                            : study.color === 'blue'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-green-100 text-green-600'
                        }`}
                      >
                        {study.industry}
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8">
                    <div>
                      <h3 className="mb-3 text-gray-900">Challenge</h3>
                      <p className="text-gray-600">{study.challenge}</p>
                    </div>

                    <div>
                      <h3 className="mb-3 text-gray-900">Solution</h3>
                      <p className="text-gray-600">{study.solution}</p>
                    </div>

                    <div>
                      <h3 className="mb-3 text-gray-900">Results</h3>
                      <ul className="space-y-2">
                        {study.results.map((result, resultIndex) => (
                          <li key={resultIndex} className="flex items-start text-gray-700">
                            <span
                              className={`w-1.5 h-1.5 rounded-full mt-2 mr-2 flex-shrink-0 ${
                                study.color === 'orange'
                                  ? 'bg-orange-500'
                                  : study.color === 'blue'
                                  ? 'bg-blue-600'
                                  : 'bg-green-600'
                              }`}
                            ></span>
                            {result}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6">
                    <a
                      href="#"
                      className={`inline-flex items-center ${
                        study.color === 'orange'
                          ? 'text-orange-500 hover:text-orange-600'
                          : study.color === 'blue'
                          ? 'text-blue-600 hover:text-blue-700'
                          : 'text-green-600 hover:text-green-700'
                      } transition-colors`}
                    >
                      Read Full Case Study
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
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
