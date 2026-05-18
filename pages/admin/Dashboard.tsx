import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/AdminLayout';
import {
  Users,
  Briefcase,
  Mail,
  FileText,
  TrendingUp,
  Network,
  Home,
} from 'lucide-react';
import { apiFetch } from '../../utils/storage';

export function Dashboard() {
  const [dashboardStats, setDashboardStats] = useState({
    totalMessages: 0,
    newMessages: 0,
    totalApplications: 0,
    newApplications: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const response = await apiFetch('/api/admin/dashboard-stats', { method: 'GET' });
        if (response.ok) {
          const data = await response.json();
          if (data.stats) setDashboardStats(data.stats);
        }
      } catch {
        // use defaults
      }
    };
    void load();
  }, []);

  const stats = [
    {
      label: 'Contact Messages',
      value: String(dashboardStats.totalMessages),
      change: `${dashboardStats.newMessages} new`,
      icon: Mail,
      bgClass: 'bg-blue-100',
      textClass: 'text-blue-600',
    },
    {
      label: 'Job Applications',
      value: String(dashboardStats.totalApplications),
      change: `${dashboardStats.newApplications} new`,
      icon: Briefcase,
      bgClass: 'bg-green-100',
      textClass: 'text-green-600',
    },
  ];

  const quickActions = [
    {
      title: 'Manage Home Page',
      description: 'Update hero section, stats, and featured content',
      icon: Home,
      link: '/admin/home',
      bgClass: 'bg-orange-100',
      textClass: 'text-orange-600',
    },
    {
      title: 'Network Coverage',
      description: 'Update coverage map and network information',
      icon: Network,
      link: '/admin/network-coverage',
      bgClass: 'bg-blue-100',
      textClass: 'text-blue-600',
    },
    {
      title: 'Articles & Resources',
      description: 'Manage insights, case studies, and FAQs',
      icon: FileText,
      link: '/admin/resources/insights',
      bgClass: 'bg-green-100',
      textClass: 'text-green-600',
    },
    {
      title: 'View Messages',
      description: 'Check and respond to contact inquiries',
      icon: Mail,
      link: '/admin/contact',
      bgClass: 'bg-orange-100',
      textClass: 'text-orange-600',
    },
    {
      title: 'Careers & Jobs',
      description: 'Manage job postings and applications',
      icon: Briefcase,
      link: '/admin/careers/jobs',
      bgClass: 'bg-blue-100',
      textClass: 'text-blue-600',
    },
    {
      title: 'Customers',
      description: 'Manage customer logos and testimonials',
      icon: Users,
      link: '/admin/customers',
      bgClass: 'bg-green-100',
      textClass: 'text-green-600',
    },
  ];

  const recentActivity = dashboardStats.newMessages > 0 || dashboardStats.newApplications > 0
    ? [
        ...(dashboardStats.newMessages > 0 ? [{ action: `${dashboardStats.newMessages} new contact message(s) waiting for review`, time: 'Recent' }] : []),
        ...(dashboardStats.newApplications > 0 ? [{ action: `${dashboardStats.newApplications} new job application(s) to review`, time: 'Recent' }] : []),
        { action: `${dashboardStats.totalMessages} total contact messages`, time: 'All time' },
        { action: `${dashboardStats.totalApplications} total job applications`, time: 'All time' },
      ]
    : [
        { action: 'No new activity yet', time: 'Start by adding content via the admin panel' },
      ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your website.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgClass}`}>
                <stat.icon className={`w-6 h-6 ${stat.textClass}`} />
              </div>
              <span className="text-orange-600 text-sm">{stat.change}</span>
            </div>
            <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-100 hover:border-orange-500 hover:shadow-lg transition-all group"
            >
              <div
                className={`inline-flex p-3 rounded-lg ${action.bgClass} mb-4 group-hover:scale-110 transition-transform`}
              >
                <action.icon className={`w-6 h-6 ${action.textClass}`} />
              </div>
              <h3 className="text-lg mb-2 group-hover:text-orange-600 transition-colors">
                {action.title}
              </h3>
              <p className="text-gray-600 text-sm">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-100">
        <div className="flex items-center mb-4">
          <TrendingUp className="w-6 h-6 text-orange-600 mr-2" />
          <h2 className="text-2xl">Recent Activity</h2>
        </div>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <p className="text-gray-700">{activity.action}</p>
              <span className="text-sm text-gray-500 whitespace-nowrap ml-4">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}