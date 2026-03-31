import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/AdminLayout';
import {
  Users,
  Briefcase,
  Mail,
  FileText,
  TrendingUp,
  Eye,
  Network,
  Home,
} from 'lucide-react';

export function Dashboard() {
  const stats = [
    {
      label: 'Total Visitors',
      value: '12,543',
      change: '+12.5%',
      icon: Eye,
      color: 'orange',
    },
    {
      label: 'Contact Messages',
      value: '89',
      change: '+5.2%',
      icon: Mail,
      color: 'blue',
    },
    {
      label: 'Job Applications',
      value: '234',
      change: '+18.3%',
      icon: Briefcase,
      color: 'green',
    },
    {
      label: 'Active Customers',
      value: '542',
      change: '+8.7%',
      icon: Users,
      color: 'orange',
    },
  ];

  const quickActions = [
    {
      title: 'Manage Home Page',
      description: 'Update hero section, stats, and featured content',
      icon: Home,
      link: '/admin/home',
      color: 'orange',
    },
    {
      title: 'Network Coverage',
      description: 'Update coverage map and network information',
      icon: Network,
      link: '/admin/network-coverage',
      color: 'blue',
    },
    {
      title: 'Articles & Resources',
      description: 'Manage insights, case studies, and FAQs',
      icon: FileText,
      link: '/admin/resources/insights',
      color: 'green',
    },
    {
      title: 'View Messages',
      description: 'Check and respond to contact inquiries',
      icon: Mail,
      link: '/admin/contact',
      color: 'orange',
    },
    {
      title: 'Careers & Jobs',
      description: 'Manage job postings and applications',
      icon: Briefcase,
      link: '/admin/careers/jobs',
      color: 'blue',
    },
    {
      title: 'Customers',
      description: 'Manage customer logos and testimonials',
      icon: Users,
      link: '/admin/customers',
      color: 'green',
    },
  ];

  const recentActivity = [
    { action: 'New contact message from PT. Telkom Indonesia', time: '5 minutes ago' },
    { action: 'Job application received for Senior Network Engineer', time: '1 hour ago' },
    { action: 'Home page content updated', time: '3 hours ago' },
    { action: 'New case study published', time: '1 day ago' },
    { action: 'Network coverage map updated', time: '2 days ago' },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your website.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 rounded-lg bg-${stat.color}-100`}
              >
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <span className="text-green-600 text-sm">{stat.change}</span>
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
                className={`inline-flex p-3 rounded-lg bg-${action.color}-100 mb-4 group-hover:scale-110 transition-transform`}
              >
                <action.icon className={`w-6 h-6 text-${action.color}-600`} />
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