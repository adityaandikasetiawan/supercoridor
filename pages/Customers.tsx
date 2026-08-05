import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Quote } from 'lucide-react';
import { usePageContent } from '../hooks/usePageContent';
import { getHeroGradient } from '../components/HeroGradient';

interface Testimonial {
  id: string;
  customerName: string;
  position: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
}

interface Customer {
  id: string;
  name: string;
  logo: string;
  industry: string;
}

const defaultTestimonials = [
  {
    company: 'TechCorp Indonesia',
    industry: 'Technology',
    person: 'John Doe, CTO',
    quote: 'SuperCorridor\'s dedicated connectivity has been transformative for our operations. The reliability and support are unmatched.',
    color: 'orange',
  },
  {
    company: 'Bank Nusantara',
    industry: 'Financial Services',
    person: 'Jane Smith, IT Director',
    quote: 'We depend on SuperCorridor for our mission-critical financial transactions. They consistently deliver on their 99.99% uptime promise.',
    color: 'blue',
  },
  {
    company: 'HealthNet Hospitals',
    industry: 'Healthcare',
    person: 'Dr. Ahmad Rahman, CIO',
    quote: 'The secure, high-speed connectivity enables us to deliver better patient care through telemedicine and instant access to medical records.',
    color: 'green',
  },
  {
    company: 'RetailMax Group',
    industry: 'Retail',
    person: 'Sarah Lee, VP Technology',
    quote: 'Our e-commerce platform handles millions of transactions monthly. SuperCorridor\'s network ensures we never miss a sale.',
    color: 'orange',
  },
  {
    company: 'MediaPro Studios',
    industry: 'Media & Entertainment',
    person: 'Michael Chen, Head of IT',
    quote: 'The high bandwidth and low latency connections allow us to transfer massive video files in minutes instead of hours.',
    color: 'blue',
  },
  {
    company: 'Manufacturing Plus',
    industry: 'Manufacturing',
    person: 'Robert Williams, IT Manager',
    quote: 'SuperCorridor connected all our factories with reliable, secure networking. Their support team is always responsive.',
    color: 'green',
  },
];

const defaultIndustries = [
  'Financial Services',
  'Healthcare',
  'Technology',
  'Retail & E-Commerce',
  'Manufacturing',
  'Media & Entertainment',
  'Education',
  'Government',
  'Telecommunications',
  'Logistics',
  'Energy',
  'Hospitality',
];

export function Customers() {
  const pageContent = usePageContent('page-customers', {
    heroTitle: 'Our Customers',
    heroSubtitle: 'Trusted by leading enterprises across diverse industries to power their digital infrastructure.',
    heroGradient: 'blue',
  });
  const [testimonials, setTestimonials] = useState(defaultTestimonials);
  const [industries, setIndustries] = useState(defaultIndustries);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/content/customers');
        if (response.ok) {
          const data = await response.json();
          if (data.customers) {
            // Map API testimonials to display format
            if (data.customers.testimonials && data.customers.testimonials.length > 0) {
              const colors = ['orange', 'blue', 'green'];
              setTestimonials(
                data.customers.testimonials.map((t: Testimonial, i: number) => ({
                  company: t.company,
                  industry: '',
                  person: `${t.customerName}, ${t.position}`,
                  quote: t.content,
                  color: colors[i % 3],
                }))
              );
            }
            // Extract unique industries from customers
            if (data.customers.customers && data.customers.customers.length > 0) {
              const uniqueIndustries = [...new Set(data.customers.customers.map((c: Customer) => c.industry))].filter(Boolean) as string[];
              if (uniqueIndustries.length > 0) {
                setIndustries(uniqueIndustries);
              }
            }
          }
        }
      } catch {
        // use defaults
      }
    };
    void load();
  }, []);
  return (
    <div>
      {/* Hero */}
      <section className={`${getHeroGradient(pageContent.heroGradient)} text-white py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-bold text-4xl lg:text-5xl mb-6">{pageContent.heroTitle}</h1>
            <p className="text-xl opacity-90">
              {pageContent.heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl mb-2 text-orange-600">500+</div>
              <div className="text-xl text-gray-700">Enterprise Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2 text-blue-600">98%</div>
              <div className="text-xl text-gray-700">Client Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2 text-green-600">15+</div>
              <div className="text-xl text-gray-700">Years of Service</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2 text-orange-600">24/7</div>
              <div className="text-xl text-gray-700">Support Available</div>
            </div>
          </div>

          {/* Industries Served */}
          <div className="mb-16">
            <h2 className="font-bold text-3xl mb-8 text-center">Industries We Serve</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {industries.map((industry, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 border-2 border-transparent transition-all"
                >
                  <Building2 className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">{industry}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-bold text-3xl mb-12 text-center">What Our Customers Say</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
                    testimonial.color === 'orange'
                      ? 'bg-orange-100 text-orange-500'
                      : testimonial.color === 'blue'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-green-100 text-green-600'
                  }`}
                >
                  <Quote className="w-6 h-6" />
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                <div className="border-t pt-4">
                  <div className="mb-1">{testimonial.person}</div>
                  <div
                    className={`${
                      testimonial.color === 'orange'
                        ? 'text-orange-600'
                        : testimonial.color === 'blue'
                        ? 'text-blue-600'
                        : 'text-green-600'
                    }`}
                  >
                    {testimonial.company}
                  </div>
                  <div className="text-gray-500 text-sm">{testimonial.industry}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-orange-500 via-blue-600 to-green-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-bold text-3xl mb-4">Join Our Growing Customer Base</h2>
          <p className="text-xl opacity-90 mb-6">
            Discover why leading enterprises trust SuperCorridor for their connectivity needs.
          </p>
          <Link
            to="/contact-us"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
}
