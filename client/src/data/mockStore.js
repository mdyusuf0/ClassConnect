// ============================================
// ClassConnect Mock Data Store
// All courses, packages, testimonials, etc.
// Will be replaced by backend API calls later
// ============================================

const STORAGE_KEY = 'classconnect_data_v4';

// ---- Seed Data ----

const defaultCourses = [
  {
    id: 'c1',
    title: 'Google Ads Mastery',
    category: 'Marketing',
    description: 'Master Google Search, Display, and Video ads to capture high-intent leads and maximize business ROI.',
    thumbnail: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=500&h=300&fit=crop',
    duration: '4 Weeks',
    lessons: 28,
    level: 'Intermediate',
    badge: 'HOT BUNDLE',
    price: 2499,
    originalPrice: 4999,
    instructor: 'ClassConnect PRO Mentors',
    featured: true,
  },
  {
    id: 'c2',
    title: 'Meta Ads Pro',
    category: 'Marketing',
    description: 'Run high-converting Facebook & Instagram ad campaigns with targeted audience building and retargeting.',
    thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500&h=300&fit=crop',
    duration: '5 Weeks',
    lessons: 32,
    level: 'Advanced',
    badge: 'TOP RATED',
    price: 2499,
    originalPrice: 4999,
    instructor: 'ClassConnect PRO Mentors',
    featured: true,
  },
  {
    id: 'c3',
    title: 'Chat GPT & AI Tools',
    category: 'AI & Tech',
    description: 'Leverage ChatGPT, Claude, and modern AI platforms to automate content creation and workflow productivity.',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop',
    duration: '3 Weeks',
    lessons: 22,
    level: 'Beginner',
    badge: 'TRENDING',
    price: 1799,
    originalPrice: 3599,
    instructor: 'ClassConnect PRO Mentors',
    featured: true,
  },
  {
    id: 'c4',
    title: 'AI Faceless YouTube',
    category: 'AI & Tech',
    description: 'Build a profitable YouTube channel without showing your face using AI voiceovers, scripts, and video generators.',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&h=300&fit=crop',
    duration: '5 Weeks',
    lessons: 35,
    level: 'Intermediate',
    badge: 'HIGH INCOME',
    price: 2199,
    originalPrice: 4399,
    instructor: 'ClassConnect PRO Mentors',
    featured: true,
  },
  {
    id: 'c5',
    title: 'AI Faceless Instagram',
    category: 'Social Media',
    description: 'Grow viral faceless Instagram theme pages that generate passive revenue and brand sponsorships.',
    thumbnail: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=500&h=300&fit=crop',
    duration: '4 Weeks',
    lessons: 26,
    level: 'Beginner',
    badge: 'POPULAR',
    price: 1899,
    originalPrice: 3799,
    instructor: 'ClassConnect PRO Mentors',
    featured: true,
  },
  {
    id: 'c6',
    title: 'Gen AI - Website Design',
    category: 'AI & Tech',
    description: 'Create stunning, high-converting websites in hours using generative AI web builders with zero coding.',
    thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=500&h=300&fit=crop',
    duration: '4 Weeks',
    lessons: 24,
    level: 'Intermediate',
    badge: 'FEATURED',
    price: 2299,
    originalPrice: 4599,
    instructor: 'ClassConnect PRO Mentors',
    featured: true,
  },
  {
    id: 'c7',
    title: 'GEN AI Digital Marketing',
    category: 'Marketing',
    description: 'Transform your marketing strategy by fusing generative AI for copy, visuals, ad creatives, and customer funnels.',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop',
    duration: '6 Weeks',
    lessons: 40,
    level: 'Advanced',
    badge: 'BESTSELLER',
    price: 2499,
    originalPrice: 4999,
    instructor: 'ClassConnect PRO Mentors',
    featured: true,
  },
  {
    id: 'c8',
    title: 'SEO (Search Engine Optimization)',
    category: 'Marketing',
    description: 'Rank #1 on Google with keyword research, technical SEO, backlink building, and content optimization.',
    thumbnail: 'https://images.unsplash.com/photo-1571721795195-a2ca2d3370a9?w=500&h=300&fit=crop',
    duration: '5 Weeks',
    lessons: 30,
    level: 'Intermediate',
    badge: 'MUST LEARN',
    price: 1999,
    originalPrice: 3999,
    instructor: 'ClassConnect PRO Mentors',
    featured: true,
  },
  {
    id: 'c9',
    title: 'Blogging',
    category: 'Content Creation',
    description: 'Start a profitable blog, write high-ranking articles, and generate passive income through Google AdSense & affiliates.',
    thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500&h=300&fit=crop',
    duration: '4 Weeks',
    lessons: 25,
    level: 'Beginner',
    badge: 'PASSIVE INCOME',
    price: 1499,
    originalPrice: 2999,
    instructor: 'ClassConnect PRO Mentors',
    featured: false,
  },
  {
    id: 'c10',
    title: 'Pinterest Marketing',
    category: 'Social Media',
    description: 'Drive millions of organic visitors to your website or store using viral Pinterest pin strategies.',
    thumbnail: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=500&h=300&fit=crop',
    duration: '3 Weeks',
    lessons: 18,
    level: 'Beginner',
    badge: 'ORGANIC TRAFFIC',
    price: 1299,
    originalPrice: 2599,
    instructor: 'ClassConnect PRO Mentors',
    featured: false,
  },
  {
    id: 'c11',
    title: 'Email Marketing',
    category: 'Marketing',
    description: 'Build responsive subscriber lists, write high-converting sales emails, and automate email sequences.',
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&h=300&fit=crop',
    duration: '3 Weeks',
    lessons: 20,
    level: 'Beginner',
    badge: 'HIGH CONVERSION',
    price: 1499,
    originalPrice: 2999,
    instructor: 'ClassConnect PRO Mentors',
    featured: false,
  },
  {
    id: 'c12',
    title: 'Dominate Content',
    category: 'Content Creation',
    description: 'Build a multi-platform content engine that captures attention, builds trust, and scales your personal brand.',
    thumbnail: 'https://images.unsplash.com/photo-1542744094-3a31b272c490?w=500&h=300&fit=crop',
    duration: '4 Weeks',
    lessons: 28,
    level: 'Intermediate',
    badge: 'BRANDING',
    price: 1699,
    originalPrice: 3399,
    instructor: 'ClassConnect PRO Mentors',
    featured: false,
  },
  {
    id: 'c13',
    title: 'Organic Marketing Mastery',
    category: 'Marketing',
    description: 'Generate steady leads and sales organically without relying on paid advertising.',
    thumbnail: 'https://images.unsplash.com/photo-1557838923-2985c318be48?w=500&h=300&fit=crop',
    duration: '4 Weeks',
    lessons: 24,
    level: 'Beginner',
    badge: 'ZERO AD COST',
    price: 1899,
    originalPrice: 3799,
    instructor: 'ClassConnect PRO Mentors',
    featured: false,
  },
  {
    id: 'c14',
    title: 'Freelancing Guide',
    category: 'Business',
    description: 'Land high-paying international clients, price your services, and launch a successful freelancing business.',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=300&fit=crop',
    duration: '4 Weeks',
    lessons: 26,
    level: 'Beginner',
    badge: 'REMOTE WORK',
    price: 1599,
    originalPrice: 3199,
    instructor: 'ClassConnect PRO Mentors',
    featured: false,
  },
  {
    id: 'c15',
    title: 'WhatsApp Marketing',
    category: 'Social Media',
    description: 'Turn WhatsApp into a high-converting sales machine with broadcasts, automation, and direct closing.',
    thumbnail: 'https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?w=500&h=300&fit=crop',
    duration: '2 Weeks',
    lessons: 14,
    level: 'Beginner',
    badge: 'HIGH CONVERSION',
    price: 1199,
    originalPrice: 2399,
    instructor: 'ClassConnect PRO Mentors',
    featured: false,
  },
  {
    id: 'c16',
    title: 'Mastering AI Resume Writing',
    category: 'AI & Tech',
    description: 'Craft ATS-clearing resumes, cover letters, and LinkedIn profiles using AI tools to land top job interviews.',
    thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&h=300&fit=crop',
    duration: '2 Weeks',
    lessons: 12,
    level: 'Beginner',
    badge: 'CAREER BOOST',
    price: 999,
    originalPrice: 1999,
    instructor: 'ClassConnect PRO Mentors',
    featured: false,
  },
  {
    id: 'c17',
    title: 'MS EXCEL Advanced',
    category: 'Business',
    description: 'Master advanced Excel formulas, VLOOKUP, XLOOKUP, Pivot Tables, macros, and financial dashboards.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop',
    duration: '4 Weeks',
    lessons: 32,
    level: 'Advanced',
    badge: 'ESSENTIAL SKILL',
    price: 1399,
    originalPrice: 2799,
    instructor: 'ClassConnect PRO Mentors',
    featured: false,
  },
  {
    id: 'c18',
    title: 'Objection Handling',
    category: 'Business',
    description: 'Master high-ticket closing scripts, overcome client price objections, and double your sales closing rate.',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
    duration: '3 Weeks',
    lessons: 18,
    level: 'Intermediate',
    badge: 'SALES CLOSING',
    price: 1599,
    originalPrice: 3199,
    instructor: 'ClassConnect PRO Mentors',
    featured: false,
  },
  {
    id: 'c19',
    title: 'Affiliate Marketing',
    category: 'Marketing',
    description: 'Promote high-ticket affiliate products and earn daily commission payouts directly to your bank account.',
    thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=500&h=300&fit=crop',
    duration: '4 Weeks',
    lessons: 28,
    level: 'Beginner',
    badge: 'EARN DAILY',
    price: 1999,
    originalPrice: 3999,
    instructor: 'ClassConnect PRO Mentors',
    featured: false,
  },
  {
    id: 'c20',
    title: 'Meesho Reselling',
    category: 'E-Commerce',
    description: 'Start your zero-investment online shop on Meesho and sell trending products with margin profits.',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop',
    duration: '3 Weeks',
    lessons: 18,
    level: 'Beginner',
    badge: 'ZERO INVESTMENT',
    price: 1199,
    originalPrice: 2399,
    instructor: 'ClassConnect PRO Mentors',
    featured: false,
  },
  {
    id: 'c21',
    title: 'Mindset Improvement',
    category: 'Personal Development',
    description: 'Develop an unstoppable growth mindset, eliminate procrastination, and build daily success habits.',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&h=300&fit=crop',
    duration: '2 Weeks',
    lessons: 14,
    level: 'Beginner',
    badge: 'SELF GROWTH',
    price: 999,
    originalPrice: 1999,
    instructor: 'ClassConnect PRO Mentors',
    featured: false,
  },
  {
    id: 'c22',
    title: 'Inshot Video Editing',
    category: 'Content Creation',
    description: 'Edit professional mobile videos, YouTube Shorts, and Instagram Reels quickly using InShot.',
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=500&h=300&fit=crop',
    duration: '3 Weeks',
    lessons: 20,
    level: 'Beginner',
    badge: 'MOBILE EDITING',
    price: 1299,
    originalPrice: 2599,
    instructor: 'ClassConnect PRO Mentors',
    featured: false,
  },
  {
    id: 'c23',
    title: 'Capcut Video Editing',
    category: 'Content Creation',
    description: 'Master viral video editing, auto-captions, green screen effects, and speed ramps using CapCut.',
    thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=500&h=300&fit=crop',
    duration: '3 Weeks',
    lessons: 22,
    level: 'Beginner',
    badge: 'VIRAL REELS',
    price: 1399,
    originalPrice: 2799,
    instructor: 'ClassConnect PRO Mentors',
    featured: false,
  },
  {
    id: 'c24',
    title: 'Amazon Associate Program',
    category: 'E-Commerce',
    description: 'Monetize physical product recommendations by joining the world’s largest affiliate network on Amazon.',
    thumbnail: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=500&h=300&fit=crop',
    duration: '4 Weeks',
    lessons: 26,
    level: 'Intermediate',
    badge: 'PASSIVE INCOME',
    price: 1499,
    originalPrice: 2999,
    instructor: 'ClassConnect PRO Mentors',
    featured: false,
  },
  {
    id: 'c25',
    title: 'Prompt Engineering',
    category: 'AI & Tech',
    description: 'Master advanced prompt architecture to get high-precision responses from Midjourney, ChatGPT & LLMs.',
    thumbnail: 'https://images.unsplash.com/photo-1684163761883-8a3e3b278e48?w=500&h=300&fit=crop',
    duration: '3 Weeks',
    lessons: 20,
    level: 'Intermediate',
    badge: 'AI SKILLS',
    price: 1699,
    originalPrice: 3399,
    instructor: 'ClassConnect PRO Mentors',
    featured: false,
  },
  {
    id: 'c26',
    title: 'Sales and Lead Generation Skills',
    category: 'Business',
    description: 'Build predictable inbound & outbound lead generation systems to scale high-ticket sales.',
    thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=500&h=300&fit=crop',
    duration: '5 Weeks',
    lessons: 34,
    level: 'Advanced',
    badge: 'HIGH DEMAND',
    price: 1999,
    originalPrice: 3999,
    instructor: 'ClassConnect PRO Mentors',
    featured: false,
  },
  {
    id: 'c27',
    title: 'Canva Mastery',
    category: 'Content Creation',
    description: 'Design professional graphics, YouTube thumbnails, ebooks, and social posts effortlessly with Canva.',
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&h=300&fit=crop',
    duration: '3 Weeks',
    lessons: 20,
    level: 'Beginner',
    badge: 'CREATIVE DESIGN',
    price: 1199,
    originalPrice: 2399,
    instructor: 'ClassConnect PRO Mentors',
    featured: false,
  },
  {
    id: 'c28',
    title: 'Real Estate Lead Generation',
    category: 'Marketing',
    description: 'Generate high-intent homebuyer and property investor leads specifically for real estate agents.',
    thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&h=300&fit=crop',
    duration: '5 Weeks',
    lessons: 30,
    level: 'Intermediate',
    badge: 'REAL ESTATE',
    price: 2499,
    originalPrice: 4999,
    instructor: 'ClassConnect PRO Mentors',
    featured: false,
  },
  {
    id: 'c29',
    title: 'HR Training',
    category: 'Business',
    description: 'Learn modern HR recruitment, talent management, labor compliance, and employee retention strategies.',
    thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=300&fit=crop',
    duration: '4 Weeks',
    lessons: 25,
    level: 'Beginner',
    badge: 'CORPORATE HR',
    price: 1799,
    originalPrice: 3599,
    instructor: 'ClassConnect PRO Mentors',
    featured: false,
  },
  {
    id: 'c30',
    title: 'Communication Training',
    category: 'Personal Development',
    description: 'Develop executive communication, public speaking confidence, active listening, and business presentation skills.',
    thumbnail: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=500&h=300&fit=crop',
    duration: '3 Weeks',
    lessons: 20,
    level: 'Beginner',
    badge: 'SOFT SKILLS',
    price: 1299,
    originalPrice: 2599,
    instructor: 'ClassConnect PRO Mentors',
    featured: false,
  },
];

