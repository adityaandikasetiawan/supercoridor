import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, Calculator, History, HardDrive, LogOut, Menu, X, ArrowLeft, ShieldCheck } from 'lucide-react';

export function EnterpriseLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const role = user?.role ?? 'sales';
  const isAdmin = role === 'super_admin' || role === 'sales_admin';

  // Menu items based on role
  const menuItems = [
    { path: '/enterprise', icon: LayoutDashboard, label: 'Dashboard', roles: ['super_admin', 'sales_admin', 'sales'] },
    { path: '/enterprise/quotation', icon: Calculator, label: 'New Quotation', roles: ['super_admin', 'sales_admin', 'sales'] },
    { path: '/enterprise/history', icon: History, label: 'History', roles: ['super_admin', 'sales_admin', 'sales'] },
    { path: '/enterprise/devices', icon: HardDrive, label: 'Devices', roles: ['super_admin', 'sales_admin'] },
  ].filter(item => item.roles.includes(role));

  const roleBadge: Record<string, { label: string; color: string }> = {
    super_admin: { label: 'Super Admin', color: 'text-red-400' },
    sales_admin: { label: 'Sales Admin', color: 'text-amber-400' },
    sales: { label: 'Sales', color: 'text-green-400' },
  };

  const badge = roleBadge[role] ?? { label: role, color: 'text-gray-400' };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className={`bg-gray-900 text-white transition-all duration-300 ${sidebarOpen ? 'w-60' : 'w-16'} flex flex-col`}>
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          {sidebarOpen && (
            <div>
              <span className="text-sm font-semibold text-purple-400">Solusi Enterprise</span>
              <div className={`flex items-center gap-1 text-xs mt-0.5 ${badge.color}`}>
                {isAdmin && <ShieldCheck className="w-3 h-3" />}
                <span>{badge.label}</span>
              </div>
            </div>
          )}
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
          {sidebarOpen && user && (
            <div className="px-3 py-2 text-xs text-gray-500">
              <p className="truncate">{user.name}</p>
              <p className="truncate text-gray-600">{user.email}</p>
            </div>
          )}
          {isAdmin && (
            <Link to="/admin/dashboard" className="flex items-center px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              {sidebarOpen && <span className="ml-3 text-sm">Back to Admin</span>}
            </Link>
          )}
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
