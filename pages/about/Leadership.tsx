import { Linkedin, Mail, Twitter, Instagram } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { usePageContent } from '../../hooks/usePageContent';

interface Leader {
  id?: string;
  name: string;
  position: string;
  bio: string;
  image?: string;
  linkedin?: string;
  email?: string;
  twitter?: string;
  instagram?: string;
  color?: string;
}

export function Leadership() {
  const content = usePageContent('about-leadership', {
    teamMembers: [] as Leader[],
  });

  const colors = ['orange', 'blue', 'green'];
  const leaders: Leader[] = (content.teamMembers || []).map((m: Leader, i: number) => ({
    ...m,
    color: colors[i % 3],
  }));

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
                key={leader.id || index}
                className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                {/* Photo or Initials */}
                {leader.image ? (
                  <div className="w-24 h-24 rounded-full mb-4 mx-auto overflow-hidden">
                    <ImageWithFallback
                      src={leader.image}
                      alt={leader.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
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
                )}

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
                  {leader.position}
                </p>
                <p className="text-gray-600 text-center mb-4">{leader.bio}</p>

                {/* Social Media Links */}
                <div className="flex justify-center space-x-3">
                  {leader.linkedin && (
                    <a
                      href={leader.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                      aria-label={`${leader.name} LinkedIn`}
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {leader.email && (
                    <a
                      href={`mailto:${leader.email}`}
                      className="text-gray-600 hover:text-gray-700 transition-colors"
                      aria-label={`Email ${leader.name}`}
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                  )}
                  {leader.twitter && (
                    <a
                      href={leader.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-500 hover:text-sky-600 transition-colors"
                      aria-label={`${leader.name} Twitter`}
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {leader.instagram && (
                    <a
                      href={leader.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-500 hover:text-pink-600 transition-colors"
                      aria-label={`${leader.name} Instagram`}
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {/* Fallback if no social links */}
                  {!leader.linkedin && !leader.email && !leader.twitter && !leader.instagram && (
                    <span className="text-xs text-gray-400 italic">No social media</span>
                  )}
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
