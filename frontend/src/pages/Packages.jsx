import React from 'react';
import { Link } from 'react-router-dom';
import store from '../data/mockStore';
import './Packages.css';
import { Check, Star } from 'lucide-react';

export default function Packages() {
  const packages = store.getPackages();

  return (
    <div className="packages-page">
      <div className="breadcrumb-hero">
        <div className="container">
          <h1 className="heading-lg">Our Packages</h1>
        </div>
      </div>

      <section className="packages-section section-gap container">
        <div className="text-center mb-5">
          <span className="pre-title">Get Membership</span>
          <h2 className="section-title">Choose Your Learning Path</h2>
        </div>

        <div className="packages-grid">
          {packages.map(pkg => {
            const isPopular = pkg.name.toLowerCase() === 'gold';
            return (
              <div key={pkg.id} className={`package-card card-edge-glow ${isPopular ? 'popular-card' : ''}`}>
                {isPopular && <div className="popular-badge"><Star size={14} /> Most Popular</div>}
                
                <div className="pkg-header">
                  <h3 className="pkg-name">
                    {pkg.name} Package
                  </h3>
                  <div className="pkg-price-wrap">
                    <span className="pkg-price">₹{pkg.price}</span>
                    <span className="pkg-price-strike">₹{Math.round(pkg.price * 1.5)}</span>
                  </div>
                </div>

                <ul className="pkg-features">
                  <li><Check className="check-icon" size={18} /> {pkg.courses?.length || 5}+ Premium Courses</li>
                  <li><Check className="check-icon" size={18} /> ₹{pkg.directCommission} Direct Commission</li>
                  <li><Check className="check-icon" size={18} /> ₹{pkg.passiveCommission} Passive Commission</li>
                  <li><Check className="check-icon" size={18} /> Lifetime Access</li>
                  <li><Check className="check-icon" size={18} /> Certification on Completion</li>
                  <li><Check className="check-icon" size={18} /> Weekly Q&A Sessions</li>
                </ul>

                <div className="pkg-footer">
                  <Link to={`/register?package=${pkg.id}`} className={`btn ${isPopular ? 'btn-primary' : 'btn-secondary'} w-100`}>
                    Enroll Now
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="comparison-section section-gap container">
        <h2 className="section-title text-center">Package Comparison</h2>
        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Features</th>
                {packages.map(p => <th key={p.id}>{p.name}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Number of Courses</td>
                {packages.map(p => <td key={p.id}>{p.courses?.length || '-'}</td>)}
              </tr>
              <tr>
                <td>Direct Commission</td>
                {packages.map(p => <td key={p.id}>₹{p.directCommission}</td>)}
              </tr>
              <tr>
                <td>Passive Commission</td>
                {packages.map(p => <td key={p.id}>₹{p.passiveCommission}</td>)}
              </tr>
              <tr>
                <td>Support Level</td>
                <td>Standard</td>
                <td>Priority</td>
                <td>Premium</td>
                <td>VIP</td>
                <td>Elite</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
