import { AdminLayout } from '../../../components/AdminLayout';
import { Save } from 'lucide-react';
import { useAdminContent } from '../../../hooks/useAdminContent';

export function AdminSolutionsDedicatedConnectivity() {
  const defaultData = {
    title: 'Dedicated Connectivity Solutions',
    subtitle: 'Reliable, high-speed dedicated internet access for your business',
    heroImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
    description:
      'Our dedicated connectivity solutions provide your business with guaranteed bandwidth and superior performance. With symmetric upload and download speeds, your critical applications run smoothly without interruption.',
    features: [
      { title: 'Guaranteed Bandwidth', description: 'Dedicated line with no contention - your bandwidth is yours alone' },
      { title: 'Symmetric Speed', description: 'Equal upload and download speeds for seamless communication' },
      { title: '99.99% SLA', description: 'Industry-leading uptime guarantee with proactive monitoring' },
      { title: '24/7 Support', description: 'Round-the-clock technical support from certified engineers' },
    ],
    packages: [
      { name: 'Starter', speed: '10 Mbps', price: 'IDR 5,000,000', features: ['Dedicated Line', 'SLA 99.9%', 'Email Support'] },
      { name: 'Business', speed: '50 Mbps', price: 'IDR 15,000,000', features: ['Dedicated Line', 'SLA 99.99%', '24/7 Support', 'Free Installation'] },
      { name: 'Enterprise', speed: '100 Mbps+', price: 'Custom', features: ['Dedicated Line', 'SLA 99.99%', '24/7 Priority Support', 'Managed Services'] },
    ],
  };

  const { data: formData, setData: setFormData, saved: isSaved, save } = useAdminContent('solutions-dedicated-connectivity', defaultData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await save();
  };

  const updateFeature = (index: number, field: string, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setFormData({ ...formData, features: newFeatures });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl text-gray-900">Dedicated Connectivity Management</h1>
          <p className="text-gray-600 mt-1">Manage content for Dedicated Connectivity page</p>
        </div>

        {isSaved && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Changes saved successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hero Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl text-gray-900 mb-4">Hero Section</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Hero Image URL</label>
                <input
                  type="url"
                  value={formData.heroImage}
                  onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl text-gray-900 mb-4">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.features.map((feature, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm text-gray-700 mb-2">Feature {index + 1}</h3>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Feature Title"
                      value={feature.title}
                      onChange={(e) => updateFeature(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                    <textarea
                      placeholder="Feature Description"
                      value={feature.description}
                      onChange={(e) => updateFeature(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Packages Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl text-gray-900 mb-4">Pricing Packages (Preview Only)</h2>
            <p className="text-sm text-gray-600 mb-4">
              Package pricing is display only. Contact developer to modify pricing structure.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {formData.packages.map((pkg, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-gray-900 mb-1">{pkg.name}</h3>
                  <p className="text-xl text-orange-600 mb-2">{pkg.speed}</p>
                  <p className="text-sm text-gray-600 mb-2">{pkg.price}/month</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {pkg.features.map((f, i) => (
                      <li key={i}>• {f}</li>
                    ))}
                  </ul>
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
