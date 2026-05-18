import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import { Save, User, Lock, Bell, Globe } from 'lucide-react';
import { apiFetch } from '../../utils/storage';

export function Settings() {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const role = user?.role === 'admin' ? 'super_admin' : user?.role;
  const roleLabel =
    role === 'super_admin' ? 'Super Admin' : role === 'content' ? 'Content Admin' : role === 'hr' ? 'HR' : 'Admin';

  const [profile, setProfile] = useState({
    name: user?.name ?? 'Admin User',
    email: user?.email ?? 'admin@supercorridor.com',
    phone: '+62 812-3456-7890',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    newPassword: '',
    confirm: '',
  });

  const [notifications, setNotifications] = useState({
    contactMessages: true,
    jobApplications: true,
    weeklySummary: false,
    systemUpdates: true,
  });

  const [website, setWebsite] = useState({
    name: 'SuperCorridor',
    phone: '021-4587 8409',
    email: 'ask@supercorridor.co.id',
    address: 'Artha Gading Niaga Blok E 11, 12, 15A Kelapa Gading, Jakarta 14240 Indonesia',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const response = await apiFetch('/api/admin/content/settings', { method: 'GET' });
        if (response.ok) {
          const data = await response.json();
          if (data.settings) {
            if (data.settings.profile) setProfile(data.settings.profile);
            if (data.settings.notifications) setNotifications(data.settings.notifications);
            if (data.settings.website) setWebsite(data.settings.website);
          }
        }
      } catch {
        // use defaults
      }
    };
    void load();
  }, []);

  const handleSave = async () => {
    setError('');
    try {
      const response = await apiFetch('/api/admin/content/settings', {
        method: 'PUT',
        body: JSON.stringify({
          settings: { profile, notifications, website },
        }),
      });
      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError('Failed to save settings');
      }
    } catch {
      setError('Failed to save settings');
    }
  };

  const handleChangePassword = async () => {
    setError('');
    if (!passwords.current || !passwords.newPassword) {
      setError('Please fill in current and new password');
      return;
    }
    if (passwords.newPassword !== passwords.confirm) {
      setError('New passwords do not match');
      return;
    }
    if (passwords.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }
    try {
      const response = await apiFetch('/api/admin/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.newPassword,
        }),
      });
      if (response.ok) {
        setPasswords({ current: '', newPassword: '', confirm: '' });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const data = await response.json();
        setError(data.error === 'INVALID_PASSWORD' ? 'Current password is incorrect' : 'Failed to change password');
      }
    } catch {
      setError('Failed to change password');
    }
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

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {saved && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          Changes saved successfully!
        </div>
      )}

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
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Phone Number</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
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
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">New Password</label>
            <input
              type="password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Confirm New Password</label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="button"
              onClick={handleChangePassword}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              Update Password
            </button>
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
            <input
              type="checkbox"
              checked={notifications.contactMessages}
              onChange={(e) => setNotifications({ ...notifications, contactMessages: e.target.checked })}
              className="w-5 h-5"
            />
          </label>
          <label className="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <span>Email notifications for new job applications</span>
            <input
              type="checkbox"
              checked={notifications.jobApplications}
              onChange={(e) => setNotifications({ ...notifications, jobApplications: e.target.checked })}
              className="w-5 h-5"
            />
          </label>
          <label className="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <span>Weekly summary report</span>
            <input
              type="checkbox"
              checked={notifications.weeklySummary}
              onChange={(e) => setNotifications({ ...notifications, weeklySummary: e.target.checked })}
              className="w-5 h-5"
            />
          </label>
          <label className="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <span>System updates and maintenance alerts</span>
            <input
              type="checkbox"
              checked={notifications.systemUpdates}
              onChange={(e) => setNotifications({ ...notifications, systemUpdates: e.target.checked })}
              className="w-5 h-5"
            />
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
              value={website.name}
              onChange={(e) => setWebsite({ ...website, name: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Company Phone</label>
            <input
              type="text"
              value={website.phone}
              onChange={(e) => setWebsite({ ...website, phone: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Company Email</label>
            <input
              type="email"
              value={website.email}
              onChange={(e) => setWebsite({ ...website, email: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Address</label>
            <textarea
              value={website.address}
              onChange={(e) => setWebsite({ ...website, address: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
              rows={3}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
