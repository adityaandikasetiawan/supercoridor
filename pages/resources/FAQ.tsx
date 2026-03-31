import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    category: 'General',
    color: 'orange',
    questions: [
      {
        q: 'What makes SuperCorridor different from other ISPs?',
        a: 'We specialize exclusively in enterprise connectivity, offering dedicated fiber-optic connections, carrier-grade infrastructure, 99.99% uptime SLA, and 24/7 expert support. Our network is designed specifically for business-critical applications.',
      },
      {
        q: 'What is your service level agreement (SLA)?',
        a: 'We guarantee 99.99% network uptime with comprehensive SLA coverage. This includes committed bandwidth guarantees, latency commitments, and rapid response times for any service issues.',
      },
      {
        q: 'How long does it take to set up service?',
        a: 'Typical installation takes 2-4 weeks depending on location and service type. We work closely with you to plan the deployment and minimize any disruption to your operations.',
      },
    ],
  },
  {
    category: 'Technical',
    color: 'blue',
    questions: [
      {
        q: 'What bandwidth options are available?',
        a: 'We offer scalable bandwidth from 10 Mbps to 100 Gbps. Our solutions can grow with your business, and bandwidth upgrades can typically be completed within days.',
      },
      {
        q: 'Do you provide IPv6 support?',
        a: 'Yes, all our services include full IPv6 support alongside IPv4. We can help you plan and implement your IPv6 migration strategy.',
      },
      {
        q: 'What routing protocols do you support?',
        a: 'We support BGP4 for enterprise customers who require their own AS number and IP space. We also offer static routing for simpler configurations.',
      },
    ],
  },
  {
    category: 'Security & Compliance',
    color: 'green',
    questions: [
      {
        q: 'What security features are included?',
        a: 'All services include DDoS protection and network monitoring. Additional security features like managed firewalls, intrusion prevention, and content filtering are available as value-added services.',
      },
      {
        q: 'Are your services compliant with industry regulations?',
        a: 'Yes, our infrastructure and services comply with ISO 27001, PCI DSS, and other international standards. We can provide HIPAA-compliant solutions for healthcare clients.',
      },
      {
        q: 'How is data privacy protected?',
        a: 'We maintain strict data privacy policies and never inspect or log customer traffic content. All connections are private and encrypted when required.',
      },
    ],
  },
  {
    category: 'Pricing & Billing',
    color: 'orange',
    questions: [
      {
        q: 'How is pricing structured?',
        a: 'Pricing is based on bandwidth, service level, location, and contract term. We offer flexible plans with 1, 2, or 3-year contracts. Contact our sales team for a custom quote.',
      },
      {
        q: 'Are there any setup fees?',
        a: 'Setup fees vary depending on location and installation complexity. In many cases, we can waive installation fees for multi-year contracts.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept bank transfers, corporate credit cards, and can set up automated monthly billing. Enterprise customers can arrange custom payment terms.',
      },
    ],
  },
];

export function FAQ() {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const toggleQuestion = (category: string, index: number) => {
    const key = `${category}-${index}`;
    setOpenQuestion(openQuestion === key ? null : key);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl mb-6">Frequently Asked Questions</h1>
            <p className="text-xl opacity-90">
              Find answers to common questions about our enterprise connectivity solutions.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqs.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-12">
              <h2
                className={`text-2xl mb-6 ${
                  section.color === 'orange'
                    ? 'text-orange-600'
                    : section.color === 'blue'
                    ? 'text-blue-600'
                    : 'text-green-600'
                }`}
              >
                {section.category}
              </h2>
              <div className="space-y-4">
                {section.questions.map((faq, faqIndex) => {
                  const key = `${section.category}-${faqIndex}`;
                  const isOpen = openQuestion === key;

                  return (
                    <div
                      key={faqIndex}
                      className={`border-2 rounded-lg overflow-hidden transition-all ${
                        isOpen
                          ? section.color === 'orange'
                            ? 'border-orange-500'
                            : section.color === 'blue'
                            ? 'border-blue-600'
                            : 'border-green-600'
                          : 'border-gray-200'
                      }`}
                    >
                      <button
                        className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        onClick={() => toggleQuestion(section.category, faqIndex)}
                      >
                        <span className="pr-8">{faq.q}</span>
                        <ChevronDown
                          className={`w-5 h-5 flex-shrink-0 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          } ${
                            section.color === 'orange'
                              ? 'text-orange-500'
                              : section.color === 'blue'
                              ? 'text-blue-600'
                              : 'text-green-600'
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-6">
                          <p className="text-gray-600">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl mb-4">Still Have Questions?</h2>
          <p className="text-xl text-gray-600 mb-6">
            Our team is here to help. Contact us for personalized assistance.
          </p>
          <a
            href="/contact"
            className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </section>
    </div>
  );
}
