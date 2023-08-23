import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  Image,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import MapView, {Marker, Callout} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import colors from '../../../assets/colors/colors';
import images from '../../../assets/images/images';
import icons from '../../../assets/icons/icons';
import {BASE_URL, GOOGLE_API_KEY, WEB_SOCKET} from '../../../config';
import CustomButton from '../../components/Button/Button';
import CustomAlert from '../../components/Alert/Alert';

import CustomScreenLoading from '../../components/ScreenLoading/ScreenLoading';
import MapViewDirections from 'react-native-maps-directions';
import fontsizes from '../../../assets/fontsizes/fontsizes';
import fonts from '../../../assets/fonts/fonts';
import io from 'socket.io-client';
import Geolocation, {clearWatch} from 'react-native-geolocation-service';
import {PermissionsAndroid} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {useTypedSelector} from '../../redux/Store';
import call from 'react-native-phone-call';
import CustomSuccessAlert from '../../components/SuccessAlert/Alert';
import {
  calculateZoom,
  haversine,
} from '../../components/HaversineDistance/HaversineDistance';
import DistanceCard from '../../components/Cards/DriverDistanceCard/DistanceCard';
import UserPaymentCard from '../../components/Cards/UserPaymentCard/UserPaymentCard';
import UserPickupCard from '../../components/Cards/UserPickupCard/UserPickupCard';
import UserDropoffCard from '../../components/Cards/UserDropoffCard/UserDropoffCard';
import DriverMessageCard from '../../components/Cards/DriversMessageCard/DriverMessageCard';

import {getDistance, getPreciseDistance} from 'geolib';

navigator.geolocation = require('react-native-geolocation-service');

