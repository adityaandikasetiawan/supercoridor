import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Home,
  Network,
  FileText,
  Users,
  Users2,
  Briefcase,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Globe,
  Info,
  Layers,
  Cpu,
  Calculator,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [careersOpen, setCareersOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const role = user?.role === 'admin' ? 'super_admin' : user?.role;
  const canManageContent = role === 'super_admin' || role === 'content';
  const canManageHr = role === 'super_admin' || role === 'hr';
  const canAccessSales = role === 'super_admin' || role === 'sales';

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ...(canManageContent
      ? [
          { path: '/admin/home', icon: Home, label: 'Home Page' },
          { path: '/admin/tgcs-management', icon: Layers, label: 'TGCS Project' },
          { path: '/admin/solutions', icon: Network, label: 'Solutions' },
          { path: '/admin/technology', icon: Cpu, label: 'Technology' },
          {
            label: 'About Us',
            icon: Info,
            submenu: [
              { path: '/admin/about/company-overview', label: 'Company Overview' },
              { path: '/admin/about/vision-mission', label: 'Vision & Mission' },
              { path: '/admin/about/leadership', label: 'Leadership' },
              { path: '/admin/about/milestones', label: 'Milestones' },
            ],
          },
          { path: '/admin/network-coverage', icon: Globe, label: 'Network & Coverage' },
          {
            label: 'Resources',
            icon: FileText,
            submenu: [
              { path: '/admin/resources/insights', label: 'Insights / Articles' },
              { path: '/admin/resources/case-studies', label: 'Case Studies' },
              { path: '/admin/resources/faq', label: 'FAQ' },
            ],
          },
          { path: '/admin/customers', icon: Users, label: 'Customers' },
          { path: '/admin/contact', icon: Mail, label: 'Contact Messages' },
        ]
      : []),
    ...(canManageHr
      ? [
          {
            label: 'Careers',
            icon: Briefcase,
            submenu: [
              { path: '/admin/careers/jobs', label: 'Job Posts' },
              { path: '/admin/careers/applications', label: 'Applications' },
            ],
          },
        ]
      : []),
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
    ...(role === 'super_admin' ? [{ path: '/admin/users', icon: Users2, label: 'User Management' }] : []),
    ...(canAccessSales ? [{ path: '/enterprise', icon: Calculator, label: 'Solusi Enterprise' }] : []),
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          {sidebarOpen && (
            <span className="text-lg bg-gradient-to-r from-orange-500 via-blue-600 to-green-500 bg-clip-text text-transparent">
              SuperCorridor
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item, index) => {
            if (item.submenu) {
              const isSubmenuOpen =
                (item.label === 'Solutions' && solutionsOpen) ||
                (item.label === 'About Us' && aboutOpen) ||
                (item.label === 'Resources' && resourcesOpen) ||
                (item.label === 'Careers' && careersOpen);

              return (
                <div key={index}>
                  <button
                    onClick={() => {
                      if (item.label === 'Solutions') setSolutionsOpen(!solutionsOpen);
                      if (item.label === 'About Us') setAboutOpen(!aboutOpen);
                      if (item.label === 'Resources') setResourcesOpen(!resourcesOpen);
                      if (item.label === 'Careers') setCareersOpen(!careersOpen);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center">
                      <item.icon className="w-5 h-5" />
                      {sidebarOpen && <span className="ml-3">{item.label}</span>}
                    </div>
                    {sidebarOpen && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          isSubmenuOpen ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>
                  {sidebarOpen && isSubmenuOpen && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.submenu.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          to={subItem.path}
                          className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActive(subItem.path)
                              ? 'bg-orange-600 text-white'
                              : 'text-gray-300 hover:bg-gray-800'
                          }`}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
                title={!sidebarOpen ? item.label : ''}
              >
                <item.icon className="w-5 h-5" />
                {sidebarOpen && <span className="ml-3">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-800">
          {sidebarOpen && (
            <div className="mb-3">
              <p className="text-sm text-gray-400">Signed in as</p>
              <p className="truncate">{user?.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
