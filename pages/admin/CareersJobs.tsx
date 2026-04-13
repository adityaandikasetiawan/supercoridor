import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Plus, Edit, Trash2, Search, MapPin, Briefcase, Clock } from 'lucide-react';
import { apiFetch } from '../../utils/storage';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  salary: string;
  posted: string;
  active: boolean;
}

export function AdminCareersJobs() {
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: '1',
      title: 'Network Engineer',
      department: 'Engineering',
      location: 'Jakarta, Indonesia',
      type: 'Full-time',
      description: 'We are looking for an experienced Network Engineer...',
      requirements: ['5+ years experience', 'CCNP certification', 'Strong TCP/IP knowledge'],
      responsibilities: [
        'Design and implement network solutions',
        'Monitor network performance',
        'Troubleshoot connectivity issues',
      ],
      salary: 'IDR 15-25 million',
      posted: '2024-01-15',
      active: true,
    },
    {
      id: '2',
      title: 'Sales Manager',
      department: 'Sales',
      location: 'Surabaya, Indonesia',
      type: 'Full-time',
      description: 'Seeking a dynamic Sales Manager to lead our team...',
      requirements: ['7+ years in B2B sales', 'Leadership experience', 'Excellent communication'],
      responsibilities: [
        'Lead sales team',
        'Develop business strategies',
        'Manage client relationships',
      ],
      salary: 'IDR 20-30 million',
      posted: '2024-01-10',
      active: true,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch('/api/admin/content/careers/jobs');
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data?.ok && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
        }
      } catch (err) {
        void err;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persistJobs = async (nextJobs: Job[]) => {
    try {
      await apiFetch('/api/admin/content/careers/jobs', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ jobs: nextJobs }),
      });
    } catch (err) {
      void err;
    }
  };

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: '',
    description: '',
    requirements: [''],
    responsibilities: [''],
    salary: '',
    posted: new Date().toISOString().split('T')[0],
    active: true,
  });

  const handleOpenModal = (job?: Job) => {
    if (job) {
      setEditingJob(job);
      setFormData(job);
    } else {
      setEditingJob(null);
      setFormData({
        title: '',
        department: '',
        location: '',
        type: '',
        description: '',
        requirements: [''],
        responsibilities: [''],
        salary: '',
        posted: new Date().toISOString().split('T')[0],
        active: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let nextJobs: Job[];
    if (editingJob) {
      nextJobs = jobs.map((j) => (j.id === editingJob.id ? { ...formData, id: j.id } : j));
    } else {
      nextJobs = [...jobs, { ...formData, id: Date.now().toString() }];
    }
    setJobs(nextJobs);
    await persistJobs(nextJobs);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      const nextJobs = jobs.filter((j) => j.id !== id);
      setJobs(nextJobs);
      await persistJobs(nextJobs);
    }
  };

  const addArrayItem = (field: 'requirements' | 'responsibilities') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const updateArrayItem = (
    field: 'requirements' | 'responsibilities',
    index: number,
    value: string
  ) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const removeArrayItem = (field: 'requirements' | 'responsibilities', index: number) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index),
    });
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl text-gray-900">Job Posts</h1>
            <p className="text-gray-600 mt-1">Manage career opportunities</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Job
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Total Jobs</p>
            <p className="text-2xl text-gray-900 mt-1">{jobs.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Active Jobs</p>
            <p className="text-2xl text-green-600 mt-1">
              {jobs.filter((j) => j.active).length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Inactive Jobs</p>
            <p className="text-2xl text-gray-600 mt-1">
              {jobs.filter((j) => !j.active).length}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 gap-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl text-gray-900">{job.title}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        job.active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {job.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-1" />
                      {job.department}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {job.location}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {job.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{job.description}</p>
                  <p className="text-sm text-gray-900">
                    Salary: <span className="text-green-600">{job.salary}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Posted: {new Date(job.posted).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleOpenModal(job)}
                    className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">No jobs found</p>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl text-gray-900 mb-4">
                  {editingJob ? 'Edit Job' : 'Add New Job'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Job Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Department</label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Department</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Sales">Sales</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Operations">Operations</option>
                        <option value="Customer Support">Customer Support</option>
                        <option value="Finance">Finance</option>
                        <option value="HR">HR</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Job Type</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Salary Range</label>
                      <input
                        type="text"
                        value={formData.salary}
                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="e.g., IDR 15-25 million"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Requirements</label>
                    {formData.requirements.map((req, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={req}
                          onChange={(e) =>
                            updateArrayItem('requirements', index, e.target.value)
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Enter requirement"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('requirements', index)}
                          className="bg-red-100 text-red-600 px-3 py-2 rounded hover:bg-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('requirements')}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      + Add Requirement
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Responsibilities</label>
                    {formData.responsibilities.map((resp, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={resp}
                          onChange={(e) =>
                            updateArrayItem('responsibilities', index, e.target.value)
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Enter responsibility"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('responsibilities', index)}
                          className="bg-red-100 text-red-600 px-3 py-2 rounded hover:bg-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('responsibilities')}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      + Add Responsibility
                    </button>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                    />
                    <label htmlFor="active" className="ml-2 text-sm text-gray-700">
                      Active (visible on careers page)
                    </label>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      {editingJob ? 'Update' : 'Create'} Job
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
