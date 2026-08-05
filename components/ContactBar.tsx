import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';

export function ContactBar() {
  const [phone, setPhone] = useState('021-4587 8409');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/content/settings', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.settings?.website?.phone) setPhone(data.settings.website.phone);
        }
      } catch { /* use default */ }
    })();
  }, []);

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center">
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-900">
              <Phone className="w-4 h-4 mr-2" />
              <span className="text-sm">Call: {phone}</span>
            </div>
            <Link
              to="/contact-us"
              className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors text-sm"
            >
              Contact sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
