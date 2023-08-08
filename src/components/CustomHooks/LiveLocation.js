import {useState, useEffect, useRef} from 'react';
import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid} from 'react-native';

// export interface Location {
//   latitude: number;
//   longitude: number;
//   latitudeDelta?: number;
//   longitudeDelta?: number;
// }

const useLiveLocation = () => {
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Ambuserve Camera Permission',
          message:
            'Ambuserve needs access to your location ' +
            'so you can take awesome rides.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log('live loaction');
        fetchCurrentLocation();
      } else {
        // console.log('live loaction else ');
        setIsLoading(false);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const fetchCurrentLocation = async () => {
    try {
      Geolocation.watchPosition(
        position => {
          const {latitude, longitude} = position.coords;
          console.log('useLivelocation', {latitude, longitude});
          setLocation({latitude, longitude});
          setIsLoading(false);
        },
        error => {
          console.error(`Error getting current location: ${error.message}`);
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
        },
      );
    } catch (error) {
      console.error('Error fetching current location:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  return [location, isLoading];
};

export default useLiveLocation;
