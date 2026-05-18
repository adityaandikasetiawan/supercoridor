import { AdminLayout } from '../../../components/AdminLayout';
import { Save } from 'lucide-react';
import { useAdminContent } from '../../../hooks/useAdminContent';
import { ImageUpload } from '../../../components/ImageUpload';

export function AdminAboutVisionMission() {
  const defaultData = {
    title: 'Vision & Mission',
    heroImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
    vision:
      'To be the leading Internet Service Provider in Indonesia, empowering businesses with world-class connectivity solutions and driving digital transformation across the nation.',
    mission: [
      'Deliver reliable, high-speed internet connectivity to businesses of all sizes',
      'Build and maintain robust network infrastructure across Indonesia',
      'Provide exceptional customer service and technical support',
      'Innovate continuously to meet evolving connectivity needs',
      'Foster partnerships that create value for our customers',
    ],
    goals: [
      { title: 'Expand Coverage', description: 'Reach 100+ cities by 2025' },
      { title: 'Enhance Reliability', description: 'Maintain 99.99% uptime across all services' },
      { title: 'Drive Innovation', description: 'Launch next-gen connectivity solutions' },
      { title: 'Customer Satisfaction', description: 'Achieve 95%+ customer satisfaction rate' },
    ],
  };

  const { data: formData, setData: setFormData, saved: isSaved, save } = useAdminContent('about-vision-mission', defaultData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await save();
  };

  const updateMissionItem = (index: number, value: string) => {
    const newMission = [...formData.mission];
    newMission[index] = value;
    setFormData({ ...formData, mission: newMission });
  };

  const addMissionItem = () => {
    setFormData({ ...formData, mission: [...formData.mission, ''] });
  };

  const removeMissionItem = (index: number) => {
    setFormData({
      ...formData,
      mission: formData.mission.filter((_, i) => i !== index),
    });
  };

  const updateGoal = (index: number, field: string, value: string) => {
    const newGoals = [...formData.goals];
    newGoals[index] = { ...newGoals[index], [field]: value };
    setFormData({ ...formData, goals: newGoals });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl text-gray-900">Vision & Mission Management</h1>
          <p className="text-gray-600 mt-1">Manage company vision, mission, and goals</p>
        </div>

        {isSaved && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Changes saved successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl text-gray-900 mb-4">Header</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Page Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <ImageUpload
                  value={formData.heroImage}
                  onChange={(url) => setFormData({ ...formData, heroImage: url })}
                  label="Hero Image"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl text-gray-900 mb-4">Vision</h2>
            <textarea
              value={formData.vision}
              onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows={4}
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl text-gray-900 mb-4">Mission Points</h2>
            <div className="space-y-3">
              {formData.mission.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateMissionItem(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder={`Mission point ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeMissionItem(index)}
                    className="bg-red-100 text-red-600 px-3 py-2 rounded hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addMissionItem}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add Mission Point
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl text-gray-900 mb-4">Strategic Goals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.goals.map((goal, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm text-gray-700 mb-2">Goal {index + 1}</h3>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Goal Title"
                      value={goal.title}
                      onChange={(e) => updateGoal(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                    <textarea
                      placeholder="Goal Description"
                      value={goal.description}
                      onChange={(e) => updateGoal(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Changes
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
