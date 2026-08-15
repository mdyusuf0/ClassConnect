import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Package } from './package.model.js';

const isDbConnected = (): boolean => mongoose.connection.readyState === 1;

// In-memory fallback
const inMemoryPackages: Map<string, any> = new Map();

// Helper to seed initial packages if empty or db offline
const getInitialPackages = () => [
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

export const getPackages = async (_req: Request, res: Response) => {
  try {
    let packages: any[] = [];
    if (isDbConnected()) {
      try {
        packages = await Package.find().sort({ price: 1 });
      } catch (e) {
        packages = Array.from(inMemoryPackages.values());
      }
    } else {
      packages = Array.from(inMemoryPackages.values());
    }

    // Return empty list if no packages found
    if (packages.length === 0) {
      packages = [];
    }

    return res.status(200).json({
      success: true,
      count: packages.length,
      packages,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const createPackage = async (req: Request, res: Response) => {
  try {
    const { name, price, originalPrice, commission, selectedCourses, features, popular } = req.body;
    if (!name || price === undefined || originalPrice === undefined) {
      return res.status(400).json({ success: false, error: 'name, price, and originalPrice are required' });
    }

    const packageId = `pkg_${Date.now().toString(36)}`;
    const newPkg = {
      id: packageId,
      name,
      price: Number(price),
      originalPrice: Number(originalPrice),
      commission: Number(commission || 0),
      selectedCourses: selectedCourses || [],
      features: features || [],
      popular: !!popular,
    };

    if (isDbConnected()) {
      try {
        await Package.create(newPkg);
      } catch (e) {
        inMemoryPackages.set(packageId, newPkg);
      }
    } else {
      inMemoryPackages.set(packageId, newPkg);
    }

    return res.status(201).json({
      success: true,
      message: 'Package created successfully',
      package: newPkg,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const updatePackage = async (req: Request, res: Response) => {
  try {
    const { packageId } = req.params;
    const { name, price, originalPrice, commission, selectedCourses, features, popular } = req.body;

    let pkg: any = null;
    if (isDbConnected()) {
      try {
        pkg = await Package.findOne({
          $or: [
            { id: packageId },
            { _id: mongoose.Types.ObjectId.isValid(packageId) ? packageId : null }
          ]
        });
      } catch (e) {
        pkg = inMemoryPackages.get(packageId);
      }
    } else {
      pkg = inMemoryPackages.get(packageId) || Array.from(inMemoryPackages.values()).find(p => p.id === packageId);
    }

    if (!pkg) {
      return res.status(404).json({ success: false, error: 'Package not found' });
    }

    if (name !== undefined) pkg.name = name;
    if (price !== undefined) pkg.price = Number(price);
    if (originalPrice !== undefined) pkg.originalPrice = Number(originalPrice);
    if (commission !== undefined) pkg.commission = Number(commission);
    if (selectedCourses !== undefined) pkg.selectedCourses = selectedCourses;
    if (features !== undefined) pkg.features = features;
    if (popular !== undefined) pkg.popular = !!popular;

    pkg.updatedAt = new Date();

    if (isDbConnected() && typeof pkg.save === 'function') {
      await pkg.save();
    } else {
      inMemoryPackages.set(pkg.id || packageId, pkg);
    }

    return res.status(200).json({
      success: true,
      message: 'Package updated successfully',
      package: pkg,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const deletePackage = async (req: Request, res: Response) => {
  try {
    const { packageId } = req.params;
    if (isDbConnected()) {
      try {
        await Package.findOneAndDelete({
          $or: [
            { id: packageId },
            { _id: mongoose.Types.ObjectId.isValid(packageId) ? packageId : null }
          ]
        });
      } catch (e) {
        inMemoryPackages.delete(packageId);
      }
    } else {
      inMemoryPackages.delete(packageId);
    }

    return res.status(200).json({
      success: true,
      message: 'Package deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};