const defaultPackages = [
  {
    id: 'pkg-bronze',
    name: 'Bronze Bundle',
    price: 1499,
    originalPrice: 4999,
    discountPercent: 70,
    color: '#CD7F32',
    courses: ['c9', 'c15', 'c21', 'c22'],
    features: ['4 Premium Courses Included', 'Lifetime Course Access', 'Certificate of Completion', 'Community Access', '₹300 Direct Referral Earnings'],
    popular: false,
    commission: 300,
  },
  {
    id: 'pkg-silver',
    name: 'Silver Bundle',
    price: 2999,
    originalPrice: 9999,
    discountPercent: 70,
    color: '#C0C0C0',
    courses: ['c3', 'c9', 'c10', 'c14', 'c15', 'c20', 'c21', 'c22'],
    features: ['8 Full Courses Included', 'Lifetime Access', 'Certificate of Completion', 'Weekly Q&A Sessions', '₹600 Direct Referral Earnings'],
    popular: false,
    commission: 600,
  },
  {
    id: 'pkg-gold',
    name: 'Gold Bundle',
    price: 4999,
    originalPrice: 14999,
    discountPercent: 67,
    color: '#FFD700',
    courses: ['c1', 'c2', 'c3', 'c5', 'c6', 'c8', 'c9', 'c10', 'c14', 'c15', 'c17', 'c20', 'c21', 'c22'],
    features: ['14 Masterclass Courses', 'Lifetime Access & Updates', 'Certificates of Completion', 'Weekly Live Trainings', '₹1,200 Direct Referral Earnings', '1-on-1 Mentorship Support'],
    popular: true,
    commission: 1200,
  },
  {
    id: 'pkg-diamond',
    name: 'Diamond Bundle',
    price: 7999,
    originalPrice: 24999,
    discountPercent: 68,
    color: '#B9F2FF',
    courses: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'c11', 'c12', 'c13', 'c14', 'c15', 'c17', 'c18', 'c20', 'c21', 'c22', 'c25', 'c28'],
    features: ['22 Complete Advanced Courses', 'Lifetime Access & Community', 'Official Certification', 'Daily Live Sessions', '₹2,000 Direct Referral Earnings', 'Priority VIP Support'],
    popular: false,
    commission: 2000,
  },
  {
    id: 'pkg-platinum',
    name: 'Platinum All-Access',
    price: 9999,
    originalPrice: 34999,
    discountPercent: 71,
    color: '#E5E4E2',
    courses: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'c11', 'c12', 'c13', 'c14', 'c15', 'c16', 'c17', 'c18', 'c19', 'c20', 'c21', 'c22', 'c23', 'c24', 'c25', 'c26', 'c27', 'c28', 'c29', 'c30'],
    features: ['All 30+ Courses Unlocked', 'Lifetime Unlimited Access', 'All Professional Certificates', 'Daily Live Masterclasses', '₹3,000 Direct Referral Earnings', '1-on-1 VIP Mentorship', 'Revenue Partner Perks'],
    popular: false,
    commission: 3000,
  },
];

