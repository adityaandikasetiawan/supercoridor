import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Layouts
import { Navbar } from './components/Navbar';
import { ContactBar } from './components/ContactBar';
import { Footer } from './components/Footer';

// Public Pages
import { Home } from './pages/Home';
import { Contact } from './pages/Contact';
import { Customers } from './pages/Customers';
import { NetworkCoverage } from './pages/NetworkCoverage';
import { Careers } from './pages/Careers';
import { TGCSProject } from './pages/TGCSProject';

// Solutions Pages
import { DedicatedConnectivity } from './pages/solutions/DedicatedConnectivity';
import { BackboneNetwork } from './pages/solutions/BackboneNetwork';
import { CloudInterconnection } from './pages/solutions/CloudInterconnection';
import { ValueAddedServices } from './pages/solutions/ValueAddedServices';

// About Pages
import { CompanyOverview } from './pages/about/CompanyOverview';
import { VisionMission } from './pages/about/VisionMission';
import { Leadership } from './pages/about/Leadership';
import { Milestones } from './pages/about/Milestones';

// Resources Pages
import { Insights } from './pages/resources/Insights';
import { ArticleDetail } from './pages/resources/ArticleDetail';
import { CaseStudies } from './pages/resources/CaseStudies';
import { CaseStudyDetail } from './pages/resources/CaseStudyDetail';
import { FAQ } from './pages/resources/FAQ';

// Admin Pages
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { AdminHomeManagement } from './pages/admin/HomeManagement';
import { ManageContact } from './pages/admin/ManageContact';
import { Settings } from './pages/admin/Settings';
import { UserManagement } from './pages/admin/UserManagement';

// Admin Resources
import { AdminResourcesInsights } from './pages/admin/ResourcesInsights';
import { AdminResourcesCaseStudies } from './pages/admin/ResourcesCaseStudies';
import { AdminResourcesFAQ } from './pages/admin/ResourcesFAQ';

// Admin Careers
import { AdminCareersJobs } from './pages/admin/CareersJobs';
import { AdminCareersApplications } from './pages/admin/CareersApplications';

// Admin Customers
import { AdminCustomers } from './pages/admin/Customers';

// Admin Solutions
import { AdminSolutions } from './pages/admin/Solutions';
import { AdminTechnology } from './pages/admin/Technology';

// Admin About
import { AdminAboutCompanyOverview } from './pages/admin/about/CompanyOverview';
import { AdminAboutVisionMission } from './pages/admin/about/VisionMission';
import { AdminAboutLeadership } from './pages/admin/about/Leadership';
import { AdminAboutMilestones } from './pages/admin/about/Milestones';

// Admin Network
import { AdminNetworkCoverage } from './pages/admin/NetworkCoverage';

// Admin TGCS
import { AdminTGCSManagement } from './pages/admin/TGCSManagement';

// Enterprise Pages
import { EnterpriseDashboard } from './pages/enterprise/Dashboard';
import { EnterpriseQuotation } from './pages/enterprise/Quotation';
import { EnterpriseHistory } from './pages/enterprise/QuoteHistory';
import { EnterpriseDevices } from './pages/enterprise/Devices';
import { EnterpriseConfig } from './pages/enterprise/Config';

// 404 Page
import { NotFound } from './pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname]);

  return null;
}

