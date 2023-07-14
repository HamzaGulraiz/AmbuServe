import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  Image,
  Text,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ToastAndroid,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import MapView, {Marker, Callout} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {Database, child, push, ref, set} from 'firebase/database';
import {db} from '../../../components/firebase/config';
import images from '../../../../assets/images/images';

type NavigationProps = {
  navigate(APPEREANCE: string): unknown;
  navigation: string;
  goBack: () => void;
  replace: any;
  jumpTo: any;
};

const predefinedPlaces = [
  {
    description: 'Lahore',
    geometry: {location: {lat: 31.5204, lng: 74.3587}},
  },
  {
    description: 'Islamabad',
    geometry: {location: {lat: 33.6844, lng: 73.0479}},
  },
];

const DriverMap = () => {
  const navigation = useNavigation<NavigationProps>();

  const MY_KEY = 'AIzaSyDmAPrOnDwMg0-3lKuTWHOAfwylLwLj6Yk';

  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });

  const [markerposition, SetMarkerPosition] = useState({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    locationAccess();
  }, []);

  const shareLiveLocation = () => {
    const keyId = push(child(ref(db), 'location')).key;
    set(ref(db, 'location/' + keyId), {
      lat: region.latitude,
      long: region.longitude,
    })
      .then(() => {
        console.log('Live location sent to firebase');
      })
      .catch(e => {
        console.log('error live location', e);
      });
  };

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        console.log(`Current location: ${latitude}, ${longitude}`);
        // Do something with the latitude and longitude values
        setRegion({
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0,
          longitudeDelta: 0,
        });
      },
      error => {
        console.error(`Error getting location: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 5, // Minimum distance (in meters) for an update event
        interval: 5000, // Interval (in milliseconds) between updates
        fastestInterval: 2000, // Fastest interval (in milliseconds) for updates
        // timeout: 15000, // Maximum time (in milliseconds) to wait for an update
        // maximumAge: 10000, // Maximum age (in milliseconds) of a cached location
      },
    );
    return () => {
      Geolocation.clearWatch(watchId); // Clear the location tracking when component unmounts
    };
  }, []);

  const locationAccess = async () => {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (granted) {
      console.log('Location already given ');
      Geolocation.getCurrentPosition(
        position => {
          setRegion({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
          });
          shareLiveLocation();
          console.log(position.coords.latitude);
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );

      // const watchId = Geolocation.watchPosition(
      //   position => {
      //     const {latitude, longitude} = position.coords;

      //     console.log(`Current location: ${latitude}, ${longitude}`);
      //     // Do something with the latitude and longitude values
      //     setRegion({
      //       latitude: latitude,
      //       longitude: longitude,
      //       latitudeDelta: 0.001,
      //       longitudeDelta: 0.001,
      //     });
      //   },
      //   error => {
      //     console.error(`Error getting location: ${error.message}`);
      //   },
      //   {
      //     enableHighAccuracy: true,
      //     distanceFilter: 10, // Minimum distance (in meters) for an update event
      //     interval: 5000, // Interval (in milliseconds) between updates
      //     fastestInterval: 2000, // Fastest interval (in milliseconds) for updates
      //     // timeout: 15000, // Maximum time (in milliseconds) to wait for an update
      //     // maximumAge: 10000, // Maximum age (in milliseconds) of a cached location
      //   },
      // );
      // return () => {
      //   Geolocation.clearWatch(watchId); // Clear the location tracking when component unmounts
      // };
    } else {
      console.log('Trying to get location ');
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('location granted by asking');
          Geolocation.getCurrentPosition(
            position => {
              setRegion({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001,
              });

              console.log(position.coords.latitude);
            },
            error => {
              // See error code charts below.
              console.log(error.code, error.message);
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
          );

          // const watchId = Geolocation.watchPosition(
          //   position => {
          //     const {latitude, longitude} = position.coords;

          //     console.log(`Current location: ${latitude}, ${longitude}`);
          //     // Do something with the latitude and longitude values
          //     setRegion({
          //       latitude: latitude,
          //       longitude: longitude,
          //       latitudeDelta: 0.001,
          //       longitudeDelta: 0.001,
          //     });
          //   },
          //   error => {
          //     console.error(`Error getting location: ${error.message}`);
          //   },
          //   {
          //     enableHighAccuracy: true,
          //     distanceFilter: 10, // Minimum distance (in meters) for an update event
          //     interval: 5000, // Interval (in milliseconds) between updates
          //     fastestInterval: 2000, // Fastest interval (in milliseconds) for updates
          //     // timeout: 15000, // Maximum time (in milliseconds) to wait for an update
          //     // maximumAge: 10000, // Maximum age (in milliseconds) of a cached location
          //   },
          // );
          // return () => {
          //   Geolocation.clearWatch(watchId); // Clear the location tracking when component unmounts
          // };
        } else {
          console.log('location permission denied');

          ToastAndroid.showWithGravityAndOffset(
            'AmbuServe would like to access your location',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            wp(8),
            hp(4),
          );
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}>
        <Text
          style={{
            color: 'black',
          }}>
          Lat: {region.latitude}
        </Text>
        <Text
          style={{
            color: 'black',
          }}>
          Long: {region.longitude}
        </Text>
      </View> */}
      {region.latitude != null ? (
        <>
          <MapView
            style={styles.map}
            // showsUserLocation={true}
            provider="google"
            maxZoomLevel={12}
            onPress={event =>
              SetMarkerPosition({
                latitude: event.nativeEvent.coordinate.latitude,
                longitude: event.nativeEvent.coordinate.longitude,
              })
            }
            region={region}
            // onRegionChangeComplete={region => setRegion(region)}
            //onRegionChange={region}
          >
            <Marker
              coordinate={{
                latitude: region.latitude,
                longitude: region.longitude,
              }}
              //title="Home"
              //description="press button to save"
              //image={require('../../assets/home.png')}
              // onPress={() => {
              //   sendCoords({markerposition});
              // }}
            >
              <Image source={images.AMBULANCE_MARKER} resizeMode="contain" style={{
                height:20,
                width:20
              }} />

            </Marker>
          </MapView>
        </>
      ) : (
        <MapView
          style={styles.map}
          showsUserLocation={true}
          provider="google"
          maxZoomLevel={12}
          initialRegion={{
            latitude: 31.5204,
            longitude: 74.3587,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default DriverMap;




//////////////////////////////////////////////////////////////

// <Callout
// onPress={() => {
//   Alert.alert(
//     'Home',
//     'Are you sure you want to save this location as Home',
//     [
//       {
//         text: 'Cancel',
//         onPress: () => console.log('Cancel Pressed'),
//         style: 'cancel',
//       },
//       {
//         text: 'OK',
//         onPress: () => {},
//       },
//     ],
//   );
// }}>
// {/* <View style={styles.calloutStyle}>
//   <Text style={{fontSize: 16, fontWeight: '800'}}>
//     Save Home
//   </Text>
// </View> */}
// <View
//   style={{
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'space-between',
//     height: '100%',
//     width: '100%',
//     backgroundColor: '#fff',
//     borderColor: '#eee',
//     borderRadius: 5,
//     elevation: 10,
//   }}>
//   <TouchableOpacity style={styles.button}>
//     <Text style={{alignSelf: 'center'}}>
//       Save this location as Home
//     </Text>
//   </TouchableOpacity>
// </View>
// </Callout>