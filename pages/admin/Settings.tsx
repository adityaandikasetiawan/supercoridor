import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import { Save, User, Lock, Bell, Globe, Share2, Search, Shield } from 'lucide-react';
import { apiFetch } from '../../utils/storage';
import { ImageUpload } from '../../components/ImageUpload';

export function Settings() {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'website' | 'social' | 'seo' | 'notifications' | 'advanced'>('profile');
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
    logo: '',
    favicon: '',
  });

  const [social, setSocial] = useState<{ name: string; url: string; icon: string }[]>([
    { name: 'Facebook', url: '', icon: '' },
    { name: 'Twitter / X', url: '', icon: '' },
    { name: 'LinkedIn', url: '', icon: '' },
    { name: 'Instagram', url: '', icon: '' },
    { name: 'YouTube', url: '', icon: '' },
    { name: 'WhatsApp', url: '', icon: '' },
  ]);

  const [seo, setSeo] = useState({
    metaTitle: 'SuperCorridor - Enterprise Connectivity Solutions',
    metaDescription: 'Leading Internet Service Provider in Indonesia delivering enterprise-grade connectivity solutions with 99.99% uptime guarantee.',
    ogImage: '',
    googleAnalyticsId: '',
  });

  const [advanced, setAdvanced] = useState({
    maintenanceMode: false,
    maintenanceMessage: 'We are currently performing scheduled maintenance. Please check back soon.',
    defaultLanguage: 'id' as 'id' | 'en',
    timezone: 'Asia/Jakarta',
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
            if (data.settings.website) setWebsite((prev) => ({ ...prev, ...data.settings.website }));
            if (data.settings.social) {
              if (Array.isArray(data.settings.social)) {
                setSocial(data.settings.social);
              } else {
                // Convert old format to new format
                const oldSocial = data.settings.social;
                const converted = Object.entries(oldSocial)
                  .filter(([, v]) => typeof v === 'string')
                  .map(([key, value]) => ({
                    name: key === 'facebook' ? 'Facebook' : key === 'twitter' ? 'Twitter / X' : key === 'linkedin' ? 'LinkedIn' : key === 'instagram' ? 'Instagram' : key === 'youtube' ? 'YouTube' : key === 'whatsapp' ? 'WhatsApp' : key,
                    url: value as string,
                    icon: '',
                  }))
                  .filter((item) => item.url);
                if (converted.length > 0) setSocial(converted);
              }
            }
            if (data.settings.seo) setSeo((prev) => ({ ...prev, ...data.settings.seo }));
            if (data.settings.advanced) setAdvanced((prev) => ({ ...prev, ...data.settings.advanced }));
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
          settings: { profile, notifications, website, social, seo, advanced },
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

  const tabs = [
    { key: 'profile' as const, label: 'Profile', icon: User },
    { key: 'website' as const, label: 'Website', icon: Globe },
    { key: 'social' as const, label: 'Social Media', icon: Share2 },
    { key: 'seo' as const, label: 'SEO', icon: Search },
    { key: 'notifications' as const, label: 'Notifications', icon: Bell },
    { key: 'advanced' as const, label: 'Advanced', icon: Shield },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account and website settings</p>
          </div>
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            {saved ? 'Saved!' : 'Save All'}
          </button>
        </div>

        {error && (
          <div role="alert" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
        )}
        {saved && (
          <div role="alert" className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">Changes saved successfully!</div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 pb-3 px-3 border-b-2 transition-colors whitespace-nowrap text-sm ${
                  activeTab === tab.key ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-orange-600" /> Profile Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Full Name</label>
                  <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Email Address</label>
                  <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Role</label>
                  <input type="text" value={roleLabel} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-orange-600" /> Change Password
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700 mb-1">Current Password</label>
                  <input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">New Password</label>
                  <input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Confirm New Password</label>
                  <input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
                <div className="md:col-span-2">
                  <button type="button" onClick={handleChangePassword} className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors text-sm">
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Website Tab */}
        {activeTab === 'website' && (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-orange-600" /> Website Information
            </h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Website Name</label>
                  <input type="text" value={website.name} onChange={(e) => setWebsite({ ...website, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Company Phone</label>
                  <input type="text" value={website.phone} onChange={(e) => setWebsite({ ...website, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Company Email</label>
                <input type="email" value={website.email} onChange={(e) => setWebsite({ ...website, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Address</label>
                <textarea value={website.address} onChange={(e) => setWebsite({ ...website, address: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" rows={3} />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <ImageUpload value={website.logo} onChange={(url) => setWebsite({ ...website, logo: url })} label="Website Logo" previewClassName="h-12 object-contain rounded" />
                </div>
                <div>
                  <ImageUpload value={website.favicon} onChange={(url) => setWebsite({ ...website, favicon: url })} label="Favicon" previewClassName="w-8 h-8 object-contain rounded" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Social Media Tab */}
        {activeTab === 'social' && (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg text-gray-900 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-orange-600" /> Social Media Links
              </h2>
              <button
                type="button"
                onClick={() => setSocial([...social, { name: '', url: '', icon: '' }])}
                className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                + Add Social Media
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">Manage your social media links. Upload custom icons or leave blank for default icons.</p>
            <div className="space-y-4">
              {social.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Social Media {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => setSocial(social.filter((_, i) => i !== index))}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Platform Name</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => { const updated = [...social]; updated[index] = { ...updated[index], name: e.target.value }; setSocial(updated); }}
                        placeholder="e.g. Facebook, TikTok, etc."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">URL / Link</label>
                      <input
                        type="text"
                        value={item.url}
                        onChange={(e) => { const updated = [...social]; updated[index] = { ...updated[index], url: e.target.value }; setSocial(updated); }}
                        placeholder="https://..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <ImageUpload
                      value={item.icon}
                      onChange={(url) => { const updated = [...social]; updated[index] = { ...updated[index], icon: url }; setSocial(updated); }}
                      label="Custom Icon (optional, recommended 24x24 PNG)"
                      previewClassName="w-8 h-8 object-contain"
                    />
                  </div>
                </div>
              ))}
              {social.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No social media links added. Click "Add Social Media" to get started.</p>
              )}
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-orange-600" /> SEO Settings
            </h2>
            <p className="text-sm text-gray-600 mb-4">Configure default meta tags for search engine optimization.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Meta Title</label>
                <input type="text" value={seo.metaTitle} onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                <p className="text-xs text-gray-500 mt-1">{seo.metaTitle.length}/60 characters (recommended max 60)</p>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Meta Description</label>
                <textarea value={seo.metaDescription} onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" rows={3} />
                <p className="text-xs text-gray-500 mt-1">{seo.metaDescription.length}/160 characters (recommended max 160)</p>
              </div>
              <div>
                <ImageUpload value={seo.ogImage} onChange={(url) => setSeo({ ...seo, ogImage: url })} label="Open Graph Image (shared on social media)" previewClassName="w-full h-32 object-cover rounded-lg" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Google Analytics ID</label>
                <input type="text" value={seo.googleAnalyticsId} onChange={(e) => setSeo({ ...seo, googleAnalyticsId: e.target.value })} placeholder="G-XXXXXXXXXX" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-600" /> Notification Preferences
            </h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <div>
                  <span className="text-sm text-gray-900">New contact messages</span>
                  <p className="text-xs text-gray-500">Get notified when someone submits the contact form</p>
                </div>
                <input type="checkbox" checked={notifications.contactMessages} onChange={(e) => setNotifications({ ...notifications, contactMessages: e.target.checked })} className="w-5 h-5 text-orange-600 rounded" />
              </label>
              <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <div>
                  <span className="text-sm text-gray-900">New job applications</span>
                  <p className="text-xs text-gray-500">Get notified when someone applies for a job</p>
                </div>
                <input type="checkbox" checked={notifications.jobApplications} onChange={(e) => setNotifications({ ...notifications, jobApplications: e.target.checked })} className="w-5 h-5 text-orange-600 rounded" />
              </label>
              <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <div>
                  <span className="text-sm text-gray-900">Weekly summary report</span>
                  <p className="text-xs text-gray-500">Receive a weekly digest of website activity</p>
                </div>
                <input type="checkbox" checked={notifications.weeklySummary} onChange={(e) => setNotifications({ ...notifications, weeklySummary: e.target.checked })} className="w-5 h-5 text-orange-600 rounded" />
              </label>
              <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <div>
                  <span className="text-sm text-gray-900">System updates</span>
                  <p className="text-xs text-gray-500">Get notified about maintenance and system updates</p>
                </div>
                <input type="checkbox" checked={notifications.systemUpdates} onChange={(e) => setNotifications({ ...notifications, systemUpdates: e.target.checked })} className="w-5 h-5 text-orange-600 rounded" />
              </label>
            </div>
          </div>
        )}

        {/* Advanced Tab */}
        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-600" /> Maintenance Mode
              </h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div>
                    <span className="text-sm text-gray-900 font-medium">Enable Maintenance Mode</span>
                    <p className="text-xs text-gray-500">When enabled, visitors will see a maintenance page instead of the website</p>
                  </div>
                  <input type="checkbox" checked={advanced.maintenanceMode} onChange={(e) => setAdvanced({ ...advanced, maintenanceMode: e.target.checked })} className="w-5 h-5 text-red-600 rounded" />
                </label>
                {advanced.maintenanceMode && (
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Maintenance Message</label>
                    <textarea value={advanced.maintenanceMessage} onChange={(e) => setAdvanced({ ...advanced, maintenanceMessage: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" rows={3} />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg text-gray-900 mb-4">Localization</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Default Language</label>
                  <select value={advanced.defaultLanguage} onChange={(e) => setAdvanced({ ...advanced, defaultLanguage: e.target.value as 'id' | 'en' })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Timezone</label>
                  <select value={advanced.timezone} onChange={(e) => setAdvanced({ ...advanced, timezone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option value="Asia/Jakarta">Asia/Jakarta (WIB, UTC+7)</option>
                    <option value="Asia/Makassar">Asia/Makassar (WITA, UTC+8)</option>
                    <option value="Asia/Jayapura">Asia/Jayapura (WIT, UTC+9)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