function TitleManager() {
  const { pathname } = useLocation();
  const { lang } = useLanguage();

  useEffect(() => {
    const base = 'SuperCorridor';

    const titleFor = (path: string) => {
      const id = {
        '/': 'Beranda',
        '/network-coverage': 'Cakupan Jaringan',
        '/contact': 'Hubungi Kami',
        '/careers': 'Karir',
        '/customers': 'Pelanggan',
        '/tgcs-project': 'Proyek TGCS',
        '/solutions/dedicated-connectivity': 'Konektivitas Dedicated',
        '/solutions/backbone-network': 'Backbone & Infrastruktur Jaringan',
        '/solutions/cloud-interconnection': 'Layanan Cloud & Interkoneksi',
        '/solutions/value-added-services': 'Layanan Nilai Tambah',
        '/about/company-overview': 'Profil Perusahaan',
        '/about/vision-mission': 'Visi & Misi',
        '/about/leadership': 'Tim Kepemimpinan',
        '/about/milestones': 'Pencapaian',
        '/resources/insights': 'Artikel & Insight',
        '/resources/case-studies': 'Studi Kasus',
        '/resources/faq': 'FAQ',
        '/admin/login': 'Admin | Masuk',
        '/admin/dashboard': 'Admin | Dashboard',
        '/admin/home': 'Admin | Home',
        '/admin/contact': 'Admin | Contact',
        '/admin/settings': 'Admin | Settings',
        '/admin/resources/insights': 'Admin | Resources Insights',
        '/admin/resources/case-studies': 'Admin | Resources Case Studies',
        '/admin/resources/faq': 'Admin | Resources FAQ',
        '/admin/careers/jobs': 'Admin | Careers Jobs',
        '/admin/careers/applications': 'Admin | Careers Applications',
        '/admin/customers': 'Admin | Customers',
        '/admin/solutions/dedicated-connectivity': 'Admin | Dedicated Connectivity',
        '/admin/solutions/backbone-network': 'Admin | Backbone Network',
        '/admin/network-coverage': 'Admin | Network Coverage',
        '/admin/tgcs-management': 'Admin | TGCS Management',
      } as const;

      const en = {
        '/': 'Home',
        '/network-coverage': 'Network Coverage',
        '/contact': 'Contact',
        '/careers': 'Careers',
        '/customers': 'Customers',
        '/tgcs-project': 'TGCS Project',
        '/solutions/dedicated-connectivity': 'Dedicated Connectivity',
        '/solutions/backbone-network': 'Backbone & Network Infrastructure',
        '/solutions/cloud-interconnection': 'Cloud & Interconnection Services',
        '/solutions/value-added-services': 'Value-Added Services',
        '/about/company-overview': 'Company Overview',
        '/about/vision-mission': 'Vision & Mission',
        '/about/leadership': 'Leadership Team',
        '/about/milestones': 'Milestones',
        '/resources/insights': 'Articles & Insights',
        '/resources/case-studies': 'Case Studies',
        '/resources/faq': 'FAQ',
        '/admin/login': 'Admin | Login',
        '/admin/dashboard': 'Admin | Dashboard',
        '/admin/home': 'Admin | Home',
        '/admin/contact': 'Admin | Contact',
        '/admin/settings': 'Admin | Settings',
        '/admin/resources/insights': 'Admin | Resources Insights',
        '/admin/resources/case-studies': 'Admin | Resources Case Studies',
        '/admin/resources/faq': 'Admin | Resources FAQ',
        '/admin/careers/jobs': 'Admin | Careers Jobs',
        '/admin/careers/applications': 'Admin | Careers Applications',
        '/admin/customers': 'Admin | Customers',
        '/admin/solutions/dedicated-connectivity': 'Admin | Dedicated Connectivity',
        '/admin/solutions/backbone-network': 'Admin | Backbone Network',
        '/admin/network-coverage': 'Admin | Network Coverage',
        '/admin/tgcs-management': 'Admin | TGCS Management',
      } as const;

      if (path.startsWith('/admin') && !(path in en) && !(path in id)) {
        return lang === 'id' ? 'Admin | SuperCorridor' : 'Admin | SuperCorridor';
      }

      const label = lang === 'id' ? id[path as keyof typeof id] : en[path as keyof typeof en];
      return label ?? null;
    };

    const leaf = titleFor(pathname);
    document.title = leaf ? `${base} | ${leaf}` : base;
    document.documentElement.lang = lang;
  }, [lang, pathname]);

  return null;
}

