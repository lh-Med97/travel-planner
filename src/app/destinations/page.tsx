'use client';

import { useState, useMemo } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, StarIcon, CurrencyDollarIcon, GlobeEuropeAfricaIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import Navbar from '@/components/Navbar';

interface Destination {
  id: number;
  name: string;
  country: string;
  description: string;
  imageUrl: string;
  rating: number;
  priceRange: string;
  category: string;
  activities: string[];
  bestTimeToVisit: string;
  language: string;
  currency: string;
  duration: string;
  climate: string;
}

const sampleDestinations: Destination[] = [
  {
    id: 1,
    name: 'Paris',
    country: 'France',
    description: 'The City of Light, known for its iconic Eiffel Tower, world-class museums, and exquisite cuisine. Experience the romance of Parisian cafes, historic architecture, and artistic heritage.',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    rating: 4.8,
    priceRange: '$$$',
    category: 'City',
    activities: ['Eiffel Tower Visit', 'Louvre Museum', 'Seine River Cruise', 'Notre-Dame Cathedral', 'Montmartre Walk'],
    bestTimeToVisit: 'April to October',
    language: 'French',
    currency: 'Euro',
    duration: '4-7 days',
    climate: 'Mediterranean'
  },
  {
    id: 2,
    name: 'Bali',
    country: 'Indonesia',
    description: 'A tropical paradise with pristine beaches, ancient temples, lush rice terraces, and vibrant culture. Perfect for both relaxation and adventure.',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
    rating: 4.7,
    priceRange: '$$',
    category: 'Beach',
    activities: ['Temple Visits', 'Surfing', 'Rice Terrace Tours', 'Spa Treatments', 'Sunset Beach Walks'],
    bestTimeToVisit: 'April to October',
    language: 'Indonesian',
    currency: 'Indonesian Rupiah',
    duration: '1-2 weeks',
    climate: 'Tropical'
  },
  {
    id: 3,
    name: 'Kyoto',
    country: 'Japan',
    description: 'Ancient capital of Japan featuring stunning temples, traditional gardens, and preserved cultural districts. Experience authentic Japanese culture and history.',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',
    rating: 4.9,
    priceRange: '$$$',
    category: 'Cultural',
    activities: ['Temple Tours', 'Tea Ceremonies', 'Geisha District Visit', 'Japanese Garden Tours', 'Kimono Experience'],
    bestTimeToVisit: 'March to May, October to November',
    language: 'Japanese',
    currency: 'Japanese Yen',
    duration: '4-7 days',
    climate: 'Continental'
  },
  {
    id: 4,
    name: 'Santorini',
    country: 'Greece',
    description: 'Stunning volcanic island known for its white-washed buildings, blue-domed churches, and spectacular sunsets over the Aegean Sea.',
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff',
    rating: 4.8,
    priceRange: '$$$',
    category: 'Beach',
    activities: ['Sunset Watching', 'Wine Tasting', 'Boat Tours', 'Beach Hopping', 'Historical Site Visits'],
    bestTimeToVisit: 'June to September',
    language: 'Greek',
    currency: 'Euro',
    duration: '1-3 days',
    climate: 'Mediterranean'
  }
];

export default function DestinationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [durationFilter, setDurationFilter] = useState('All');
  const [climateFilter, setClimateFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState(0);
  
  const categories = ['All', 'City', 'Beach', 'Mountain', 'Cultural', 'Adventure'];
  const priceRanges = ['All', '$', '$$', '$$$'];
  const durations = ['All', '1-3 days', '4-7 days', '1-2 weeks', '2+ weeks'];
  const climates = ['All', 'Tropical', 'Mediterranean', 'Continental', 'Alpine'];

  const filteredDestinations = useMemo(() => {
    return sampleDestinations
      .filter(destination => {
        const matchesSearch = 
          destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          destination.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
          destination.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || destination.category === selectedCategory;
        const matchesPrice = priceFilter === 'All' || destination.priceRange === priceFilter;
        const matchesDuration = durationFilter === 'All' || destination.duration === durationFilter;
        const matchesClimate = climateFilter === 'All' || destination.climate === climateFilter;
        const matchesRating = destination.rating >= ratingFilter;
        
        return matchesSearch && matchesCategory && matchesPrice && matchesDuration && matchesClimate && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'price') {
          return a.priceRange.length - b.priceRange.length;
        }
        return 0;
      });
  }, [searchQuery, selectedCategory, priceFilter, sortBy, durationFilter, climateFilter, ratingFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredDestinations.length / itemsPerPage);
  const paginatedDestinations = filteredDestinations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Discover Amazing Destinations</h1>
            
            {/* Advanced Search and Filters */}
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search destinations, countries, or activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              
              {/* Filter Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
                >
                  <option value="" disabled>Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
                >
                  <option value="" disabled>Price Range</option>
                  {priceRanges.map(price => (
                    <option key={price} value={price}>{price}</option>
                  ))}
                </select>

                <select
                  value={durationFilter}
                  onChange={(e) => setDurationFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
                >
                  <option value="" disabled>Duration</option>
                  {durations.map(duration => (
                    <option key={duration} value={duration}>{duration}</option>
                  ))}
                </select>

                <select
                  value={climateFilter}
                  onChange={(e) => setClimateFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
                >
                  <option value="" disabled>Climate</option>
                  {climates.map(climate => (
                    <option key={climate} value={climate}>{climate}</option>
                  ))}
                </select>
              </div>

              {/* Additional Filters */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Min Rating:</label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(Number(e.target.value))}
                    className="w-32"
                  />
                  <span className="text-sm text-gray-600">{ratingFilter}+ ⭐</span>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
                  >
                    <option value="rating">Top Rated</option>
                    <option value="name">Alphabetical</option>
                    <option value="price">Price (Low to High)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Items per page:</label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
                  >
                    <option value={6}>6</option>
                    <option value={9}>9</option>
                    <option value={12}>12</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-4 text-gray-600">
            Showing {paginatedDestinations.length} of {filteredDestinations.length} destinations
          </div>

          {/* Destinations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedDestinations.map((destination) => (
              <div key={destination.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48">
                  <img
                    src={destination.imageUrl}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <StarIconSolid className="h-4 w-4 text-yellow-400" />
                    {destination.rating}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{destination.name}</h3>
                      <p className="text-gray-600">{destination.country}</p>
                    </div>
                    <span className="text-gray-600 font-medium">{destination.priceRange}</span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">{destination.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <GlobeEuropeAfricaIcon className="h-4 w-4 mr-2" />
                      <span>Best Time: {destination.bestTimeToVisit}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {destination.activities.slice(0, 3).map((activity, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {activity}
                        </span>
                      ))}
                      {destination.activities.length > 3 && (
                        <span className="text-sm text-gray-500">+{destination.activities.length - 3} more</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg border ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* No Results Message */}
          {filteredDestinations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No destinations found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setPriceFilter('All');
                  setDurationFilter('All');
                  setClimateFilter('All');
                  setRatingFilter(0);
                }}
                className="mt-4 text-blue-600 hover:text-blue-700"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
