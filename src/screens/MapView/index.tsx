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
import React, {useEffect, useState, useRef} from 'react';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import MapView, {Marker, Callout} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import colors from '../../../assets/colors/colors';
import images from '../../../assets/images/images';
import icons from '../../../assets/icons/icons';
import {BASE_URL} from '../../../config';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import CustomButton from '../../components/Button/Button';
import CustomAlert from '../../components/Alert/Alert';
import {useTypedSelector} from '../../redux/Store';

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

const Maps = () => {
  const navigation = useNavigation<NavigationProps>();
  const userInfoFromRedux = useTypedSelector(state => state.app.userInfo);
  console.log('from redux ========> ', userInfoFromRedux);
  const userDataToSend = JSON.parse(userInfoFromRedux);
  const {full_name, email, contact, emergency_contact, token, ...otherProps} =
    userDataToSend;

  const mapRef = useRef<any>(null);
  const MY_KEY = 'AIzaSyDmAPrOnDwMg0-3lKuTWHOAfwylLwLj6Yk';
  const [alertVisible, setAlertVisible] = useState(false);

  const [findDriverIsLoaded, setfindDriverIsLoaded] = useState(false);

  const socketUser = new WebSocket(
    'ws://ambu-serv-8e4fba44a667.herokuapp.com/',
    'user',
  );
  // socketUser.addEventListener('open', () => {
  //   // console.log('Request send from user ');
  //   // Send a message to the server
  // });
  socketUser.onmessage = e => {
    // a message was received
    const receivedMessage = JSON.parse(e.data);
    console.log(
      'message from socket node js in user maps ===>',
      receivedMessage.status,
    );
    if (receivedMessage.status === 'canceled') {
      // console.log('status hweraa sdkljlk');
      // setfindDriverIsLoaded(false);
      setAlertVisible(true);
    }
    // setfindDriverIsLoaded(false);
  };

  const [userInfoForRide, setUserInfoForRide] = useState({
    type: 'user',
    full_name: 'Hamza Gulraiz',
    email: 'hamza@gmail.com',
    contact: '03244421920',
    emergency_contact: '03212312312',
    pickup_location: 'heere',
    drop_location: 'here',
    pickup_date: 'at',
    drop_date: 'at',
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImZ1bGxfbmFtZSI6Ikhhb…',
  });

  useEffect(() => {
    locationAccess();
  }, []);

  const sendRequestToAllDrivers = () => {
    // setfindDriverIsLoaded(true);
    // console.log('asdajkhdajkhdajkdhajkshdjkahsdjk', userDataInformations);
    const sendingObject = {
      type: 'user',
      full_name: full_name,
      email: email,
      contact: contact,
      emergency_contact: emergency_contact,
      pickup_location: 'here',
      drop_location: 'to',
      pickup_date: '12-03-23',
      drop_date: '12-03-23',
      token: token,
    };

    const data = JSON.stringify(sendingObject);
    socketUser.send(data);
  };

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
    const watchId = Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        console.log(`Current location: ${latitude}, ${longitude}`);
        // Do something with the latitude and longitude values
        setRegion({
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        //  checkOnlineDrivers();
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

          console.log(position.coords.latitude);
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
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

  const findDriver = () => {
    console.log('find driver');
    checkOnlineDrivers();
  };

  const checkOnlineDrivers = () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://192.168.100.21:8000/driver/list',
      // url: `${BASE_URL}/driver/list`,
      headers: {},
    };

    axios
      .request(config)
      .then(response => {
        console.log(JSON.stringify(response.data));
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleShowUserLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        const region = {
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        mapRef.current.animateToRegion(region, 1000); // Animate to the new region with a duration of 1 second (1000 milliseconds)
      },
      error => {
        console.log('Error getting user location:', error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        {region.latitude != null ? (
          <>
            <View style={styles.searchBarFrom}>
              <GooglePlacesAutocomplete
                placeholder="Current location"
                textInputProps={{
                  placeholderTextColor: colors.BLACK,
                }}
                styles={{
                  textInput: {
                    color: colors.BLACK,
                  },
                  container: {
                    // marginTop:30
                  },
                  listView: {
                    marginTop: hp(6),
                  },
                }}
                onPress={(data, details = null) => {
                  // 'details' is provided when fetchDetails = true
                  console.log(data, details);
                }}
                query={{
                  key: MY_KEY,
                  language: 'en',
                }}
                // predefinedPlaces={predefinedPlaces}
              />
            </View>
            <View style={styles.searchBarTo}>
              <GooglePlacesAutocomplete
                placeholder="Where to"
                textInputProps={{
                  placeholderTextColor: colors.BLACK,
                }}
                styles={{
                  textInput: {
                    color: colors.BLACK,
                  },
                }}
                onPress={(data, details = null) => {
                  // 'details' is provided when fetchDetails = true
                  console.log(data, details);
                }}
                query={{
                  key: MY_KEY,
                  language: 'en',
                }}
                // predefinedPlaces={predefinedPlaces}
              />
            </View>
            <MapView
              style={styles.map}
              // showsUserLocation={true}
              provider="google"
              ref={mapRef}
              minZoomLevel={13}
              maxZoomLevel={16}
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
                <Image
                  source={icons.PERSON}
                  resizeMode="center"
                  style={{
                    height: hp(2.5),
                    width: wp(5),
                    // backgroundColor:"red"
                  }}
                />
              </Marker>
            </MapView>
            <TouchableOpacity
              onPress={handleShowUserLocation}
              style={{
                position: 'absolute',
                right: wp(4),
                bottom: hp(10),
              }}>
              <Image
                source={icons.CURRENT_LOCATION}
                resizeMode="contain"
                style={{
                  height: hp(4),
                  width: wp(8),
                }}
              />
            </TouchableOpacity>
            <View
              style={{
                position: 'absolute',
                // right:wp(4),
                bottom: hp(0.5),
              }}>
              <CustomButton
                title="Request Ambulance"
                textColor={colors.WHITE}
                backgroundColor={colors.BLUE}
                activityIndicator={findDriverIsLoaded}
                height={hp(6)}
                width={wp(90)}
                borderRadius={wp(2)}
                marginHorizontal={wp(5)}
                // marginTop={hp(2)}
                marginBottom={hp(2)}
                onPress={() => {
                  sendRequestToAllDrivers();
                }}
              />
            </View>
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
      {alertVisible !== null && (
        <CustomAlert
          message="Could not find driver"
          visible={alertVisible}
          onPressClose={() => {
            setAlertVisible(false);
          }}
        />
      )}
    </>
  );
};

export default Maps;
