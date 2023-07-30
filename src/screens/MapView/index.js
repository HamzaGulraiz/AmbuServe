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
import {PermissionsAndroid} from 'react-native';
import {
  // GooglePlaceData,
  GooglePlacesAutocomplete,
} from 'react-native-google-places-autocomplete';
import Geolocation from '@react-native-community/geolocation';
import colors from '../../../assets/colors/colors';
import images from '../../../assets/images/images';
import icons from '../../../assets/icons/icons';
import {BASE_URL, GOOGLE_API_KEY, WEB_SOCKET} from '../../../config';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import CustomButton from '../../components/Button/Button';
import CustomAlert from '../../components/Alert/Alert';
// import {useTypedSelector} from '../../redux/Store';
import {getData} from '../../asyncStorage/AsyncStorage';
import {useTypedSelector} from '../../redux/Store';
import useLiveLocation, {
  Location,
} from '../../components/CustomHooks/useLiveLocation';
import CustomScreenLoading from '../../components/ScreenLoading/ScreenLoading';
import MapViewDirections from 'react-native-maps-directions';
import {useFocusEffect} from '@react-navigation/native';

// interface Geometry {
//   latitude: number;
//   longitude: number;
// }

// interface GooglePlaceData {
//   location: Geometry;
// }

// interface Region {
//   latitude: number;
//   longitude: number;
//   latitudeDelta: number;
//   longitudeDelta: number;
// }

// type NavigationProps = {
//   navigate(APPEREANCE: string): unknown;
//   navigation: string;
//   goBack: () => void;
//   replace: any;
//   jumpTo: any;
// };

// Geolocation.setRNConfiguration(config);
// navigator.geolocation = require('@react-native-community/geolocation');

