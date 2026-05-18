import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Plus, Edit, Trash2, Shield, Save } from 'lucide-react';
import { apiFetch } from '../../utils/storage';

// All available permissions in the system
const ALL_PERMISSIONS = [
  { key: 'dashboard', label: 'Dashboard', group: 'General' },
  { key: 'home', label: 'Home Page', group: 'Content' },
  { key: 'tgcs', label: 'TGCS Project', group: 'Content' },
  { key: 'solutions', label: 'Solutions', group: 'Content' },
  { key: 'technology', label: 'Technology', group: 'Content' },
  { key: 'about', label: 'About Us', group: 'Content' },
  { key: 'network', label: 'Network & Coverage', group: 'Content' },
  { key: 'resources', label: 'Resources', group: 'Content' },
  { key: 'customers', label: 'Customers', group: 'Content' },
  { key: 'contact', label: 'Contact Messages', group: 'Content' },
  { key: 'careers', label: 'Careers', group: 'HR' },
  { key: 'settings', label: 'Settings', group: 'General' },
  { key: 'users', label: 'User Management', group: 'Admin' },
] as const;

type PermissionKey = typeof ALL_PERMISSIONS[number]['key'];

// Default permissions per role template
const ROLE_TEMPLATES: Record<string, PermissionKey[]> = {
  super_admin: ALL_PERMISSIONS.map((p) => p.key),
  content: ['dashboard', 'home', 'tgcs', 'solutions', 'technology', 'about', 'network', 'resources', 'customers', 'contact', 'settings'],
  hr: ['dashboard', 'careers', 'settings'],
};

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'content' | 'hr';
  permissions: PermissionKey[];
  active: boolean;
  createdAt: string;
}

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  content: 'Content Admin',
  hr: 'HR Admin',
};

const ROLE_COLORS: Record<string, string> = {
  super_admin: 'bg-red-100 text-red-700',
  content: 'bg-blue-100 text-blue-700',
  hr: 'bg-green-100 text-green-700',
};

