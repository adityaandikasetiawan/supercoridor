import { AdminLayout } from '../../../components/AdminLayout';
import { Save } from 'lucide-react';
import { useAdminContent } from '../../../hooks/useAdminContent';
import { ImageUpload } from '../../../components/ImageUpload';

export function AdminAboutCompanyOverview() {
  const defaultData = {
    title: 'Company Overview',
    subtitle: 'Leading Internet Service Provider in Indonesia',
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
    companyDescription:
      'SuperCorridor is a premier Internet Service Provider dedicated to delivering enterprise-grade connectivity solutions across Indonesia. Since our inception, we have been committed to building robust network infrastructure that powers businesses and drives digital transformation.',
    additionalDescription:
      "Our extensive fiber-optic infrastructure spans across major business districts, connecting enterprises to the digital world with unmatched speed and reliability. We serve over 500 corporate clients, from startups to Fortune 500 companies.\n\nAt SuperCorridor, we believe that connectivity is the foundation of modern business. That's why we're committed to delivering not just internet service, but complete network solutions that empower organizations to achieve their digital transformation goals.",
    stats: [
      { value: '500+', label: 'Enterprise Clients' },
      { value: '50+', label: 'Cities Covered' },
      { value: '99.99%', label: 'Network Uptime' },
      { value: '15+', label: 'Years Experience' },
    ],
    values: [
      { title: 'Innovation', description: 'Continuously advancing our technology and services' },
      { title: 'Reliability', description: 'Delivering consistent, high-quality connectivity' },
      { title: 'Customer Focus', description: 'Putting our clients needs at the forefront' },
      { title: 'Integrity', description: 'Operating with transparency and ethical standards' },
    ],
  };

  const { data: formData, setData: setFormData, saved: isSaved, save } = useAdminContent('about-company-overview', defaultData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await save();
  };

  const updateValue = (index: number, field: string, value: string) => {
    const newValues = [...formData.values];
    newValues[index] = { ...newValues[index], [field]: value };
    setFormData({ ...formData, values: newValues });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl text-gray-900">Company Overview Management</h1>
          <p className="text-gray-600 mt-1">Manage company information and values</p>
        </div>

        {isSaved && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Changes saved successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl text-gray-900 mb-4">Header Section</h2>
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
                <ImageUpload
                  value={formData.heroImage}
                  onChange={(url) => setFormData({ ...formData, heroImage: url })}
                  label="Hero Image"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Company Description</label>
                <textarea
                  value={formData.companyDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, companyDescription: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={4}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl text-gray-900 mb-4">Additional Description</h2>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Additional paragraphs (separate with blank line)</label>
              <textarea
                value={formData.additionalDescription}
                onChange={(e) => setFormData({ ...formData, additionalDescription: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows={5}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl text-gray-900 mb-4">Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(formData.stats ?? []).map((stat, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm text-gray-700 mb-2">Stat {index + 1}</h3>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Value (e.g. 500+)"
                      value={stat.value}
                      onChange={(e) => {
                        const newStats = [...(formData.stats ?? [])];
                        newStats[index] = { ...newStats[index], value: e.target.value };
                        setFormData({ ...formData, stats: newStats });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Label (e.g. Enterprise Clients)"
                      value={stat.label}
                      onChange={(e) => {
                        const newStats = [...(formData.stats ?? [])];
                        newStats[index] = { ...newStats[index], label: e.target.value };
                        setFormData({ ...formData, stats: newStats });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl text-gray-900 mb-4">Company Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.values.map((value, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm text-gray-700 mb-2">Value {index + 1}</h3>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Value Title"
                      value={value.title}
                      onChange={(e) => updateValue(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                    <textarea
                      placeholder="Value Description"
                      value={value.description}
                      onChange={(e) => updateValue(index, 'description', e.target.value)}
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
