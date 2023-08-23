import React from 'react';

// function HaversineDistance({lat1, lon1, lat2, lon2}) {
//   const R = 6371; // Earth's radius in kilometers
//   const dLat = (lat2 - lat1) * (Math.PI / 180);
//   const dLon = (lon2 - lon1) * (Math.PI / 180);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(lat1 * (Math.PI / 180)) *
//       Math.cos(lat2 * (Math.PI / 180)) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   const distance = R * c;

//   return distance;
// }

// export default HaversineDistance;

// Calculate the distance between two locations using the Haversine formula
export const haversine = (location1, location2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = ((location2.latitude - location1.latitude) * Math.PI) / 180; // deg2rad below
  const dLon = ((location2.longitude - location1.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((location1.latitude * Math.PI) / 180) *
      Math.cos((location2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

// Calculate the zoom level based on the distance between two locations
export const calculateZoom = distance => {
  const earthRadiusInKm = 6371;
  const zoomDistanceInKm = 1.5;
  const milesPerKm = 0.621371;
  const distanceInMiles = distance * milesPerKm;
  const zoom = Math.round(
    Math.log(
      (earthRadiusInKm * 2 * Math.PI * 0.5) /
        (zoomDistanceInKm * distanceInMiles),
    ) / Math.LN2,
  );
  return zoom;
};
