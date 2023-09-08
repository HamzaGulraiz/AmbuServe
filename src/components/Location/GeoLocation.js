// geolocation.js
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import {GOOGLE_API_KEY} from '../../../config';

const API_KEY = GOOGLE_API_KEY;

Geocoder.init(API_KEY);

export const getAddress = async coordinate => {
  try {
    const json = await Geocoder.from(coordinate.latitude, coordinate.longitude);
    const addressComponents = json.results[0].address_components;

    // Define the address components you want to include in the simple address
    const componentsToInclude = ['locality', 'sublocality', 'country'];

    // Initialize an array to store the selected components
    const selectedComponents = [];

    // Iterate through the components and select the ones to include
    addressComponents.forEach(component => {
      if (component.types.some(type => componentsToInclude.includes(type))) {
        selectedComponents.push(component.long_name);
      }
    });

    // Join the selected components into a single string
    const simpleAddress = selectedComponents.join(', ');

    console.log('Simple Address:', simpleAddress);
    return simpleAddress;
  } catch (error) {
    console.log('geoCoder error', error);
    throw error; // You can choose to handle or propagate the error as needed
  }
};

// export const getAddress = async coordinate => {
//   try {
//     const json = await Geocoder.from(coordinate.latitude, coordinate.longitude);
//     const addressComponent = json.results[0].address_components;
//     console.log('address ===>', addressComponent);
//     return addressComponent;
//   } catch (error) {
//     console.log('geoCoder error', error);
//     throw error; // You can choose to handle or propagate the error as needed
//   }
// };

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
      interval: 1000,
      distanceFilter: 2,
      // forceRequestLocation: true,
    },
  );

  return watchId;
};
