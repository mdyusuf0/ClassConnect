// ============================================
// ClassConnect Mock Data Store
// All courses, packages, testimonials, etc.
// Will be replaced by backend API calls later
// ============================================

const STORAGE_KEY = 'classconnect_data';

// ---- Seed Data ----

const defaultCourses = [
  {
    id: 'c1',
    title: 'Digital Marketing Mastery',
    category: 'Marketing',
    description: 'Learn the fundamentals of digital marketing including SEO, content strategy, and social media marketing to grow any business online.',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
    duration: '6 Weeks',
    lessons: 42,
    level: 'Beginner',
    instructor: 'Surekha',
    featured: true,
  },
  {
    id: 'c2',
    title: 'Affiliate Marketing Pro',
    category: 'Marketing',
    description: 'Master the art of affiliate marketing. Learn how to earn commissions by promoting products through proven strategies.',
    thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=250&fit=crop',
    duration: '4 Weeks',
    lessons: 28,
    level: 'Intermediate',
    instructor: 'Surekha',
    featured: true,
  },
  {
    id: 'c3',
    title: 'Meesho Reselling Business',
    category: 'E-Commerce',
    description: 'Start your own reselling business on Meesho. Learn product selection, pricing strategies, and customer management.',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop',
    duration: '3 Weeks',
    lessons: 18,
    level: 'Beginner',
    instructor: 'Surekha',
    featured: false,
  },
  {
    id: 'c4',
    title: 'AI Faceless YouTube Channel',
    category: 'AI & Tech',
    description: 'Create a profitable YouTube channel using AI tools without showing your face. Learn AI content generation and monetization.',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop',
    duration: '5 Weeks',
    lessons: 35,
    level: 'Intermediate',
    instructor: 'Surekha',
    featured: true,
  },
  {
    id: 'c5',
    title: 'ChatGPT & Prompt Engineering',
    category: 'AI & Tech',
    description: 'Master the art of prompt engineering with ChatGPT. Learn to leverage AI for content creation, automation, and productivity.',
    thumbnail: 'https://images.unsplash.com/photo-1684163761883-8a3e3b278e48?w=400&h=250&fit=crop',
    duration: '3 Weeks',
    lessons: 22,
    level: 'Beginner',
    instructor: 'Surekha',
    featured: false,
  },
  {
    id: 'c6',
    title: 'CapCut & InShot Video Editing',
    category: 'Content Creation',
    description: 'Create professional-quality videos using CapCut and InShot. Learn transitions, effects, and viral content creation techniques.',
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=250&fit=crop',
    duration: '3 Weeks',
    lessons: 24,
    level: 'Beginner',
    instructor: 'Surekha',
    featured: false,
  },
  {
    id: 'c7',
    title: 'Instagram Growth & Marketing',
    category: 'Social Media',
    description: 'Build a powerful Instagram presence. Learn growth hacking, content strategy, reels, and monetization techniques.',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=250&fit=crop',
    duration: '4 Weeks',
    lessons: 30,
    level: 'Beginner',
    instructor: 'Surekha',
    featured: true,
  },
  {
    id: 'c8',
    title: 'WhatsApp Marketing Strategies',
    category: 'Social Media',
    description: 'Leverage WhatsApp for business growth. Learn broadcast strategies, automation, and customer engagement techniques.',
    thumbnail: 'https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?w=400&h=250&fit=crop',
    duration: '2 Weeks',
    lessons: 14,
    level: 'Beginner',
    instructor: 'Surekha',
    featured: false,
  },
  {
    id: 'c9',
    title: 'Meta & Google Ads Mastery',
    category: 'Marketing',
    description: 'Run profitable ad campaigns on Facebook, Instagram, and Google. Learn targeting, budgeting, and optimization.',
    thumbnail: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=250&fit=crop',
    duration: '6 Weeks',
    lessons: 38,
    level: 'Advanced',
    instructor: 'Surekha',
    featured: false,
  },
  {
    id: 'c10',
    title: 'Amazon Affiliate Marketing',
    category: 'E-Commerce',
    description: 'Earn passive income through Amazon Associates program. Learn niche selection, content strategy, and link optimization.',
    thumbnail: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=400&h=250&fit=crop',
    duration: '4 Weeks',
    lessons: 26,
    level: 'Intermediate',
    instructor: 'Surekha',
    featured: false,
  },
  {
    id: 'c11',
    title: 'Canva Design Masterclass',
    category: 'Content Creation',
    description: 'Create stunning graphics, social media posts, presentations, and marketing materials using Canva like a pro.',
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=250&fit=crop',
    duration: '3 Weeks',
    lessons: 20,
    level: 'Beginner',
    instructor: 'Surekha',
    featured: false,
  },
  {
    id: 'c12',
    title: 'Sales Mastery & Closing',
    category: 'Business',
    description: 'Master the psychology of selling. Learn proven sales techniques, objection handling, and closing strategies.',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
    duration: '4 Weeks',
    lessons: 28,
    level: 'Advanced',
    instructor: 'Surekha',
    featured: false,
  },
  {
    id: 'c13',
    title: 'Pinterest Marketing',
    category: 'Social Media',
    description: 'Drive organic traffic and sales using Pinterest. Learn pin strategy, SEO, and conversion optimization.',
    thumbnail: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=400&h=250&fit=crop',
    duration: '3 Weeks',
    lessons: 18,
    level: 'Beginner',
    instructor: 'Surekha',
    featured: false,
  },
  {
    id: 'c14',
    title: 'MS Excel for Business',
    category: 'Business',
    description: 'Master Microsoft Excel for data analysis, reporting, and business automation. From basics to advanced formulas.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
    duration: '4 Weeks',
    lessons: 32,
    level: 'Beginner',
    instructor: 'Surekha',
    featured: false,
  },
  {
    id: 'c15',
    title: 'Real Estate Digital Marketing',
    category: 'Marketing',
    description: 'Digital marketing strategies specifically for real estate professionals. Generate leads and close deals online.',
    thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop',
    duration: '5 Weeks',
    lessons: 30,
    level: 'Intermediate',
    instructor: 'Surekha',
    featured: false,
  },
  {
    id: 'c16',
    title: 'Gen AI Website Design',
    category: 'AI & Tech',
    description: 'Build beautiful websites using AI-powered tools. No coding required. Create professional sites in hours, not weeks.',
    thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=250&fit=crop',
    duration: '4 Weeks',
    lessons: 24,
    level: 'Intermediate',
    instructor: 'Surekha',
    featured: false,
  },
];

