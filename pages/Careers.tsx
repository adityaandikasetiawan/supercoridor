import { useEffect, useMemo, useState } from 'react';
import { Search, MapPin, Briefcase, Clock, Users, ArrowRight, TrendingUp, Heart, Star, Filter } from 'lucide-react';
import { apiFetch } from '../utils/storage';
import { usePageContent } from '../hooks/usePageContent';
import { getHeroGradient } from '../components/HeroGradient';

type JobListing = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  level: string;
  salary: string;
  description: string;
  requirements: string[];
  skills: string[];
  featured: boolean;
  applicants: number;
  postedDays: number;
};

const fallbackJobListings = [
  {
    id: '1',
    title: 'Senior Network Engineer',
    department: 'Engineering',
    location: 'Jakarta',
    type: 'Full-time',
    level: 'Senior',
    salary: 'Rp 15,000,000 - 25,000,000',
    description: 'Design, implement, and maintain our enterprise-grade network infrastructure serving 500+ corporate clients.',
    requirements: ['5+ years network engineering experience', 'CCNP or equivalent certification', 'Experience with BGP, MPLS, DWDM'],
    skills: ['Cisco', 'Juniper', 'BGP', 'MPLS', 'Network Security'],
    featured: true,
    applicants: 24,
    postedDays: 2,
  },
  {
    id: '2',
    title: 'Enterprise Account Manager',
    department: 'Sales',
    location: 'Jakarta',
    type: 'Full-time',
    level: 'Mid-Senior',
    salary: 'Rp 12,000,000 - 20,000,000',
    description: 'Drive new business acquisition and manage relationships with enterprise clients in the telecommunications sector.',
    requirements: ['3+ years B2B sales experience', 'Strong networking skills', 'Understanding of enterprise IT solutions'],
    skills: ['B2B Sales', 'Account Management', 'Networking', 'CRM'],
    featured: true,
    applicants: 18,
    postedDays: 3,
  },
  {
    id: '3',
    title: 'Customer Success Specialist',
    department: 'Customer Support',
    location: 'Jakarta',
    type: 'Full-time',
    level: 'Entry-Mid',
    salary: 'Rp 8,000,000 - 12,000,000',
    description: 'Ensure customer satisfaction and drive adoption of our connectivity solutions through proactive support.',
    requirements: ['2+ years customer success experience', 'Excellent communication skills', 'Technical aptitude'],
    skills: ['Customer Service', 'Technical Support', 'Communication', 'Problem Solving'],
    featured: false,
    applicants: 32,
    postedDays: 5,
  },
  {
    id: '4',
    title: 'NOC Engineer (Network Operations Center)',
    department: 'Operations',
    location: 'Jakarta',
    type: 'Shift Work',
    level: 'Entry-Mid',
    salary: 'Rp 9,000,000 - 14,000,000',
    description: 'Monitor and maintain network infrastructure 24/7, respond to incidents, and ensure optimal performance.',
    requirements: ['1-3 years NOC experience', 'Understanding of network protocols', 'Willingness to work shifts'],
    skills: ['Network Monitoring', 'Troubleshooting', 'Incident Management', 'TCP/IP'],
    featured: false,
    applicants: 41,
    postedDays: 4,
  },
  {
    id: '5',
    title: 'Solutions Architect',
    department: 'Pre-Sales',
    location: 'Jakarta',
    type: 'Full-time',
    level: 'Senior',
    salary: 'Rp 18,000,000 - 28,000,000',
    description: 'Design comprehensive network solutions for enterprise clients and support the sales team with technical expertise.',
    requirements: ['5+ years solutions architecture experience', 'Strong presentation skills', 'Enterprise networking knowledge'],
    skills: ['Solution Design', 'SD-WAN', 'Cloud Connectivity', 'Presales'],
    featured: true,
    applicants: 15,
    postedDays: 1,
  },
  {
    id: '6',
    title: 'Security Operations Analyst',
    department: 'Security',
    location: 'Jakarta',
    type: 'Full-time',
    level: 'Mid-Senior',
    salary: 'Rp 13,000,000 - 22,000,000',
    description: 'Monitor security threats, implement security measures, and respond to security incidents across our network.',
    requirements: ['3+ years security operations experience', 'Security certifications (CISSP, CEH)', 'Experience with SIEM tools'],
    skills: ['Cybersecurity', 'SIEM', 'Threat Analysis', 'Firewall Management'],
    featured: false,
    applicants: 27,
    postedDays: 6,
  },
  {
    id: '7',
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Jakarta / Remote',
    type: 'Full-time',
    level: 'Mid-Senior',
    salary: 'Rp 14,000,000 - 24,000,000',
    description: 'Build and maintain CI/CD pipelines, automate infrastructure deployment, and optimize our operational systems.',
    requirements: ['3+ years DevOps experience', 'Experience with Kubernetes, Docker', 'Cloud platform expertise (AWS/GCP)'],
    skills: ['DevOps', 'Kubernetes', 'Docker', 'AWS', 'Terraform'],
    featured: false,
    applicants: 19,
    postedDays: 7,
  },
  {
    id: '8',
    title: 'Technical Support Engineer',
    department: 'Customer Support',
    location: 'Surabaya',
    type: 'Full-time',
    level: 'Entry-Mid',
    salary: 'Rp 7,000,000 - 11,000,000',
    description: 'Provide technical support to enterprise clients, troubleshoot connectivity issues, and ensure customer satisfaction.',
    requirements: ['1-2 years technical support experience', 'Good understanding of networking', 'Customer-oriented mindset'],
    skills: ['Technical Support', 'Networking Basics', 'Customer Service', 'Troubleshooting'],
    featured: false,
    applicants: 38,
    postedDays: 8,
  },
];

