// geolocation.js
import Geolocation from 'react-native-geolocation-service';

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve(position.coords);
      },
      error => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000,
      },
    );
  });
};

export const watchPosition = callback => {
  const watchId = Geolocation.watchPosition(
    position => {
      callback(position.coords);
    },
    error => {
      console.error(`Error getting current location: ${error.message}`);
    },
    {
      enableHighAccuracy: true,
      interval: 3000,
      distanceFilter: 1,
      forceRequestLocation: true,
    },
  );

  return watchId;
};
