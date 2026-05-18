import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import {
  Search,
  Filter,
  Eye,
  Trash2,
  Download,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  FileText,
  FileDown,
  Send,
} from 'lucide-react';
import { apiFetch } from '../../utils/storage';

interface Application {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  location: string;
  jobTitle: string;
  jobId: string;
  appliedDate: string;
  resumeUrl: string;
  coverLetter: string;
  status: 'new' | 'reviewed' | 'shortlisted' | 'rejected';
  experience: string;
  nik?: string;
  birthPlace?: string;
  birthDate?: string;
  gender?: 'male' | 'female' | '';
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed' | '';
  address?: string;
  city?: string;
  postalCode?: string;
  educationLevel?: string;
  institution?: string;
  major?: string;
  gpa?: string;
  expectedSalary?: string;
  availableStartDate?: string;
  emergencyName?: string;
  emergencyPhone?: string;
}

export function AdminCareersApplications() {
  const [applications, setApplications] = useState<Application[]>([
    {
      id: '1',
      applicantName: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+62 812 3456 7890',
      location: 'Jakarta, Indonesia',
      jobTitle: 'Network Engineer',
      jobId: '1',
      appliedDate: '2024-01-20',
      resumeUrl: '#',
      coverLetter:
        'I am writing to express my strong interest in the Network Engineer position...',
      status: 'new',
      experience: '5 years',
    },
    {
      id: '2',
      applicantName: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+62 813 9876 5432',
      location: 'Surabaya, Indonesia',
      jobTitle: 'Sales Manager',
      jobId: '2',
      appliedDate: '2024-01-19',
      resumeUrl: '#',
      coverLetter:
        'With over 7 years of experience in B2B sales, I am excited to apply...',
      status: 'reviewed',
      experience: '7 years',
    },
    {
      id: '3',
      applicantName: 'Ahmad Rahman',
      email: 'ahmad.rahman@email.com',
      phone: '+62 815 1234 5678',
      location: 'Bandung, Indonesia',
      jobTitle: 'Network Engineer',
      jobId: '1',
      appliedDate: '2024-01-18',
      resumeUrl: '#',
      coverLetter:
        'I am passionate about network infrastructure and would love to contribute...',
      status: 'shortlisted',
      experience: '6 years',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch('/api/admin/content/careers/applications');
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data?.ok && Array.isArray(data.applications)) {
          setApplications(data.applications);
        }
      } catch (err) {
        void err;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persistApplications = async (nextApplications: Application[]) => {
    try {
      await apiFetch('/api/admin/content/careers/applications', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ applications: nextApplications }),
      });
    } catch (err) {
      void err;
    }
  };

  const handleStatusChange = async (id: string, newStatus: Application['status']) => {
    const nextApplications = applications.map((app) =>
      app.id === id ? { ...app, status: newStatus } : app
    );
    setApplications(nextApplications);
    if (selectedApplication?.id === id) {
      const updated = nextApplications.find((a) => a.id === id) ?? null;
      setSelectedApplication(updated);
    }
    await persistApplications(nextApplications);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      const nextApplications = applications.filter((app) => app.id !== id);
      setApplications(nextApplications);
      await persistApplications(nextApplications);
      if (selectedApplication?.id === id) {
        setIsDetailOpen(false);
      }
    }
  };

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setIsDetailOpen(true);
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Location', 'Job Title', 'Experience', 'Applied Date', 'Status', 'Education', 'Institution', 'Expected Salary'];
    const rows = filteredApplications.map((app) => [
      app.applicantName,
      app.email,
      app.phone,
      app.location,
      app.jobTitle,
      app.experience,
      app.appliedDate,
      app.status,
      app.educationLevel ?? '',
      app.institution ?? '',
      app.expectedSalary ?? '',
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `applications-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const [emailSending, setEmailSending] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState('');

  const handleSendStatusEmail = async (app: Application) => {
    setEmailSending(true);
    setEmailSuccess('');
    try {
      const res = await apiFetch('/api/admin/careers/send-status-email', {
        method: 'POST',
        body: JSON.stringify({
          applicantName: app.applicantName,
          email: app.email,
          jobTitle: app.jobTitle,
          status: app.status,
        }),
      });
      if (res.ok) {
        setEmailSuccess(`Email notification sent to ${app.email}`);
        setTimeout(() => setEmailSuccess(''), 5000);
      }
    } catch {
      // silently fail
    } finally {
      setEmailSending(false);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: applications.length,
    new: applications.filter((a) => a.status === 'new').length,
    reviewed: applications.filter((a) => a.status === 'reviewed').length,
    shortlisted: applications.filter((a) => a.status === 'shortlisted').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-700';
      case 'reviewed':
        return 'bg-yellow-100 text-yellow-700';
      case 'shortlisted':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-gray-900">Job Applications</h1>
            <p className="text-gray-600 mt-1">Manage candidate applications</p>
          </div>
          <button
            onClick={handleExportCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center text-sm"
          >
            <FileDown className="w-4 h-4 mr-2" /> Export CSV
          </button>
        </div>

        {emailSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center gap-2">
            <Send className="w-4 h-4" /> {emailSuccess}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl text-gray-900 mt-1">{statusCounts.all}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">New</p>
            <p className="text-2xl text-blue-600 mt-1">{statusCounts.new}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Reviewed</p>
            <p className="text-2xl text-yellow-600 mt-1">{statusCounts.reviewed}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Shortlisted</p>
            <p className="text-2xl text-green-600 mt-1">{statusCounts.shortlisted}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Rejected</p>
            <p className="text-2xl text-red-600 mt-1">{statusCounts.rejected}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="reviewed">Reviewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm text-gray-900">{app.applicantName}</div>
                      <div className="text-xs text-gray-500">{app.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{app.jobTitle}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{app.experience}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {new Date(app.appliedDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={app.status}
                      onChange={(e) =>
                        handleStatusChange(app.id, e.target.value as Application['status'])
                      }
                      className={`text-xs px-2 py-1 rounded border-0 focus:ring-2 focus:ring-orange-500 ${getStatusColor(
                        app.status
                      )}`}
                    >
                      <option value="new">New</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(app)}
                        className="text-blue-600 hover:text-blue-700"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No applications found</p>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {isDetailOpen && selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl text-gray-900">{selectedApplication.applicantName}</h2>
                    <p className="text-gray-600 mt-1">
                      Applied for: {selectedApplication.jobTitle}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsDetailOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm text-gray-900">{selectedApplication.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-sm text-gray-900">{selectedApplication.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="text-sm text-gray-900">{selectedApplication.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Experience</p>
                        <p className="text-sm text-gray-900">{selectedApplication.experience}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Applied Date</p>
                        <p className="text-sm text-gray-900">
                          {new Date(selectedApplication.appliedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-gray-900 mb-3">Data Pribadi</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">NIK</p>
                        <p className="text-sm text-gray-900">{selectedApplication.nik || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Tempat / Tanggal Lahir</p>
                        <p className="text-sm text-gray-900">
                          {(selectedApplication.birthPlace || '-') +
                            ' / ' +
                            (selectedApplication.birthDate || '-')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Jenis Kelamin</p>
                        <p className="text-sm text-gray-900">
                          {selectedApplication.gender === 'male'
                            ? 'Laki-laki'
                            : selectedApplication.gender === 'female'
                              ? 'Perempuan'
                              : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Status Pernikahan</p>
                        <p className="text-sm text-gray-900">
                          {selectedApplication.maritalStatus === 'single'
                            ? 'Belum menikah'
                            : selectedApplication.maritalStatus === 'married'
                              ? 'Menikah'
                              : selectedApplication.maritalStatus === 'divorced'
                                ? 'Cerai hidup'
                                : selectedApplication.maritalStatus === 'widowed'
                                  ? 'Cerai mati'
                                  : '-'}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-xs text-gray-500">Alamat</p>
                        <p className="text-sm text-gray-900">{selectedApplication.address || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Kota</p>
                        <p className="text-sm text-gray-900">{selectedApplication.city || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Kode Pos</p>
                        <p className="text-sm text-gray-900">{selectedApplication.postalCode || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Gaji yang Diharapkan</p>
                        <p className="text-sm text-gray-900">{selectedApplication.expectedSalary || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Ketersediaan Mulai</p>
                        <p className="text-sm text-gray-900">{selectedApplication.availableStartDate || '-'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-gray-900 mb-3">Pendidikan</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Pendidikan Terakhir</p>
                        <p className="text-sm text-gray-900">{selectedApplication.educationLevel || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Institusi</p>
                        <p className="text-sm text-gray-900">{selectedApplication.institution || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Jurusan</p>
                        <p className="text-sm text-gray-900">{selectedApplication.major || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">IPK</p>
                        <p className="text-sm text-gray-900">{selectedApplication.gpa || '-'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-gray-900 mb-3">Kontak Darurat</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Nama</p>
                        <p className="text-sm text-gray-900">{selectedApplication.emergencyName || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">No. HP</p>
                        <p className="text-sm text-gray-900">{selectedApplication.emergencyPhone || '-'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Cover Letter */}
                  <div className="border-t pt-4">
                    <h3 className="flex items-center gap-2 text-gray-900 mb-2">
                      <FileText className="w-5 h-5" />
                      Cover Letter
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {selectedApplication.coverLetter}
                    </p>
                  </div>

                  {/* Resume */}
                  <div className="border-t pt-4">
                    <h3 className="flex items-center gap-2 text-gray-900 mb-2">
                      <Download className="w-5 h-5" />
                      Resume
                    </h3>
                    <a
                      href={selectedApplication.resumeUrl}
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                      <Download className="w-4 h-4" />
                      Download Resume
                    </a>
                  </div>

                  {/* Status Update */}
                  <div className="border-t pt-4">
                    <h3 className="text-gray-900 mb-2">Update Status</h3>
                    <select
                      value={selectedApplication.status}
                      onChange={(e) => {
                        handleStatusChange(
                          selectedApplication.id,
                          e.target.value as Application['status']
                        );
                        setSelectedApplication({
                          ...selectedApplication,
                          status: e.target.value as Application['status'],
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="new">New</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <button
                      onClick={() => handleSendStatusEmail(selectedApplication)}
                      disabled={emailSending}
                      className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
                    >
                      <Send className="w-4 h-4" />
                      {emailSending ? 'Sending...' : 'Send Status Notification Email'}
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setIsDetailOpen(false)}
                      className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(selectedApplication.id);
                      }}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete Application
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
