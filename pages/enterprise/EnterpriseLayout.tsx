import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, Calculator, History, HardDrive, Settings, LogOut, Menu, X, ArrowLeft } from 'lucide-react';

export function EnterpriseLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/enterprise', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/enterprise/quotation', icon: Calculator, label: 'New Quotation' },
    { path: '/enterprise/history', icon: History, label: 'History' },
    { path: '/enterprise/devices', icon: HardDrive, label: 'Devices' },
    { path: '/enterprise/config', icon: Settings, label: 'Config' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className={`bg-gray-900 text-white transition-all duration-300 ${sidebarOpen ? 'w-60' : 'w-16'} flex flex-col`}>
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          {sidebarOpen && <span className="text-sm font-semibold text-purple-400">Solusi Enterprise</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-gray-800 rounded">
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path} className={`flex items-center px-3 py-2 rounded-lg transition-colors ${isActive(item.path) ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span className="ml-3 text-sm">{item.label}</span>}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-800 space-y-2">
          <Link to="/admin/dashboard" className="flex items-center px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {sidebarOpen && <span className="ml-3 text-sm">Back to Admin</span>}
          </Link>
          <button onClick={() => { logout(); navigate('/admin/login'); }} className="w-full flex items-center px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors">
            <LogOut className="w-4 h-4" />
            {sidebarOpen && <span className="ml-3 text-sm">Logout</span>}
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
