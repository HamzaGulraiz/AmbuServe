///////////////////////////////////////driversmap/////////////////////////////////////////////////
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Image, Text, SafeAreaView, View, TouchableOpacity} from 'react-native';
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
import MapViewDirections from 'react-native-maps-directions';
import io from 'socket.io-client';
import getDistanceMatrix from '../../../DistanceMatrix/DistanceMatrix';
import CustomScreenLoading from '../../../components/ScreenLoading/ScreenLoading';
import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import getInitialMatrix from '../../../DistanceMatrix/initialMatrix';
import {useTypedSelector} from '../../../redux/Store';
import {useDispatch} from 'react-redux';
import {
  getCurrentLocation,
  watchPosition,
} from '../../../components/Location/GeoLocation';
import useSocket from '../../../components/Socket/Socket';
import {setData, getData, removeData} from '../../../asyncStorage/AsyncStorage';

const DriverMap = () => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const GOOGLE_MAPS_APIKEY = GOOGLE_API_KEY;
  const navigation = useNavigation();
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

  // const [companyName, setCompanyName] = useState('');
  // const [vehicleNumber, setVehicleNumber] = useState('');
  // const [driverName, setDriverName] = useState('');
  // const [companyEmail, setCompanyEmail] = useState('');
  // const [driverContact, setDriverContact] = useState('');
  // const [officeAddress, setOfficeAddress] = useState('');

  // useEffect(() => {
  //   console.log('1');
  //   const fetchData = async () => {
  //     try {
  //       const driverInfo = await getData({storageKey: 'DRIVER_INFO'});
  //       if (driverInfo === null) {
  //         console.log('Drivers Map: No driver info');
  //       } else {
  //         const driverData = JSON.parse(driverInfo);
  //         console.log(driverData);
  //         console.log(typeof driverData);
  //         // setCompanyName(driverData.company_name);
  //         // setVehicleNumber(driverData.vehicle_number);
  //         // setDriverContact(driverData.driver_contact);
  //         // setDriverName(driverData.driver_name);
  //         // console.log('Drivers Map: saving results');
  //         // requestLocationPermission();
  //       }
  //     } catch (e) {
  //       console.log('Index.js: drivers async catch', e);
  //     }
  //     fetchData();
  //   };
  // }, [isFocused]);

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
  const [manualLocation, setManualLocation] = useState(false);
  const [userToken, setUserToken] = useState('');
  // const [socket, setSocket] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [startRideButton, setStartRideButton] = useState(false);

  const [startPhaseOne, setStartPhaseOne] = useState(false);
  const [startPhaseTwo, setStartPhaseTwo] = useState(false);
  const [rideConnected, setRideConnected] = useState(false);

  // console.log('render', rideConnected, startPhaseOne);
  // useEffect(() => {
  //   console.log('rideConnected:', rideConnected);
  //   console.log('startPhaseOne:', startPhaseOne);
  //   console.log('startPhaseTwo:', startPhaseTwo);
  // }, [rideConnected, startPhaseOne, startPhaseTwo]);

  const socket = useSocket(WEB_SOCKET);

  // useEffect(() => {
  //   // Connect to the server as a driver
  //   const driverSocket = io(WEB_SOCKET, {transports: ['websocket']});
  //   driverSocket.emit('identify', {type: 'driver', driverId: driverSocket.id});
  //   setSocket(driverSocket);
  //   // Clean up on unmount
  //   return () => {
  //     if (driverSocket) {
  //       driverSocket.disconnect();
  //     }
  //   };
  // }, []);

  useEffect(() => {
    // When the driver receives a new request

    if (socket) {
      socket?.on('new_request', request => {
        const receivedMessage = JSON.parse(request);
        const {pickUp_location, dropOff_location} = receivedMessage;
        if (pickUp_location && dropOff_location) {
          setRidePhase1(pickUp_location);
          setRidePhase2(dropOff_location);
          getInitialMatrix(region, pickUp_location).then(distanceMatrix => {
            setDestinationDistance(distanceMatrix.distance);
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
    }
  }, [socket]);

  useEffect(() => {
    if (isFocused) {
      // console.log(rideConnected, 'isFocused');
      getCurrentLocation().then(currentLocation => {
        setRegion(prevRegion => ({
          ...prevRegion,
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        }));
        console.log('set user on bind ', currentLocation);
      });
    }
  }, [isFocused]);

  useEffect(() => {
    const watchId = watchPosition(position => {
      // Handle position updates
      setRegion(prevRegion => ({
        ...prevRegion,
        latitude: position.latitude,
        longitude: position.longitude,
      }));
      setIsLoadingLocation(true);
      // handleLocationChange(position);
    });

    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, []);

  useEffect(() => {
    console.log('1');
    const watchId = watchPosition(position => {
      // Handle position updates
      if (startPhaseOne) {
        handleLocationChangePhaseOne(position);
      }
    });

    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, [startPhaseOne]);

  useEffect(() => {
    console.log('3');
    const watchId = watchPosition(position => {
      // Handle position updates
      if (startPhaseTwo) {
        handleLocationChangePhaseTwo(position);
      }
    });

    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, [startPhaseTwo]);

  // const requestLocationPermission = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //       {
  //         title: 'Ambuserve Camera Permission',
  //         message:
  //           'Ambuserve needs access to your location ' +
  //           'so you can take awesome rides.',
  //         buttonNeutral: 'Ask Me Later',
  //         buttonNegative: 'Cancel',
  //         buttonPositive: 'OK',
  //       },
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       setLocationOnMapOnFocus();
  //     } else {
  //       setManualLocation(true);
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // };

  // const setLocationOnMapOnFocus = async () => {
  //   try {
  //     Geolocation.getCurrentPosition(
  //       position => {
  //         const {latitude, longitude} = position.coords;
  //         setRegion(prevRegion => ({
  //           ...prevRegion,
  //           latitude: latitude,
  //           longitude: longitude,
  //         }));
  //         setIsLoadingLocation(true);
  //       },
  //       error => {
  //         console.error(`Error getting current location: ${error.message}`);
  //         setIsLoadingLocation(true);
  //       },
  //       {
  //         enableHighAccuracy: true,
  //         timeout: 10000,
  //         maximumAge: 1000,
  //       },
  //     );
  //   } catch (error) {
  //     setIsLoadingLocation(true);
  //     console.error('Error fetching current location:', error);
  //   }
  // };

  // useEffect(() => {
  //   const watchId = Geolocation.watchPosition(
  //     position => {
  //       const {latitude, longitude} = position.coords;
  //       setRegion(prevRegion => ({
  //         ...prevRegion,
  //         latitude: latitude,
  //         longitude: longitude,
  //       }));
  //       setIsLoadingLocation(true);
  //       // console.log(rideConnected, '========>??');
  //       // if (rideConnected === true) {
  //       // handleLocationChange(position);
  //       // }
  //     },
  //     error => {
  //       console.error(`Error getting current location: ${error.message}`);
  //       setIsLoadingLocation(true);
  //     },
  //     {
  //       enableHighAccuracy: true,
  //       interval: 4000,
  //       distanceFilter: 2,
  //       forceRequestLocation: true,
  //     },
  //   );
  //   return () => {
  //     Geolocation.clearWatch(watchId);
  //   };
  // }, []);
  ///////////////////////on ride connection/////////////////////////
  const handleLocationChangePhaseOne = async position => {
    const {latitude, longitude} = position;
    console.log(
      'handle loation sharing ====.',
      latitude,
      longitude,
      rideConnected,
      startPhaseOne,
    );
    getDistanceMatrix(position, ridePhase1, 'phaseOne').then(distanceMatrix => {
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
      // setStartRideButton(distanceMatrix.phaseTwo);
    });
  };

  const handleLocationChangePhaseTwo = async position => {
    const {latitude, longitude} = position;
    console.log(
      'handle loation sharing ====.',
      latitude,
      longitude,
      rideConnected,
      startPhaseTwo,
    );

    getDistanceMatrix(position, ridePhase2, 'phaseTwo').then(distanceMatrix => {
      setDestinationDistance(distanceMatrix.distance);
      setDestinationTime(distanceMatrix.duration);
      shareLiveLocation(
        latitude,
        longitude,
        distanceMatrix.distance,
        distanceMatrix.duration,
        distanceMatrix.message,
      );
    });
  };
  const onConfirmRide = () => {
    // Set the necessary states first
    setRideConnected(true);
    setStartPhaseOne(true);
    setUserDetailCard(true);
    setStartRideButton(true);

    // Now, send the location and hide the alert
    sendLocationOnRideConnected();
    setAlertVisible(false);
  };

  const sendLocationOnRideConnected = () => {
    getCurrentLocation().then(currentLocation => {
      const {latitude, longitude} = currentLocation;
      getDistanceMatrix(region, ridePhase1, 'phaseOne').then(distanceMatrix => {
        setDestinationDistance(distanceMatrix.distance);
        setDestinationTime(distanceMatrix.duration);
        shareLiveLocation(
          latitude,
          longitude,
          distanceMatrix.distance,
          distanceMatrix.duration,
          distanceMatrix.message,
        );
      });
      console.log('send on connect', currentLocation);
    });
  };
  // const sendLocationOnRideConnected = async () => {
  //   try {
  //     Geolocation.getCurrentPosition(
  //       position => {
  //         const {latitude, longitude} = position.coords;

  //         getDistanceMatrix(region, ridePhase1, 'phaseOne').then(
  //           distanceMatrix => {
  //             setDestinationDistance(distanceMatrix.distance);
  //             setDestinationTime(distanceMatrix.duration);
  //             shareLiveLocation(
  //               latitude,
  //               longitude,
  //               distanceMatrix.distance,
  //               distanceMatrix.duration,
  //               distanceMatrix.message,
  //             );
  //           },
  //         );
  //       },
  //       error => {
  //         console.error(`Error getting current location: ${error.message}`);
  //       },
  //       {enableHighAccuracy: true, timeout: 10000, maximumAge: 1000},
  //     );
  //   } catch (error) {
  //     console.error('Error fetching current location:', error);
  //   }
  // };

  const onCancelRide = () => {
    setAlertVisible(false);
    socket?.emit('cancel_request', 'canceled');
  };

  const handleRidePhase2 = () => {
    // console.log('Phase 2');
    setStartPhaseOne(false);
    setStartPhaseTwo(true);
    setRideConnected(true);
    setStartRideButton(false);
  };

  const shareLiveLocation = (lat, long, distance, duration, message) => {
    console.log('message:', message);

    const userReqConnect = {
      type: 'driver',
      driver_name: driver_name,
      contact: driver_contact,
      currentLocation: {latitude: lat, longitude: long},
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
            // minZoomLevel={13}
            // maxZoomLevel={20}
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
            {rideConnected === true ? (
              <>
                <MapViewDirections
                  origin={{
                    latitude: region?.latitude,
                    longitude: region?.longitude,
                  }}
                  destination={{
                    latitude: ridePhase1.latitude,
                    longitude: ridePhase1.longitude,
                  }}
                  apikey={GOOGLE_MAPS_APIKEY}
                  strokeWidth={3}
                  strokeColor={colors.BLACK}
                />
                <Marker
                  coordinate={{
                    latitude: ridePhase1?.latitude,
                    longitude: ridePhase1?.longitude,
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
          {startRideButton === true ? (
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
  );
};

export default DriverMap;