export function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'content' as 'super_admin' | 'content' | 'hr',
    password: '',
    active: true,
    permissions: ROLE_TEMPLATES.content as PermissionKey[],
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch('/api/admin/users', { method: 'GET' });
        if (res.ok) {
          const data = await res.json();
          if (data.users) setUsers(data.users);
        }
      } catch {
        // use empty
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const handleOpenModal = (user?: AdminUser) => {
    setError('');
    if (user) {
      setEditingUser(user);
      setFormData({
        email: user.email,
        name: user.name,
        role: user.role,
        password: '',
        active: user.active,
        permissions: user.permissions ?? ROLE_TEMPLATES[user.role] ?? [],
      });
    } else {
      setEditingUser(null);
      setFormData({
        email: '',
        name: '',
        role: 'content',
        password: '',
        active: true,
        permissions: [...ROLE_TEMPLATES.content],
      });
    }
    setIsModalOpen(true);
  };

  const handleRoleChange = (role: 'super_admin' | 'content' | 'hr') => {
    setFormData({
      ...formData,
      role,
      permissions: [...(ROLE_TEMPLATES[role] ?? [])],
    });
  };

  const togglePermission = (key: PermissionKey) => {
    const current = formData.permissions;
    if (current.includes(key)) {
      setFormData({ ...formData, permissions: current.filter((p) => p !== key) });
    } else {
      setFormData({ ...formData, permissions: [...current, key] });
    }
  };

  const selectAllPermissions = () => {
    setFormData({ ...formData, permissions: ALL_PERMISSIONS.map((p) => p.key) });
  };

  const clearAllPermissions = () => {
    setFormData({ ...formData, permissions: ['dashboard'] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.name || !formData.role) {
      setError('Please fill in all required fields');
      return;
    }
    if (!editingUser && !formData.password) {
      setError('Password is required for new users');
      return;
    }
    if (formData.password && formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const payload = editingUser
      ? { id: editingUser.id, email: formData.email, name: formData.name, role: formData.role, active: formData.active, permissions: formData.permissions, ...(formData.password ? { password: formData.password } : {}) }
      : { email: formData.email, name: formData.name, role: formData.role, password: formData.password, active: formData.active, permissions: formData.permissions };

    const url = editingUser ? '/api/admin/users/update' : '/api/admin/users/create';
    const res = await apiFetch(url, { method: 'POST', body: JSON.stringify(payload) });

    if (res.ok) {
      const data = await res.json();
      if (editingUser) {
        setUsers(users.map((u) => (u.id === editingUser.id ? { ...u, ...data.user } : u)));
      } else {
        setUsers([...users, data.user]);
      }
      setIsModalOpen(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.error === 'EMAIL_EXISTS' ? 'Email already exists' : data?.error ?? 'Failed to save user');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    const res = await apiFetch('/api/admin/users/delete', { method: 'POST', body: JSON.stringify({ id }) });
    if (res.ok) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const handleToggleActive = async (id: string) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;
    const res = await apiFetch('/api/admin/users/update', {
      method: 'POST',
      body: JSON.stringify({ id, active: !user.active, email: user.email, name: user.name, role: user.role, permissions: user.permissions }),
    });
    if (res.ok) {
      setUsers(users.map((u) => (u.id === id ? { ...u, active: !u.active } : u)));
    }
  };

  // Group permissions by category
  const permissionGroups = ALL_PERMISSIONS.reduce<Record<string, typeof ALL_PERMISSIONS[number][]>>((acc, perm) => {
    if (!acc[perm.group]) acc[perm.group] = [];
    acc[perm.group].push(perm);
    return acc;
  }, {});

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[40vh]">
          <p className="text-gray-500">Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">Manage admin users and permissions (RBAC)</p>
          </div>
          <button onClick={() => handleOpenModal()} className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center">
            <Plus className="w-5 h-5 mr-2" /> Add User
          </button>
        </div>

        {isSaved && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">Changes saved successfully!</div>
        )}

        {/* Users List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Permissions</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded ${ROLE_COLORS[user.role] ?? 'bg-gray-100 text-gray-700'}`}>
                        {ROLE_LABELS[user.role] ?? user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {(user.permissions ?? []).length} / {ALL_PERMISSIONS.length} features
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleToggleActive(user.id)} className={`text-xs px-2 py-1 rounded cursor-pointer ${user.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {user.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleOpenModal(user)} className="text-blue-600 hover:text-blue-700"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">No users found. Add your first admin user.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl text-gray-900 mb-4">{editingUser ? 'Edit User' : 'Add New User'}</h2>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Full Name *</label>
                      <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" required />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Email *</label>
                      <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Role Template *</label>
                      <select value={formData.role} onChange={(e) => handleRoleChange(e.target.value as 'super_admin' | 'content' | 'hr')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                        <option value="super_admin">Super Admin</option>
                        <option value="content">Content Admin</option>
                        <option value="hr">HR Admin</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Changing role resets permissions to template defaults</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">{editingUser ? 'New Password' : 'Password *'}</label>
                      <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder={editingUser ? 'Leave blank to keep' : 'Min 6 characters'} />
                    </div>
                  </div>

                  {/* Permissions */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-orange-600" />
                        Permissions ({formData.permissions.length}/{ALL_PERMISSIONS.length})
                      </h3>
                      <div className="flex gap-2">
                        <button type="button" onClick={selectAllPermissions} className="text-xs text-blue-600 hover:text-blue-700">Select All</button>
                        <span className="text-gray-300">|</span>
                        <button type="button" onClick={clearAllPermissions} className="text-xs text-gray-600 hover:text-gray-700">Clear</button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {Object.entries(permissionGroups).map(([group, perms]) => (
                        <div key={group}>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{group}</p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {perms.map((perm) => (
                              <label key={perm.key} className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ${formData.permissions.includes(perm.key) ? 'bg-orange-50 border-orange-300' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                                <input
                                  type="checkbox"
                                  checked={formData.permissions.includes(perm.key)}
                                  onChange={() => togglePermission(perm.key)}
                                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                                />
                                <span className="text-sm text-gray-700">{perm.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active toggle */}
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="user-active" checked={formData.active} onChange={(e) => setFormData({ ...formData, active: e.target.checked })} className="w-4 h-4 text-orange-600 rounded" />
                    <label htmlFor="user-active" className="text-sm text-gray-700">Active (can login)</label>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center">
                      <Save className="w-4 h-4 mr-2" /> {editingUser ? 'Update' : 'Create'} User
                    </button>
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
