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
  Alert,
} from 'react-native';
import React, {useEffect, useState, useRef, useCallback} from 'react';
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

import {useRoute} from '@react-navigation/native';
import {findClosestCoordinate} from '../../../assets/utils/closestCoordinate';

navigator.geolocation = require('react-native-geolocation-service');

const MapForEmergency = () => {
  // Get the route object to access params
  const routeForParams = useRoute();
  const rideTypeFromParams = routeForParams.params;
  // console.log('type======', rideTypeFromParams);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const mapRef = useRef(null);
  const originRef = useRef(null);
  const destinationRef = useRef(null);
  const isMounted = useRef(true);
  const MY_KEY = GOOGLE_API_KEY;
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
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
    latitude: 24.8607,
    longitude: 67.0011,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [regionForZoom, setRegionForZoom] = useState({
    latitude: 24.8607,
    longitude: 67.0011,
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
  // const initializeSocket = useCallback(() => {
  //   // Connect to the server as a user
  //   const userSocket = io(WEB_SOCKET, {
  //     transports: ['websocket'],
  //   });
  //   console.log(1);

  //   // Identify the user
  //   userSocket.emit('identify', {type: 'user', userId: userSocket.id});
  //   // Set the socket state
  //   setSocket(userSocket);
  //   // Clean up on unmount
  //   return () => {
  //     if (userSocket) {
  //       userSocket.disconnect();
  //     }
  //   };
  // }, []);

  useEffect(() => {
    // Ensure that the socket is initialized before requesting location permission
    const userSocket = io(WEB_SOCKET, {
      transports: ['websocket'],
    });
    if (isMounted.current) {
      setScreenLoading(true);
      // Identify the user
      userSocket.emit('identify', {type: 'user', userId: userSocket.id});
      // Set the socket state
      setSocket(userSocket);
      requestLocationPermission(userSocket);
    }

    isMounted.current = false;
    return () => {
      if (userSocket) {
        userSocket.disconnect();
      }
    };

    // if (socket) {
    //   console.log(2);
    // } else {
    //   console.log('No socket available');
    // }

    // Set the component as unmounted
  }, [isFocused]);

  // useEffect(() => {
  //   setScreenLoading(true);
  //   // Connect to the server as a user
  //   const userSocket = io(WEB_SOCKET, {
  //     transports: ['websocket'],
  //   });
  //   // Identify the user
  //   userSocket.emit('identify', {type: 'user', userId: userSocket.id});
  //   // console.log('saving socket', userSocket);
  //   setSocket(userSocket);
  //   if (isMounted.current) {
  //     console.log(2);
  //     requestLocationPermission();
  //   }
  //   // Set the component as unmounted
  //   console.log(1);
  //   isMounted.current = false;
  //   // Clean up on unmount
  //   return () => {
  //     if (userSocket) {
  //       userSocket.disconnect();
  //     }
  //   };
  // }, [isFocused]);

  // useEffect(() => {
  //   // Only run this when the component is mounted
  //   if (isMounted.current) {
  //     console.log(2);
  //     requestLocationPermission();
  //   }

  //   // // Clean up on unmount
  //   // return () => {
  //   //   // Set the component as unmounted
  //   //   isMounted.current = false;
  //   // };
  // }, []);

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
      socket?.disconnect();
      // socket?.on('disconnect', () => {
      //   console.log('user disconnect after ride compelete', socket.id); // undefined
      // });
      setRequestPhase(true);
      setDriverAcceptPhase(false);
      setDriverRoute(false);
      setRoute(false);
      setPaymentPhase(true);
    });
  }, [socket]);

  const [defaultRouteForMarker, setDefaultRouteForMarker] = useState('pickup');

  useEffect(() => {
    const eventHandler = response => {
      // Your code here
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
      }
      handleMapZoomOnRideConnection(driverData);
      setRoute(false);
      setUserCurrentPosition(false);
    };

    socket?.on('driver_response', eventHandler);

    return () => {
      socket?.off('driver_response', eventHandler);
    };
  }, [socket]);

  const handleMapZoomOnRideConnection = driverData => {
    console.log('handleMapZoomOnRideConnection ===>>>>>>>>>>.', driverData);
    if (driverData.route === 'pickup') {
      console.log(
        'handleMapZoomOnRideConnection ========================== pickup',
      );

      const distance = haversine(driverData?.zoom, driverData?.currentLocation);

      const centerLatitude =
        (driverData?.zoom.latitude + driverData?.currentLocation.latitude) / 2;
      const centerLongitude =
        (driverData?.zoom.longitude + driverData?.currentLocation.longitude) /
        2;

      const mapDelta = distance * 0.02; // Adjust this factor for better coverage
      // const zoom = calculateZoom(mapDelta);

      // setMapZoom(zoom);
      setRegionForZoom({
        latitude: centerLatitude,
        longitude: centerLongitude,
        latitudeDelta: mapDelta,
        longitudeDelta: mapDelta,
      });
      console.log(
        'updated location for zoom ',
        centerLatitude,
        centerLongitude,
      );

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
      console.log(
        'handleMapZoomOnRideConnection ========================================= Dropoff',
      );
      const distance = haversine(driverData?.zoom, driverData?.currentLocation);

      const centerLatitude =
        (driverData?.zoom.latitude + driverData?.currentLocation.latitude) / 2;
      const centerLongitude =
        (driverData?.zoom.longitude + driverData?.currentLocation.longitude) /
        2;

      const mapDelta = distance * 0.02; // Adjust this factor for better coverage
      // const zoom = calculateZoom(mapDelta);

      // setMapZoom(zoom);
      setRegionForZoom({
        latitude: centerLatitude,
        longitude: centerLongitude,
        latitudeDelta: mapDelta,
        longitudeDelta: mapDelta,
      });

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

  const sendRequest = (request, userSocket) => {
    try {
      userSocket.emit('user_request', request);
      if (socket) {
        console.log('data sending ======>>>>', request);
      } else {
        console.log('no socket');
      }
    } catch (error) {
      console.log('error on user request', error);
    }
  };

  // const sendRequestToAllDrivers = () => {
  //   if (originPlace && destinationPlace) {
  //     setUserInfoForRide({
  //       type: 'user',
  //       full_name: full_name,
  //       contact: contact,
  //       emergency_contact: emergency_contact,
  //       pickUp_location: originPlace.location,
  //       dropOff_location: destinationPlace.location,
  //       token: token,
  //       userSocketId: socket.id,
  //     });
  //   } else {
  //     originRef.current.focus();
  //   }
  // };

  // useEffect(() => {
  //   if (
  //     userInfoForRide &&
  //     userInfoForRide.pickUp_location &&
  //     userInfoForRide.dropOff_location
  //   ) {
  //     // getDistanceMatrix(
  //     //   userInfoForRide.pickUp_location,
  //     //   userInfoForRide.dropOff_location,
  //     //   'phase',
  //     // )
  //     //   .then(data => {
  //     //     setDistanceData(data);
  //     setRequestPhase(false);
  //     setScreenLoading(true);
  //     const sendingData = JSON.stringify(userInfoForRide);
  //     sendRequest(sendingData);
  //     // })
  //     // .catch(error => {
  //     //   console.log(error);
  //     //   setRequestPhase(false);
  //     //   setScreenLoading(false);
  //     // });
  //   }
  // }, [userInfoForRide]);

  const cancelRequestToAllDrivers = () => {
    setCard2(false);
  };

  const requestLocationPermission = async userSocket => {
    // setScreenLoading(true);
    // console.log('==================================', socket);
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
        fetchCurrentLocation(userSocket);
      } else {
        return null;
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleSettingCoordinatesForEmergency = (
    latitude,
    longitude,
    userSocket,
  ) => {
    const closestHospital = findClosestCoordinate(latitude, longitude);

    setOriginPlace({
      location: {
        latitude: latitude,
        longitude: longitude,
      },
    });
    setDestinationPlace({
      location: {
        latitude: closestHospital.latitude,
        longitude: closestHospital.longitude,
      },
    });
    let userInfoForRide = {
      type: 'user',
      full_name: full_name,
      contact: contact,
      emergency_contact: emergency_contact,
      pickUp_location: {
        latitude: latitude,
        longitude: longitude,
      },
      dropOff_location: {
        latitude: closestHospital.latitude,
        longitude: closestHospital.longitude,
      },
      token: token,
      rideType: 'emergency',
    };
    setRequestPhase(false);
    const sendingData = JSON.stringify(userInfoForRide);
    sendRequest(sendingData, userSocket);
  };

  const fetchCurrentLocation = async userSocket => {
    try {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          handleSettingCoordinatesForEmergency(latitude, longitude, userSocket);

          // setIsLoadingLocation(true);
        },
        error => {
          console.error(`Error getting current location: ${error.message}`);
          // setIsLoadingLocation(true);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 10000,
          distanceFilter: 6,
          // forceRequestLocation: true,
        },
      );
    } catch (error) {
      console.error('Error fetching current location:', error);
      // setIsLoadingLocation(true);
    }
  };
  // useEffect(() => {
  //   console.log(2);
  //   if (socket) {
  //     requestLocationPermission();
  //   }
  // }, [socket]);

  const handleShowUserLocation = () => {
    if (userCurrentPosition === true) {
      console.log('userCurrentPosition is true');
      // mapRef.current.animateToRegion(region, 1000);
    } else {
      console.log('userCurrentPosition is false', regionForZoom);
      mapRef.current.animateToRegion(regionForZoom, 1000);
    }
  };

  // const [mapZoom, setMapZoom] = useState(10);

  // useEffect(() => {
  //   // Check if both originPlace and destinationPlace are not null
  //   if (originPlace && destinationPlace) {
  //     const distance = haversine(
  //       originPlace.location,
  //       destinationPlace.location,
  //     );

  //     const centerLatitude =
  //       (originPlace.location.latitude + destinationPlace.location.latitude) /
  //       2;
  //     const centerLongitude =
  //       (originPlace.location.longitude + destinationPlace.location.longitude) /
  //       2;

  //     const mapDelta = distance * 0.02; // Adjust this factor for better coverage
  //     // console.log(mapDelta);
  //     // const zoom = calculateZoom(mapDelta);

  //     // setMapZoom(zoom);
  //     setRegionForZoom({
  //       latitude: centerLatitude,
  //       longitude: centerLongitude,
  //       latitudeDelta: mapDelta,
  //       longitudeDelta: mapDelta,
  //     });
  //     setUserCurrentPosition(false);
  //     setRoute(true);
  //   }
  //   // if (originPlace && destinationPlace) {
  //   //
  //   //   const distance = haversine(
  //   //     originPlace.location,
  //   //     destinationPlace.location,
  //   //   );
  //   //   const zoom = calculateZoom(distance);
  //   //   setMapZoom(zoom);
  //   //   console.log('=============>', {distance, zoom});
  //   //   setRegionForZoom(prevRegion => ({
  //   //     ...prevRegion,
  //   //     latitude:
  //   //       (originPlace.location.latitude + destinationPlace.location.latitude) /
  //   //       2,
  //   //     longitude:
  //   //       (originPlace.location.longitude +
  //   //         destinationPlace.location.longitude) /
  //   //       2,
  //   //   }));
  //   //   setRoute(true);
  //   //   // console.log('useeffect where checking origin and des to set route true ');
  //   // }
  // }, [originPlace, destinationPlace]);

  const handleCancelRequestButton = () => {
    Alert.alert('AmbuServe', 'are you sure you want to cancel', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          handleCancelRequest();
        },
      },
    ]);
  };

  const handleCancelRequest = () => {
    socket?.emit('cancel_ride', 'canceled');
    socket?.disconnect();
    // socket?.on('disconnect', () => {
    //   console.log('user disconnect after ride compelete', socket.id); // undefined
    // });
    setDriverAcceptPhase(false);
    setDriverRoute(false);
    setRoute(false);
    // setPaymentPhase(true);
    setRideDefault();
  };

  // const handleOriginPlaceChange = location => {
  //   setOriginPlace(location);
  // };
  // const handleDestinationPlaceChange = location => {
  //   setDestinationPlace(location);
  // };

  const [rideSuccessfulAlert, setRideSuccessfulAlert] = useState(false);
  const handlePayment = () => {
    setRideSuccessfulAlert(true);
  };

  const setRideDefault = () => {
    setUserCurrentPosition(true);
    setPaymentPhase(false);
    setDriverAcceptPhase(false);
    setRequestPhase(true);
    setRideSuccessfulAlert(false);
    navigation.goBack();
  };

  // const [originPlaceholder, setOriginPlaceholder] = useState('Where from?');
  // const [destinationPlaceholder, setDestinationPlaceholder] =
  //   useState('Where to');

  return (
    <>
      <SafeAreaView style={styles.container}>
        {/* {isLoadingLocation ? ( */}
        <>
          {driverAcceptPhase ? (
            <DistanceCard
              distance={driversInformation?.distance}
              duration={driversInformation?.duration}
            />
          ) : null}
          {/* {requestPhase ? (
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
            ) : null} */}
          <MapView
            style={styles.map}
            provider="google"
            ref={mapRef}
            // showsUserLocation={userCurrentPosition ? true : false}
            // minZoomLevel={14}
            // maxZoomLevel={18}
            zoomEnabled={true}
            // minZoomLevel={mapZoom}
            region={userCurrentPosition ? region : null}>
            {/* {userCurrentPosition ? (
                // <Marker
                //   style={{
                //     // backgroundColor: 'green',
                //     height: hp(4),
                //     width: wp(7),
                //     justifyContent: 'center',
                //     alignItems: 'center',
                //   }}
                //   flat
                //   anchor={{x: 0.5, y: 0.5}}
                //   coordinate={{
                //     latitude: region?.latitude,
                //     longitude: region?.longitude,
                //   }}>
                //   <Image
                //     source={icons.PERSON}
                //     resizeMode="contain"
                //     style={{
                //       height: '100%',
                //       width: '100%',
                //       // backgroundColor: 'red',
                //     }}
                //   />
                // </Marker>
                <View></View>
              ) : null} */}
            {/* {route ? (
                <>
                  <View>
                    <MapViewDirections
                      origin={originPlace?.location}
                      destination={destinationPlace?.location}
                      apikey={MY_KEY}
                      strokeWidth={3}
                      strokeColor={colors.BLACK}
                      mode="DRIVING"
                      resetOnChange={false}
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
              ) : null} */}
            {driverRoute === true && defaultRouteForMarker === 'pickup' ? (
              <>
                <MapViewDirections
                  origin={driversInformation?.currentLocation}
                  destination={originPlace?.location}
                  apikey={MY_KEY}
                  strokeWidth={3}
                  strokeColor={colors.RED}
                  mode="DRIVING"
                  resetOnChange={false}
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
            ) : driverRoute === true && defaultRouteForMarker === 'dropoff' ? (
              <>
                <MapViewDirections
                  origin={driversInformation?.currentLocation}
                  destination={destinationPlace?.location}
                  apikey={MY_KEY}
                  strokeWidth={3}
                  strokeColor={colors.RED}
                  mode="DRIVING"
                  resetOnChange={false}
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
                  bottom: hp(45),
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

                {defaultRouteForMarker === 'pickup' ? (
                  <>
                    <UserPickupCard
                      driverName={driversInformation?.driver_name}
                      vehicleNumber={driversInformation?.vehicle_number}
                      phoneCall={handlePhoneCall}
                    />
                    <TouchableOpacity
                      onPress={handleCancelRequestButton}
                      style={{
                        marginTop: hp(1),
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        // numberOfLines={1}
                        style={{
                          fontFamily: fonts.REGULAR,
                          fontSize: fontsizes.px_22,
                          color: colors.BLUE,
                          fontWeight: '700',
                          // textAlign: 'center',
                        }}>
                        Cancel Request
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <UserDropoffCard
                    driverName={driversInformation?.driver_name}
                    vehicleNumber={driversInformation?.vehicle_number}
                    companyName={driversInformation?.company_name}
                    emergencyCall={handleEmergencyCall}
                  />
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
            </>
          ) : null}
          {/* {requestPhase ? (
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
          ) : null} */}
        </>
        {/* ) : (
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
            /> */}

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
        {/* </> */}
        {/* )} */}
      </SafeAreaView>
      {alertVisible !== null && (
        <CustomAlert
          message={alertMessage}
          visible={alertVisible}
          onPressClose={() => {
            // socket?.disconnect();
            setAlertVisible(false);
            navigation.goBack();
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
        <CustomScreenLoading
          visible={screenLoading}
          emergency={'Finding nearest available ambulance and hospital'}
        />
      ) : null}
    </>
  );
};

export default MapForEmergency;
