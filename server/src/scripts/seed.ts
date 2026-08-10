import dotenv from 'dotenv';
import path from 'path';

// Load .env from server directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../modules/auth/user.model';
import { Course } from '../modules/courses/course.model';
import { Payment } from '../modules/payments/payment.model';
import { ReferralSetting, ReferralEarning, PayoutRequest } from '../modules/referrals/referral.model';
import { Review } from '../modules/reviews/review.model';
import { LiveSession, ChatMessage } from '../modules/live/live.model';
import { UserProgress } from '../modules/progress/progress.model';

const BUNNY_STORAGE_CDN = process.env.BUNNY_STORAGE_CDN_URL || 'https://class-connect.b-cdn.net';
const BUNNY_STREAM_CDN = process.env.BUNNY_STREAM_CDN_URL || 'https://vz-e90d4726-817.b-cdn.net';

async function seedDatabase() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ClassConnect';
  console.log('Connecting to MongoDB...');

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully.');

    // Clear existing data for clean seed
    console.log('Clearing old data...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Payment.deleteMany({});
    await ReferralSetting.deleteMany({});
    await ReferralEarning.deleteMany({});
    await PayoutRequest.deleteMany({});
    await Review.deleteMany({});
    await LiveSession.deleteMany({});
    await ChatMessage.deleteMany({});
    await UserProgress.deleteMany({});

    console.log('Hashing passwords...');
    const defaultPasswordRaw = 'Password@123';
    const hashedPassword = await bcrypt.hash(defaultPasswordRaw, 8);

    // 1. SEED USERS
    console.log('Seeding Users...');
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@test.com',
      password: hashedPassword,
      role: 'admin',
      enrolledCourses: [],
    });

    const student1 = await User.create({
      name: 'Alex Johnson',
      email: 'student1@test.com',
      password: hashedPassword,
      role: 'student',
      enrolledCourses: [],
    });

    const student2 = await User.create({
      name: 'Bella Smith',
      email: 'student2@test.com',
      password: hashedPassword,
      role: 'student',
      enrolledCourses: [],
    });

    const student3 = await User.create({
      name: 'Charlie Davis',
      email: 'student3@test.com',
      password: hashedPassword,
      role: 'student',
      enrolledCourses: [],
    });

    const student4 = await User.create({
      name: 'Diana Prince',
      email: 'student4@test.com',
      password: hashedPassword,
      role: 'student',
      enrolledCourses: [],
    });

    const student5 = await User.create({
      name: 'Ethan Hunt',
      email: 'student5@test.com',
      password: hashedPassword,
      role: 'student',
      enrolledCourses: [],
    });

    // Also add default fallback admin@classconnect.com
    await User.create({
      name: 'ClassConnect Admin',
      email: 'admin@classconnect.com',
      password: hashedPassword,
      role: 'admin',
      enrolledCourses: [],
    });

    // 2. SEED COURSES (UNIT-WISE WITH BUNNY CDN VIDEO & IMAGE URLS)
    console.log('Seeding Courses (Unit-wise with Bunny CDN links)...');
    
    const course1 = await Course.create({
      title: 'Full-Stack Web Development Mastery (MERN)',
      slug: 'full-stack-web-development-mern',
      description: 'Master modern web development from HTML5/CSS3/JavaScript to React 18, Node.js, Express, MongoDB and Docker deployment.',
      thumbnail: `${BUNNY_STORAGE_CDN}/courses/web-development-mastery.jpg`,
      price: 4999,
      category: 'Web Development',
      level: 'All Levels',
      isPublished: true,
      units: [
        {
          id: 'u1-web',
          title: 'Unit 1: Fundamentals of HTML5, CSS3 & JavaScript (ES6+)',
          description: 'Learn foundational core building blocks of frontend architecture.',
          order: 1,
          lessons: [
            {
              id: 'u1-l1-web',
              title: 'Lesson 1.1: Web Architecture & HTML5 Semantic Structuring',
              description: 'Understand how HTTP, browsers, DOM, and HTML5 elements operate.',
              duration: 1800,
              videoUrl: `${BUNNY_STREAM_CDN}/unit1/lesson1_html5.mp4`,
              bunnyVideoId: 'bv-web-101',
              thumbnailUrl: `${BUNNY_STORAGE_CDN}/lessons/html5-thumb.jpg`,
              isFreePreview: true,
              order: 1,
              type: 'recorded',
            },
            {
              id: 'u1-l2-web',
              title: 'Lesson 1.2: Modern CSS3 Flexbox, Grid & Tailwind Styling',
              description: 'Build fully responsive, mobile-first design layouts.',
              duration: 2400,
              videoUrl: `${BUNNY_STREAM_CDN}/unit1/lesson2_css3.mp4`,
              bunnyVideoId: 'bv-web-102',
              thumbnailUrl: `${BUNNY_STORAGE_CDN}/lessons/css3-thumb.jpg`,
              isFreePreview: false,
              order: 2,
              type: 'recorded',
            },
            {
              id: 'u1-l3-web',
              title: 'Lesson 1.3: JavaScript ES6+, Async/Await & Fetch API',
              description: 'Deep dive into closures, promises, async/await, and event loops.',
              duration: 3000,
              videoUrl: `${BUNNY_STREAM_CDN}/unit1/lesson3_js.mp4`,
              bunnyVideoId: 'bv-web-103',
              thumbnailUrl: `${BUNNY_STORAGE_CDN}/lessons/js-thumb.jpg`,
              isFreePreview: false,
              order: 3,
              type: 'recorded',
            },
          ],
        },
        {
          id: 'u2-web',
          title: 'Unit 2: React 18 Frontend Development & State Management',
          description: 'Build single page applications with component hierarchy and state management.',
          order: 2,
          lessons: [
            {
              id: 'u2-l1-web',
              title: 'Lesson 2.1: React 18 Fundamentals, JSX & Custom Hooks',
              description: 'Master component lifecycle, useState, useEffect, and custom hooks.',
              duration: 2700,
              videoUrl: `${BUNNY_STREAM_CDN}/unit2/lesson1_react.mp4`,
              bunnyVideoId: 'bv-web-201',
              thumbnailUrl: `${BUNNY_STORAGE_CDN}/lessons/react-thumb.jpg`,
              isFreePreview: true,
              order: 1,
              type: 'recorded',
            },
            {
              id: 'u2-l2-web',
              title: 'Lesson 2.2: React Router v6 & Context API State Flow',
              description: 'Implement dynamic routing and global application state.',
              duration: 2100,
              videoUrl: `${BUNNY_STREAM_CDN}/unit2/lesson2_router.mp4`,
              bunnyVideoId: 'bv-web-202',
              thumbnailUrl: `${BUNNY_STORAGE_CDN}/lessons/router-thumb.jpg`,
              isFreePreview: false,
              order: 2,
              type: 'recorded',
            },
            {
              id: 'u2-l3-web',
              title: 'Lesson 2.3: State Management with Redux Toolkit',
              description: 'Manage complex immutable state slices efficiently.',
              duration: 3200,
              videoUrl: `${BUNNY_STREAM_CDN}/unit2/lesson3_redux.mp4`,
              bunnyVideoId: 'bv-web-203',
              thumbnailUrl: `${BUNNY_STORAGE_CDN}/lessons/redux-thumb.jpg`,
              isFreePreview: false,
              order: 3,
              type: 'recorded',
            },
          ],
        },
        {
          id: 'u3-web',
          title: 'Unit 3: Backend API Architecture with Node.js & Express',
          description: 'Develop secure RESTful API backends with MongoDB integration.',
          order: 3,
          lessons: [
            {
              id: 'u3-l1-web',
              title: 'Lesson 3.1: Node.js Core Modules & Express Router Setup',
              description: 'Create scalable server instances and route controllers.',
              duration: 2500,
              videoUrl: `${BUNNY_STREAM_CDN}/unit3/lesson1_node.mp4`,
              bunnyVideoId: 'bv-web-301',
              thumbnailUrl: `${BUNNY_STORAGE_CDN}/lessons/node-thumb.jpg`,
              isFreePreview: false,
              order: 1,
              type: 'recorded',
            },
            {
              id: 'u3-l2-web',
              title: 'Lesson 3.2: MongoDB Data Modeling & Mongoose Schemas',
              description: 'Design NoSQL collections, indexes, and aggregation pipelines.',
              duration: 2900,
              videoUrl: `${BUNNY_STREAM_CDN}/unit3/lesson2_mongo.mp4`,
              bunnyVideoId: 'bv-web-302',
              thumbnailUrl: `${BUNNY_STORAGE_CDN}/lessons/mongo-thumb.jpg`,
              isFreePreview: false,
              order: 2,
              type: 'recorded',
            },
            {
              id: 'u3-l3-web',
              title: 'Lesson 3.3: JWT Authentication & Security Headers',
              description: 'Implement JWT tokens, bcrypt password hashing, and Helmet security.',
              duration: 3100,
              videoUrl: `${BUNNY_STREAM_CDN}/unit3/lesson3_jwt.mp4`,
              bunnyVideoId: 'bv-web-303',
              thumbnailUrl: `${BUNNY_STORAGE_CDN}/lessons/jwt-thumb.jpg`,
              isFreePreview: false,
              order: 3,
              type: 'recorded',
            },
          ],
        },
      ],
    });

    const course2 = await Course.create({
      title: 'Python Data Science, Machine Learning & Generative AI',
      slug: 'python-data-science-machine-learning-ai',
      description: 'Complete roadmap covering NumPy, Pandas, Scikit-Learn, PyTorch, Deep Learning, and LLM Generative AI applications.',
      thumbnail: `${BUNNY_STORAGE_CDN}/courses/python-data-science-ai.jpg`,
      price: 5499,
      category: 'Data Science & AI',
      level: 'Intermediate',
      isPublished: true,
      units: [
        {
          id: 'u1-ds',
          title: 'Unit 1: Python Core & Numerical Computing with NumPy & Pandas',
          description: 'Data structures, vectorized arrays, and DataFrame operations.',
          order: 1,
          lessons: [
            {
              id: 'u1-l1-ds',
              title: 'Lesson 1.1: Data Wrangling with Pandas & NumPy Vectors',
              description: 'Load, clean, and manipulate large datasets in Python.',
              duration: 2200,
              videoUrl: `${BUNNY_STREAM_CDN}/unit1/lesson1_pandas.mp4`,
              bunnyVideoId: 'bv-ds-101',
              thumbnailUrl: `${BUNNY_STORAGE_CDN}/lessons/pandas-thumb.jpg`,
              isFreePreview: true,
              order: 1,
              type: 'recorded',
            },
            {
              id: 'u1-l2-ds',
              title: 'Lesson 1.2: Data Visualization with Matplotlib & Seaborn',
              description: 'Create interactive charts, heatmaps, and statistical plots.',
              duration: 1900,
              videoUrl: `${BUNNY_STREAM_CDN}/unit1/lesson2_seaborn.mp4`,
              bunnyVideoId: 'bv-ds-102',
              thumbnailUrl: `${BUNNY_STORAGE_CDN}/lessons/seaborn-thumb.jpg`,
              isFreePreview: false,
              order: 2,
              type: 'recorded',
            },
          ],
        },
        {
          id: 'u2-ds',
          title: 'Unit 2: Supervised & Unsupervised Machine Learning Algorithms',
          description: 'Implement regression, classification, clustering, and model evaluation.',
          order: 2,
          lessons: [
            {
              id: 'u2-l1-ds',
              title: 'Lesson 2.1: Regression & Classification with Scikit-Learn',
              description: 'Train Decision Trees, Random Forests, and SVM classifiers.',
              duration: 3300,
              videoUrl: `${BUNNY_STREAM_CDN}/unit2/lesson1_sklearn.mp4`,
              bunnyVideoId: 'bv-ds-201',
              thumbnailUrl: `${BUNNY_STORAGE_CDN}/lessons/sklearn-thumb.jpg`,
              isFreePreview: false,
              order: 1,
              type: 'recorded',
            },
            {
              id: 'u2-l2-ds',
              title: 'Lesson 2.2: Deep Learning Neural Networks with PyTorch',
              description: 'Build multi-layer perceptrons and Convolutional Neural Networks.',
              duration: 3600,
              videoUrl: `${BUNNY_STREAM_CDN}/unit2/lesson2_pytorch.mp4`,
              bunnyVideoId: 'bv-ds-202',
              thumbnailUrl: `${BUNNY_STORAGE_CDN}/lessons/pytorch-thumb.jpg`,
              isFreePreview: false,
              order: 2,
              type: 'recorded',
            },
          ],
        },
      ],
    });

    const course3 = await Course.create({
      title: 'Cyber Security, Ethical Hacking & Penetration Testing',
      slug: 'cyber-security-ethical-hacking',
      description: 'Hands-on ethical hacking guide covering network scanning, OWASP web exploitation, Kali Linux, and Metasploit.',
      thumbnail: `${BUNNY_STORAGE_CDN}/courses/cyber-security-hacking.jpg`,
      price: 4799,
      category: 'Cyber Security',
      level: 'Beginner',
      isPublished: true,
      units: [
        {
          id: 'u1-sec',
          title: 'Unit 1: Network Fundamentals & Security Reconnaissance',
          description: 'Understand TCP/IP, DNS, Wireshark packet analysis, and Nmap scanning.',
          order: 1,
          lessons: [
            {
              id: 'u1-l1-sec',
              title: 'Lesson 1.1: Network Architecture & Nmap Vulnerability Scanning',
              description: 'Discover active hosts, open ports, and operating system fingerprints.',
              duration: 2000,
              videoUrl: `${BUNNY_STREAM_CDN}/unit1/lesson1_nmap.mp4`,
              bunnyVideoId: 'bv-sec-101',
              thumbnailUrl: `${BUNNY_STORAGE_CDN}/lessons/nmap-thumb.jpg`,
              isFreePreview: true,
              order: 1,
              type: 'recorded',
            },
          ],
        },
        {
          id: 'u2-sec',
          title: 'Unit 2: Web Exploitation & OWASP Top 10 Security Risks',
          description: 'Exploit SQL Injection, Cross-Site Scripting (XSS), and CSRF vulnerabilities.',
          order: 2,
          lessons: [
            {
              id: 'u2-l1-sec',
              title: 'Lesson 2.1: Burp Suite Mastery & Web App Penetration',
              description: 'Intercept HTTP requests, manipulate headers, and bypass auth controls.',
              duration: 2800,
              videoUrl: `${BUNNY_STREAM_CDN}/unit2/lesson1_burp.mp4`,
              bunnyVideoId: 'bv-sec-201',
              thumbnailUrl: `${BUNNY_STORAGE_CDN}/lessons/burp-thumb.jpg`,
              isFreePreview: false,
              order: 1,
              type: 'recorded',
            },
          ],
        },
      ],
    });

    const course4 = await Course.create({
      title: 'Cloud Computing & DevOps Engineering (AWS & Kubernetes)',
      slug: 'cloud-computing-devops-aws-kubernetes',
      description: 'Master AWS cloud architecture, Docker containers, Kubernetes deployment orchestration, and Terraform infrastructure as code.',
      thumbnail: `${BUNNY_STORAGE_CDN}/courses/cloud-devops-aws.jpg`,
      price: 5999,
      category: 'Cloud & DevOps',
      level: 'Advanced',
      isPublished: true,
      units: [
        {
          id: 'u1-cloud',
          title: 'Unit 1: AWS Core Cloud Infrastructure (EC2, S3, VPC & IAM)',
          description: 'Architect secure, elastic virtual private clouds on Amazon Web Services.',
          order: 1,
          lessons: [
            {
              id: 'u1-l1-cloud',
              title: 'Lesson 1.1: AWS VPC Networking & EC2 Server Deployment',
              description: 'Configure public/private subnets, internet gateways, and security groups.',
              duration: 2600,
              videoUrl: `${BUNNY_STREAM_CDN}/unit1/lesson1_aws_vpc.mp4`,
              bunnyVideoId: 'bv-cloud-101',
              thumbnailUrl: `${BUNNY_STORAGE_CDN}/lessons/aws-thumb.jpg`,
              isFreePreview: true,
              order: 1,
              type: 'recorded',
            },
          ],
        },
      ],
    });

    // Enroll students in courses
    student1.enrolledCourses = [course1._id.toString(), course2._id.toString()];
    await student1.save();

    student2.enrolledCourses = [course1._id.toString(), course3._id.toString()];
    await student2.save();

    student3.enrolledCourses = [course3._id.toString(), course4._id.toString()];
    await student3.save();

    student4.enrolledCourses = [course2._id.toString()];
    await student4.save();

    student5.enrolledCourses = [course1._id.toString()];
    await student5.save();

    // 3. SEED PAYMENTS & TRANSACTIONS
    console.log('Seeding Payments & Transactions...');
    await Payment.create({
      transactionId: 'TXN-RAZORPAY-8801',
      userId: student1._id.toString(),
      userEmail: student1.email,
      courseId: course1._id.toString(),
      courseTitle: course1.title,
      amount: course1.price,
      currency: 'INR',
      gateway: 'razorpay',
      gatewayOrderId: 'order_rzp_1001',
      gatewayPaymentId: 'pay_rzp_1001_success',
      status: 'completed',
      commissionAmount: 750,
    });

    await Payment.create({
      transactionId: 'TXN-STRIPE-8802',
      userId: student2._id.toString(),
      userEmail: student2.email,
      courseId: course2._id.toString(),
      courseTitle: course2.title,
      amount: course2.price,
      currency: 'INR',
      gateway: 'stripe',
      gatewayOrderId: 'cs_test_stripe_2002',
      gatewayPaymentId: 'pi_test_stripe_2002_success',
      status: 'completed',
      commissionAmount: 825,
    });

    // 4. SEED REFERRALS & PAYOUTS
    console.log('Seeding Referrals & Payouts...');
    await ReferralSetting.create({
      courseId: course1._id.toString(),
      referralsEnabled: true,
      commissionType: 'percentage',
      commissionValue: 15,
    });

    await ReferralEarning.create({
      referrerUserId: student1._id.toString(),
      referredUserId: student2._id.toString(),
      referredUserEmail: student2.email,
      courseId: course1._id.toString(),
      courseTitle: course1.title,
      transactionId: 'TXN-RAZORPAY-8801',
      commissionAmount: 750,
      status: 'credited',
    });

    await PayoutRequest.create({
      requestId: 'REQ-PAYOUT-9901',
      userId: student1._id.toString(),
      userEmail: student1.email,
      amount: 1500,
      paymentDetails: 'UPI ID: alexjohnson@okicici',
      status: 'approved',
      adminNotes: 'Payout processed via Bank Transfer UPI',
    });

    await PayoutRequest.create({
      requestId: 'REQ-PAYOUT-9902',
      userId: student2._id.toString(),
      userEmail: student2.email,
      amount: 750,
      paymentDetails: 'UPI ID: bellasmith@upi',
      status: 'pending',
    });

    // 5. SEED USER PROGRESS & CERTIFICATES
    console.log('Seeding User Progress...');
    await UserProgress.create({
      userId: student1._id.toString(),
      courseId: course1._id.toString(),
      lessonProgress: [
        {
          lessonId: 'u1-l1-web',
          unitId: 'u1-web',
          watchedSeconds: 1800,
          duration: 1800,
          percentage: 100,
          isCompleted: true,
        },
        {
          lessonId: 'u1-l2-web',
          unitId: 'u1-web',
          watchedSeconds: 2400,
          duration: 2400,
          percentage: 100,
          isCompleted: true,
        },
        {
          lessonId: 'u2-l1-web',
          unitId: 'u2-web',
          watchedSeconds: 2700,
          duration: 2700,
          percentage: 100,
          isCompleted: true,
        },
      ],
      unitProgress: [
        { unitId: 'u1-web', isUnlocked: true, percentageWatched: 100 },
        { unitId: 'u2-web', isUnlocked: true, percentageWatched: 66 },
      ],
      overallCoursePercentage: 75,
      isCertificateUnlocked: true,
      certificateId: 'CERT-MERN-10088',
    });

    // 6. SEED REVIEWS
    console.log('Seeding Reviews...');
    await Review.create({
      reviewId: 'REV-101',
      courseId: course1._id.toString(),
      userId: student1._id.toString(),
      userName: student1.name,
      userEmail: student1.email,
      rating: 5,
      comment: 'Top-tier MERN stack course! The unit-wise Bunny CDN video playback is seamless and lightning fast.',
      status: 'approved',
    });

    await Review.create({
      reviewId: 'REV-102',
      courseId: course2._id.toString(),
      userId: student2._id.toString(),
      userName: student2.name,
      userEmail: student2.email,
      rating: 5,
      comment: 'Excellent breakdown of Python Data Science & PyTorch. Highly recommended for aspiring AI engineers.',
      status: 'approved',
    });

    // 7. SEED LIVE SESSIONS
    console.log('Seeding Live Sessions...');
    await LiveSession.create({
      sessionId: 'LIVE-SESSION-301',
      courseId: course1._id.toString(),
      unitId: 'u2-web',
      title: 'Live Workshop: Building High Performance React 18 Apps',
      description: 'Interactive Q&A and live coding on React Server Components and performance tuning.',
      scheduledAt: new Date(Date.now() + 86400000), // Tomorrow
      duration: 90,
      status: 'scheduled',
    });

    await LiveSession.create({
      sessionId: 'LIVE-SESSION-302',
      courseId: course2._id.toString(),
      unitId: 'u2-ds',
      title: 'Generative AI & LLM Fine-Tuning Live Masterclass',
      description: 'Live session converting PyTorch models into API endpoints.',
      scheduledAt: new Date(Date.now() - 3600000), // Past session
      duration: 120,
      status: 'ended',
      recordingUrl: `${BUNNY_STREAM_CDN}/recordings/genai_live_masterclass.mp4`,
      bunnyVideoId: 'bv-live-rec-302',
    });

    console.log('\n✅ SEEDING COMPLETE FOR ALL FEATURES!');
    console.log('---------------------------------------------------------');
    console.log('ADMIN USER:');
    console.log(`  Email: ${adminUser.email}`);
    console.log(`  Password: ${defaultPasswordRaw}`);
    console.log('STUDENT USERS:');
    console.log(`  Student 1: ${student1.email} | Password: ${defaultPasswordRaw}`);
    console.log(`  Student 2: ${student2.email} | Password: ${defaultPasswordRaw}`);
    console.log(`  Student 3: ${student3.email} | Password: ${defaultPasswordRaw}`);
    console.log(`  Student 4: ${student4.email} | Password: ${defaultPasswordRaw}`);
    console.log(`  Student 5: ${student5.email} | Password: ${defaultPasswordRaw}`);
    console.log('BUNNY STORAGE CDN:', BUNNY_STORAGE_CDN);
    console.log('BUNNY STREAM CDN:', BUNNY_STREAM_CDN);
    console.log('---------------------------------------------------------');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seedDatabase();
