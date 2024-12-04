import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarIcon, MapPinIcon, CurrencyEuroIcon } from '@heroicons/react/24/outline';

interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelStyle: string;
  status: 'planned' | 'ongoing' | 'completed';
}

export default function TripList() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch('/api/trips');
        if (!response.ok) {
          throw new Error('Failed to fetch trips');
        }
        const data = await response.json();
        setTrips(data);
      } catch (err) {
        setError('Une erreur est survenue lors du chargement des voyages');
        console.error('Error fetching trips:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-4">Vous n'avez pas encore de voyages planifiés</p>
        <Link
          href="/trips/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Planifier un voyage
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: Trip['status']) => {
    switch (status) {
      case 'planned':
        return 'bg-yellow-100 text-yellow-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Trip['status']) => {
    switch (status) {
      case 'planned':
        return 'Planifié';
      case 'ongoing':
        return 'En cours';
      case 'completed':
        return 'Terminé';
      default:
        return status;
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {trips.map((trip) => (
        <Link
          key={trip.id}
          href={`/trips/${trip.id}`}
          className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-900">{trip.destination}</h2>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  trip.status
                )}`}
              >
                {getStatusText(trip.status)}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-gray-500">
                <CalendarIcon className="h-5 w-5 mr-2" />
                <span>
                  {new Date(trip.startDate).toLocaleDateString()} -{' '}
                  {new Date(trip.endDate).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center text-gray-500">
                <MapPinIcon className="h-5 w-5 mr-2" />
                <span>{trip.travelStyle}</span>
              </div>
              
              <div className="flex items-center text-gray-500">
                <CurrencyEuroIcon className="h-5 w-5 mr-2" />
                <span>{trip.budget}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
