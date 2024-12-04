import React from 'react';
import TripPlanningForm from '@/components/trips/TripPlanningForm';
import Navbar from '@/components/Navbar';

export default function NewTripPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Planifier un nouveau voyage
            </h1>
            <TripPlanningForm />
          </div>
        </div>
      </div>
    </>
  );
}
