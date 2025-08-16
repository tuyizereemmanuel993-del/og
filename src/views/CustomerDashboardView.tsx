import React from 'react';
import { CustomerDashboard } from '../components/dashboard/CustomerDashboard';

export function CustomerDashboardView() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CustomerDashboard />
      </div>
    </div>
  );
}