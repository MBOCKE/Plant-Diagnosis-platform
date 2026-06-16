/**
 * Geocoding utilities for location processing
 * Converts coordinates to human-readable addresses and vice versa
 */

// Reverse geocode - convert coordinates to address
async function reverseGeocode(latitude, longitude) {
  try {
    // Use OpenStreetMap Nominatim API (free, no key required)
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'PlantDiagnosisApp/1.0',
        'Accept-Language': 'en,fr',
      },
    });

    if (!response.ok) return null;

    const data = await response.json();
    
    return {
      type: 'Point',
      coordinates: [longitude, latitude],
      country: data.address?.country || '',
      region: data.address?.state || data.address?.region || '',
      town: data.address?.city || data.address?.town || data.address?.village || '',
      displayName: data.display_name || '',
    };
  } catch (error) {
    console.error('Reverse geocode failed:', error.message);
    return null;
  }
}

// Forward geocode - convert address to coordinates
async function forwardGeocode(address) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'PlantDiagnosisApp/1.0',
      },
    });

    if (!response.ok) return null;

    const data = await response.json();
    
    if (data.length === 0) return null;

    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
      displayName: data[0].display_name,
    };
  } catch (error) {
    console.error('Forward geocode failed:', error.message);
    return null;
  }
}

// Calculate distance between two coordinates (in kilometers)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

// Format coordinates for display
function formatCoordinates(latitude, longitude) {
  const latDir = latitude >= 0 ? 'N' : 'S';
  const lonDir = longitude >= 0 ? 'E' : 'W';
  return `${Math.abs(latitude).toFixed(4)}°${latDir}, ${Math.abs(longitude).toFixed(4)}°${lonDir}`;
}

module.exports = {
  reverseGeocode,
  forwardGeocode,
  calculateDistance,
  formatCoordinates,
};