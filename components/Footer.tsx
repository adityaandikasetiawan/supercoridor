import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

interface SocialItem {
  name: string;
  url: string;
  icon?: string;
}

interface SiteSettings {
  website?: { name?: string; phone?: string; email?: string; address?: string };
  social?: SocialItem[] | Record<string, string>;
}

function getDefaultIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes('facebook')) return Facebook;
  if (n.includes('twitter') || n.includes('x')) return Twitter;
  if (n.includes('linkedin')) return Linkedin;
  if (n.includes('instagram')) return Instagram;
  if (n.includes('youtube')) return Youtube;
  return null;
}

export function Footer() {
  const [settings, setSettings] = useState<SiteSettings>({});

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/content/settings', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.settings) setSettings(data.settings);
        }
      } catch { /* use defaults */ }
    })();
  }, []);

  const website = settings.website ?? {};

  // Normalize social to array format
  let socialItems: SocialItem[] = [];
  if (Array.isArray(settings.social)) {
    socialItems = settings.social.filter((item) => item.url);
  } else if (settings.social && typeof settings.social === 'object') {
    // Old format: { facebook: "url", twitter: "url", ... }
    socialItems = Object.entries(settings.social)
      .filter(([, v]) => typeof v === 'string' && v)
      .map(([key, value]) => ({
        name: key === 'facebook' ? 'Facebook' : key === 'twitter' ? 'Twitter / X' : key === 'linkedin' ? 'LinkedIn' : key === 'instagram' ? 'Instagram' : key === 'youtube' ? 'YouTube' : key === 'whatsapp' ? 'WhatsApp' : key,
        url: value,
        icon: '',
      }));
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="inline-flex items-center">
              <img src="/image/logo-tis.png" alt="TIS Logo" className="h-12" />
            </Link>
            <p className="text-gray-400 mb-4">
              Leading provider of enterprise-grade internet connectivity and network solutions.
            </p>
            <div className="flex space-x-4">
              {socialItems.length > 0 ? (
                socialItems.map((item, index) => {
                  const DefaultIcon = getDefaultIcon(item.name);
                  return (
                    <a
                      key={index}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.name}
                      className="text-gray-400 hover:text-orange-500 transition-colors"
                    >
                      {item.icon ? (
                        <img src={item.icon} alt={item.name} className="w-5 h-5" />
                      ) : DefaultIcon ? (
                        <DefaultIcon className="w-5 h-5" />
                      ) : (
                        <span className="w-5 h-5 flex items-center justify-center text-xs font-bold">{item.name.charAt(0)}</span>
                      )}
                    </a>
                  );
                })
              ) : (
                <>
                  <span className="text-gray-400"><Facebook className="w-5 h-5" /></span>
                  <span className="text-gray-400"><Twitter className="w-5 h-5" /></span>
                  <span className="text-gray-400"><Linkedin className="w-5 h-5" /></span>
                  <span className="text-gray-400"><Instagram className="w-5 h-5" /></span>
                </>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4">Solutions</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/solutions/dedicated-connectivity" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Dedicated Connectivity
                </Link>
              </li>
              <li>
                <Link to="/solutions/backbone-network" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Backbone & Network
                </Link>
              </li>
              <li>
                <Link to="/solutions/cloud-interconnection" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Cloud & Interconnection
                </Link>
              </li>
              <li>
                <Link to="/solutions/value-added-services" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Value-Added Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about/company-overview" className="text-gray-400 hover:text-blue-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/network-coverage" className="text-gray-400 hover:text-green-500 transition-colors">
                  Network & Coverage
                </Link>
              </li>
              <li>
                <Link to="/customers" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Customers
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-400 hover:text-green-500 transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start text-gray-400">
                <MapPin className="w-5 h-5 mr-2 mt-1 flex-shrink-0 text-orange-500" />
                <span>{website.address || 'Artha Gading Niaga Blok E 11, 12, 15A Kelapa Gading, Jakarta 14240 Indonesia'}</span>
              </li>
              <li className="flex items-center text-gray-400">
                <Phone className="w-5 h-5 mr-2 flex-shrink-0 text-blue-500" />
                <span>{website.phone || '021-4587 8409'}</span>
              </li>
              <li className="flex items-center text-gray-400">
                <Mail className="w-5 h-5 mr-2 flex-shrink-0 text-green-500" />
                <span>{website.email || 'ask@supercorridor.co.id'}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} SuperCorridor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
