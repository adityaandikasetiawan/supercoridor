import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { Globe, Users, Award, TrendingUp } from 'lucide-react';
import { usePageContent } from '../../hooks/usePageContent';
import { getHeroGradient } from '../../components/HeroGradient';

export function CompanyOverview() {
  const content = usePageContent('about-company-overview', {
    title: 'Company Overview',
    subtitle: 'Leading the future of enterprise connectivity with innovation, reliability, and exceptional service.',
    heroImage: 'https://images.unsplash.com/photo-1674981208693-de5a9c4c4f44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBidWlsZGluZyUyMG1vZGVybnxlbnwxfHx8fDE3NjczMjAwMzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    companyDescription: "Founded with a vision to transform enterprise connectivity, SuperCorridor has grown to become one of Indonesia's leading internet service providers. We specialize in delivering high-performance, reliable network solutions to businesses of all sizes.",
    additionalDescription: "Our extensive fiber-optic infrastructure spans across major business districts, connecting enterprises to the digital world with unmatched speed and reliability. We serve over 500 corporate clients, from startups to Fortune 500 companies.\n\nAt SuperCorridor, we believe that connectivity is the foundation of modern business. That's why we're committed to delivering not just internet service, but complete network solutions that empower organizations to achieve their digital transformation goals.",
    stats: [
      { value: '500+', label: 'Enterprise Clients' },
      { value: '50+', label: 'Cities Covered' },
      { value: '99.99%', label: 'Network Uptime' },
      { value: '15+', label: 'Years Experience' },
    ],
    values: [
      { title: 'Innovation', description: 'We continuously invest in cutting-edge technology to provide our clients with the most advanced connectivity solutions.' },
      { title: 'Reliability', description: 'Our commitment to uptime and performance ensures your business stays connected when it matters most.' },
      { title: 'Customer Focus', description: 'We put our clients first, delivering personalized service and support tailored to their unique needs.' },
      { title: 'Integrity', description: 'Operating with transparency and ethical standards in everything we do.' },
    ],
  });

  const statIcons = [Users, Globe, TrendingUp, Award];
  const colorCycle = ['orange', 'blue', 'green'] as const;

  return (
    <div>
      {/* Hero */}
      <section className={`${getHeroGradient((content as any).heroGradient)} text-white py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-bold text-4xl lg:text-5xl mb-6">{content.title}</h1>
            <p className="text-xl opacity-90">{content.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="font-bold text-3xl mb-6">About SuperCorridor</h2>
              <p className="text-gray-600 mb-4">{content.companyDescription}</p>
              {(content.additionalDescription ?? '').split('\n\n').filter(Boolean).map((paragraph, index) => (
                <p key={index} className="text-gray-600 mb-4">{paragraph}</p>
              ))}
            </div>
            <div>
              <ImageWithFallback
                src={(content as any).heroImage || 'https://images.unsplash.com/photo-1674981208693-de5a9c4c4f44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBidWlsZGluZyUyMG1vZGVybnxlbnwxfHx8fDE3NjczMjAwMzB8MA&ixlib=rb-4.1.0&q=80&w=1080'}
                alt="SuperCorridor Office"
                className="rounded-lg"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {(content.stats ?? []).map((stat, index) => {
              const color = colorCycle[index % 3];
              const Icon = statIcons[index % statIcons.length];
              const bgGradient = color === 'orange' ? 'from-orange-50 to-orange-100' : color === 'blue' ? 'from-blue-50 to-blue-100' : 'from-green-50 to-green-100';
              const iconBg = color === 'orange' ? 'bg-orange-500' : color === 'blue' ? 'bg-blue-600' : 'bg-green-600';
              const textColor = color === 'orange' ? 'text-orange-600' : color === 'blue' ? 'text-blue-600' : 'text-green-600';

              return (
                <div key={index} className={`text-center p-6 bg-gradient-to-br ${bgGradient} rounded-lg`}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${iconBg} text-white rounded-full mb-4`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className={`text-3xl mb-2 ${textColor}`}>{stat.value}</div>
                  <div className="text-gray-700">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Core Values */}
          <div>
            <h2 className="font-bold text-3xl mb-8 text-center">Our Core Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {(content.values ?? []).map((value, index) => {
                const color = colorCycle[index % 3];
                const bgColor = color === 'orange' ? 'bg-orange-50' : color === 'blue' ? 'bg-blue-50' : 'bg-green-50';
                const textColor = color === 'orange' ? 'text-orange-600' : color === 'blue' ? 'text-blue-600' : 'text-green-600';

                return (
                  <div key={index} className={`${bgColor} p-6 rounded-lg`}>
                    <h3 className={`text-xl mb-3 ${textColor}`}>{value.title}</h3>
                    <p className="text-gray-700">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
