import { useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { apiFetch } from '../../utils/storage';

export function ChangePassword() {
  const { user } = useAuth();
  const [passwords, setPasswords] = useState({
    current: '',
    newPassword: '',
    confirm: '',
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

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

    setLoading(true);
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
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
      } else {
        const data = await response.json();
        setError(
          data.error === 'INVALID_PASSWORD'
            ? 'Current password is incorrect'
            : 'Failed to change password'
        );
      }
    } catch {
      setError('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-lg mx-auto space-y-6">
        <div>
          <h1 className="text-2xl text-gray-900">Change Password</h1>
          <p className="text-gray-600 mt-1">
            Update the password for <span className="font-medium">{user?.email}</span>
          </p>
        </div>

        {error && (
          <div role="alert" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {success && (
          <div role="alert" className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Password changed successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg text-gray-900">Update Password</h2>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter new password (min. 6 characters)"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
