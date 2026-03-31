import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';

export function ContactBar() {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center">
            <span className="text-gray-600 text-sm mr-2">Home</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-900">
              <Phone className="w-4 h-4 mr-2" />
              <span className="text-sm">Call: 021-4587 8409</span>
            </div>
            <Link
              to="/contact"
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
