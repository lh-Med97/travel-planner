import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import TripList from '@/components/trips/TripList';

export default function TripsPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Mes Voyages</h1>
            <Link
              href="/trips/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Nouveau Voyage
            </Link>
          </div>
          <TripList />
        </div>
      </div>
    </>
  );
}