const Maps = () => {
  const navigation = useNavigation();
  const [liveLocation, isLoading] = useLiveLocation();
  const mapRef = useRef(null);
  const originRef = useRef(null);
  const destinationRef = useRef(null);
  const MY_KEY = GOOGLE_API_KEY;
  const [alertVisible, setAlertVisible] = useState(false);
  const userInfoString = useTypedSelector(state => state.reducer.userInfo);
  const userInfo = JSON.parse(userInfoString);
  const {
    full_name,
    email,
    password,
    contact,
    address,
    emergency_contact,
    cnic,
    token,
  } = userInfo;
  const [findDriverIsLoaded, setfindDriverIsLoaded] = useState(false);
  const [rideConnected, setRideConnected] = useState(false);
  const [driversInformation, setDriversInformation] = useState('');
  const [route, setRoute] = useState(false);
  const [originPlace, setOriginPlace] = useState(null);
  const [destinationPlace, setDestinationPlace] = useState(null);
  const [region, setRegion] = useState(null);
  const [userInfoForRide, setUserInfoForRide] = useState({});

  const socketUser = new WebSocket(WEB_SOCKET, 'user');
  // socketUser.addEventListener('open', () => {
  //   // console.log('Request send from user ');
  //   // Send a message to the server
  // });
  socketUser.onmessage = e => {
    // a message was received
    const receivedMessage = JSON.parse(e.data);
    console.log(
      'message from socket node js in user maps ===>',
      receivedMessage,
    );
    if (receivedMessage === 'No drivers available') {
      setAlertVisible(true);
    }
    if (receivedMessage.status === 'canceled') {
      // console.log('status hweraa sdkljlk');
      // setfindDriverIsLoaded(false);
      setAlertVisible(true);
    } else if (receivedMessage.status === 'active') {
      console.log(
        'driver accepted, user side data: ===========>',
        receivedMessage,
      );
      setRideConnected(true);
      setDriversInformation(
        receivedMessage.longitude + receivedMessage.latitude,
      );
    }
  };

  const sendRequestToAllDrivers = () => {
    if (originPlace) {
      if (destinationPlace) {
        setUserInfoForRide({
          type: 'user',
          full_name: full_name,
          contact: contact,
          emergency_contact: emergency_contact,
          pickUp_location: originPlace,
          dropOff_location: destinationPlace,
          token: token,
        });
        const data = JSON.stringify(userInfoForRide);
        socketUser.send(data);
      } else {
        destinationRef.current.focus();
      }
    } else {
      originRef.current.focus();
    }
  };

  useEffect(() => {
    // console.log('herearkjhjkras', liveLocation);
    if (
      liveLocation?.latitude !== undefined &&
      liveLocation?.longitude !== undefined
    ) {
      setRegion({
        latitude: liveLocation.latitude,
        longitude: liveLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [liveLocation]);

  useEffect(() => {
    // console.log('=====>', region);
  }, [region]);

  const handleShowUserLocation = () => {
    mapRef.current.animateToRegion(region, 1000);
  };

  useEffect(() => {
    // Check if both originPlace and destinationPlace are not null
    if (originPlace && destinationPlace) {
      // Run the function when both are set
      setRoute(true);
    }
  }, [originPlace, destinationPlace]);

  const [manualLocation, setManualLocation] = useState(false);
  const handleLocationPermission = () => {
    setManualLocation(true);
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        {region != null ? (
          <>
            <View style={styles.searchBarFrom}>
              <GooglePlacesAutocomplete
                ref={originRef}
                placeholder="Where from?"
                // currentLocation={true}
                // currentLocationLabel="Current location"
                minLength={2}
                enablePoweredByContainer={false}
                fetchDetails={true}
                onPress={(data, details = null) => {
                  // console.log({data, details});

                  if (details) {
                    const {geometry} = details;
                    // console.log(geometry);

                    const {location} = geometry;
                    const {lat: latitude, lng: longitude} = location;
                    setOriginPlace({
                      location: {
                        latitude: latitude,
                        longitude: longitude,
                      },
                    });
                  }
                }}
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
                    // backgroundColor: colors.RED,
                  },
                  description: {
                    color: colors.BLACK,
                  },
                }}
                query={{
                  key: MY_KEY,
                  language: 'en',
                  type: 'establishment',
                  location: `${region.latitude},${region.longitude}`,
                  radius: 40,
                }}
                GooglePlacesSearchQuery={{
                  rankby: 'distance',
                  // type: 'hospital',
                }}
                GooglePlacesDetailsQuery={{
                  fields: 'geometry',
                }}
              />
            </View>
            <View style={styles.searchBarTo}>
              <GooglePlacesAutocomplete
                placeholder="Where to?"
                ref={destinationRef}
                minLength={2}
                enablePoweredByContainer={false}
                fetchDetails={true}
                onPress={(data, details = null) => {
                  // console.log({data, details});

                  if (details) {
                    const {geometry} = details;
                    // console.log(geometry);

                    const {location} = geometry;
                    const {lat: latitude, lng: longitude} = location;
                    setDestinationPlace({
                      location: {
                        latitude: latitude,
                        longitude: longitude,
                      },
                    });
                  }
                }}
                textInputProps={{
                  placeholderTextColor: colors.BLACK,
                }}
                styles={{
                  textInput: {
                    color: colors.BLACK,
                  },
                  description: {
                    color: colors.BLACK,
                  },
                }}
                query={{
                  key: MY_KEY,
                  language: 'en',
                  type: 'establishment',
                  location: `${region.latitude},${region.longitude}`,
                  radius: 40,
                }}
                GooglePlacesSearchQuery={{
                  rankby: 'distance',
                  // type: 'hospital',
                }}
                GooglePlacesDetailsQuery={{
                  fields: 'geometry',
                }}
              />
            </View>
            <MapView
              style={styles.map}
              provider="google"
              ref={mapRef}
              minZoomLevel={13}
              maxZoomLevel={16}
              // onPress={event =>
              //   SetMarkerPosition({
              //     latitude: event.nativeEvent.coordinate.latitude,
              //     longitude: event.nativeEvent.coordinate.longitude,
              //   })
              // }
              region={region}
              // onRegionChangeComplete={region => setRegion(region)}
              //onRegionChange={region}
            >
              <Marker
                coordinate={{
                  latitude: region.latitude,
                  longitude: region.longitude,
                }}>
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
              {route ? (
                <>
                  <MapViewDirections
                    origin={originPlace?.location}
                    destination={destinationPlace?.location}
                    apikey={MY_KEY}
                    strokeWidth={3}
                    strokeColor={colors.BLACK}
                  />
                  <Marker
                    coordinate={{
                      latitude: originPlace?.location.latitude,
                      longitude: originPlace?.location.longitude,
                    }}>
                    <Image
                      source={icons.CHECK_POINT}
                      resizeMode="center"
                      style={{
                        height: hp(2.5),
                        width: wp(5),
                        // backgroundColor:"red"
                      }}
                    />
                  </Marker>
                  <Marker
                    coordinate={{
                      latitude: destinationPlace?.location.latitude,
                      longitude: destinationPlace?.location.longitude,
                    }}>
                    <Image
                      source={icons.CHECK_POINT}
                      resizeMode="center"
                      style={{
                        height: hp(2.5),
                        width: wp(5),
                        // backgroundColor:"red"
                      }}
                    />
                  </Marker>
                </>
              ) : null}
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
                // disable={destinationSearched}
                // marginTop={hp(2)}
                marginBottom={hp(2)}
                onPress={() => {
                  sendRequestToAllDrivers();
                }}
              />
            </View>
          </>
        ) : (
          <>
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
            <TouchableOpacity
              onPress={handleLocationPermission}
              style={{
                position: 'absolute',
                right: wp(4),
                bottom: hp(4),
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
          </>
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
      {manualLocation === true ? (
        <CustomAlert
          message="Manually give location permission"
          visible={manualLocation}
          onPressClose={() => {
            setManualLocation(false);
          }}
        />
      ) : null}
      {/* {isLoading === true ? <CustomScreenLoading visible={isLoading} /> : null} */}
    </>
  );
};

export default Maps;
