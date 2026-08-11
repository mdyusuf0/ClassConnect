import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Package } from './package.model.js';

const isDbConnected = (): boolean => mongoose.connection.readyState === 1;

// In-memory fallback
const inMemoryPackages: Map<string, any> = new Map();

// Helper to seed initial packages if empty or db offline
const getInitialPackages = () => [
  {
    id: 'pkg_bronze',
    name: 'Bronze Starter Bundle',
    price: 999,
    originalPrice: 1999,
    commission: 300,
    selectedCourses: [],
    features: ['Access to 2 basic courses', 'Certificate of Completion', 'Email Support', '₹300 Referral Earnings'],
    popular: false,
  },
  {
    id: 'pkg_silver',
    name: 'Silver Growth Bundle',
    price: 1999,
    originalPrice: 3999,
    commission: 700,
    selectedCourses: [],
    features: ['Access to 10 courses', 'Bilingual Telugu & English Labs', '₹700 Referral Earnings', 'Weekly Live Q&A'],
    popular: true,
  },
  {
    id: 'pkg_gold',
    name: 'Gold Ultimate Bundle',
    price: 4999,
    originalPrice: 9999,
    commission: 2000,
    selectedCourses: [],
    features: ['All 30+ Courses Unlocked', 'Lifetime Unlimited Access', 'All Professional Certificates', 'Daily Live Masterclasses', '₹3,000 Direct Referral Earnings', '1-on-1 VIP Mentorship'],
    popular: false,
  }
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
