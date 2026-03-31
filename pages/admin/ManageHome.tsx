import { useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Save, Eye, Plus, Trash2, Edit2, MoveUp, MoveDown } from 'lucide-react';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;
}

export function ManageHome() {
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([
    {
      id: 1,
      title: "Powering today's needs\nand tomorrow's goals",
      subtitle: 'Enterprise Connectivity Solutions',
      description: 'Reliable, high-speed internet infrastructure designed for businesses across Indonesia',
      buttonText: 'Explore Solutions',
      buttonLink: '/solutions',
      backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
    },
    {
      id: 2,
      title: 'Building Digital Infrastructure\nfor the Future',
      subtitle: 'Nationwide Network Coverage',
      description: 'Connect your business across 50+ cities with our robust fiber optic network',
      buttonText: 'View Coverage',
      buttonLink: '/network-coverage',
      backgroundImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
    },
    {
      id: 3,
      title: 'Your Partner in\nDigital Transformation',
      subtitle: '24/7 Enterprise Support',
      description: 'Industry-leading SLA with 99.99% uptime guarantee and dedicated support team',
      buttonText: 'Contact Us',
      buttonLink: '/contact',
      backgroundImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
    },
  ]);

  const [editingSlide, setEditingSlide] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const addNewSlide = () => {
    const newSlide: HeroSlide = {
      id: Date.now(),
      title: 'New Slide Title',
      subtitle: 'Subtitle here',
      description: 'Description here',
      buttonText: 'Learn More',
      buttonLink: '#',
      backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
    };
    setHeroSlides([...heroSlides, newSlide]);
  };

  const updateSlide = (id: number, field: keyof HeroSlide, value: string) => {
    setHeroSlides(
      heroSlides.map((slide) => (slide.id === id ? { ...slide, [field]: value } : slide))
    );
  };

  const deleteSlide = (id: number) => {
    if (heroSlides.length <= 1) {
      alert('You must have at least one hero slide!');
      return;
    }
    if (confirm('Are you sure you want to delete this slide?')) {
      setHeroSlides(heroSlides.filter((slide) => slide.id !== id));
    }
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === heroSlides.length - 1)
    ) {
      return;
    }

    const newSlides = [...heroSlides];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newSlides[index], newSlides[newIndex]] = [newSlides[newIndex], newSlides[index]];
    setHeroSlides(newSlides);
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Manage Home Page</h1>
          <p className="text-gray-600">Update and customize your homepage content</p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {saved && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          Changes saved successfully!
        </div>
      )}

      {/* Hero Slides Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl flex items-center">
            <Edit2 className="w-5 h-5 mr-2 text-orange-600" />
            Hero Slides ({heroSlides.length})
          </h2>
          <button
            onClick={addNewSlide}
            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Slide
          </button>
        </div>

        <div className="space-y-4">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className="border-2 border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors"
            >
              {/* Slide Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded text-sm">
                    Slide {index + 1}
                  </div>
                  <button
                    onClick={() => setEditingSlide(editingSlide === slide.id ? null : slide.id)}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    {editingSlide === slide.id ? 'Collapse' : 'Edit'}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => moveSlide(index, 'up')}
                    disabled={index === 0}
                    className="p-2 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <MoveUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveSlide(index, 'down')}
                    disabled={index === heroSlides.length - 1}
                    className="p-2 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <MoveDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteSlide(slide.id)}
                    className="p-2 hover:bg-red-100 text-red-600 rounded"
                    title="Delete slide"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Slide Preview (Collapsed) */}
              {editingSlide !== slide.id && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-1">{slide.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{slide.subtitle}</p>
                  <p className="text-sm text-gray-500">{slide.description}</p>
                  {slide.backgroundImage && (
                    <img
                      src={slide.backgroundImage}
                      alt="Background preview"
                      className="w-full h-32 object-cover rounded mt-3"
                    />
                  )}
                </div>
              )}

              {/* Slide Editor (Expanded) */}
              {editingSlide === slide.id && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Title</label>
                      <textarea
                        value={slide.title}
                        onChange={(e) => updateSlide(slide.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        rows={2}
                        placeholder="Main headline"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Subtitle</label>
                      <input
                        type="text"
                        value={slide.subtitle}
                        onChange={(e) => updateSlide(slide.id, 'subtitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Supporting headline"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Description</label>
                    <textarea
                      value={slide.description}
                      onChange={(e) => updateSlide(slide.id, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows={2}
                      placeholder="Brief description"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Button Text</label>
                      <input
                        type="text"
                        value={slide.buttonText}
                        onChange={(e) => updateSlide(slide.id, 'buttonText', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Call to action text"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Button Link</label>
                      <input
                        type="text"
                        value={slide.buttonLink}
                        onChange={(e) => updateSlide(slide.id, 'buttonLink', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="/solutions or #"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Background Image URL</label>
                    <input
                      type="url"
                      value={slide.backgroundImage}
                      onChange={(e) => updateSlide(slide.id, 'backgroundImage', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="https://images.unsplash.com/..."
                    />
                    {slide.backgroundImage && (
                      <img
                        src={slide.backgroundImage}
                        alt="Background preview"
                        className="w-full h-48 object-cover rounded mt-2"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tab Sections */}
      <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl flex items-center">
            <Edit2 className="w-5 h-5 mr-2 text-orange-600" />
            Tab Sections (Small Business, Enterprise, Public Sector)
          </h2>
          <button className="inline-flex items-center px-3 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <Plus className="w-4 h-4 mr-1" />
            Add Tab
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 border-2 border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Small Business Tab</h3>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-red-100 text-red-600 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <input
              type="text"
              defaultValue="Helping small businesses make it big"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
            />
            <textarea
              defaultValue="Grow and scale with high-speed connectivity solutions designed specifically for small businesses."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={2}
            />
          </div>

          <div className="p-4 border-2 border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Enterprise Tab</h3>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-red-100 text-red-600 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <input
              type="text"
              defaultValue="Helping enterprises scale and innovate"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
            />
            <textarea
              defaultValue="Enterprise-grade connectivity and network infrastructure designed for digital transformation."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={2}
            />
          </div>

          <div className="p-4 border-2 border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Public Sector Tab</h3>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-red-100 text-red-600 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <input
              type="text"
              defaultValue="Empowering public sector innovation"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
            />
            <textarea
              defaultValue="Secure, compliant connectivity solutions for government agencies and public institutions."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl flex items-center">
            <Edit2 className="w-5 h-5 mr-2 text-orange-600" />
            Statistics Section
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-2">Enterprise Clients</label>
            <input
              type="text"
              defaultValue="500+"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Network Uptime</label>
            <input
              type="text"
              defaultValue="99.99%"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Cities Covered</label>
            <input
              type="text"
              defaultValue="50+"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Expert Support</label>
            <input
              type="text"
              defaultValue="24/7"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl flex items-center">
            <Edit2 className="w-5 h-5 mr-2 text-orange-600" />
            Success Stories
          </h2>
          <button className="inline-flex items-center px-3 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
            <Plus className="w-4 h-4 mr-1" />
            Add Story
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="border-2 border-gray-200 rounded-lg p-4">
            <div className="bg-gray-200 h-32 rounded-lg mb-3"></div>
            <input
              type="text"
              defaultValue="Innovating the game"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
            />
            <button className="text-red-600 text-sm">Remove</button>
          </div>
          <div className="border-2 border-gray-200 rounded-lg p-4">
            <div className="bg-gray-200 h-32 rounded-lg mb-3"></div>
            <input
              type="text"
              defaultValue="Transforming retail"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
            />
            <button className="text-red-600 text-sm">Remove</button>
          </div>
          <div className="border-2 border-gray-200 rounded-lg p-4">
            <div className="bg-gray-200 h-32 rounded-lg mb-3"></div>
            <input
              type="text"
              defaultValue="Building the future"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
            />
            <button className="text-red-600 text-sm">Remove</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
