/**
 * Geospatial utility functions for CivicFlow
 * Used for hotspot detection, deduplication, and proximity calculations
 */

/**
 * Calculate distance between two coordinates using Haversine formula
 * This accounts for the Earth's curvature for accurate distance calculation
 * 
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in meters
 * 
 * @example
 * const distance = getDistanceFromLatLonInMeters(19.0760, 72.8777, 19.0765, 72.8780);
 * console.log(distance); // ~68 meters
 */
export function getDistanceFromLatLonInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Radius of Earth in meters
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

/**
 * Convert degrees to radians
 * Helper function for Haversine formula
 * 
 * @param deg - Angle in degrees
 * @returns Angle in radians
 */
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Check if a point is within a circular radius of another point
 * 
 * @param centerLat - Latitude of center point
 * @param centerLon - Longitude of center point
 * @param pointLat - Latitude of point to check
 * @param pointLon - Longitude of point to check
 * @param radiusMeters - Radius in meters
 * @returns true if point is within radius
 * 
 * @example
 * const isNearby = isWithinRadius(19.0760, 72.8777, 19.0765, 72.8780, 500);
 * console.log(isNearby); // true (within 500m)
 */
export function isWithinRadius(
  centerLat: number,
  centerLon: number,
  pointLat: number,
  pointLon: number,
  radiusMeters: number
): boolean {
  const distance = getDistanceFromLatLonInMeters(
    centerLat,
    centerLon,
    pointLat,
    pointLon
  );
  return distance <= radiusMeters;
}

/**
 * Calculate the centroid (center point) of multiple coordinates
 * Used for finding the center of issue clusters/hotspots
 * 
 * @param coordinates - Array of {lat, lng} objects
 * @returns Centroid coordinates {lat, lng}
 * 
 * @example
 * const center = calculateCentroid([
 *   { lat: 19.0760, lng: 72.8777 },
 *   { lat: 19.0765, lng: 72.8780 },
 *   { lat: 19.0768, lng: 72.8775 }
 * ]);
 */
export function calculateCentroid(
  coordinates: Array<{ lat: number; lng: number }>
): { lat: number; lng: number } {
  if (coordinates.length === 0) {
    throw new Error('Cannot calculate centroid of empty array');
  }

  const avgLat = coordinates.reduce((sum, coord) => sum + coord.lat, 0) / coordinates.length;
  const avgLng = coordinates.reduce((sum, coord) => sum + coord.lng, 0) / coordinates.length;

  return { lat: avgLat, lng: avgLng };
}

/**
 * Convert meters to kilometers
 * 
 * @param meters - Distance in meters
 * @returns Distance in kilometers (rounded to 2 decimals)
 */
export function metersToKilometers(meters: number): number {
  return Math.round((meters / 1000) * 100) / 100;
}

/**
 * Convert kilometers to meters
 * 
 * @param kilometers - Distance in kilometers
 * @returns Distance in meters
 */
export function kilometersToMeters(kilometers: number): number {
  return kilometers * 1000;
}

/**
 * Format distance for human-readable display
 * 
 * @param meters - Distance in meters
 * @returns Formatted string (e.g., "500m" or "2.5km")
 * 
 * @example
 * formatDistance(500);  // "500m"
 * formatDistance(2500); // "2.5km"
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${metersToKilometers(meters)}km`;
}
