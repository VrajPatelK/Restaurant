import React from 'react';

const SearchBarShimmer = () => {
  return (
    <div className="w-full px-4 py-2 mb-6">
      <div className="animate-pulse flex space-x-4">
        <div className="flex-1 space-y-4">
          <div className="h-10 bg-gray-300 rounded"></div>
        </div>
        <div className="flex-shrink-0">
          <div className="h-10 w-20 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
};

const RestaurantCardShimmer = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      {[...Array(8)].map((_, index) => (
        <div 
          key={index} 
          className="border rounded p-4 shadow animate-pulse"
        >
          {/* Image Shimmer */}
          <div className="mb-4 rounded bg-gray-300 h-48 w-full"></div>
          
          {/* Text Shimmer */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ShimmerEffect = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Restaurants</h1>
      <SearchBarShimmer />
      <RestaurantCardShimmer />
    </div>
  );
};

export default ShimmerEffect;