const defaultTestimonials = [
  {
    id: 't1',
    name: 'Vamsi Krishna',
    role: 'Fullstack Engineering Student',
    avatar: 'https://ui-avatars.com/api/?name=Vamsi+Krishna&background=002B70&color=fff&size=100',
    content: "ClassConnect's Bilingual English & Telugu Learning OS changed everything for me! Being able to switch between Telugu explanation and English code units made understanding React 19 and Node.js microservices seamless.",
    rating: 5,
  },
  {
    id: 't2',
    name: 'Sampath Kumar',
    role: 'Real Estate Growth Partner',
    avatar: 'https://ui-avatars.com/api/?name=Sampath+Kumar&background=D44000&color=fff&size=100',
    content: "I am a realtor in Hyderabad. Joining ClassConnect's Google Ads & Meta Ads masterclasses helped me build a consistent automated lead generation pipeline for my properties. Highly recommended!",
    rating: 5,
  },
  {
    id: 't3',
    name: 'Chandra Leela',
    role: 'UI/UX Designer',
    avatar: 'https://ui-avatars.com/api/?name=Chandra+Leela&background=76A72C&color=fff&size=100',
    content: 'The 100% real production projects and verifiable skill credentials on ClassConnect allowed me to build a professional Figma design portfolio. The PRO Mentors review your code and designs line-by-line!',
    rating: 5,
  },
  {
    id: 't4',
    name: 'Hima Bindhu',
    role: 'Digital Freelancer',
    avatar: 'https://ui-avatars.com/api/?name=Hima+Bindhu&background=002B70&color=fff&size=100',
    content: "As a homemaker, ClassConnect's Generative AI and Video Editing units gave me the practical skills to start freelance clients and earn referral rewards in my spare time. Thank you ClassConnect!",
    rating: 5,
  },
  {
    id: 't5',
    name: 'Madhusoudhan',
    role: 'Agency Founder',
    avatar: 'https://ui-avatars.com/api/?name=Madhusoudhan&background=D44000&color=fff&size=100',
    content: "ClassConnect's Gold Bundle provided our agency team with cutting-edge AI prompt engineering and lead generation strategies. The bilingual switching feature is revolutionary for our team members.",
    rating: 5,
  },
  {
    id: 't6',
    name: 'Gade Balaji',
    role: 'Software Engineer',
    avatar: 'https://ui-avatars.com/api/?name=Gade+Balaji&background=76A72C&color=fff&size=100',
    content: "As a full-time software engineer, I was always looking for ways to utilize my free time productively. Joining ClassConnect turned out to be one of the best decisions of my life. The training introduced me to digital skills that I could easily implement part-time.",
    rating: 5,
  },
  {
    id: 't7',
    name: 'Sandhya',
    role: 'Home Maker',
    avatar: 'https://ui-avatars.com/api/?name=Sandhya&background=002B70&color=fff&size=100',
    content: "The classes gave me so much confidence. I started affiliate marketing part-time and now I've made it my career. The tips shared were very easy to implement.",
    rating: 4,
  },
  {
    id: 't8',
    name: 'Divya',
    role: 'Home Maker',
    avatar: 'https://ui-avatars.com/api/?name=Divya&background=D44000&color=fff&size=100',
    content: "As a homemaker, I wanted to generate income in my free time. The Amazon Affiliate Marketing course on the platform really inspired me and gave me practical skills.",
    rating: 5,
  },
];