const defaultPackages = [
  {
    id: 'pkg-bronze',
    name: 'Bronze',
    price: 1499,
    originalPrice: 2999,
    color: '#CD7F32',
    courses: ['c3', 'c6', 'c8'],
    features: ['3 Courses Included', 'Lifetime Access', 'Certificate of Completion', 'Community Access'],
    popular: false,
    commission: 200,
  },
  {
    id: 'pkg-silver',
    name: 'Silver',
    price: 2999,
    originalPrice: 5999,
    color: '#C0C0C0',
    courses: ['c3', 'c6', 'c8', 'c1', 'c7', 'c13'],
    features: ['6 Courses Included', 'Lifetime Access', 'Certificate of Completion', 'Community Access', 'Weekly Live Sessions'],
    popular: false,
    commission: 400,
  },
  {
    id: 'pkg-gold',
    name: 'Gold',
    price: 4999,
    originalPrice: 9999,
    color: '#FFD700',
    courses: ['c3', 'c6', 'c8', 'c1', 'c7', 'c13', 'c2', 'c10', 'c5', 'c11'],
    features: ['10 Courses Included', 'Lifetime Access', 'Certificate of Completion', 'Community Access', 'Weekly Live Sessions', '1-on-1 Mentorship'],
    popular: true,
    commission: 700,
  },
  {
    id: 'pkg-diamond',
    name: 'Diamond',
    price: 7999,
    originalPrice: 14999,
    color: '#B9F2FF',
    courses: ['c3', 'c6', 'c8', 'c1', 'c7', 'c13', 'c2', 'c10', 'c5', 'c11', 'c4', 'c9', 'c12'],
    features: ['13 Courses Included', 'Lifetime Access', 'Certificate of Completion', 'Community Access', 'Daily Live Sessions', '1-on-1 Mentorship', 'Priority Support'],
    popular: false,
    commission: 1200,
  },
  {
    id: 'pkg-platinum',
    name: 'Platinum',
    price: 9999,
    originalPrice: 19999,
    color: '#E5E4E2',
    courses: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'c11', 'c12', 'c13', 'c14', 'c15', 'c16'],
    features: ['All 16+ Courses', 'Lifetime Access', 'Certificate of Completion', 'Exclusive Community', 'Daily Live Sessions', '1-on-1 Mentorship', 'Priority Support', 'Revenue Share Program'],
    popular: false,
    commission: 2000,
  },
];

const defaultTestimonials = [
  {
    id: 't1',
    name: 'Vamsi Krishna',
    role: 'Student',
    avatar: 'https://ui-avatars.com/api/?name=Vamsi+Krishna&background=002B70&color=fff&size=100',
    content: "I'm thrilled to have had the opportunity to learn from Surekha! Her training sessions are a total game-changer. She breaks down complex concepts about Facebook and Instagram ads into easy-to-understand, bite-sized pieces, making it perfect for beginners and experienced professionals alike.",
    rating: 5,
  },
  {
    id: 't2',
    name: 'Sampath Kumar',
    role: 'Real Estate Agent',
    avatar: 'https://ui-avatars.com/api/?name=Sampath+Kumar&background=D44000&color=fff&size=100',
    content: "I am a realtor in Hyderabad. I have joined Surekha mam's classes to grow my business. These classes and trainings helped me a lot for my business.",
    rating: 5,
  },
  {
    id: 't3',
    name: 'Chandra Leela',
    role: 'Nutritionist',
    avatar: 'https://ui-avatars.com/api/?name=Chandra+Leela&background=76A72C&color=fff&size=100',
    content: 'Surekha mam herself directly takes live trainings for us. Those trainings are so valuable and informative. She explains everything step by step and everyone can understand easily.',
    rating: 5,
  },
  {
    id: 't4',
    name: 'Hima Bindhu',
    role: 'Home Maker',
    avatar: 'https://ui-avatars.com/api/?name=Hima+Bindhu&background=002B70&color=fff&size=100',
    content: "As a homemaker, I followed the techniques taught by Surekha. She taught us step-by-step how to generate income in free time. The training content was easy to practice. Thanks to ClassConnect!",
    rating: 5,
  },
  {
    id: 't5',
    name: 'Madhusoudhan',
    role: 'Business Owner',
    avatar: 'https://ui-avatars.com/api/?name=Madhusoudhan&background=D44000&color=fff&size=100',
    content: "The knowledge shared in Surekha's training was incredibly useful for me. She is the right mentor to improve marketing skills. The practical strategies she taught were very easy to implement.",
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

  deleteCourse(id) {
    const data = this.getData();
    data.courses = data.courses.filter(c => c.id !== id);
    saveData(data);
  },

  // Packages
  getPackages() {
    return this.getData().packages;
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
