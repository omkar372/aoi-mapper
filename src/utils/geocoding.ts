
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

export interface GeocodingResult {
  lat: number;
  lon: number;
  display_name: string;
  boundingbox?: [string, string, string, string];
}

export async function searchLocations(query: string): Promise<GeocodingResult[]> {
  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/search?q=${encodeURIComponent(query)}&format=json&limit=5`,
      {
        headers: {
          'User-Agent': 'AOI-Satellite-Mapper',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.statusText}`);
    }

    const results: GeocodingResult[] = await response.json();
    return results;
  } catch (error) {
    console.error('Geocoding error:', error);
    return [];
  }
}

export async function reverseGeocode(
  lat: number,
  lon: number
): Promise<GeocodingResult | null> {
  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: {
          'User-Agent': 'AOI-Satellite-Mapper',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Reverse geocoding API error: ${response.statusText}`);
    }

    const result: GeocodingResult = await response.json();
    return result;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
}
