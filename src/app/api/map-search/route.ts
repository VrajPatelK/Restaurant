import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

async function getGooglePlacesResults(zipcode: string) {
  // First get coordinates for zipcode
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipcode}&key=${GOOGLE_MAPS_API_KEY}`;
  const geocodeRes = await fetch(geocodeUrl);
  const geocodeData = await geocodeRes.json();

  if (!geocodeData.results?.[0]) {
    return [];
  }

  const { lat, lng } = geocodeData.results[0].geometry.location;

  // Then search for restaurants near those coordinates
  const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=restaurant&key=${GOOGLE_MAPS_API_KEY}`;
  const placesRes = await fetch(placesUrl);
  const placesData = await placesRes.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return placesData.results.map((place: any) => ({
    id: place.place_id,
    name: place.name,
    address: place.vicinity,
    rating: place.rating,
    isExternal: true
  }));
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const zipcode = searchParams.get('zipcode');

    if (!zipcode) {
      return NextResponse.json({ error: 'Zipcode is required' }, { status: 400 });
    }

    // Get restaurants from your database
    const dbRestaurants = await prisma.restaurant.findMany({
      where: { zipcode },
      select: {
        id: true,
        name: true,
        address: true,
        ratings: true,
      }
    });

    // Format database results
    interface DbRestaurant {
        id: number;
        name: string;
        address: string;
        ratings: number;
      }
      
      const formattedDbRestaurants = dbRestaurants.map((r: DbRestaurant) => ({
        id: r.id.toString(),
        name: r.name,
        address: r.address,
        rating: r.ratings,
        isExternal: false
      }));

    // Get restaurants from Google Places API
    const googleRestaurants = await getGooglePlacesResults(zipcode);

    // Combine results
    const allRestaurants = [...formattedDbRestaurants, ...googleRestaurants];

    return NextResponse.json(allRestaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json({ error: 'Failed to fetch restaurants' }, { status: 500 });
  }
}