const defaultVideoTestimonials = [
  { id: 'vt1', title: 'Student Success Story 1', videoUrl: '' },
  { id: 'vt2', title: 'Student Success Story 2', videoUrl: '' },
  { id: 'vt3', title: 'Student Success Story 3', videoUrl: '' },
  { id: 'vt4', title: 'Student Success Story 4', videoUrl: '' },
];

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh',
];

// ---- Store Helper Functions ----

function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to load from localStorage:', e);
  }
  return null;
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

function getDefaultData() {
  return {
    courses: defaultCourses,
    packages: defaultPackages,
    testimonials: defaultTestimonials,
    videoTestimonials: defaultVideoTestimonials,
    users: [
      {
        id: 'admin-1',
        name: 'Admin',
        email: 'admin@classconnect.com',
        password: 'admin123',
        role: 'admin',
        referralCode: 'ADMIN001',
      }
    ],
    referralLog: [],
    payoutRequests: [],
  };
}

function initStore() {
  const existing = loadData();
  if (!existing) {
    const defaultData = getDefaultData();
    saveData(defaultData);
    return defaultData;
  }
  return existing;
}

// ---- Public API ----

const store = {
  getData() {
    return loadData() || getDefaultData();
  },

  // Courses
  getCourses() {
    return this.getData().courses;
  },

  getCourseById(id) {
    return this.getCourses().find(c => c.id === id);
  },

  getFeaturedCourses() {
    return this.getCourses().filter(c => c.featured);
  },

  getCoursesByCategory(category) {
    if (!category || category === 'All') return this.getCourses();
    return this.getCourses().filter(c => c.category === category);
  },

  getCategories() {
    const courses = this.getCourses();
    return ['All', ...new Set(courses.map(c => c.category))];
  },

  addCourse(course) {
    const data = this.getData();
    const newCourse = { ...course, id: 'c' + Date.now() };
    data.courses.push(newCourse);
    saveData(data);
    return newCourse;
  },

  updateCourse(id, updates) {
    const data = this.getData();
    const idx = data.courses.findIndex(c => c.id === id);
    if (idx > -1) {
      data.courses[idx] = { ...data.courses[idx], ...updates };
      saveData(data);
    }
  },

  updateCoursePrice(id, price, originalPrice) {
    const data = this.getData();
    const idx = data.courses.findIndex(c => c.id === id);
    if (idx > -1) {
      data.courses[idx].price = price;
      data.courses[idx].originalPrice = originalPrice;
      saveData(data);
    }
  },

  deleteCourse(id) {
    const data = this.getData();
    data.courses = data.courses.filter(c => c.id !== id);
    saveData(data);
  },

  // Packages
  getPackages() {
    return this.getData().packages;
  },

  updatePackagePrice(id, price, originalPrice, commission) {
    const data = this.getData();
    const idx = data.packages.findIndex(p => p.id === id);
    if (idx > -1) {
      data.packages[idx].price = price;
      data.packages[idx].originalPrice = originalPrice;
      if (commission !== undefined) data.packages[idx].commission = commission;
      saveData(data);
    }
  },

  getPackageById(id) {
    return this.getPackages().find(p => p.id === id);
  },

  addPackage(pkg) {
    const data = this.getData();
    const newPkg = { ...pkg, id: 'pkg-' + Date.now() };
    data.packages.push(newPkg);
    saveData(data);
    return newPkg;
  },

  updatePackage(id, updates) {
    const data = this.getData();
    const idx = data.packages.findIndex(p => p.id === id);
    if (idx > -1) {
      data.packages[idx] = { ...data.packages[idx], ...updates };
      saveData(data);
    }
  },

  deletePackage(id) {
    const data = this.getData();
    data.packages = data.packages.filter(p => p.id !== id);
    saveData(data);
  },

  // Testimonials
  getTestimonials() {
    return this.getData().testimonials;
  },

  addTestimonial(testimonial) {
    const data = this.getData();
    const newT = { ...testimonial, id: 't' + Date.now() };
    data.testimonials.push(newT);
    saveData(data);
    return newT;
  },

  deleteTestimonial(id) {
    const data = this.getData();
    data.testimonials = data.testimonials.filter(t => t.id !== id);
    saveData(data);
  },

  getVideoTestimonials() {
    return this.getData().videoTestimonials;
  },

  addVideoTestimonial(vt) {
    const data = this.getData();
    const newVT = { ...vt, id: 'vt' + Date.now() };
    data.videoTestimonials.push(newVT);
    saveData(data);
    return newVT;
  },

  deleteVideoTestimonial(id) {
    const data = this.getData();
    data.videoTestimonials = data.videoTestimonials.filter(v => v.id !== id);
    saveData(data);
  },

  // Users & Auth
  getUsers() {
    return this.getData().users;
  },

  getUserByEmail(email) {
    return this.getUsers().find(u => u.email === email);
  },

  getUserByReferralCode(code) {
    return this.getUsers().find(u => u.referralCode === code);
  },

  registerUser(userData) {
    const data = this.getData();
    const referralCode = 'CC' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const newUser = {
      id: 'user-' + Date.now(),
      ...userData,
      role: 'student',
      referralCode,
      enrolledPackage: userData.packageId || null,
      referralCount: 0,
      totalEarnings: 0,
      pendingPayout: 0,
      bankDetails: null,
      createdAt: new Date().toISOString(),
    };
    data.users.push(newUser);

    // Process referral
    if (userData.referredBy) {
      const referrer = data.users.find(u => u.referralCode === userData.referredBy);
      if (referrer) {
        const pkg = data.packages.find(p => p.id === userData.packageId);
        const commission = pkg ? pkg.commission : 0;
        referrer.referralCount = (referrer.referralCount || 0) + 1;
        referrer.totalEarnings = (referrer.totalEarnings || 0) + commission;
        referrer.pendingPayout = (referrer.pendingPayout || 0) + commission;

        data.referralLog.push({
          id: 'ref-' + Date.now(),
          referrerId: referrer.id,
          referredUserId: newUser.id,
          packageId: userData.packageId,
          commission,
          status: 'pending',
          date: new Date().toISOString(),
        });
      }
    }

    saveData(data);
    return newUser;
  },

  loginUser(email, password) {
    const user = this.getUsers().find(u => u.email === email && u.password === password);
    return user || null;
  },

  updateUserBankDetails(userId, bankDetails) {
    const data = this.getData();
    const user = data.users.find(u => u.id === userId);
    if (user) {
      user.bankDetails = bankDetails;
      saveData(data);
    }
  },

  // Referral Log
  getReferralLog() {
    return this.getData().referralLog;
  },

  getReferralsByUser(userId) {
    return this.getReferralLog().filter(r => r.referrerId === userId);
  },

  // Payout Requests
  requestPayout(userId, amount) {
    const data = this.getData();
    const user = data.users.find(u => u.id === userId);
    if (user && user.pendingPayout >= amount) {
      const request = {
        id: 'payout-' + Date.now(),
        userId,
        userName: user.name,
        amount,
        bankDetails: user.bankDetails,
        status: 'pending',
        requestDate: new Date().toISOString(),
        processedDate: null,
        transactionId: null,
      };
      data.payoutRequests.push(request);
      user.pendingPayout -= amount;
      saveData(data);
      return request;
    }
    return null;
  },

  getPayoutRequests() {
    return this.getData().payoutRequests;
  },

  approvePayout(payoutId, transactionId) {
    const data = this.getData();
    const payout = data.payoutRequests.find(p => p.id === payoutId);
    if (payout) {
      payout.status = 'completed';
      payout.processedDate = new Date().toISOString();
      payout.transactionId = transactionId;
      saveData(data);
    }
  },

  rejectPayout(payoutId) {
    const data = this.getData();
    const payout = data.payoutRequests.find(p => p.id === payoutId);
    if (payout) {
      payout.status = 'rejected';
      payout.processedDate = new Date().toISOString();
      // Refund to user's pending balance
      const user = data.users.find(u => u.id === payout.userId);
      if (user) {
        user.pendingPayout += payout.amount;
      }
      saveData(data);
    }
  },

  // Reset store
  resetStore() {
    const defaultData = getDefaultData();
    saveData(defaultData);
    return defaultData;
  },
};

// Initialize on first import
initStore();

export default store;
export { indianStates };