function RequireAdminRole({ allowed, children }: { allowed: string[]; children: React.ReactNode }) {
  const { user } = useAuth();
  const role = user?.role === 'admin' ? 'super_admin' : user?.role;
  if (!role || !allowed.includes(role)) return <Navigate to="/admin/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <ScrollToTop />
          <TitleManager />
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route
                      path="home"
                      element={
                        <RequireAdminRole allowed={['super_admin', 'content']}>
                          <AdminHomeManagement />
                        </RequireAdminRole>
                      }
                    />
                    <Route
                      path="contact"
                      element={
                        <RequireAdminRole allowed={['super_admin', 'content']}>
                          <ManageContact />
                        </RequireAdminRole>
                      }
                    />
                    <Route path="settings" element={<Settings />} />
                    <Route
                      path="users"
                      element={
                        <RequireAdminRole allowed={['super_admin']}>
                          <UserManagement />
                        </RequireAdminRole>
                      }
                    />
                    
                    {/* Resources Routes */}
                    <Route
                      path="resources/insights"
                      element={
                        <RequireAdminRole allowed={['super_admin', 'content']}>
                          <AdminResourcesInsights />
                        </RequireAdminRole>
                      }
                    />
                    <Route
                      path="resources/case-studies"
                      element={
                        <RequireAdminRole allowed={['super_admin', 'content']}>
                          <AdminResourcesCaseStudies />
                        </RequireAdminRole>
                      }
                    />
                    <Route
                      path="resources/faq"
                      element={
                        <RequireAdminRole allowed={['super_admin', 'content']}>
                          <AdminResourcesFAQ />
                        </RequireAdminRole>
                      }
                    />
                    
                    {/* Careers Routes */}
                    <Route
                      path="careers/jobs"
                      element={
                        <RequireAdminRole allowed={['super_admin', 'hr']}>
                          <AdminCareersJobs />
                        </RequireAdminRole>
                      }
                    />
                    <Route
                      path="careers/applications"
                      element={
                        <RequireAdminRole allowed={['super_admin', 'hr']}>
                          <AdminCareersApplications />
                        </RequireAdminRole>
                      }
                    />
                    
                    {/* Customers Route */}
                    <Route
                      path="customers"
                      element={
                        <RequireAdminRole allowed={['super_admin', 'content']}>
                          <AdminCustomers />
                        </RequireAdminRole>
                      }
                    />
                    
                    {/* Solutions Routes */}
                    <Route
                      path="solutions"
                      element={
                        <RequireAdminRole allowed={['super_admin', 'content']}>
                          <AdminSolutions />
                        </RequireAdminRole>
                      }
                    />
                    <Route
                      path="technology"
                      element={
                        <RequireAdminRole allowed={['super_admin', 'content']}>
                          <AdminTechnology />
                        </RequireAdminRole>
                      }
                    />
                    
                    {/* About Routes */}
                    <Route
                      path="about/company-overview"
                      element={
                        <RequireAdminRole allowed={['super_admin', 'content']}>
                          <AdminAboutCompanyOverview />
                        </RequireAdminRole>
                      }
                    />
                    <Route
                      path="about/vision-mission"
                      element={
                        <RequireAdminRole allowed={['super_admin', 'content']}>
                          <AdminAboutVisionMission />
                        </RequireAdminRole>
                      }
                    />
                    <Route
                      path="about/leadership"
                      element={
                        <RequireAdminRole allowed={['super_admin', 'content']}>
                          <AdminAboutLeadership />
                        </RequireAdminRole>
                      }
                    />
                    <Route
                      path="about/milestones"
                      element={
                        <RequireAdminRole allowed={['super_admin', 'content']}>
                          <AdminAboutMilestones />
                        </RequireAdminRole>
                      }
                    />
                    
                    {/* Network Coverage Route */}
                    <Route
                      path="network-coverage"
                      element={
                        <RequireAdminRole allowed={['super_admin', 'content']}>
                          <AdminNetworkCoverage />
                        </RequireAdminRole>
                      }
                    />
                    
                    {/* TGCS Management Route */}
                    <Route
                      path="tgcs-management"
                      element={
                        <RequireAdminRole allowed={['super_admin', 'content']}>
                          <AdminTGCSManagement />
                        </RequireAdminRole>
                      }
                    />
                    
                    {/* Enterprise Routes handled at top level */}
                  </Routes>
                </ProtectedRoute>
              }
            />

            {/* Enterprise Routes */}
            <Route path="/enterprise" element={<ProtectedRoute allowedRoles={['super_admin', 'sales']}><EnterpriseDashboard /></ProtectedRoute>} />
            <Route path="/enterprise/quotation" element={<ProtectedRoute allowedRoles={['super_admin', 'sales']}><EnterpriseQuotation /></ProtectedRoute>} />
            <Route path="/enterprise/history" element={<ProtectedRoute allowedRoles={['super_admin', 'sales']}><EnterpriseHistory /></ProtectedRoute>} />
            <Route path="/enterprise/devices" element={<ProtectedRoute allowedRoles={['super_admin', 'sales']}><EnterpriseDevices /></ProtectedRoute>} />
            <Route path="/enterprise/config" element={<ProtectedRoute allowedRoles={['super_admin', 'sales']}><EnterpriseConfig /></ProtectedRoute>} />

            {/* Public Routes */}
            <Route
              path="*"
              element={
                <div className="min-h-screen bg-white flex flex-col">
                  <Navbar />
                  <main className="flex-grow">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/solutions/dedicated-connectivity" element={<DedicatedConnectivity />} />
                      <Route path="/solutions/backbone-network" element={<BackboneNetwork />} />
                      <Route path="/solutions/cloud-interconnection" element={<CloudInterconnection />} />
                      <Route path="/solutions/value-added-services" element={<ValueAddedServices />} />
                      <Route path="/about/company-overview" element={<CompanyOverview />} />
                      <Route path="/about/vision-mission" element={<VisionMission />} />
                      <Route path="/about/leadership" element={<Leadership />} />
                      <Route path="/about/milestones" element={<Milestones />} />
                      <Route path="/network-coverage" element={<NetworkCoverage />} />
                      <Route path="/resources/insights" element={<Insights />} />
                      <Route path="/resources/insights/:id" element={<ArticleDetail />} />
                      <Route path="/resources/case-studies" element={<CaseStudies />} />
                      <Route path="/resources/case-studies/:id" element={<CaseStudyDetail />} />
                      <Route path="/resources/faq" element={<FAQ />} />
                      <Route path="/customers" element={<Customers />} />
                      <Route path="/careers" element={<Careers />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/tgcs-project" element={<TGCSProject />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <ContactBar />
                  <Footer />
                </div>
              }
            />
          </Routes>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}
