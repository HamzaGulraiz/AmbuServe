const coordinates = [
  {latitude: 24.8864317, longitude: 67.076156},
  {latitude: 24.9142362, longitude: 67.1274877},
  {latitude: 24.8580615, longitude: 67.1203248},
  {latitude: 24.8740947, longitude: 67.0740445},
  {latitude: 24.8817011, longitude: 67.0930571},
  {latitude: 24.9083359, longitude: 67.0831438},
  {latitude: 24.8902155, longitude: 67.0684118},
  {latitude: 24.88241015, longitude: 67.0818843423058},
  {latitude: 24.8927762, longitude: 67.07408528875231},
  {latitude: 24.8809599, longitude: 67.0635735},
  {latitude: 24.9239276, longitude: 67.0447127},
  {latitude: 24.9088159, longitude: 67.0840837},
  {latitude: 24.9290994, longitude: 67.062751},
  {latitude: 24.9142658, longitude: 67.0571429},
  {latitude: 24.8980493, longitude: 67.0693077},
  {latitude: 24.9220222, longitude: 67.1019989},
  {latitude: 24.926015, longitude: 67.1073176},
  {latitude: 24.8728007, longitude: 67.0734853},
  {latitude: 25.0163167, longitude: 67.1301263},
  {latitude: 24.920460400000003, longitude: 67.05195916005204},
  {latitude: 24.8504456, longitude: 67.0881702},
  {latitude: 24.881172, longitude: 67.0692613},
  {latitude: 24.85779905, longitude: 67.01554806544726},
  {latitude: 24.8739467, longitude: 67.0486155},
  {latitude: 24.8721189, longitude: 67.0281769},
  {latitude: 24.9183758, longitude: 67.0614663},
  {latitude: 25.090022, longitude: 67.0140083},
  {latitude: 24.9095495, longitude: 67.1205288},
  {latitude: 24.8613787, longitude: 67.0100599},
  {latitude: 24.9190179, longitude: 67.09692661404608},
  {latitude: 24.9252601, longitude: 67.0914869},
  {latitude: 24.9223154, longitude: 67.0885875},
  {latitude: 24.9389042, longitude: 67.0737461},
  {latitude: 24.9381866, longitude: 67.0662705},
  {latitude: 24.8682626, longitude: 67.3539676},
  {latitude: 24.9487288, longitude: 67.133857},
];

export function findClosestCoordinate(targetLat, targetLon) {
  console.log('cosest latlong finding===', targetLat, targetLon);
  let closestCoordinate = null;
  let closestDistance = Number.MAX_VALUE;

  for (const coordinate of coordinates) {
    const distance = calculateDistance(
      targetLat,
      targetLon,
      coordinate.latitude,
      coordinate.longitude,
    );

    if (distance < closestDistance) {
      closestDistance = distance;
      closestCoordinate = coordinate;
    }
  }

  return closestCoordinate;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180); // Convert degrees to radians
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers

  return distance;
}
