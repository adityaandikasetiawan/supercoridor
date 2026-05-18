import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface MilestoneItem {
  year: string;
  title: string;
  description: string;
  color: string;
}

const defaultMilestones: MilestoneItem[] = [
  { year: '2008', title: 'Company Founded', description: 'SuperCorridor was established with a vision to transform enterprise connectivity in Indonesia.', color: 'orange' },
  { year: '2010', title: 'First 100 Clients', description: 'Reached our first major milestone, serving 100 enterprise customers across Jakarta.', color: 'blue' },
  { year: '2012', title: 'Network Expansion', description: 'Expanded fiber-optic network to 10 major cities, doubling our coverage area.', color: 'green' },
  { year: '2014', title: 'Cloud Partnerships', description: 'Established direct connections to AWS, Azure, and Google Cloud platforms.', color: 'orange' },
  { year: '2016', title: '10 Gbps Milestone', description: 'Launched 10 Gbps dedicated connectivity services for enterprise clients.', color: 'blue' },
  { year: '2018', title: 'Industry Recognition', description: 'Awarded "Best Enterprise ISP" by Indonesia Telecommunications Association.', color: 'green' },
  { year: '2020', title: '500+ Clients', description: 'Reached 500 enterprise clients, solidifying our position as a market leader.', color: 'orange' },
  { year: '2021', title: '100 Gbps Launch', description: 'Introduced 100 Gbps connectivity options for the most demanding enterprise workloads.', color: 'blue' },
  { year: '2022', title: 'Regional Expansion', description: 'Expanded operations to 50+ cities across Indonesia and neighboring countries.', color: 'green' },
  { year: '2024', title: 'Innovation Hub', description: 'Opened our Network Innovation Center to develop next-generation connectivity solutions.', color: 'orange' },
];

export function Milestones() {
  const [milestones, setMilestones] = useState<MilestoneItem[]>(defaultMilestones);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/content/pages/about-milestones');
        if (response.ok) {
          const result = await response.json();
          if (result.data?.milestones && result.data.milestones.length > 0) {
            const colors = ['orange', 'blue', 'green'];
            setMilestones(
              result.data.milestones.map((m: { year: string; title: string; description: string }, i: number) => ({
                ...m,
                color: colors[i % 3],
              }))
            );
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
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl mb-6">Our Milestones</h1>
            <p className="text-xl opacity-90">
              A journey of growth, innovation, and commitment to excellence in enterprise connectivity.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-orange-500 via-blue-600 to-green-500"></div>

            {/* Milestones */}
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Content */}
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
                    <div className={`inline-block bg-${milestone.color === 'orange' ? 'orange-50' : milestone.color === 'blue' ? 'blue-50' : 'green-50'} p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow`}>
                      <div
                        className={`text-3xl mb-2 ${
                          milestone.color === 'orange'
                            ? 'text-orange-600'
                            : milestone.color === 'blue'
                            ? 'text-blue-600'
                            : 'text-green-600'
                        }`}
                      >
                        {milestone.year}
                      </div>
                      <h3 className="text-xl mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="relative flex items-center justify-center w-full md:w-2/12 my-4 md:my-0">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                        milestone.color === 'orange'
                          ? 'bg-orange-500'
                          : milestone.color === 'blue'
                          ? 'bg-blue-600'
                          : 'bg-green-600'
                      } text-white shadow-lg`}
                    >
                      <CheckCircle className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="hidden md:block w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Future Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 via-blue-600 to-green-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl mb-4">The Journey Continues</h2>
          <p className="text-xl opacity-90">
            As we look to the future, we remain committed to innovation, excellence, and delivering the connectivity solutions that empower businesses to succeed in an increasingly digital world.
          </p>
        </div>
      </section>
    </div>
  );
}
