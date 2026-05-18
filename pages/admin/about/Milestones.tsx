import { AdminLayout } from '../../../components/AdminLayout';
import { Save, Plus, Trash2 } from 'lucide-react';
import { useAdminContent } from '../../../hooks/useAdminContent';

interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
}

export function AdminAboutMilestones() {
  const defaultData = {
    milestones: [
      { id: '1', year: '2008', title: 'Company Founded', description: 'SuperCorridor was established with a vision to transform enterprise connectivity in Indonesia.' },
      { id: '2', year: '2010', title: 'First 100 Clients', description: 'Reached our first major milestone, serving 100 enterprise customers across Jakarta.' },
      { id: '3', year: '2012', title: 'Network Expansion', description: 'Expanded fiber-optic network to 10 major cities, doubling our coverage area.' },
      { id: '4', year: '2014', title: 'Cloud Partnerships', description: 'Established direct connections to AWS, Azure, and Google Cloud platforms.' },
      { id: '5', year: '2016', title: '10 Gbps Milestone', description: 'Launched 10 Gbps dedicated connectivity services for enterprise clients.' },
      { id: '6', year: '2018', title: 'Industry Recognition', description: 'Awarded "Best Enterprise ISP" by Indonesia Telecommunications Association.' },
      { id: '7', year: '2020', title: '500+ Clients', description: 'Reached 500 enterprise clients, solidifying our position as a market leader.' },
      { id: '8', year: '2021', title: '100 Gbps Launch', description: 'Introduced 100 Gbps connectivity options for the most demanding enterprise workloads.' },
      { id: '9', year: '2022', title: 'Regional Expansion', description: 'Expanded operations to 50+ cities across Indonesia and neighboring countries.' },
      { id: '10', year: '2024', title: 'Innovation Hub', description: 'Opened our Network Innovation Center to develop next-generation connectivity solutions.' },
    ] as Milestone[],
  };

  const { data, setData, saved: isSaved, save } = useAdminContent('about-milestones', defaultData);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await save();
  };

  const addMilestone = () => {
    setData({
      ...data,
      milestones: [...data.milestones, { id: Date.now().toString(), year: '', title: '', description: '' }],
    });
  };

  const removeMilestone = (id: string) => {
    if (window.confirm('Are you sure you want to remove this milestone?')) {
      setData({ ...data, milestones: data.milestones.filter((m) => m.id !== id) });
    }
  };

  const updateMilestone = (id: string, field: keyof Milestone, value: string) => {
    setData({
      ...data,
      milestones: data.milestones.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-gray-900">Milestones Management</h1>
            <p className="text-gray-600 mt-1">Manage company timeline and achievements</p>
          </div>
          <button
            onClick={addMilestone}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Milestone
          </button>
        </div>

        {isSaved && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Changes saved successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {data.milestones.map((milestone, index) => (
            <div key={milestone.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg text-gray-900">Milestone {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeMilestone(milestone.id)}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Year</label>
                  <input
                    type="text"
                    value={milestone.year}
                    onChange={(e) => updateMilestone(milestone.id, 'year', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="2024"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={milestone.title}
                    onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Achievement title"
                  />
                </div>
                <div className="md:col-span-4">
                  <label className="block text-sm text-gray-700 mb-1">Description</label>
                  <textarea
                    value={milestone.description}
                    onChange={(e) => updateMilestone(milestone.id, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows={2}
                    placeholder="Describe this milestone..."
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
          >
            <Save className="w-5 h-5 mr-2" />
            Save All Milestones
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
