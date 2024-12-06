import { NextResponse } from 'next/server';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const type = searchParams.get('type') || 'tourist_attraction';

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    if (!GOOGLE_PLACES_API_KEY) {
      return NextResponse.json({ error: 'Google Places API key is not configured' }, { status: 500 });
    }

    // First, search for places
    const searchResponse = await fetch(
      `${GOOGLE_PLACES_API_URL}/textsearch/json?query=${encodeURIComponent(query)}&type=${type}&key=${GOOGLE_PLACES_API_KEY}`
    );

    const searchData = await searchResponse.json();

    if (!searchData.results) {
      return NextResponse.json({ error: 'No results found' }, { status: 404 });
    }

    // Get details for each place
    const detailedPlaces = await Promise.all(
      searchData.results.slice(0, 5).map(async (place: any) => {
        const detailsResponse = await fetch(
          `${GOOGLE_PLACES_API_URL}/details/json?place_id=${place.place_id}&fields=name,formatted_address,rating,photos,price_level,editorial_summary,formatted_phone_number,website,opening_hours,reviews&key=${GOOGLE_PLACES_API_KEY}`
        );
        const detailsData = await detailsResponse.json();
        
        return {
          id: place.place_id,
          name: place.name,
          location: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
            address: place.formatted_address,
          },
          rating: place.rating,
          photos: place.photos?.map((photo: any) => ({
            reference: photo.photo_reference,
            url: `${GOOGLE_PLACES_API_URL}/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`,
          })) || [],
          priceLevel: place.price_level,
          types: place.types,
          details: detailsData.result || null,
        };
      })
    );

    return NextResponse.json({ places: detailedPlaces });
  } catch (error) {
    console.error('Error fetching places:', error);
    return NextResponse.json({ error: 'Failed to fetch places' }, { status: 500 });
  }
}
