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
import images from '../../../../assets/images/images';
import icons from '../../../../assets/icons/icons';
import fonts from '../../../../assets/fonts/fonts';
import fontsizes from '../../../../assets/fontsizes/fontsizes';
import colors from '../../../../assets/colors/colors';
import CustomAlert from '../../../components/Alert/Alert';
import {GOOGLE_API_KEY, WEB_SOCKET} from '../../../../config';

import {useTypedSelector} from '../../../redux/Store';
import MapViewDirections from 'react-native-maps-directions';
import io from 'socket.io-client';
import getDistanceMatrix from '../../../DistanceMatrix/DistanceMatrix';
import CustomScreenLoading from '../../../components/ScreenLoading/ScreenLoading';
import Geolocation, {watchPosition} from 'react-native-geolocation-service';
import {PermissionsAndroid} from 'react-native';

import {useIsFocused} from '@react-navigation/native';
import getInitialMatrix from '../../../DistanceMatrix/initialMatrix';
import {useSelector, useDispatch} from 'react-redux';
import {
  setDriverRideConnectedState,
  setDriverRidePhaseOne,
} from '../../../redux/Action';

const DriverMap = () => {
  const isFocused = useIsFocused();
  const rideConnect = useSelector(
    state => state.reducer.driverRideConnectState,
  ); // Access state from Redux
  const ridePhaseOne = useSelector(state => state.reducer.driverRidePhaseOne);

  useEffect(() => {
    if (ridePhaseOne) {
      // Update location based on rideConnect value
      // ...
      setStartPhaseOne(ridePhaseOne);
      // console.log(ridePhaseOne);
    }
  }, [rideConnect]);

  useEffect(() => {
    if (rideConnect) {
      // Update location based on rideConnect value
      // ...
      setRideConnected(rideConnect);
      // console.log(rideConnect);
    }
  }, [rideConnect]);

  const dispatch = useDispatch();
  const GOOGLE_MAPS_APIKEY = GOOGLE_API_KEY;
  // const socketDriver = new WebSocket(WEB_SOCKET, 'driver');
  const navigation = useNavigation();
  // const [liveLocation, isLoading] = useLiveLocation();
  const mapRef = useRef(null);
  const driverInfoString = useTypedSelector(state => state.reducer.driverInfo);
  const driverInfo = JSON.parse(driverInfoString);
  const {
    company_name,
    vehicle_number,
    driver_name,
    company_email,
    driver_contact,
    office_address,
  } = driverInfo;
  const destination = {latitude: 37.771707, longitude: -122.4053769};
  const [region, setRegion] = useState({
    latitude: 31.5204,
    longitude: 74.3587,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [alertVisible, setAlertVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [userContact, setUserContact] = useState('');
  const [destinationDistance, setDestinationDistance] = useState();
  const [destinationTime, setDestinationTime] = useState();
  const [userDropOff, setUserDropOff] = useState();
  const [ridePhase1, setRidePhase1] = useState({latitude: 0, longitude: 0});
  const [ridePhase2, setRidePhase2] = useState({latitude: 0, longitude: 0});
  const [userDetailCard, setUserDetailCard] = useState(false);

  const [userToken, setUserToken] = useState('');
  const [userInformation, setUserInformation] = useState('');

  const [socket, setSocket] = useState(null);
  const [userSocket, setUserSocket] = useState(null);

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [ambulanceMessage, setAmbulanceMessage] = useState(
    'You ambulance is on the way',
  );
  const [startRideButton, setStartRideButton] = useState(false);
  const [startPhaseOne, setStartPhaseOne] = useState(false);
  const [startPhaseTwo, setStartPhaseTwo] = useState(false);
  const [rideConnected, setRideConnected] = useState(false);
  console.log('redndered screen', rideConnected);
  console.log('redndered screen 1', startPhaseOne);

  useEffect(() => {
    // Connect to the server as a driver
    const driverSocket = io(WEB_SOCKET, {transports: ['websocket']});
    driverSocket.emit('identify', {type: 'driver', driverId: driverSocket.id});
    setSocket(driverSocket);

    // Clean up on unmount
    return () => {
      if (userSocket) {
        driverSocket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    // When the driver receives a new request
    socket?.on('new_request', request => {
      // Handle the new request here
      // console.log('Received new request:', request);
      const receivedMessage = JSON.parse(request);
      const {pickUp_location, dropOff_location} = receivedMessage;
      // console.log(' geting location====>', {pickUp_location, dropOff_location});
      if (pickUp_location && dropOff_location) {
        setRidePhase1(pickUp_location);
        setRidePhase2(dropOff_location);
        getInitialMatrix(region, pickUp_location).then(distanceMatrix => {
          setDestinationDistance(distanceMatrix.distance);
          // console.log('--------------->', distanceMatrix);
          getInitialMatrix(pickUp_location, dropOff_location).then(
            distanceMatrix => {
              setUserDropOff(distanceMatrix.distance);
              setUserName(receivedMessage.full_name);
              setUserContact(receivedMessage.contact);
              setUserToken(receivedMessage.token);
              setAlertVisible(true);
            },
          );
        });
      }
    });
  }, [socket]);

  useEffect(() => {
    requestLocationPermission();
  }, []);

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
        updateMapLocation();
      } else {
        return null;
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const updateMapLocation = async () => {
    console.log('1');
    try {
      Geolocation.watchPosition(
        position => {
          const {latitude, longitude} = position.coords;
          // console.log(rideConnected, startPhaseOne, startPhaseTwo);
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
          interval: 2000,
          distanceFilter: 1,
          forceRequestLocation: true,
        },
      );
    } catch (error) {
      console.error('Error fetching current location:', error);
      setIsLoadingLocation(true);
    }
  };

  ///////////////////////on ride connection/////////////////////////
  const handleLocationChange = position => {
    const {latitude, longitude} = position.coords;
    if (startPhaseOne) {
      getDistanceMatrix(position.coords, ridePhase1, 'phaseOne').then(
        distanceMatrix => {
          console.log('--------------------------------');
          setDestinationDistance(distanceMatrix.distance);
          setDestinationTime(distanceMatrix.duration);
          shareLiveLocation(
            latitude,
            longitude,
            distanceMatrix.distance,
            distanceMatrix.duration,
            distanceMatrix.message,
          );
          setStartRideButton(distanceMatrix.phaseTwo);
        },
      );
    } else if (startPhaseTwo) {
      getDistanceMatrix(position.coords, ridePhase2, 'phaseTwo').then(
        distanceMatrix => {
          setDestinationDistance(distanceMatrix.distance);
          setDestinationTime(distanceMatrix.duration);
          shareLiveLocation(
            latitude,
            longitude,
            distanceMatrix.distance,
            distanceMatrix.duration,
            distanceMatrix.message,
          );
        },
      );
    }
  };

  useEffect(() => {
    // console.log(rideConnected, startPhaseOne, startPhaseTwo);
    console.log('2');
    try {
      const watchId = Geolocation.watchPosition(
        position => {
          console.log('3');
          if (rideConnected) {
            console.log('ride conect==========>', rideConnected);
            handleLocationChange(position);
          }
        },
        error => {
          console.error(`Error getting current location: ${error.message}`);
          setIsLoadingLocation(true);
        },
        {
          enableHighAccuracy: true,
          interval: 2000,
          distanceFilter: 2,
          forceRequestLocation: true,
        },
      );

      return () => {
        Geolocation.clearWatch(watchId);
      };
    } catch (error) {
      console.error('Error fetching current location:', error);
      setIsLoadingLocation(true);
    }
  }, [rideConnected]);

  // useEffect(() => {
  //   console.log(rideConnected, startPhaseOne, startPhaseTwo);

  //   try {
  //     Geolocation.watchPosition(
  //       position => {
  //         const {latitude, longitude} = position.coords;
  //         if (startPhaseOne) {
  //           getDistanceMatrix(position.coords, ridePhase1, 'phaseOne').then(
  //             distanceMatrix => {
  //               setDestinationDistance(distanceMatrix.distance);
  //               setDestinationTime(distanceMatrix.duration);
  //               shareLiveLocation(
  //                 latitude,
  //                 longitude,
  //                 distanceMatrix.distance,
  //                 distanceMatrix.duration,
  //                 distanceMatrix.message,
  //               );
  //               setStartRideButton(distanceMatrix.phaseTwo);
  //             },
  //           );
  //         } else if (startPhaseTwo) {
  //           getDistanceMatrix(position.coords, ridePhase2, 'phaseTwo').then(
  //             distanceMatrix => {
  //               setDestinationDistance(distanceMatrix.distance);
  //               setDestinationTime(distanceMatrix.duration);
  //               shareLiveLocation(
  //                 latitude,
  //                 longitude,
  //                 distanceMatrix.distance,
  //                 distanceMatrix.duration,
  //                 distanceMatrix.message,
  //               );
  //             },
  //           );
  //         }
  //       },
  //       error => {
  //         console.error(`Error getting current location: ${error.message}`);
  //         setIsLoadingLocation(true);
  //       },
  //       {
  //         enableHighAccuracy: true,
  //         interval: 2000,
  //         distanceFilter: 2,
  //         forceRequestLocation: true,
  //       },
  //     );
  //   } catch (error) {
  //     console.error('Error fetching current location:', error);
  //     setIsLoadingLocation(true);
  //   }
  // }, []);

  const onConfirmRide = () => {
    setAlertVisible(false);
    // setStartPhaseOne(true);
    dispatch(setDriverRidePhaseOne(true));
    dispatch(setDriverRideConnectedState(true));
    // setRideConnected(true);
    setUserDetailCard(true);

    // Call the fetchCurrentLocation function here to immediately send the socket data
    sendLocationOnRideConnected();
  };

  const sendLocationOnRideConnected = async () => {
    try {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          getDistanceMatrix(region, ridePhase1, 'phaseOne').then(
            distanceMatrix => {
              setDestinationDistance(distanceMatrix.distance);
              setDestinationTime(distanceMatrix.duration);
              shareLiveLocation(
                latitude,
                longitude,
                distanceMatrix.distance,
                distanceMatrix.duration,
                distanceMatrix.message,
              );
            },
          );
        },
        error => {
          console.error(`Error getting current location: ${error.message}`);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 1000,
        },
      );
    } catch (error) {
      console.error('Error fetching current location:', error);
    }
  };

  const onCancelRide = () => {
    setAlertVisible(false);
    socket?.emit('cancel_request', 'canceled');
  };

  const handleRidePhase2 = () => {
    // console.log('Phase 2');
    setStartPhaseOne(false);
    setStartPhaseTwo(true);
    // setRideConnected(true);
    setStartRideButton(false);
  };

  const shareLiveLocation = (lat, long, distance, duration, message) => {
    console.log('message:', message);
    const userReqConnect = {
      type: 'driver',
      driver_name: driver_name,
      contact: driver_contact,
      currentLocation: {
        latitude: lat,
        longitude: long,
      },
      distance: distance,
      duration: duration,
      company_name: company_name,
      vehicle_number: vehicle_number,
      usertoken: userToken,
      message: message,
      status: 'active',
    };
    const data = JSON.stringify(userReqConnect);
    console.log('sending driver location=============>', data);
    socket?.emit('driver_response', data);
  };

  const handleShowUserLocation = () => {
    mapRef.current.animateToRegion(region, 1000);
  };

  const [manualLocation, setManualLocation] = useState(false);
  const handleLocationPermission = () => {
    setManualLocation(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {region != null ? (
        <>
          {/* <Text style={{color: colors.BLACK}}>{liveLocation.latitude}</Text> */}
          {userDetailCard ? (
            <View
              style={{
                marginTop: hp(2),
                marginHorizontal: wp(5),
                position: 'absolute',
                height: hp(12),
                width: wp(90),
                borderRadius: wp(5),
                borderWidth: wp(0.2),
                borderColor: colors.BLACK,
                zIndex: 1,
                backgroundColor: colors.WHITE,
                justifyContent: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: wp(5),
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontWeight: '400',
                    fontSize: fontsizes.px_22,
                    fontFamily: fonts.REGULAR,
                    color: colors.BLACK,
                    textAlign: 'left',
                  }}>
                  Distance
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontWeight: '400',
                    fontSize: fontsizes.px_22,
                    fontFamily: fonts.REGULAR,
                    color: colors.BLACK,
                    width: wp(24),
                    textAlign: 'right',
                  }}>
                  {destinationDistance}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: wp(5),
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontWeight: '400',
                    fontSize: fontsizes.px_22,
                    fontFamily: fonts.REGULAR,
                    color: colors.BLACK,
                    textAlign: 'left',
                  }}>
                  Estimate time of travel
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontWeight: '400',
                    fontSize: fontsizes.px_22,
                    fontFamily: fonts.REGULAR,
                    color: colors.BLACK,
                    width: wp(24),
                    textAlign: 'right',
                  }}>
                  {destinationTime}
                </Text>
              </View>
            </View>
          ) : null}
          <MapView
            style={styles.map}
            provider="google"
            ref={mapRef}
            minZoomLevel={13}
            maxZoomLevel={20}
            // onPress={event => {
            //   setRegion({
            //     latitude: event.nativeEvent.coordinate.latitude,
            //     longitude: event.nativeEvent.coordinate.longitude,
            //     latitudeDelta: 0.0922,
            //     longitudeDelta: 0.0421,
            //   });
            //   getDistanceMatrix(region, ridePhase1).then(distanceMatrix => {
            //     setDestinationDistance(distanceMatrix);
            //     console.log('ride conneted', distanceMatrix);
            //     // shareLiveLocation(liveLocation.latitude, liveLocation.longitude);
            //     // getDistanceMatrix(pickUp_location, dropOff_location).then(
            //     //   distanceMatrix => {
            //     //     setUserDropOff(distanceMatrix);

            //     //   },
            //     // );
            //     shareLiveLocation(
            //       event.nativeEvent.coordinate.latitude,
            //       event.nativeEvent.coordinate.longitude,
            //     );
            //   });
            // }}
            region={region}>
            <Marker
              coordinate={{
                latitude: region?.latitude,
                longitude: region?.longitude,
              }}>
              <Image
                source={images.AMBULANCE_MARKER}
                resizeMode="center"
                style={{
                  height: hp(2.5),
                  width: wp(5),
                  // backgroundColor:"red"
                }}
              />
            </Marker>
            {rideConnected ? (
              <>
                <MapViewDirections
                  origin={{
                    latitude: region?.latitude,
                    longitude: region?.longitude,
                  }}
                  destination={{
                    latitude: startPhaseTwo
                      ? ridePhase2.latitude
                      : ridePhase1.latitude,
                    longitude: startPhaseTwo
                      ? ridePhase2.longitude
                      : ridePhase1.longitude,
                  }}
                  apikey={GOOGLE_MAPS_APIKEY}
                  strokeWidth={3}
                  strokeColor={colors.BLACK}
                />
                <Marker
                  coordinate={{
                    latitude: startPhaseTwo
                      ? ridePhase2.latitude
                      : ridePhase1?.latitude,
                    longitude: startPhaseTwo
                      ? ridePhase2.longitude
                      : ridePhase1?.longitude,
                  }}>
                  <Image
                    source={icons.END_POINT}
                    resizeMode="center"
                    style={{
                      height: hp(2.5),
                      width: wp(5),
                    }}
                  />
                </Marker>
              </>
            ) : null}
          </MapView>
          {startRideButton ? (
            <TouchableOpacity
              onPress={handleRidePhase2}
              style={{
                position: 'absolute',
                left: wp(5),
                bottom: hp(2),
                height: wp(15),
                width: wp(50),
                borderRadius: wp(2),
                backgroundColor: colors.BLUE,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontWeight: '400',
                  fontSize: fontsizes.px_18,
                  fontFamily: fonts.REGULAR,
                  color: colors.WHITE,
                  // width: wp(24),
                  textAlign: 'center',
                }}>
                Start Ride!
              </Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            onPress={handleShowUserLocation}
            style={{
              position: 'absolute',
              right: wp(5),
              bottom: hp(3),
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
          {alertVisible !== null && (
            <CustomAlert
              name={userName}
              number={userContact}
              pickup={destinationDistance}
              dropoff={userDropOff}
              visible={alertVisible}
              confirmButton={onConfirmRide}
              cancelButton={onCancelRide}
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
          {/* 
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
          </TouchableOpacity> */}
        </>
      )}
    </SafeAreaView>
  );
};

export default DriverMap;
