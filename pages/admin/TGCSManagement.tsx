import { useState } from 'react';
import { Save, Eye, EyeOff } from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { toast } from 'sonner';

export function AdminTGCSManagement() {
  const [tgcsData, setTgcsData] = useState(() => {
    const saved = localStorage.getItem('tgcs_data');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      hero: {
        title: 'SuperCorridor TGCS',
        subtitle: 'Trans Gunung Cyber Subsea Cable System',
        description: 'A state-of-the-art submarine cable system connecting strategic locations across Indonesia with world-class reliability and capacity.',
        enabled: true,
      },
      statistics: {
        cableLength: '1,200+ KM',
        fiberPairs: '12',
        capacity: '40 Tbps',
        rfsSchedule: 'Q2 2025',
      },
    };
  });

  const handleSave = () => {
    localStorage.setItem('tgcs_data', JSON.stringify(tgcsData));
    window.dispatchEvent(new Event('storage'));
    toast.success('TGCS data saved successfully!');
  };

  const toggleEnabled = () => {
    setTgcsData({
      ...tgcsData,
      hero: {
        ...tgcsData.hero,
        enabled: !tgcsData.hero.enabled,
      },
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">TGCS Project Management</h1>
            <p className="text-gray-600">
              Manage the content for the SuperCorridor TGCS flagship project page
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleEnabled}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                tgcsData.hero.enabled
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tgcsData.hero.enabled ? (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Visible</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span>Hidden</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Hero Section */}
          <div>
            <h2 className="text-xl text-gray-900 mb-4">Hero Section</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={tgcsData.hero.title}
                  onChange={(e) =>
                    setTgcsData({
                      ...tgcsData,
                      hero: { ...tgcsData.hero, title: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Subtitle</label>
                <input
                  type="text"
                  value={tgcsData.hero.subtitle}
                  onChange={(e) =>
                    setTgcsData({
                      ...tgcsData,
                      hero: { ...tgcsData.hero, subtitle: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Description</label>
                <textarea
                  value={tgcsData.hero.description}
                  onChange={(e) =>
                    setTgcsData({
                      ...tgcsData,
                      hero: { ...tgcsData.hero, description: e.target.value },
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="border-t pt-6">
            <h2 className="text-xl text-gray-900 mb-4">Statistics</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Cable Length</label>
                <input
                  type="text"
                  value={tgcsData.statistics.cableLength}
                  onChange={(e) =>
                    setTgcsData({
                      ...tgcsData,
                      statistics: { ...tgcsData.statistics, cableLength: e.target.value },
                    })
                  }
                  placeholder="e.g., 1,200+ KM"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Fiber Pairs</label>
                <input
                  type="text"
                  value={tgcsData.statistics.fiberPairs}
                  onChange={(e) =>
                    setTgcsData({
                      ...tgcsData,
                      statistics: { ...tgcsData.statistics, fiberPairs: e.target.value },
                    })
                  }
                  placeholder="e.g., 12"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Total Capacity</label>
                <input
                  type="text"
                  value={tgcsData.statistics.capacity}
                  onChange={(e) =>
                    setTgcsData({
                      ...tgcsData,
                      statistics: { ...tgcsData.statistics, capacity: e.target.value },
                    })
                  }
                  placeholder="e.g., 40 Tbps"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">RFS Schedule</label>
                <input
                  type="text"
                  value={tgcsData.statistics.rfsSchedule}
                  onChange={(e) =>
                    setTgcsData({
                      ...tgcsData,
                      statistics: { ...tgcsData.statistics, rfsSchedule: e.target.value },
                    })
                  }
                  placeholder="e.g., Q2 2025"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t pt-6 flex justify-end gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>

        {/* Preview Section */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl text-gray-900 mb-4">Preview (Homepage Section)</h2>
          <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-teal-800 text-white rounded-lg p-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-full mb-4 text-sm">
                Flagship Project
              </div>
              <h3 className="text-3xl mb-2">{tgcsData.hero.title}</h3>
              <p className="text-lg text-blue-100 mb-2">{tgcsData.hero.subtitle}</p>
              <p className="text-sm text-blue-100 max-w-2xl mx-auto">{tgcsData.hero.description}</p>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl text-orange-400 mb-1">{tgcsData.statistics.cableLength}</div>
                <div className="text-xs text-blue-100">Cable Length</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl text-orange-400 mb-1">{tgcsData.statistics.fiberPairs}</div>
                <div className="text-xs text-blue-100">Fiber Pairs</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl text-orange-400 mb-1">{tgcsData.statistics.capacity}</div>
                <div className="text-xs text-blue-100">Total Capacity</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl text-orange-400 mb-1">{tgcsData.statistics.rfsSchedule}</div>
                <div className="text-xs text-blue-100">RFS Schedule</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
