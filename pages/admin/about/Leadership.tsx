import { useEffect, useState } from 'react';
import { AdminLayout } from '../../../components/AdminLayout';
import { Plus } from 'lucide-react';
import { apiFetch } from '../../../utils/storage';
import { ImageUpload } from '../../../components/ImageUpload';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image: string;
  linkedin: string;
}

export function AdminAboutLeadership() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'John Santoso',
      position: 'Chief Executive Officer',
      bio: 'John has over 20 years of experience in the telecommunications industry...',
      image: 'https://i.pravatar.cc/300?img=12',
      linkedin: 'https://linkedin.com/in/johnsantoso',
    },
    {
      id: '2',
      name: 'Sarah Wijaya',
      position: 'Chief Technology Officer',
      bio: 'Sarah leads our technology vision with expertise in network architecture...',
      image: 'https://i.pravatar.cc/300?img=47',
      linkedin: 'https://linkedin.com/in/sarahwijaya',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    bio: '',
    image: '',
    linkedin: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const response = await apiFetch('/api/admin/content/pages/about-leadership', { method: 'GET' });
        if (response.ok) {
          const result = await response.json();
          if (result.data?.teamMembers) {
            setTeamMembers(result.data.teamMembers);
          }
        }
      } catch {
        // use defaults
      }
    };
    void load();
  }, []);

  const saveToServer = async (members: TeamMember[]) => {
    await apiFetch('/api/admin/content/pages/about-leadership', {
      method: 'PUT',
      body: JSON.stringify({ data: { teamMembers: members } }),
    });
  };

  const handleOpenModal = (member?: TeamMember) => {
    if (member) {
      setEditingMember(member);
      setFormData(member);
    } else {
      setEditingMember(null);
      setFormData({ name: '', position: '', bio: '', image: '', linkedin: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let updated: TeamMember[];
    if (editingMember) {
      updated = teamMembers.map((m) => (m.id === editingMember.id ? { ...formData, id: m.id } : m));
    } else {
      updated = [...teamMembers, { ...formData, id: Date.now().toString() }];
    }
    setTeamMembers(updated);
    setIsModalOpen(false);
    await saveToServer(updated);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      const updated = teamMembers.filter((m) => m.id !== id);
      setTeamMembers(updated);
      await saveToServer(updated);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl text-gray-900">Leadership Team Management</h1>
            <p className="text-gray-600 mt-1">Manage executive team members</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Team Member
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg text-gray-900">{member.name}</h3>
                <p className="text-sm text-orange-600 mb-2">{member.position}</p>
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">{member.bio}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(member)}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="flex-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl text-gray-900 mb-4">
                  {editingMember ? 'Edit Team Member' : 'Add Team Member'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Position</label>
                      <input
                        type="text"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows={4}
                      required
                    />
                  </div>
                  <div>
                    <ImageUpload
                      value={formData.image}
                      onChange={(url) => setFormData({ ...formData, image: url })}
                      label="Photo"
                      previewClassName="w-32 h-32 object-cover rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">LinkedIn URL</label>
                    <input
                      type="url"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      {editingMember ? 'Update' : 'Add'} Team Member
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
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
