'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface Destination {
  id: number;
  name: string;
  country: string;
  description: string;
  imageUrl: string;
  rating: number;
  priceRange: string;
  category: string;
}

const sampleDestinations: Destination[] = [
  {
    id: 1,
    name: 'Paris',
    country: 'France',
    description: 'The City of Light, known for its iconic Eiffel Tower and world-class cuisine.',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    rating: 4.8,
    priceRange: '$$$',
    category: 'City',
  },
  {
    id: 2,
    name: 'Bali',
    country: 'Indonesia',
    description: 'A tropical paradise with beautiful beaches and rich culture.',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
    rating: 4.7,
    priceRange: '$$',
    category: 'Beach',
  },
  // Add more sample destinations as needed
];

export default function DestinationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'City', 'Beach', 'Mountain', 'Cultural', 'Adventure'];

  const filteredDestinations = sampleDestinations.filter(destination => {
    const matchesSearch = destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         destination.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || destination.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Explore Destinations</h1>
      
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search destinations..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <FunnelIcon className="h-5 w-5 text-gray-500" />
          <select
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDestinations.map(destination => (
          <div key={destination.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <img
                src={destination.imageUrl}
                alt={destination.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-semibold">
                ⭐ {destination.rating}
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-xl font-bold">{destination.name}</h2>
                  <p className="text-gray-600">{destination.country}</p>
                </div>
                <span className="text-gray-500 font-medium">{destination.priceRange}</span>
              </div>
              
              <p className="text-gray-700 mb-4 line-clamp-2">{destination.description}</p>
              
              <div className="flex justify-between items-center">
                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  {destination.category}
                </span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDestinations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No destinations found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
