'use client';

import { useState, useMemo, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, StarIcon, CurrencyDollarIcon, GlobeEuropeAfricaIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import Navbar from '@/components/Navbar';

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface Photo {
  reference: string;
  url: string;
}

interface PlaceDetails {
  website?: string;
  formatted_phone_number?: string;
  opening_hours?: {
    weekday_text: string[];
  };
  reviews?: Array<{
    author_name: string;
    rating: number;
    text: string;
    time: number;
  }>;
}

interface Destination {
  id: string;
  name: string;
  location: Location;
  rating: number;
  photos: Photo[];
  priceLevel?: number;
  types: string[];
  details: PlaceDetails | null;
}

export default function DestinationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [enhancedDescriptions, setEnhancedDescriptions] = useState<{[key: string]: string}>({});

  const categories = ['All', 'Tourist Attraction', 'Restaurant', 'Hotel', 'Museum', 'Park'];
  const priceRanges = ['All', '1', '2', '3', '4'];

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch places when search changes
  useEffect(() => {
    const fetchPlaces = async () => {
      if (!debouncedSearch) {
        setDestinations([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const type = selectedCategory === 'All' ? 'tourist_attraction' : selectedCategory.toLowerCase();
        const response = await fetch(
          `/api/places?query=${encodeURIComponent(debouncedSearch)}&type=${type}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch places');
        }

        const data = await response.json();
        setDestinations(data.places);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setDestinations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaces();
  }, [debouncedSearch, selectedCategory]);

  const getEnhancedDescription = async (placeName: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Provide a brief, engaging description of ${placeName} as a travel destination. Include key attractions and what makes it special. Keep it under 100 words.`
        }),
      });
      
      if (!response.ok) throw new Error('Failed to get AI description');
      
      const data = await response.json();
      setEnhancedDescriptions(prev => ({
        ...prev,
        [placeName]: data.content
      }));
    } catch (error) {
      console.error('Error getting AI description:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDestinations = useMemo(() => {
    return destinations
      .filter(destination => {
        const matchesPrice = priceFilter === 'All' || 
          destination.priceLevel === Number(priceFilter);
        return matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'price') {
          return (a.priceLevel || 0) - (b.priceLevel || 0);
        }
        return 0;
      });
  }, [destinations, priceFilter, sortBy]);

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
            
            {/* Search and Filters */}
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
                >
                  <option value="All">Any Price</option>
                  {priceRanges.map(price => (
                    <option key={price} value={price}>
                      {price === 'All' ? 'Any Price' : '💰'.repeat(Number(price))}
                    </option>
                  ))}
                </select>

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
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-blue-600 hover:text-blue-700"
              >
                Clear search
              </button>
            </div>
          )}

          {/* Results */}
          {!isLoading && !error && (
            <>
              {/* Results Summary */}
              {searchQuery && (
                <div className="mb-4 text-gray-600">
                  Found {filteredDestinations.length} destinations
                </div>
              )}

              {/* Destinations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedDestinations.map((destination) => (
                  <div key={destination.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="relative h-48">
                      {destination.photos?.[0] ? (
                        <img
                          src={destination.photos[0].url}
                          alt={destination.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">No image available</span>
                        </div>
                      )}
                      {destination.rating && (
                        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                          <StarIconSolid className="h-4 w-4 text-yellow-400" />
                          {destination.rating.toFixed(1)}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{destination.name}</h3>
                          <p className="text-gray-600 text-sm">{destination.location.address}</p>
                        </div>
                        {destination.priceLevel && (
                          <span className="text-gray-600 font-medium">
                            {'💰'.repeat(destination.priceLevel)}
                          </span>
                        )}
                      </div>
                      
                      {destination.details?.opening_hours && (
                        <div className="mt-2 text-sm text-gray-500">
                          <p>
                            {destination.details.opening_hours.weekday_text[0]}
                          </p>
                        </div>
                      )}
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        {destination.types.slice(0, 3).map((type, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {type.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>

                      {enhancedDescriptions[destination.name] ? (
                        <p className="text-gray-600 mb-2">{enhancedDescriptions[destination.name]}</p>
                      ) : (
                        <button
                          onClick={() => getEnhancedDescription(destination.name)}
                          disabled={loading}
                          className="text-blue-500 hover:text-blue-700 mb-2"
                        >
                          {loading ? 'Loading...' : 'Get AI-powered description'}
                        </button>
                      )}
                      
                      {destination.details?.website && (
                        <a
                          href={destination.details.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          Visit Website
                        </a>
                      )}
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

              {/* No Results */}
              {searchQuery && filteredDestinations.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No destinations found matching your criteria.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setPriceFilter('All');
                    }}
                    className="mt-4 text-blue-600 hover:text-blue-700"
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