const Maps = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const mapRef = useRef(null);
  const originRef = useRef(null);
  const destinationRef = useRef(null);
  const MY_KEY = GOOGLE_API_KEY;
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState(false);
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
  const [driversInformation, setDriversInformation] = useState(null);
  const [originPlace, setOriginPlace] = useState(null);
  const [destinationPlace, setDestinationPlace] = useState(null);
  const [region, setRegion] = useState({
    latitude: 31.5204,
    longitude: 74.3587,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [regionForZoom, setRegionForZoom] = useState({
    latitude: 31.5204,
    longitude: 74.3587,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [updateRegion, SetUpdateRegion] = useState(false);
  const [userInfoForRide, setUserInfoForRide] = useState({});

  const [route, setRoute] = useState(false);
  const [userCurrentPosition, setUserCurrentPosition] = useState(true);

  // console.log('redendered', userCurrentPosition);
  const [driverRoute, setDriverRoute] = useState(false);
  const [requestPhase, setRequestPhase] = useState(true);
  const [driverAcceptPhase, setDriverAcceptPhase] = useState(false);
  const [paymentPhase, setPaymentPhase] = useState(false);

  const [screenLoading, setScreenLoading] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState('9093900003');
  const handlePhoneCall = () => {
    const args = {
      number: phoneNumber, // String value with the number to call
      prompt: false, // Optional boolean property. Determines if the user should be prompted prior to the call
      skipCanOpen: true, // Skip the canOpenURL check
    };

    call(args).catch(console.error);
  };

  const handleEmergencyCall = () => {
    const args = {
      number: '911', // String value with the number to call
      prompt: false, // Optional boolean property. Determines if the user should be prompted prior to the call
      skipCanOpen: true, // Skip the canOpenURL check
    };

    call(args).catch(console.error);
  };

  const [socket, setSocket] = useState(null);
  useEffect(() => {
    // Connect to the server as a user
    const userSocket = io(WEB_SOCKET, {
      transports: ['websocket'],
    });
    // Identify the user
    userSocket.emit('identify', {type: 'user', userId: userSocket.id});

    setSocket(userSocket);

    // Clean up on unmount
    return () => {
      if (userSocket) {
        userSocket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    socket?.on('no_drivers_available', response => {
      setAlertVisible(true);
      setAlertMessage('no drivers available');
      setRequestPhase(true);
      setDriverAcceptPhase(false);
      // setRoute(false);
      setScreenLoading(false);
    });
  }, [socket]);

  useEffect(() => {
    socket?.on('canceled', response => {
      // console.log(response);
      setDriverAcceptPhase(false);
      setScreenLoading(false);
      setRequestPhase(true);
      setAlertVisible(true);
      setAlertMessage('Try again');
    });
  }, [socket]);

  useEffect(() => {
    socket?.on('ride_completed', response => {
      socket?.on('disconnect', () => {
        console.log('user disconnect after ride compelete', socket.id); // undefined
      });
      setRequestPhase(true);
      setDriverAcceptPhase(false);
      setDriverRoute(false);
      setRoute(false);
      setPaymentPhase(true);
    });
  }, [socket]);

  const [defaultRouteForMarker, setDefaultRouteForMarker] = useState('pickup');
  useEffect(() => {
    socket?.on('driver_response', response => {
      console.log('Received driver response:', response);
      const driverData = JSON.parse(response);
      setDriversInformation(prevDriversInfo => ({
        ...prevDriversInfo,
        ...driverData,
      }));
      setPhoneNumber(driverData?.contact);
      setDefaultRouteForMarker(driverData?.route);
      if (driverData.currentLocation) {
        ////////////////////////// check this
        setScreenLoading(false);
        setRequestPhase(false);
        setDriverRoute(true);
        setDriverAcceptPhase(true);
        handleMapZoomOnRideConnection(driverData);
      }
      setRoute(false);
      setUserCurrentPosition(false);

      // console.log('setUserCurrentPosition false');
    });
  }, [socket]);

  const handleMapZoomOnRideConnection = driverData => {
    console.log('handleMapZoomOnRideConnection', driverData);
    if (originPlace) {
      if (driverData.route === 'route') {
        const distance = haversine(
          originPlace?.location,
          driverData?.currentLocation,
        );

        const centerLatitude =
          (originPlace?.location.latitude +
            driverData?.currentLocation.latitude) /
          2;
        const centerLongitude =
          (originPlace?.location.longitude +
            driverData?.currentLocation.longitude) /
          2;

        const mapDelta = distance * 0.5; // Adjust this factor for better coverage
        const zoom = calculateZoom(mapDelta);

        setMapZoom(zoom);
        setRegionForZoom({
          latitude: centerLatitude,
          longitude: centerLongitude,
          latitudeDelta: mapDelta,
          longitudeDelta: mapDelta,
        });
      }
      // const distance = haversine(
      //   originPlace.location,
      //   driverData?.currentLocation,
      // );
      // const zoom = calculateZoom(distance);
      // setMapZoom(zoom - 1);
      // // console.log('=============>', {distance, zoom});

      // // setRoute(true);
      // setRegion(prevRegion => ({
      //   ...prevRegion,
      //   latitude:
      //     (driverData?.currentLocation?.latitude +
      //       originPlace.location.latitude) /
      //     2,
      //   longitude:
      //     (driverData?.currentLocation?.longitude +
      //       originPlace.location.longitude) /
      //     2,
      // }));
    } else if (driverData.route === 'dropoff') {
      if (destinationPlace) {
        const distance = haversine(
          destinationPlace?.location,
          driverData?.currentLocation,
        );

        const centerLatitude =
          (destinationPlace?.location.latitude +
            driverData?.currentLocation.latitude) /
          2;
        const centerLongitude =
          (destinationPlace?.location.longitude +
            driverData?.currentLocation.longitude) /
          2;

        const mapDelta = distance * 0.5; // Adjust this factor for better coverage
        const zoom = calculateZoom(mapDelta);

        setMapZoom(zoom);
        setRegionForZoom({
          latitude: centerLatitude,
          longitude: centerLongitude,
          latitudeDelta: mapDelta,
          longitudeDelta: mapDelta,
        });
      }
      // const distance = haversine(
      //   destinationPlace?.location,
      //   driverData?.currentLocation,
      // );
      // const zoom = calculateZoom(distance);
      // setMapZoom(zoom - 1);
      // // console.log('=============>', {distance, zoom});

      // // setRoute(true);
      // setRegion(prevRegion => ({
      //   ...prevRegion,
      //   latitude:
      //     (driverData?.currentLocation?.latitude +
      //       destinationPlace.location.latitude) /
      //     2,
      //   longitude:
      //     (driverData?.currentLocation?.longitude +
      //       destinationPlace.location.longitude) /
      //     2,
      // }));
    }
  };

  const sendRequest = request => {
    console.log('data sending ======>>>>', request);
    socket?.emit('user_request', request);
  };

  const sendRequestToAllDrivers = () => {
    if (originPlace && destinationPlace) {
      setUserInfoForRide({
        type: 'user',
        full_name: full_name,
        contact: contact,
        emergency_contact: emergency_contact,
        pickUp_location: originPlace.location,
        dropOff_location: destinationPlace.location,
        token: token,
        userSocketId: socket.id,
      });
    } else {
      originRef.current.focus();
    }
  };

  useEffect(() => {
    if (
      userInfoForRide &&
      userInfoForRide.pickUp_location &&
      userInfoForRide.dropOff_location
    ) {
      // getDistanceMatrix(
      //   userInfoForRide.pickUp_location,
      //   userInfoForRide.dropOff_location,
      //   'phase',
      // )
      //   .then(data => {
      //     setDistanceData(data);
      setRequestPhase(false);
      setScreenLoading(true);
      const sendingData = JSON.stringify(userInfoForRide);
      sendRequest(sendingData);
      // })
      // .catch(error => {
      //   console.log(error);
      //   setRequestPhase(false);
      //   setScreenLoading(false);
      // });
    }
  }, [userInfoForRide]);

  const cancelRequestToAllDrivers = () => {
    setCard2(false);
  };

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
        fetchCurrentLocation();
      } else {
        return null;
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const fetchCurrentLocation = async () => {
    try {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setRegion(prevRegion => ({
            ...prevRegion,
            latitude: latitude,
            longitude: longitude,
          }));

          setIsLoadingLocation(true);
        },
        error => {
          console.error(`Error getting current location: ${error.message}`);
          setIsLoadingLocation(true);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 10000,
          distanceFilter: 2,
          forceRequestLocation: true,
        },
      );
    } catch (error) {
      console.error('Error fetching current location:', error);
      setIsLoadingLocation(true);
    }
  };
  useEffect(() => {
    requestLocationPermission();
  }, [isFocused]);

  useEffect(() => {
    let watchId; // Define watchId outside the if block

    watchId = Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setRegion(prevRegion => ({
          ...prevRegion,
          latitude: latitude,
          longitude: longitude,
        }));
        // console.log('Watching position current location');
      },
      error => {
        console.error(`Error getting current location: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
        interval: 4000,
        distanceFilter: 1,
        forceRequestLocation: true,
      },
    );

    return () => {
      Geolocation.clearWatch(watchId); // Clear the watch only if watchId is defined
    };
  }, []);

  const handleShowUserLocation = () => {
    mapRef.current.animateToRegion(region, 1000);
  };

  const [mapZoom, setMapZoom] = useState(12);

  useEffect(() => {
    // Check if both originPlace and destinationPlace are not null
    if (originPlace && destinationPlace) {
      setUserCurrentPosition(false);
      const distance = haversine(
        originPlace.location,
        destinationPlace.location,
      );

      const centerLatitude =
        (originPlace.location.latitude + destinationPlace.location.latitude) /
        2;
      const centerLongitude =
        (originPlace.location.longitude + destinationPlace.location.longitude) /
        2;

      const mapDelta = distance * 0.5; // Adjust this factor for better coverage
      const zoom = calculateZoom(mapDelta);

      setMapZoom(zoom);
      setRegionForZoom({
        latitude: centerLatitude,
        longitude: centerLongitude,
        latitudeDelta: mapDelta,
        longitudeDelta: mapDelta,
      });
      setRoute(true);
    }
    // if (originPlace && destinationPlace) {
    //
    //   const distance = haversine(
    //     originPlace.location,
    //     destinationPlace.location,
    //   );
    //   const zoom = calculateZoom(distance);
    //   setMapZoom(zoom);
    //   console.log('=============>', {distance, zoom});
    //   setRegionForZoom(prevRegion => ({
    //     ...prevRegion,
    //     latitude:
    //       (originPlace.location.latitude + destinationPlace.location.latitude) /
    //       2,
    //     longitude:
    //       (originPlace.location.longitude +
    //         destinationPlace.location.longitude) /
    //       2,
    //   }));
    //   setRoute(true);
    //   // console.log('useeffect where checking origin and des to set route true ');
    // }
  }, [originPlace, destinationPlace]);

  const cancelRideHandle = () => {};

  const handleOriginPlaceChange = location => {
    setOriginPlace(location);
  };
  const handleDestinationPlaceChange = location => {
    setDestinationPlace(location);
  };

  const [rideSuccessfulAlert, setRideSuccessfulAlert] = useState(false);
  const handlePayment = () => {
    setRideSuccessfulAlert(true);
  };

  const setRideDefault = () => {
    setUserCurrentPosition(true);
    setPaymentPhase(false);
    setRequestPhase(true);
    setRideSuccessfulAlert(false);
  };

  const [originPlaceholder, setOriginPlaceholder] = useState('Where from?');
  const [destinationPlaceholder, setDestinationPlaceholder] =
    useState('Where to');

  return (
    <>
      <SafeAreaView style={styles.container}>
        {isLoadingLocation ? (
          <>
            {driverAcceptPhase ? (
              <DistanceCard
                distance={driversInformation?.distance}
                duration={driversInformation?.duration}
              />
            ) : // <View
            //   style={{
            //     marginTop: hp(2),
            //     marginHorizontal: wp(5),
            //     position: 'absolute',
            //     height: hp(12),
            //     width: wp(90),
            //     borderRadius: wp(5),
            //     borderWidth: wp(0.2),
            //     borderColor: colors.BLACK,
            //     zIndex: 1,
            //     backgroundColor: colors.WHITE,
            //     justifyContent: 'center',
            //   }}>
            //   <View
            //     style={{
            //       flexDirection: 'row',
            //       justifyContent: 'space-between',
            //       marginHorizontal: wp(5),
            //     }}>
            //     <Text
            //       numberOfLines={1}
            //       style={{
            //         fontWeight: '400',
            //         fontSize: fontsizes.px_22,
            //         fontFamily: fonts.REGULAR,
            //         color: colors.BLACK,
            //         textAlign: 'left',
            //       }}>
            //       Distance
            //     </Text>
            //     <Text
            //       numberOfLines={1}
            //       style={{
            //         fontWeight: '400',
            //         fontSize: fontsizes.px_22,
            //         fontFamily: fonts.REGULAR,
            //         color: colors.BLACK,
            //         width: wp(24),
            //         textAlign: 'right',
            //       }}>
            //       {driversInformation?.distance}
            //     </Text>
            //   </View>
            //   <View
            //     style={{
            //       flexDirection: 'row',
            //       justifyContent: 'space-between',
            //       marginHorizontal: wp(5),
            //     }}>
            //     <Text
            //       numberOfLines={1}
            //       style={{
            //         fontWeight: '400',
            //         fontSize: fontsizes.px_22,
            //         fontFamily: fonts.REGULAR,
            //         color: colors.BLACK,
            //         textAlign: 'left',
            //       }}>
            //       Estimate time of travel
            //     </Text>
            //     <Text
            //       numberOfLines={1}
            //       style={{
            //         fontWeight: '400',
            //         fontSize: fontsizes.px_22,
            //         fontFamily: fonts.REGULAR,
            //         color: colors.BLACK,
            //         width: wp(24),
            //         textAlign: 'right',
            //       }}>
            //       {driversInformation?.duration}
            //     </Text>
            //   </View>
            // </View>
            null}
            {requestPhase ? (
              <>
                <View style={styles.searchBarFrom}>
                  <GooglePlacesAutocomplete
                    // currentLocation={true}
                    // currentLocationLabel="Current Location"
                    ref={originRef}
                    placeholder={originPlaceholder}
                    minLength={2}
                    enablePoweredByContainer={false}
                    fetchDetails={true}
                    onPress={(data, details = null) => {
                      if (details) {
                        const {geometry} = details;

                        const {location} = geometry;
                        const {lat: latitude, lng: longitude} = location;
                        // setOriginPlace({
                        //   location: {
                        //     latitude: latitude,
                        //     longitude: longitude,
                        //   },
                        // });
                        handleOriginPlaceChange({
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
                      container: {},
                      listView: {
                        marginTop: hp(6),
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
                      type: 'hospital',
                    }}
                    GooglePlacesDetailsQuery={{
                      fields: 'geometry',
                    }}
                  />
                </View>
                <View style={styles.searchBarTo}>
                  <GooglePlacesAutocomplete
                    placeholder={destinationPlaceholder}
                    ref={destinationRef}
                    minLength={2}
                    enablePoweredByContainer={false}
                    fetchDetails={true}
                    onPress={(data, details = null) => {
                      if (details) {
                        const {geometry} = details;

                        const {location} = geometry;
                        const {lat: latitude, lng: longitude} = location;
                        handleDestinationPlaceChange({
                          location: {
                            latitude: latitude,
                            longitude: longitude,
                          },
                        });
                        // setDestinationPlace({
                        //   location: {
                        //     latitude: latitude,
                        //     longitude: longitude,
                        //   },
                        // });
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
                      type: 'hospital',
                    }}
                    GooglePlacesDetailsQuery={{
                      fields: 'geometry',
                    }}
                  />
                </View>
              </>
            ) : null}
            <MapView
              style={styles.map}
              provider="google"
              ref={mapRef}
              // minZoomLevel={14}
              // maxZoomLevel={18}
              zoomEnabled={true}
              minZoomLevel={mapZoom}
              region={userCurrentPosition ? region : regionForZoom}>
              {userCurrentPosition ? (
                <Marker
                  style={{
                    // backgroundColor: 'green',
                    height: hp(4),
                    width: wp(7),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  flat
                  anchor={{x: 0.5, y: 0.5}}
                  coordinate={{
                    latitude: region?.latitude,
                    longitude: region?.longitude,
                  }}>
                  <Image
                    source={icons.PERSON}
                    resizeMode="contain"
                    style={{
                      height: '100%',
                      width: '100%',
                      // backgroundColor: 'red',
                    }}
                  />
                </Marker>
              ) : null}
              {route ? (
                <>
                  <View>
                    <MapViewDirections
                      origin={originPlace?.location}
                      destination={destinationPlace?.location}
                      apikey={MY_KEY}
                      strokeWidth={3}
                      strokeColor={colors.BLACK}
                    />
                    <Marker
                      style={{
                        // backgroundColor: 'green',
                        height: hp(4),
                        width: wp(7),
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      flat
                      anchor={{x: 0.5, y: 0.5}}
                      coordinate={{
                        latitude: originPlace?.location?.latitude,
                        longitude: originPlace?.location?.longitude,
                      }}>
                      <Image
                        source={icons.START_POINT}
                        resizeMode="contain"
                        style={{
                          height: '100%',
                          width: '100%',
                          // backgroundColor: 'red',
                        }}
                      />
                    </Marker>
                    <Marker
                      style={{
                        // backgroundColor: 'green',
                        height: hp(4),
                        width: wp(7),
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      flat
                      anchor={{x: 0.5, y: 0.5}}
                      coordinate={{
                        latitude: destinationPlace?.location?.latitude,
                        longitude: destinationPlace?.location?.longitude,
                      }}>
                      <Image
                        source={icons.END_POINT}
                        resizeMode="contain"
                        style={{
                          height: '100%',
                          width: '100%',
                          // backgroundColor: 'red',
                        }}
                      />
                    </Marker>
                  </View>
                </>
              ) : null}
              {driverRoute === true && defaultRouteForMarker === 'pickup' ? (
                <>
                  <MapViewDirections
                    origin={driversInformation?.currentLocation}
                    destination={originPlace?.location}
                    apikey={MY_KEY}
                    strokeWidth={3}
                    strokeColor={colors.RED}
                  />
                  <Marker
                    style={{
                      // backgroundColor: 'green',
                      height: hp(4),
                      width: wp(7),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    flat
                    anchor={{x: 0.5, y: 0.5}}
                    coordinate={{
                      latitude: driversInformation?.currentLocation.latitude,
                      longitude: driversInformation?.currentLocation.longitude,
                    }}>
                    <Image
                      source={images.AMBULANCE_MARKER}
                      resizeMode="contain"
                      style={{
                        height: '100%',
                        width: '100%',
                        // backgroundColor: 'red',
                      }}
                    />
                  </Marker>
                  <Marker
                    style={{
                      // backgroundColor: 'green',
                      height: hp(4),
                      width: wp(7),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    flat
                    anchor={{x: 0.5, y: 0.5}}
                    coordinate={{
                      latitude: originPlace?.location?.latitude,
                      longitude: originPlace?.location?.longitude,
                    }}>
                    <Image
                      source={icons.START_POINT}
                      resizeMode="contain"
                      style={{
                        height: '100%',
                        width: '100%',
                        // backgroundColor: 'red',
                      }}
                    />
                  </Marker>
                </>
              ) : driverRoute === true &&
                defaultRouteForMarker === 'dropoff' ? (
                <>
                  <MapViewDirections
                    origin={driversInformation?.currentLocation}
                    destination={destinationPlace?.location}
                    apikey={MY_KEY}
                    strokeWidth={3}
                    strokeColor={colors.RED}
                  />
                  <Marker
                    style={{
                      // backgroundColor: 'green',
                      height: hp(4),
                      width: wp(7),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    flat
                    anchor={{x: 0.5, y: 0.5}}
                    coordinate={{
                      latitude: driversInformation?.currentLocation.latitude,
                      longitude: driversInformation?.currentLocation.longitude,
                    }}>
                    <Image
                      source={images.AMBULANCE_MARKER}
                      resizeMode="contain"
                      style={{
                        height: '100%',
                        width: '100%',
                        // backgroundColor: 'red',
                      }}
                    />
                  </Marker>
                  <Marker
                    style={{
                      // backgroundColor: 'green',
                      height: hp(4),
                      width: wp(7),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    flat
                    anchor={{x: 0.5, y: 0.5}}
                    coordinate={{
                      latitude: destinationPlace?.location?.latitude,
                      longitude: destinationPlace?.location?.longitude,
                    }}>
                    <Image
                      source={icons.END_POINT}
                      resizeMode="contain"
                      style={{
                        height: '100%',
                        width: '100%',
                        // backgroundColor: 'red',
                      }}
                    />
                  </Marker>
                </>
              ) : null}
            </MapView>
            {driverAcceptPhase ? (
              <>
                <TouchableOpacity
                  onPress={handleShowUserLocation}
                  style={{
                    position: 'absolute',
                    right: wp(5),
                    bottom: hp(46),
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
                <View style={styles.rideConnectedCardView}>
                  <DriverMessageCard
                    title={driversInformation?.title}
                    message={driversInformation?.message}
                  />
                  {/* <View
                    style={{
                      marginTop: hp(1),
                      marginBottom: hp(1),
                      height: hp(10),
                      marginHorizontal: wp(2),
                      justifyContent: 'center',
                      alignItems: 'center',
                      // backgroundColor: 'pink',
                    }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontFamily: fonts.REGULAR,
                        fontSize: fontsizes.px_22,
                        color: colors.BLACK,
                        fontWeight: '700',
                        // textAlign: 'left',
                      }}>
                      {driversInformation?.title}
                    </Text>
                    <Text
                      numberOfLines={2}
                      style={{
                        marginHorizontal: wp(4),
                        fontFamily: fonts.REGULAR,
                        fontSize: fontsizes.px_15,
                        color: colors.GREY,
                        fontWeight: '500',
                        textAlign: 'center',
                      }}>
                      {driversInformation?.message}
                    </Text>
                  </View> */}
                  {defaultRouteForMarker === 'pickup' ? (
                    <UserPickupCard
                      driverName={driversInformation?.driver_name}
                      vehicleNumber={driversInformation?.vehicle_number}
                      phoneCall={handlePhoneCall}
                    />
                  ) : (
                    // <>
                    //   <View
                    //     style={{
                    //       width: 'auto',
                    //       // backgroundColor: 'red',
                    //       justifyContent: 'center',
                    //       alignItems: 'center',
                    //       // marginTop: hp(1),
                    //       marginBottom: hp(2),
                    //     }}>
                    //     <Image
                    //       source={images.MESSAGE_IMAGE_1}
                    //       resizeMode="contain"
                    //       style={{
                    //         height: hp(16),
                    //         width: wp(40),
                    //       }}
                    //     />
                    //   </View>
                    //   <View
                    //     style={{
                    //       flexDirection: 'row',
                    //       marginHorizontal: wp(6),
                    //       height: hp(11),
                    //       borderRadius: wp(2),
                    //       backgroundColor: '#e9eff2',
                    //       // justifyContent: 'center',
                    //       alignItems: 'center',

                    //       // justifyContent:'space-between',
                    //       // alignItems: 'center',
                    //     }}>
                    //     <Image
                    //       source={images.DEFAULT_USER}
                    //       resizeMode="contain"
                    //       style={{
                    //         // backgroundColor: 'green',
                    //         marginLeft: wp(2),
                    //         height: hp(8),
                    //         width: wp(15),
                    //         // borderRadius: wp(10),
                    //         // marginRight: wp(5),
                    //       }}
                    //     />
                    //     <View>
                    //       <Text
                    //         numberOfLines={1}
                    //         style={{
                    //           marginLeft: wp(2),
                    //           // marg/inTop: hp(1),
                    //           fontFamily: fonts.REGULAR,
                    //           fontSize: fontsizes.px_18,
                    //           color: colors.BLACK,
                    //           fontWeight: '700',
                    //           width: wp(30),
                    //           // backgroundColor: 'pink',
                    //           // textAlign: 'left',
                    //         }}>
                    //         {driversInformation?.driver_name}
                    //       </Text>
                    //       <Text
                    //         numberOfLines={1}
                    //         style={{
                    //           marginLeft: wp(2),
                    //           // marginTop: hp(1),
                    //           fontFamily: fonts.REGULAR,
                    //           fontSize: fontsizes.px_12,
                    //           color: colors.BLACK,
                    //           fontWeight: '300',
                    //           width: wp(30),
                    //           // backgroundColor: 'pink',
                    //           // textAlign: 'left',
                    //         }}>
                    //         {driversInformation?.vehicle_number}
                    //       </Text>
                    //     </View>
                    //     <TouchableOpacity
                    //       onPress={handlePhoneCall}
                    //       style={{
                    //         // backgroundColor: 'red',
                    //         width: wp(30),
                    //         alignItems: 'flex-end',
                    //       }}>
                    //       <Image
                    //         source={icons.PHONE_ICON}
                    //         resizeMode="contain"
                    //         style={{
                    //           height: hp(6),
                    //           width: wp(8),
                    //         }}
                    //       />
                    //     </TouchableOpacity>
                    //   </View>
                    // </>
                    <UserDropoffCard
                      driverName={driversInformation?.driver_name}
                      vehicleNumber={driversInformation?.vehicle_number}
                      companyName={driversInformation?.company_name}
                      emergencyCall={handleEmergencyCall}
                    />
                    // <>
                    //   <View
                    //     style={{
                    //       flexDirection: 'row',
                    //       marginHorizontal: wp(6),
                    //       marginTop: wp(4),
                    //       height: hp(11),
                    //       borderRadius: wp(2),
                    //       backgroundColor: '#e9eff2',
                    //       // justifyContent: 'center',
                    //       alignItems: 'center',

                    //       // justifyContent:'space-between',
                    //       // alignItems: 'center',
                    //     }}>
                    //     <Image
                    //       source={images.DEFAULT_USER}
                    //       resizeMode="contain"
                    //       style={{
                    //         // backgroundColor: 'green',
                    //         marginLeft: wp(2),
                    //         height: hp(8),
                    //         width: wp(15),
                    //         // borderRadius: wp(10),
                    //         // marginRight: wp(5),
                    //       }}
                    //     />
                    //     <View>
                    //       <Text
                    //         numberOfLines={1}
                    //         style={{
                    //           marginLeft: wp(2),
                    //           // marg/inTop: hp(1),
                    //           fontFamily: fonts.REGULAR,
                    //           fontSize: fontsizes.px_18,
                    //           color: colors.BLACK,
                    //           fontWeight: '700',
                    //           width: wp(30),
                    //           // backgroundColor: 'pink',
                    //           // textAlign: 'left',
                    //         }}>
                    //         {driversInformation?.driver_name}
                    //       </Text>
                    //       <Text
                    //         numberOfLines={1}
                    //         style={{
                    //           marginLeft: wp(2),
                    //           // marginTop: hp(1),
                    //           fontFamily: fonts.REGULAR,
                    //           fontSize: fontsizes.px_12,
                    //           color: colors.BLACK,
                    //           fontWeight: '300',
                    //           width: wp(30),
                    //           // backgroundColor: 'pink',
                    //           // textAlign: 'left',
                    //         }}>
                    //         {driversInformation?.vehicle_number}
                    //       </Text>
                    //     </View>
                    //     <Text
                    //       numberOfLines={1}
                    //       style={{
                    //         marginLeft: wp(2),
                    //         // marginTop: hp(1),
                    //         fontFamily: fonts.REGULAR,
                    //         fontSize: fontsizes.px_18,
                    //         color: colors.BLACK,
                    //         fontWeight: '300',
                    //         width: wp(32),
                    //         // backgroundColor: 'pink',
                    //         textAlign: 'center',
                    //       }}>
                    //       {driversInformation?.company_name}
                    //     </Text>
                    //   </View>
                    //   <View
                    //     style={{
                    //       flexDirection: 'row',
                    //       marginHorizontal: wp(6),
                    //       marginTop: wp(4),
                    //       height: hp(11),
                    //       borderRadius: wp(2),
                    //       backgroundColor: '#e9eff2',
                    //       justifyContent: 'space-between',
                    //       alignItems: 'center',
                    //       paddingHorizontal: wp(4),

                    //       // justifyContent:'space-between',
                    //       // alignItems: 'center',
                    //     }}>
                    //     <Text
                    //       numberOfLines={1}
                    //       style={{
                    //         // marginLeft: wp(2),
                    //         // marg/inTop: hp(1),
                    //         fontFamily: fonts.REGULAR,
                    //         fontSize: fontsizes.px_22,
                    //         color: colors.BLUE,
                    //         fontWeight: '700',
                    //         width: wp(50),
                    //         // backgroundColor: 'pink',
                    //         // textAlign: 'left',
                    //       }}>
                    //       Emergency Alerts
                    //     </Text>

                    //     <TouchableOpacity
                    //       onPress={handleEmergencyCall}
                    //       style={
                    //         {
                    //           // backgroundColor: 'red',
                    //           // width: wp(30),
                    //           // alignItems: 'flex-end',
                    //         }
                    //       }>
                    //       <Image
                    //         source={icons.PHONE_ICON}
                    //         resizeMode="contain"
                    //         style={{
                    //           height: hp(6),
                    //           width: wp(8),
                    //         }}
                    //       />
                    //     </TouchableOpacity>
                    //   </View>
                    // </>
                  )}
                </View>
              </>
            ) : null}
            {paymentPhase ? (
              <>
                <TouchableOpacity
                  onPress={handleShowUserLocation}
                  style={{
                    position: 'absolute',
                    right: wp(5),
                    bottom: hp(50),
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
                <UserPaymentCard paymentOnpress={handlePayment} />
                {/* <View
                  style={{
                    // marginTop: hp(2),
                    // marginHorizontal: wp(5),
                    // position: 'absolute',
                    height: hp(49),
                    width: '100%',
                    // width: wp(100),
                    // borderRadius: wp(5),
                    // borderWidth: wp(0.2),
                    borderColor: colors.BLACK,
                    zIndex: 1,
                    bottom: hp(0),
                    backgroundColor: colors.WHITE,
                    // justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      marginTop: hp(1),
                      marginBottom: hp(1),
                      height: hp(10),
                      marginHorizontal: wp(2),
                      justifyContent: 'center',
                      alignItems: 'center',
                      // backgroundColor: 'pink',
                    }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontFamily: fonts.REGULAR,
                        fontSize: fontsizes.px_22,
                        color: colors.BLACK,
                        fontWeight: '700',
                        // textAlign: 'left',
                      }}>
                      Arrived Destination!
                    </Text>
                    <Text
                      numberOfLines={2}
                      style={{
                        marginHorizontal: wp(4),
                        fontFamily: fonts.REGULAR,
                        fontSize: fontsizes.px_15,
                        color: colors.GREY,
                        fontWeight: '500',
                        textAlign: 'center',
                      }}>
                      AmbuServe is the right choice to serve as your ambulance
                      service and event medical services provider.
                    </Text>
                  </View>
                  <View
                    style={{
                      width: 'auto',
                      // backgroundColor: 'red',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={images.PAYMENT_PHASE_ICON}
                      resizeMode="contain"
                      style={{
                        height: hp(18),
                        width: wp(30),
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginHorizontal: wp(4),
                      height: hp(11),
                      borderRadius: wp(2),
                      backgroundColor: '#e9eff2',
                      // justifyContent: 'center',
                      alignItems: 'center',

                      // justifyContent:'space-between',
                      // alignItems: 'center',
                    }}>
                    <View>
                      <Text
                        numberOfLines={2}
                        style={{
                          marginLeft: wp(2),
                          // marg/inTop: hp(1),
                          fontFamily: fonts.REGULAR,
                          fontSize: fontsizes.px_18,
                          color: colors.BLUE,
                          fontWeight: '700',
                          width: wp(45),
                          // backgroundColor: 'pink',
                          // textAlign: 'left',
                        }}>
                        Chosse payment method
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={handlePayment}
                      style={{
                        // backgroundColor: 'red',
                        // width: wp(40),
                        alignItems: 'flex-end',
                      }}>
                      <Image
                        source={icons.CASH_ICON}
                        resizeMode="contain"
                        style={{
                          marginLeft: wp(10),
                          height: hp(5),
                          width: wp(7),
                          tintColor: colors.BLUE,
                        }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handlePayment}
                      style={{
                        // backgroundColor: 'red',
                        // width: wp(40),
                        alignItems: 'flex-end',
                      }}>
                      <Image
                        source={icons.CREDIT_CARD_ICON}
                        resizeMode="contain"
                        style={{
                          marginLeft: wp(4),
                          height: hp(5),
                          width: wp(7),
                          tintColor: colors.BLUE,
                        }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handlePayment}
                      style={{
                        // backgroundColor: 'red',
                        // width: wp(40),
                        alignItems: 'flex-end',
                      }}>
                      <Image
                        source={icons.BANK_TRANSFER_ICON}
                        resizeMode="contain"
                        style={{
                          marginLeft: wp(4),
                          height: hp(5),
                          width: wp(7),
                          tintColor: colors.BLUE,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View> */}
              </>
            ) : null}
            {requestPhase ? (
              <View
                style={{
                  position: 'absolute',
                  // right:wp(4),
                  bottom: hp(3),
                }}>
                <>
                  <TouchableOpacity
                    onPress={handleShowUserLocation}
                    style={{
                      position: 'absolute',
                      right: wp(5),
                      bottom: hp(8),
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
                  <CustomButton
                    title="Request Ambulance"
                    textColor={colors.WHITE}
                    backgroundColor={colors.BLUE}
                    height={hp(6)}
                    width={wp(90)}
                    borderRadius={wp(2)}
                    marginHorizontal={wp(5)}
                    onPress={() => {
                      sendRequestToAllDrivers();
                    }}
                  />
                </>
              </View>
            ) : null}
          </>
        ) : (
          <>
            <CustomScreenLoading visible={!isLoadingLocation} />
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

            {/*  <TouchableOpacity
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
            </TouchableOpacity> */}
          </>
        )}
      </SafeAreaView>
      {alertVisible !== null && (
        <CustomAlert
          message={alertMessage}
          visible={alertVisible}
          onPressClose={() => {
            setAlertVisible(false);
          }}
        />
      )}

      {rideSuccessfulAlert ? (
        <CustomSuccessAlert
          visible={rideSuccessfulAlert}
          confirmButton={setRideDefault}
          onPressClose={() => {
            setRideSuccessfulAlert(false);
          }}
        />
      ) : null}

      {screenLoading === true ? (
        <CustomScreenLoading visible={screenLoading} />
      ) : null}
    </>
  );
};

export default Maps;
