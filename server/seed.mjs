/**
 * Database Seed Script for SuperCorridor
 * 
 * Usage:
 *   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/supercorridor node server/seed.mjs
 * 
 * This will:
 * 1. Create all tables if they don't exist
 * 2. Seed default content data
 */

import { initDatabase, setContentValue, setPageContent, insertContactMessage, query, pool } from './db.mjs';
import crypto from 'node:crypto';

async function seed() {
  console.log('🌱 Starting database seed...\n');

  // 1. Initialize tables
  await initDatabase();
  console.log('✅ Tables created\n');

  // 2. Seed Hero Slides
  const heroSlides = [
    {
      id: 1,
      title: 'Empowering Business Connectivity',
      subtitle: 'Across Indonesia',
      description: 'Enterprise-grade internet solutions with 99.99% uptime guarantee',
      ctaText: 'Get Started',
      ctaLink: '/contact',
      backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80',
      order: 1,
    },
    {
      id: 2,
      title: 'Ultra-Fast Fiber Network',
      subtitle: 'Nationwide Coverage',
      description: 'Connect your business with speeds up to 100Gbps',
      ctaText: 'Explore Solutions',
      ctaLink: '/solutions/dedicated-connectivity',
      backgroundImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=80',
      order: 2,
    },
    {
      id: 3,
      title: 'Enterprise Security',
      subtitle: '24/7 Protection',
      description: 'Advanced DDoS protection and network monitoring',
      ctaText: 'Learn More',
      ctaLink: '/solutions/value-added-services',
      backgroundImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1920&q=80',
      order: 3,
    },
  ];
  await setContentValue('heroSlides', heroSlides);
  console.log('✅ Hero slides seeded');

  // 3. Seed TGCS Data
  const tgcsData = {
    hero: {
      title: 'SuperCorridor TGCS',
      subtitle: 'Trans Global Cable System',
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
  await setContentValue('tgcs', tgcsData);
  console.log('✅ TGCS data seeded');

  // 4. Seed Home Management
  const homeManagement = {
    heroData: {
      title: 'Empowering Business Connectivity Across Indonesia',
      subtitle: 'Enterprise-grade internet solutions with 99.99% uptime guarantee',
      ctaText: 'Get Started',
      ctaLink: '/contact',
      backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
    },
    stats: [
      { label: 'Network Coverage', value: '50+', suffix: 'Cities' },
      { label: 'Enterprise Clients', value: '1,000+', suffix: 'Companies' },
      { label: 'Network Uptime', value: '99.99%', suffix: 'SLA' },
      { label: 'Data Centers', value: '15+', suffix: 'Locations' },
    ],
  };
  await setContentValue('homeManagement', homeManagement);
  console.log('✅ Home management seeded');

  // 5. Seed Resources - Insights
  const resourcesInsights = [
    { id: '1', title: '5G Technology and the Future of Business Connectivity', excerpt: 'Explore how 5G is transforming business operations', content: 'Full article content here...', author: 'John Doe', date: '2024-01-15', category: 'Technology', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa', published: true },
    { id: '2', title: 'The Importance of Network Security in 2024', excerpt: 'Understanding modern security challenges', content: 'Full article content here...', author: 'Jane Smith', date: '2024-01-10', category: 'Security', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b', published: true },
    { id: '3', title: 'Cloud Interconnection Best Practices', excerpt: 'Optimize your multi-cloud strategy', content: 'Full article content here...', author: 'Ahmad Rahman', date: '2024-01-05', category: 'Cloud', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31', published: true },
  ];
  await setContentValue('resourcesInsights', resourcesInsights);
  console.log('✅ Resources insights seeded');

  // 6. Seed Resources - Case Studies
  const resourcesCaseStudies = [
    { id: '1', title: 'Enterprise Network Transformation', client: 'Global Tech Corp', industry: 'Technology', challenge: 'Legacy infrastructure causing downtime', solution: 'Deployed fiber optic backbone with redundancy', results: '99.99% uptime, 50% cost reduction', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa', published: true },
    { id: '2', title: 'Healthcare Network Security', client: 'National Healthcare Network', industry: 'Healthcare', challenge: 'HIPAA compliance and secure data transfer', solution: 'Dedicated network with managed firewall', results: 'HIPAA compliance achieved, 80% faster transfers', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b', published: true },
  ];
  await setContentValue('resourcesCaseStudies', resourcesCaseStudies);
  console.log('✅ Resources case studies seeded');

  // 7. Seed Resources - FAQ
  const resourcesFAQ = [
    { id: '1', question: 'What is the typical installation time?', answer: 'Installation typically takes 5-10 business days depending on location and service type.', category: 'General', order: 1, published: true },
    { id: '2', question: 'Do you offer 24/7 support?', answer: 'Yes, we provide round-the-clock technical support for all enterprise customers.', category: 'Support', order: 2, published: true },
    { id: '3', question: 'What are your SLA guarantees?', answer: 'We guarantee 99.99% uptime for enterprise services with proactive monitoring.', category: 'Technical', order: 3, published: true },
    { id: '4', question: 'What bandwidth options are available?', answer: 'We offer scalable bandwidth from 10 Mbps to 100 Gbps.', category: 'Technical', order: 4, published: true },
    { id: '5', question: 'How is pricing structured?', answer: 'Pricing is based on bandwidth, service level, location, and contract term.', category: 'Pricing', order: 5, published: true },
  ];
  await setContentValue('resourcesFAQ', resourcesFAQ);
  console.log('✅ Resources FAQ seeded');

  // 8. Seed Careers - Jobs
  const careersJobs = [
    { id: '1', title: 'Network Engineer', department: 'Engineering', location: 'Jakarta, Indonesia', type: 'Full-time', description: 'We are looking for an experienced Network Engineer...', requirements: ['5+ years experience', 'CCNP certification', 'Strong TCP/IP knowledge'], responsibilities: ['Design and implement network solutions', 'Monitor network performance'], salary: 'IDR 15-25 million', posted: '2024-01-15', active: true },
    { id: '2', title: 'Sales Manager', department: 'Sales', location: 'Surabaya, Indonesia', type: 'Full-time', description: 'Seeking a dynamic Sales Manager...', requirements: ['7+ years in B2B sales', 'Leadership experience'], responsibilities: ['Lead sales team', 'Develop business strategies'], salary: 'IDR 20-30 million', posted: '2024-01-10', active: true },
    { id: '3', title: 'DevOps Engineer', department: 'Engineering', location: 'Jakarta, Indonesia', type: 'Full-time', description: 'Build and maintain CI/CD pipelines...', requirements: ['3+ years DevOps experience', 'Kubernetes, Docker'], responsibilities: ['Automate infrastructure', 'Optimize systems'], salary: 'IDR 14-24 million', posted: '2024-01-08', active: true },
  ];
  await setContentValue('careersJobs', careersJobs);
  console.log('✅ Careers jobs seeded');

  // 9. Seed Customers
  const customers = {
    customers: [
      { id: '1', name: 'PT Bank Central Asia', logo: 'https://via.placeholder.com/150x80?text=BCA', industry: 'Banking' },
      { id: '2', name: 'PT Telkom Indonesia', logo: 'https://via.placeholder.com/150x80?text=Telkom', industry: 'Telecommunications' },
      { id: '3', name: 'PT Astra International', logo: 'https://via.placeholder.com/150x80?text=Astra', industry: 'Automotive' },
      { id: '4', name: 'PT Pertamina', logo: 'https://via.placeholder.com/150x80?text=Pertamina', industry: 'Energy' },
      { id: '5', name: 'PT Tokopedia', logo: 'https://via.placeholder.com/150x80?text=Tokopedia', industry: 'E-Commerce' },
    ],
    testimonials: [
      { id: '1', customerName: 'John Smith', position: 'CTO', company: 'Tech Corp Indonesia', content: 'SuperCorridor has been instrumental in our digital transformation. Their reliable network and excellent support have exceeded our expectations.', rating: 5, avatar: 'https://i.pravatar.cc/150?img=1' },
      { id: '2', customerName: 'Sarah Johnson', position: 'IT Director', company: 'Global Finance Ltd', content: 'The 99.99% uptime guarantee is not just a promise - they deliver. Our operations have never been smoother.', rating: 5, avatar: 'https://i.pravatar.cc/150?img=2' },
      { id: '3', customerName: 'Ahmad Rahman', position: 'VP Technology', company: 'PT Pertamina', content: 'Reliable connectivity for our nationwide operations. SuperCorridor understands enterprise needs.', rating: 5, avatar: 'https://i.pravatar.cc/150?img=3' },
    ],
  };
  await setContentValue('customers', customers);
  console.log('✅ Customers seeded');

  // 10. Seed Network Coverage
  const networkCoverage = {
    title: 'Network Coverage',
    description: 'SuperCorridor network spans across major cities in Indonesia',
    totalPops: 150,
    totalCities: 50,
    cities: [
      { id: '1', name: 'Jakarta', province: 'DKI Jakarta', pops: 25, status: 'active' },
      { id: '2', name: 'Surabaya', province: 'Jawa Timur', pops: 15, status: 'active' },
      { id: '3', name: 'Bandung', province: 'Jawa Barat', pops: 12, status: 'active' },
      { id: '4', name: 'Medan', province: 'Sumatera Utara', pops: 10, status: 'active' },
      { id: '5', name: 'Semarang', province: 'Jawa Tengah', pops: 8, status: 'active' },
      { id: '6', name: 'Makassar', province: 'Sulawesi Selatan', pops: 7, status: 'active' },
      { id: '7', name: 'Denpasar', province: 'Bali', pops: 6, status: 'active' },
      { id: '8', name: 'Yogyakarta', province: 'DI Yogyakarta', pops: 5, status: 'active' },
      { id: '9', name: 'Balikpapan', province: 'Kalimantan Timur', pops: 4, status: 'coming-soon' },
      { id: '10', name: 'Manado', province: 'Sulawesi Utara', pops: 3, status: 'coming-soon' },
    ],
  };
  await setContentValue('networkCoverage', networkCoverage);
  console.log('✅ Network coverage seeded');

  // 11. Seed Contact Messages (sample)
  const sampleMessages = [
    { id: crypto.randomBytes(12).toString('base64url'), name: 'John Doe', email: 'john.doe@telkom.co.id', phone: '+62 812-3456-7890', company: 'PT. Telkom Indonesia', subject: 'Inquiry about Dedicated Connectivity', message: 'We are interested in your 10 Gbps dedicated fiber service for our Jakarta office.', date: '2026-01-02 10:30', status: 'new' },
    { id: crypto.randomBytes(12).toString('base64url'), name: 'Jane Smith', email: 'jane.smith@bca.co.id', phone: '+62 813-9876-5432', company: 'Bank Central Asia', subject: 'SD-WAN Solution for Multi-Branch', message: 'We need SD-WAN solution to connect 50+ branches across Indonesia.', date: '2026-01-02 09:15', status: 'read' },
    { id: crypto.randomBytes(12).toString('base64url'), name: 'Ahmad Rahman', email: 'ahmad.rahman@pertamina.com', phone: '+62 821-5555-6666', company: 'PT. Pertamina', subject: 'Cloud Interconnection Services', message: 'Looking for direct connection to AWS and Azure for our enterprise applications.', date: '2026-01-01 16:45', status: 'responded' },
  ];
  await setContentValue('contactMessages', sampleMessages);
  console.log('✅ Contact messages seeded');

  // 12. Seed Page Content - Solutions
  await setPageContent('solutions-dedicated-connectivity', {
    title: 'Dedicated Connectivity Solutions',
    subtitle: 'Reliable, high-speed dedicated internet access for your business',
    heroImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
    description: 'Our dedicated connectivity solutions provide your business with guaranteed bandwidth and superior performance. With symmetric upload and download speeds, your critical applications run smoothly without interruption.',
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
  });

  await setPageContent('solutions-backbone-network', {
    title: 'Backbone & Network Infrastructure',
    subtitle: 'Robust network infrastructure connecting Indonesia',
    heroImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
    description: 'Our extensive backbone network provides the foundation for reliable, high-performance connectivity across the nation. With redundant paths and carrier-grade equipment, we ensure your data flows seamlessly.',
    features: [
      { title: 'Nationwide Coverage', description: 'Extensive fiber optic network spanning major cities' },
      { title: 'Redundant Paths', description: 'Multiple routes ensure network resilience' },
      { title: 'Carrier-Grade Equipment', description: 'Enterprise-level hardware for maximum reliability' },
      { title: 'Scalable Bandwidth', description: 'Easily upgrade capacity as your needs grow' },
    ],
  });

  await setPageContent('solutions-cloud-interconnection', {
    title: 'Cloud & Interconnection Services',
    subtitle: 'Direct, low-latency connections to major cloud providers',
    heroImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
    description: 'Connect directly to AWS, Azure, Google Cloud, and other major cloud platforms with dedicated, low-latency links. Bypass the public internet for improved performance, security, and reliability.',
    features: [
      { title: 'Multi-Cloud Access', description: 'Direct connections to AWS, Azure, Google Cloud, and more' },
      { title: 'Low Latency', description: 'Sub-millisecond latency with dedicated private links' },
      { title: 'High Availability', description: 'Redundant paths with automatic failover for 99.99% uptime' },
      { title: 'Flexible Bandwidth', description: 'Scale from 50 Mbps to 100 Gbps based on your needs' },
    ],
  });

  await setPageContent('solutions-value-added-services', {
    title: 'Value-Added Services',
    subtitle: 'Comprehensive managed services to enhance your connectivity',
    heroImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3',
    description: 'Beyond connectivity, we offer a suite of managed services designed to protect, optimize, and enhance your network infrastructure.',
    features: [
      { title: 'DDoS Protection', description: 'Advanced threat mitigation with real-time traffic analysis and filtering' },
      { title: 'Managed SD-WAN', description: 'Intelligent traffic routing across multiple WAN connections' },
      { title: 'Network Monitoring', description: '24/7 proactive monitoring with instant alerting and response' },
      { title: 'Managed Firewall', description: 'Enterprise-grade firewall management and security policies' },
    ],
  });
  console.log('✅ Solutions page content seeded');

  // 13. Seed Page Content - About
  await setPageContent('about-company-overview', {
    title: 'Company Overview',
    subtitle: 'Leading Internet Service Provider in Indonesia',
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
    companyDescription: 'SuperCorridor is a premier Internet Service Provider dedicated to delivering enterprise-grade connectivity solutions across Indonesia. Since our inception, we have been committed to building robust network infrastructure that powers businesses and drives digital transformation.',
    founded: '2010',
    headquarters: 'Jakarta, Indonesia',
    employees: '500+',
    customers: '1,000+',
    coverage: '50+ Cities',
    values: [
      { title: 'Innovation', description: 'Continuously advancing our technology and services' },
      { title: 'Reliability', description: 'Delivering consistent, high-quality connectivity' },
      { title: 'Customer Focus', description: 'Putting our clients needs at the forefront' },
      { title: 'Integrity', description: 'Operating with transparency and ethical standards' },
    ],
  });

  await setPageContent('about-vision-mission', {
    title: 'Vision & Mission',
    heroImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
    vision: 'To be the leading Internet Service Provider in Indonesia, empowering businesses with world-class connectivity solutions and driving digital transformation across the nation.',
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
  });

  await setPageContent('about-leadership', {
    teamMembers: [
      { id: '1', name: 'John Santoso', position: 'Chief Executive Officer', bio: 'John has over 20 years of experience in the telecommunications industry, leading SuperCorridor to become a market leader.', image: 'https://i.pravatar.cc/300?img=12', linkedin: 'https://linkedin.com/in/johnsantoso', email: 'john@supercorridor.com', twitter: '', instagram: '' },
      { id: '2', name: 'Sarah Wijaya', position: 'Chief Technology Officer', bio: 'Sarah leads our technology vision with expertise in network architecture and cloud infrastructure.', image: 'https://i.pravatar.cc/300?img=47', linkedin: 'https://linkedin.com/in/sarahwijaya', email: 'sarah@supercorridor.com', twitter: '', instagram: '' },
    ],
  });

  await setPageContent('about-milestones', {
    milestones: [
      { id: '1', year: '2008', title: 'Company Founded', description: 'SuperCorridor was established with a vision to transform enterprise connectivity in Indonesia.' },
      { id: '2', year: '2010', title: 'First 100 Clients', description: 'Reached our first major milestone, serving 100 enterprise customers across Jakarta.' },
      { id: '3', year: '2012', title: 'Network Expansion', description: 'Expanded fiber-optic network to 10 major cities, doubling our coverage area.' },
      { id: '4', year: '2014', title: 'Cloud Partnerships', description: 'Established direct connections to AWS, Azure, and Google Cloud platforms.' },
      { id: '5', year: '2016', title: '10 Gbps Milestone', description: 'Launched 10 Gbps dedicated connectivity services for enterprise clients.' },
      { id: '6', year: '2018', title: 'Industry Recognition', description: 'Awarded "Best Enterprise ISP" by Indonesia Telecommunications Association.' },
      { id: '7', year: '2020', title: '500+ Clients', description: 'Reached 500 enterprise clients, solidifying our position as a market leader.' },
      { id: '8', year: '2022', title: 'Regional Expansion', description: 'Expanded operations to 50+ cities across Indonesia and neighboring countries.' },
      { id: '9', year: '2024', title: 'Innovation Hub', description: 'Opened our Network Innovation Center to develop next-generation connectivity solutions.' },
    ],
  });
  console.log('✅ About page content seeded');

  // 14. Seed Settings
  await query(
    `INSERT INTO settings (key, value, updated_at) VALUES ($1, $2, NOW())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
    ['site', JSON.stringify({
      profile: { name: 'Super Admin', email: 'admin@supercorridor.com', phone: '+62 812-3456-7890' },
      notifications: { contactMessages: true, jobApplications: true, weeklySummary: false, systemUpdates: true },
      website: { name: 'SuperCorridor', phone: '021-4587 8409', email: 'ask@supercorridor.co.id', address: 'Artha Gading Niaga Blok E 11, 12, 15A Kelapa Gading, Jakarta 14240 Indonesia' },
    })]
  );
  console.log('✅ Settings seeded');

  console.log('\n🎉 Database seeded successfully!');
  console.log('   You can now start the server with: node server/index.mjs');

  await pool.end();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
