import { Linkedin, Mail } from 'lucide-react';

const leaders = [
  {
    name: 'John Anderson',
    title: 'Chief Executive Officer',
    bio: 'With over 25 years in telecommunications, John leads SuperCorridor\'s strategic vision and growth.',
    color: 'orange',
  },
  {
    name: 'Sarah Chen',
    title: 'Chief Technology Officer',
    bio: 'Sarah drives our technology innovation and oversees our network infrastructure development.',
    color: 'blue',
  },
  {
    name: 'Michael Roberts',
    title: 'Chief Operating Officer',
    bio: 'Michael ensures operational excellence and service delivery across all our client engagements.',
    color: 'green',
  },
  {
    name: 'Lisa Martinez',
    title: 'Chief Financial Officer',
    bio: 'Lisa manages our financial strategy and investor relations, driving sustainable growth.',
    color: 'orange',
  },
  {
    name: 'David Kumar',
    title: 'VP of Sales & Marketing',
    bio: 'David leads our go-to-market strategy and builds lasting relationships with enterprise clients.',
    color: 'blue',
  },
  {
    name: 'Emily Wong',
    title: 'VP of Customer Success',
    bio: 'Emily ensures our clients receive exceptional support and achieve their connectivity goals.',
    color: 'green',
  },
];

export function Leadership() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl mb-6">Leadership Team</h1>
            <p className="text-xl opacity-90">
              Meet the experienced professionals driving SuperCorridor's mission to deliver exceptional connectivity solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leaders.map((leader, index) => (
              <div
                key={index}
                className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div
                  className={`w-24 h-24 rounded-full mb-4 mx-auto bg-gradient-to-br ${
                    leader.color === 'orange'
                      ? 'from-orange-400 to-orange-600'
                      : leader.color === 'blue'
                      ? 'from-blue-400 to-blue-600'
                      : 'from-green-400 to-green-600'
                  } flex items-center justify-center text-white text-3xl`}
                >
                  {leader.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-xl text-center mb-1">{leader.name}</h3>
                <p
                  className={`text-center mb-4 ${
                    leader.color === 'orange'
                      ? 'text-orange-600'
                      : leader.color === 'blue'
                      ? 'text-blue-600'
                      : 'text-green-600'
                  }`}
                >
                  {leader.title}
                </p>
                <p className="text-gray-600 text-center mb-4">{leader.bio}</p>
                <div className="flex justify-center space-x-4">
                  <a
                    href="#"
                    className={`${
                      leader.color === 'orange'
                        ? 'text-orange-500 hover:text-orange-600'
                        : leader.color === 'blue'
                        ? 'text-blue-600 hover:text-blue-700'
                        : 'text-green-600 hover:text-green-700'
                    } transition-colors`}
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className={`${
                      leader.color === 'orange'
                        ? 'text-orange-500 hover:text-orange-600'
                        : leader.color === 'blue'
                        ? 'text-blue-600 hover:text-blue-700'
                        : 'text-green-600 hover:text-green-700'
                    } transition-colors`}
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Team CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl mb-4">Join Our Team</h2>
          <p className="text-xl opacity-90 mb-6">
            We're always looking for talented professionals to help us build the future of connectivity.
          </p>
          <a
            href="/careers"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            View Open Positions
          </a>
        </div>
      </section>
    </div>
  );
}
