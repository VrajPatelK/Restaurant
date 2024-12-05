'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

export default function MapSearchPage() {
  const [zipcode, setZipcode] = useState('');
  const [loading, /*setLoading*/] = useState(false);
  const [mapError, setMapError] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    // Define the callback function
    window.initMap = () => {
      if (!mapRef.current) return;
      
      try {
        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          zoom: 13,
          center: { lat: 37.3382, lng: -121.8863 }, // San Jose coordinates
        });
        setMapError(false);
      } catch (error) {
        console.error('Map initialization error:', error);
        setMapError(true);
      }
    };

    // Load the Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      console.error('Failed to load Google Maps script');
      setMapError(true);
    };
    
    document.head.appendChild(script);

    return () => {
      window.initMap = () => {}; // Cleanup
      const scripts = document.querySelectorAll(`script[src*="maps.googleapis.com"]`);
      scripts.forEach(script => script.remove());
    };
  }, []);

  // Rest of your component code remains the same
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Find Restaurants by Zipcode</h1>
      
      <form className="mb-8">
        <div className="flex gap-4">
          <Input
            type="text"
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
            placeholder="Enter zipcode"
            className="max-w-xs"
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mapError ? (
          <div className="h-[600px] rounded-lg border flex items-center justify-center bg-gray-100">
            <p className="text-red-500">Failed to load Google Maps. Please check your API key.</p>
          </div>
        ) : (
          <div ref={mapRef} className="h-[600px] rounded-lg border" />
        )}
        
        {/* Rest of your component JSX */}
      </div>
    </div>
  );
}