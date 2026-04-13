import { useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import { Save, User, Lock, Bell, Globe } from 'lucide-react';

export function Settings() {
  const [saved, setSaved] = useState(false);
  const { user } = useAuth();
  const role = user?.role === 'admin' ? 'super_admin' : user?.role;
  const roleLabel =
    role === 'super_admin' ? 'Super Admin' : role === 'content' ? 'Content Admin' : role === 'hr' ? 'HR' : 'Admin';

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account and website settings</p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Save className="w-4 h-4 mr-2" />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-100 mb-6">
        <h2 className="text-xl mb-4 flex items-center">
          <User className="w-5 h-5 mr-2 text-orange-600" />
          Profile Settings
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-2">Full Name</label>
            <input
              type="text"
              defaultValue="Admin User"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Email Address</label>
            <input
              type="email"
              defaultValue="admin@supercorridor.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Phone Number</label>
            <input
              type="tel"
              defaultValue="+62 812-3456-7890"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Role</label>
            <input
              type="text"
              value={roleLabel}
              disabled
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Password Settings */}
      <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-100 mb-6">
        <h2 className="text-xl mb-4 flex items-center">
          <Lock className="w-5 h-5 mr-2 text-orange-600" />
          Change Password
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm mb-2">Current Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">New Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Confirm New Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-100 mb-6">
        <h2 className="text-xl mb-4 flex items-center">
          <Bell className="w-5 h-5 mr-2 text-orange-600" />
          Notification Settings
        </h2>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <span>Email notifications for new contact messages</span>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </label>
          <label className="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <span>Email notifications for new job applications</span>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </label>
          <label className="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <span>Weekly summary report</span>
            <input type="checkbox" className="w-5 h-5" />
          </label>
          <label className="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <span>System updates and maintenance alerts</span>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </label>
        </div>
      </div>

      {/* Website Settings */}
      <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-100">
        <h2 className="text-xl mb-4 flex items-center">
          <Globe className="w-5 h-5 mr-2 text-orange-600" />
          Website Settings
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Website Name</label>
            <input
              type="text"
              defaultValue="SuperCorridor"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Company Phone</label>
            <input
              type="text"
              defaultValue="021-4587 8409"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Company Email</label>
            <input
              type="email"
              defaultValue="ask@supercorridor.co.id"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Address</label>
            <textarea
              defaultValue="Artha Gading Niaga Blok E 11, 12, 15A Kelapa Gading, Jakarta 14240 Indonesia"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
              rows={3}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
