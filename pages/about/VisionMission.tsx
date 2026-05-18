import { Target, Eye, Compass } from 'lucide-react';
import { usePageContent } from '../../hooks/usePageContent';

export function VisionMission() {
  const content = usePageContent('about-vision-mission', {
    title: 'Vision & Mission',
    heroImage: '',
    vision: 'To be the most trusted and innovative provider of enterprise connectivity solutions in Southeast Asia, empowering businesses to thrive in the digital age through exceptional network infrastructure and unwavering reliability.',
    mission: [
      'Deliver reliable, high-speed internet connectivity to businesses of all sizes',
      'Build and maintain robust network infrastructure across Indonesia',
      'Provide exceptional customer service and technical support',
      'Innovate continuously to meet evolving connectivity needs',
      'Foster partnerships that create value for our customers',
    ],
    goals: [
      { title: 'Network Expansion', description: 'Extend our fiber-optic infrastructure to reach more cities and business districts across the region.' },
      { title: 'Technology Leadership', description: 'Stay at the forefront of networking technology, adopting innovations like SD-WAN, edge computing, and 5G integration.' },
      { title: 'Customer Experience', description: 'Enhance our service delivery with proactive support, transparent communication, and personalized solutions.' },
      { title: 'Sustainability', description: 'Build and operate our network infrastructure with environmental responsibility and energy efficiency in mind.' },
    ],
  });

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl mb-6">{content.title}</h1>
            <p className="text-xl opacity-90">
              Guiding principles that drive our commitment to excellence in enterprise connectivity.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Vision */}
          <div className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 text-blue-600 rounded-full">
                <Eye className="w-10 h-10" />
              </div>
            </div>
            <h2 className="text-3xl mb-6 text-center text-blue-600">Our Vision</h2>
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-xl text-gray-700 leading-relaxed">{content.vision}</p>
            </div>
          </div>

          {/* Mission */}
          <div className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full">
                <Target className="w-10 h-10" />
              </div>
            </div>
            <h2 className="text-3xl mb-6 text-center text-green-600">Our Mission</h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                {(content.mission ?? []).map((item, index) => (
                  <div key={index} className="bg-green-50 p-6 rounded-lg">
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Strategic Priorities */}
          <div>
            <div className="flex items-center justify-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 text-orange-500 rounded-full">
                <Compass className="w-10 h-10" />
              </div>
            </div>
            <h2 className="text-3xl mb-6 text-center text-orange-600">Strategic Priorities</h2>
            <div className="max-w-4xl mx-auto">
              <div className="space-y-4">
                {(content.goals ?? []).map((goal, index) => {
                  const colors = ['orange', 'blue', 'green'] as const;
                  const color = colors[index % 3];
                  const bgColor = color === 'orange' ? 'bg-orange-50' : color === 'blue' ? 'bg-blue-50' : 'bg-green-50';
                  const numBg = color === 'orange' ? 'bg-orange-500' : color === 'blue' ? 'bg-blue-600' : 'bg-green-600';
                  const titleColor = color === 'orange' ? 'text-orange-700' : color === 'blue' ? 'text-blue-700' : 'text-green-700';

                  return (
                    <div key={index} className={`flex items-start ${bgColor} p-6 rounded-lg`}>
                      <div className={`flex-shrink-0 w-8 h-8 ${numBg} text-white rounded-full flex items-center justify-center mr-4`}>
                        {index + 1}
                      </div>
                      <div>
                        <h3 className={`mb-2 ${titleColor}`}>{goal.title}</h3>
                        <p className="text-gray-700">{goal.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