export function Careers() {
  const pageContent = usePageContent('page-careers', {
    heroTitle: 'Join Our Team',
    heroSubtitle: 'Build the future of connectivity with us. We are looking for talented people who share our passion for innovation.',
    heroGradient: 'orange-blue-green',
  });
  const [jobListings, setJobListings] = useState<JobListing[]>(fallbackJobListings);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [applyOpen, setApplyOpen] = useState(false);
  const [applySubmitting, setApplySubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState<string | null>(null);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [applyForm, setApplyForm] = useState({
    applicantName: '',
    email: '',
    phone: '',
    nik: '',
    birthPlace: '',
    birthDate: '',
    gender: '',
    maritalStatus: '',
    address: '',
    city: '',
    postalCode: '',
    educationLevel: '',
    institution: '',
    major: '',
    gpa: '',
    experience: '',
    expectedSalary: '',
    availableStartDate: '',
    coverLetter: '',
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch('/api/content/careers/jobs');
        if (!res.ok) return;
        const data = await res.json();
        if (!data?.ok || !Array.isArray(data.jobs)) return;

        const now = new Date();
        const deriveLevel = (title: string) => {
          const t = title.toLowerCase();
          if (t.includes('senior') || t.includes('lead') || t.includes('principal')) return 'Senior';
          if (t.includes('junior') || t.includes('entry')) return 'Entry-Mid';
          return 'Mid-Senior';
        };

        const next: JobListing[] = data.jobs
          .filter((j: any) => j && typeof j === 'object')
          .map((j: any, index: number) => {
            const posted = typeof j.posted === 'string' ? j.posted : '';
            const postedDate = posted ? new Date(posted) : null;
            const postedDays =
              postedDate && !Number.isNaN(postedDate.getTime())
                ? Math.max(0, Math.floor((now.getTime() - postedDate.getTime()) / (24 * 60 * 60 * 1000)))
                : 0;

            const title = typeof j.title === 'string' ? j.title : '';
            const requirements = Array.isArray(j.requirements) ? j.requirements.filter((r: any) => typeof r === 'string') : [];
            const responsibilities = Array.isArray(j.responsibilities)
              ? j.responsibilities.filter((r: any) => typeof r === 'string')
              : [];
            const skills = requirements.length > 0 ? requirements : responsibilities;

            return {
              id: typeof j.id === 'string' ? j.id : String(index + 1),
              title,
              department: typeof j.department === 'string' ? j.department : '',
              location: typeof j.location === 'string' ? j.location : '',
              type: typeof j.type === 'string' ? j.type : '',
              level: deriveLevel(title),
              salary: typeof j.salary === 'string' ? j.salary : '',
              description: typeof j.description === 'string' ? j.description : '',
              requirements,
              skills,
              featured: index < 2,
              applicants: 0,
              postedDays,
            };
          })
          .filter((j: any) => j.title && j.department && j.location && j.type);

        if (!cancelled && next.length > 0) {
          setJobListings(next);
        }
      } catch (err) {
        void err;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const openApply = (job: JobListing) => {
    setSelectedJob(job);
    setApplyOpen(true);
    setApplySubmitting(false);
    setApplySuccess(null);
    setApplyError(null);
    setResumeFile(null);
    setApplyForm((prev) => ({
      ...prev,
      city: prev.city || job.location,
    }));
  };

  const closeApply = () => {
    setApplyOpen(false);
    setApplySubmitting(false);
    setApplyError(null);
    setResumeFile(null);
  };

  const submitApplication = async () => {
    if (!selectedJob) return;
    if (!resumeFile) {
      setApplyError('CV wajib diupload (PDF/DOC/DOCX).');
      return;
    }
    if (
      !applyForm.applicantName ||
      !applyForm.email ||
      !applyForm.phone ||
      !applyForm.nik ||
      !applyForm.birthDate ||
      !applyForm.gender ||
      !applyForm.address ||
      !applyForm.city ||
      !applyForm.educationLevel ||
      !applyForm.institution ||
      !applyForm.major ||
      !applyForm.expectedSalary ||
      !applyForm.availableStartDate ||
      !applyForm.experience
    ) {
      const missing: string[] = [];
      if (!applyForm.applicantName) missing.push('Nama lengkap');
      if (!applyForm.email) missing.push('Email');
      if (!applyForm.phone) missing.push('No. HP');
      if (!applyForm.nik) missing.push('NIK');
      if (!applyForm.birthDate) missing.push('Tanggal lahir');
      if (!applyForm.gender) missing.push('Jenis kelamin');
      if (!applyForm.address) missing.push('Alamat');
      if (!applyForm.city) missing.push('Kota');
      if (!applyForm.educationLevel) missing.push('Pendidikan');
      if (!applyForm.institution) missing.push('Institusi');
      if (!applyForm.major) missing.push('Jurusan');
      if (!applyForm.expectedSalary) missing.push('Gaji yang diharapkan');
      if (!applyForm.availableStartDate) missing.push('Kapan bersedia masuk');
      if (!applyForm.experience) missing.push('Pengalaman');
      setApplyError(`Mohon lengkapi: ${missing.join(', ')}`);
      return;
    }
    // Validate phone number format
    if (!/^[0-9+\-\s]{8,20}$/.test(applyForm.phone)) {
      setApplyError('No. HP harus berupa angka yang valid (8-20 digit).');
      return;
    }
    // Validate NIK format (must be digits, typically 16)
    if (!/^[0-9]+$/.test(applyForm.nik)) {
      setApplyError('NIK harus berupa angka.');
      return;
    }
    if (applyForm.postalCode && !/^[0-9]+$/.test(applyForm.postalCode)) {
      setApplyError('Kode pos harus berupa angka.');
      return;
    }
    if (applyForm.gpa) {
      const gpaNum = parseFloat(applyForm.gpa);
      if (isNaN(gpaNum) || gpaNum < 1 || gpaNum > 4) {
        setApplyError('IPK harus antara 1.00 - 4.00.');
        return;
      }
    }
    setApplySubmitting(true);
    setApplyError(null);
    setApplySuccess(null);
    try {
      const formData = new FormData();
      formData.append('jobId', selectedJob.id);
      formData.append('applicantName', applyForm.applicantName);
      formData.append('email', applyForm.email);
      formData.append('phone', applyForm.phone);
      formData.append('nik', applyForm.nik);
      formData.append('birthPlace', applyForm.birthPlace);
      formData.append('birthDate', applyForm.birthDate);
      formData.append('gender', applyForm.gender);
      formData.append('maritalStatus', applyForm.maritalStatus);
      formData.append('address', applyForm.address);
      formData.append('city', applyForm.city);
      formData.append('postalCode', applyForm.postalCode);
      formData.append('educationLevel', applyForm.educationLevel);
      formData.append('institution', applyForm.institution);
      formData.append('major', applyForm.major);
      formData.append('gpa', applyForm.gpa);
      formData.append('experience', applyForm.experience);
      formData.append('expectedSalary', applyForm.expectedSalary);
      formData.append('availableStartDate', applyForm.availableStartDate);
      formData.append('coverLetter', applyForm.coverLetter);
      formData.append('resume', resumeFile);

      const res = await apiFetch('/api/careers/apply', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setApplyError('Gagal mengirim lamaran. Coba lagi.');
        setApplySubmitting(false);
        return;
      }
      setApplySuccess('Lamaran berhasil dikirim. Terima kasih!');
      setApplySubmitting(false);
      setApplyForm({
        applicantName: '',
        email: '',
        phone: '',
        nik: '',
        birthPlace: '',
        birthDate: '',
        gender: '',
        maritalStatus: '',
        address: '',
        city: '',
        postalCode: '',
        educationLevel: '',
        institution: '',
        major: '',
        gpa: '',
        experience: '',
        expectedSalary: '',
        availableStartDate: '',
        coverLetter: '',
      });
      setResumeFile(null);
    } catch (err) {
      void err;
      setApplyError('Gagal mengirim lamaran. Coba lagi.');
      setApplySubmitting(false);
    }
  };

  const departments = useMemo(() => {
    const set = new Set<string>();
    for (const job of jobListings) set.add(job.department);
    return ['All Departments', ...Array.from(set).sort()];
  }, [jobListings]);

  const locations = ['All Locations', 'Jakarta', 'Surabaya', 'Remote'];

  const types = useMemo(() => {
    const set = new Set<string>();
    for (const job of jobListings) set.add(job.type);
    return ['All Types', ...Array.from(set).sort()];
  }, [jobListings]);

  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
    const matchesLocation = selectedLocation === 'all' || job.location.includes(selectedLocation);
    const matchesType = selectedType === 'all' || job.type === selectedType;
    
    return matchesSearch && matchesDepartment && matchesLocation && matchesType;
  });

  const featuredJobs = filteredJobs.filter(job => job.featured);
  const regularJobs = filteredJobs.filter(job => !job.featured);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className={`${getHeroGradient(pageContent.heroGradient)} text-white py-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-bold text-4xl lg:text-5xl mb-4">{pageContent.heroTitle}</h1>
            <p className="text-xl opacity-90 mb-8">
              {pageContent.heroSubtitle}
            </p>
            
            {/* Search Bar */}
            <div className="bg-white rounded-lg p-2 shadow-lg">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 flex items-center px-4 py-3 bg-gray-50 rounded-lg">
                  <Search className="w-5 h-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Search job title, keywords, or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-gray-700"
                  />
                </div>
                <button className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors">
                  Search Jobs
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl mb-1 text-orange-600">{jobListings.length}</div>
              <div className="text-gray-600">Open Positions</div>
            </div>
            <div>
              <div className="text-3xl mb-1 text-blue-600">500+</div>
              <div className="text-gray-600">Team Members</div>
            </div>
            <div>
              <div className="text-3xl mb-1 text-green-600">15+</div>
              <div className="text-gray-600">Office Locations</div>
            </div>
            <div>
              <div className="text-3xl mb-1 text-orange-600">4.8/5</div>
              <div className="text-gray-600">Employee Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full flex items-center justify-between bg-white px-4 py-3 rounded-lg border-2 border-gray-200"
                >
                  <span className="flex items-center">
                    <Filter className="w-5 h-5 mr-2" />
                    Filters
                  </span>
                  <span className="text-gray-500">{showFilters ? '▲' : '▼'}</span>
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Department Filter */}
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                  <h3 className="font-bold mb-3 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-orange-500" />
                    Department
                  </h3>
                  <div className="space-y-2">
                    {departments.map((dept, index) => (
                      <label key={index} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="radio"
                          name="department"
                          value={index === 0 ? 'all' : dept}
                          checked={selectedDepartment === (index === 0 ? 'all' : dept)}
                          onChange={(e) => setSelectedDepartment(e.target.value)}
                          className="mr-2 text-orange-500"
                        />
                        <span className="text-gray-700">{dept}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location Filter */}
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                  <h3 className="font-bold mb-3 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                    Location
                  </h3>
                  <div className="space-y-2">
                    {locations.map((loc, index) => (
                      <label key={index} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="radio"
                          name="location"
                          value={index === 0 ? 'all' : loc}
                          checked={selectedLocation === (index === 0 ? 'all' : loc)}
                          onChange={(e) => setSelectedLocation(e.target.value)}
                          className="mr-2 text-blue-600"
                        />
                        <span className="text-gray-700">{loc}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Type Filter */}
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                  <h3 className="font-bold mb-3 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-green-600" />
                    Job Type
                  </h3>
                  <div className="space-y-2">
                    {types.map((type, index) => (
                      <label key={index} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="radio"
                          name="type"
                          value={index === 0 ? 'all' : type}
                          checked={selectedType === (index === 0 ? 'all' : type)}
                          onChange={(e) => setSelectedType(e.target.value)}
                          className="mr-2 text-green-600"
                        />
                        <span className="text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Job Listings */}
            <div className="flex-1">
              {/* Featured Jobs */}
              {featuredJobs.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <Star className="w-6 h-6 text-orange-500 mr-2" />
                    <h2 className="font-bold text-2xl">Featured Positions</h2>
                  </div>
                  <div className="space-y-4">
                    {featuredJobs.map(job => (
                      <div
                        key={job.id}
                        className="bg-white border-2 border-orange-200 rounded-lg p-6 hover:shadow-xl transition-all hover:border-orange-400 cursor-pointer"
                        onClick={() => openApply(job)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm">
                                Featured
                              </span>
                              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                                {job.level}
                              </span>
                            </div>
                            <h3 className="font-bold text-xl mb-2 hover:text-orange-600 transition-colors">
                              {job.title}
                            </h3>
                            <div className="flex flex-wrap gap-4 text-gray-600 mb-3">
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
                              <span className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {job.applicants} applicants
                              </span>
                            </div>
                            <p className="text-gray-600 mb-3">{job.description}</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {job.skills.slice(0, 5).map((skill, index) => (
                                <span
                                  key={index}
                                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                            <div className="text-orange-600 mb-2">
                              💰 {job.salary}
                            </div>
                          </div>
                          <button
                            className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <Heart className="w-6 h-6 text-gray-400 hover:text-red-500" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t">
                          <span className="text-sm text-gray-500">Posted {job.postedDays} days ago</span>
                          <button
                            className="flex items-center bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              openApply(job);
                            }}
                          >
                            Apply Now
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Jobs */}
              {regularJobs.length > 0 && (
                <div>
                  <h2 className="font-bold text-2xl mb-4">
                    All Positions ({regularJobs.length})
                  </h2>
                  <div className="space-y-4">
                    {regularJobs.map(job => (
                      <div
                        key={job.id}
                        className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all hover:border-blue-300 cursor-pointer"
                        onClick={() => openApply(job)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                                {job.level}
                              </span>
                            </div>
                            <h3 className="font-bold text-xl mb-2 hover:text-blue-600 transition-colors">
                              {job.title}
                            </h3>
                            <div className="flex flex-wrap gap-4 text-gray-600 mb-3">
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
                              <span className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {job.applicants} applicants
                              </span>
                            </div>
                            <p className="text-gray-600 mb-3">{job.description}</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {job.skills.slice(0, 5).map((skill, index) => (
                                <span
                                  key={index}
                                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                            <div className="text-blue-600 mb-2">
                              💰 {job.salary}
                            </div>
                          </div>
                          <button
                            className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <Heart className="w-6 h-6 text-gray-400 hover:text-red-500" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t">
                          <span className="text-sm text-gray-500">Posted {job.postedDays} days ago</span>
                          <button
                            className="flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              openApply(job);
                            }}
                          >
                            Apply Now
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {filteredJobs.length === 0 && (
                <div className="bg-white border-2 border-gray-200 rounded-lg p-12 text-center">
                  <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="font-bold text-xl mb-2">No jobs found</h3>
                  <p className="text-gray-600">Try adjusting your filters or search terms</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-bold text-3xl mb-12 text-center">Why Join SuperCorridor?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-500 rounded-full mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl mb-3">Career Growth</h3>
              <p className="text-gray-600">
                Fast-track your career with clear progression paths, mentorship programs, and leadership opportunities.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl mb-3">Great Culture</h3>
              <p className="text-gray-600">
                Work with talented professionals in a collaborative environment that values innovation and creativity.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl mb-3">Competitive Benefits</h3>
              <p className="text-gray-600">
                Enjoy competitive salaries, health insurance, training budgets, and flexible work arrangements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 via-blue-600 to-green-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-bold text-3xl mb-4">Don't See the Right Role?</h2>
          <p className="text-xl opacity-90 mb-6">
            Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <a
            href="mailto:careers@supercorridor.com"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Send Your Resume
          </a>
        </div>
      </section>

      {applyOpen && selectedJob && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => closeApply()}
        >
          <div
            className="bg-white rounded-xl w-full max-w-2xl max-h-[85vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-bold text-xl text-gray-900">{selectedJob.title}</h3>
                <div className="mt-1 text-gray-600 flex flex-wrap gap-4">
                  <span className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-1" />
                    {selectedJob.department}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {selectedJob.location}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {selectedJob.type}
                  </span>
                </div>
              </div>
              <button className="text-gray-500 hover:text-gray-900" onClick={() => closeApply()}>
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="text-gray-900 mb-2">Requirements</h4>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  {selectedJob.requirements.slice(0, 8).map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  value={applyForm.applicantName}
                  onChange={(e) => setApplyForm((p) => ({ ...p, applicantName: e.target.value }))}
                  placeholder="Nama lengkap *"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <input
                  value={applyForm.email}
                  onChange={(e) => setApplyForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="Email *"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <input
                  value={applyForm.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9+\-\s]/g, '');
                    setApplyForm((p) => ({ ...p, phone: val }));
                  }}
                  placeholder="No. HP *"
                  type="tel"
                  inputMode="numeric"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <input
                  value={applyForm.nik}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setApplyForm((p) => ({ ...p, nik: val }));
                  }}
                  placeholder="NIK *"
                  inputMode="numeric"
                  maxLength={16}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />

                <input
                  value={applyForm.birthPlace}
                  onChange={(e) => setApplyForm((p) => ({ ...p, birthPlace: e.target.value }))}
                  placeholder="Tempat lahir"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <input
                  type="date"
                  value={applyForm.birthDate}
                  onChange={(e) => setApplyForm((p) => ({ ...p, birthDate: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />

                <select
                  value={applyForm.gender}
                  onChange={(e) => setApplyForm((p) => ({ ...p, gender: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                >
                  <option value="">Jenis kelamin *</option>
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
                </select>
                <select
                  value={applyForm.maritalStatus}
                  onChange={(e) => setApplyForm((p) => ({ ...p, maritalStatus: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                >
                  <option value="">Status pernikahan</option>
                  <option value="single">Belum menikah</option>
                  <option value="married">Menikah</option>
                  <option value="divorced">Cerai hidup</option>
                  <option value="widowed">Cerai mati</option>
                </select>

                <textarea
                  value={applyForm.address}
                  onChange={(e) => setApplyForm((p) => ({ ...p, address: e.target.value }))}
                  placeholder="Alamat lengkap *"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent min-h-[88px] md:col-span-2"
                />

                <input
                  value={applyForm.city}
                  onChange={(e) => setApplyForm((p) => ({ ...p, city: e.target.value }))}
                  placeholder="Kota domisili *"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <input
                  value={applyForm.postalCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setApplyForm((p) => ({ ...p, postalCode: val }));
                  }}
                  placeholder="Kode pos"
                  inputMode="numeric"
                  maxLength={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />

                <select
                  value={applyForm.educationLevel}
                  onChange={(e) => setApplyForm((p) => ({ ...p, educationLevel: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                >
                  <option value="">Pendidikan terakhir *</option>
                  <option value="SMA/SMK">SMA/SMK</option>
                  <option value="D3">D3</option>
                  <option value="S1">S1</option>
                  <option value="S2">S2</option>
                  <option value="S3">S3</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
                <input
                  value={applyForm.institution}
                  onChange={(e) => setApplyForm((p) => ({ ...p, institution: e.target.value }))}
                  placeholder="Institusi *"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <input
                  value={applyForm.major}
                  onChange={(e) => setApplyForm((p) => ({ ...p, major: e.target.value }))}
                  placeholder="Jurusan *"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <input
                  value={applyForm.gpa}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.]/g, '');
                    const num = parseFloat(val);
                    if (val === '' || val === '.' || (val.match(/\./g) || []).length <= 1) {
                      if (val === '' || isNaN(num) || num <= 4) {
                        setApplyForm((p) => ({ ...p, gpa: val }));
                      }
                    }
                  }}
                  placeholder="IPK (1.00 - 4.00, opsional)"
                  inputMode="decimal"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />

                <input
                  value={applyForm.experience}
                  onChange={(e) => setApplyForm((p) => ({ ...p, experience: e.target.value }))}
                  placeholder="Pengalaman (contoh: 3 tahun) *"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <input
                  value={applyForm.expectedSalary}
                  onChange={(e) => setApplyForm((p) => ({ ...p, expectedSalary: e.target.value }))}
                  placeholder="Gaji yang diharapkan *"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />

                <div className="w-full">
                  <label className="block text-sm text-gray-600 mb-1">Kapan bersedia masuk? *</label>
                  <input
                    type="date"
                    value={applyForm.availableStartDate}
                    onChange={(e) => setApplyForm((p) => ({ ...p, availableStartDate: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                  />
                  <div className="mt-1 text-xs text-gray-600">
                    {resumeFile ? `File terpilih: ${resumeFile.name}` : 'Upload CV (PDF/DOC/DOCX)'}
                  </div>
                </div>
              </div>

              <textarea
                value={applyForm.coverLetter}
                onChange={(e) => setApplyForm((p) => ({ ...p, coverLetter: e.target.value }))}
                placeholder="Cover letter (opsional)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent min-h-[120px]"
              />

              {applyError && <div className="text-red-600">{applyError}</div>}
              {applySuccess && <div className="text-green-700">{applySuccess}</div>}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => closeApply()}
                  disabled={applySubmitting}
                >
                  Batal
                </button>
                <button
                  className="px-5 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-60"
                  onClick={() => submitApplication()}
                  disabled={applySubmitting}
                >
                  {applySubmitting ? 'Mengirim...' : 'Kirim Lamaran'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
