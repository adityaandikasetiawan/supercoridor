import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
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
import { CaseStudies } from './pages/resources/CaseStudies';
import { FAQ } from './pages/resources/FAQ';

// Admin Pages
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { AdminHomeManagement } from './pages/admin/HomeManagement';
import { ManageContact } from './pages/admin/ManageContact';
import { Settings } from './pages/admin/Settings';

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
import { AdminSolutionsDedicatedConnectivity } from './pages/admin/solutions/DedicatedConnectivity';
import { AdminSolutionsBackboneNetwork } from './pages/admin/solutions/BackboneNetwork';

// Admin About
import { AdminAboutCompanyOverview } from './pages/admin/about/CompanyOverview';
import { AdminAboutVisionMission } from './pages/admin/about/VisionMission';
import { AdminAboutLeadership } from './pages/admin/about/Leadership';

// Admin Network
import { AdminNetworkCoverage } from './pages/admin/NetworkCoverage';

// Admin TGCS
import { AdminTGCSManagement } from './pages/admin/TGCSManagement';

import { AdminPlaceholder } from './pages/admin/AdminPlaceholder';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="home" element={<AdminHomeManagement />} />
                  <Route path="contact" element={<ManageContact />} />
                  <Route path="settings" element={<Settings />} />
                  
                  {/* Resources Routes */}
                  <Route path="resources/insights" element={<AdminResourcesInsights />} />
                  <Route path="resources/case-studies" element={<AdminResourcesCaseStudies />} />
                  <Route path="resources/faq" element={<AdminResourcesFAQ />} />
                  
                  {/* Careers Routes */}
                  <Route path="careers/jobs" element={<AdminCareersJobs />} />
                  <Route path="careers/applications" element={<AdminCareersApplications />} />
                  
                  {/* Customers Route */}
                  <Route path="customers" element={<AdminCustomers />} />
                  
                  {/* Solutions Routes */}
                  <Route path="solutions/dedicated-connectivity" element={<AdminSolutionsDedicatedConnectivity />} />
                  <Route path="solutions/backbone-network" element={<AdminSolutionsBackboneNetwork />} />
                  <Route path="solutions/cloud-interconnection" element={<AdminPlaceholder title="Cloud Interconnection Management" description="Content management coming soon. Use similar structure as Dedicated Connectivity" />} />
                  <Route path="solutions/value-added-services" element={<AdminPlaceholder title="Value-Added Services Management" description="Content management coming soon. Use similar structure as Dedicated Connectivity" />} />
                  
                  {/* About Routes */}
                  <Route path="about/company-overview" element={<AdminAboutCompanyOverview />} />
                  <Route path="about/vision-mission" element={<AdminAboutVisionMission />} />
                  <Route path="about/leadership" element={<AdminAboutLeadership />} />
                  <Route path="about/milestones" element={<AdminPlaceholder title="Milestones Management" description="Timeline and achievements management coming soon" />} />
                  
                  {/* Network Coverage Route */}
                  <Route path="network-coverage" element={<AdminNetworkCoverage />} />
                  
                  {/* TGCS Management Route */}
                  <Route path="tgcs-management" element={<AdminTGCSManagement />} />
                </Routes>
              </ProtectedRoute>
            }
          />

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
                    <Route path="/resources/case-studies" element={<CaseStudies />} />
                    <Route path="/resources/faq" element={<FAQ />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/tgcs-project" element={<TGCSProject />} />
                  </Routes>
                </main>
                <ContactBar />
                <Footer />
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
