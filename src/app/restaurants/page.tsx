'use client';

import RestaurantCardUser from '@/components/RestaurantCardUser';
import ShimmerEffect from '@/components/ShimmerEffect';
import { RESTAURANTS } from '@/utils/data';
import { useEffect, useRef, useState } from 'react';

export interface Restaurant {
  id: number;
  name: string;
  description: string;
  address: string;
  zipcode: string;
  cuisine: string;
  priceRange: string;
  ratings: number;
  imageUrl: string;
}

export default function RestaurantsPage() {
  const [restaurants, /*setRestaurants*/] = useState<Restaurant[]>(RESTAURANTS);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const searchInputRef = useRef<HTMLInputElement | null>(null);


  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = restaurants.filter((restaurant) => {
      return (
        // restaurant.name.toLowerCase().includes(lowerCaseQuery) ||
        // restaurant.description.toLowerCase().includes(lowerCaseQuery) ||
        // restaurant.address.toLowerCase().includes(lowerCaseQuery) ||
        // restaurant.cuisine.toLowerCase().includes(lowerCaseQuery) ||
        restaurant.zipcode.includes(lowerCaseQuery)
      )
    });

    setFilteredRestaurants(filtered);

    // Keep focus on the search input
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchQuery, restaurants]);

  if (loading) {
    return <ShimmerEffect />;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Restaurants</h1>
      <div className="mb-4 flex justify-center">
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search restaurants by zipcode..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full max-w-md"
        />
      </div>
      {filteredRestaurants.length === 0 ? (
        <div className="text-center py-10">
          <div>No restaurants match your search.</div>
        </div>
      ) : (
        <RestaurantCardUser restaurants={filteredRestaurants} />
      )}
    </div>
  );
}