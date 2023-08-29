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
import {BASE_URL, GOOGLE_API_KEY, WEB_SOCKET} from '../../../../config';
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
import CustomButton from '../../../components/Button/Button';
import axios from 'axios';

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

  const [rideType, setRideType] = useState('normal');

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
    latitude: 24.8607,
    longitude: 67.0011,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [alertVisible, setAlertVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userContact, setUserContact] = useState('');
  const [userEmergencyContact, setUserEmergencyContact] = useState('');
  const [userCNIC, setUserCNIC] = useState('');
  const [destinationDistance, setDestinationDistance] = useState();
  const [destinationTime, setDestinationTime] = useState();
  const [userDropOff, setUserDropOff] = useState();
  const [totalDistance, setTotalDistance] = useState();
  const [totaltime, setTotalTime] = useState();
  const [ridePhase1, setRidePhase1] = useState({latitude: 0, longitude: 0});
  const [ridePhase2, setRidePhase2] = useState({latitude: 0, longitude: 0});
  const [userDetailCard, setUserDetailCard] = useState(false);
  const [manualLocation, setManualLocation] = useState(false);
  const [userToken, setUserToken] = useState('');
  // const [socket, setSocket] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [startRideButton, setStartRideButton] = useState(false);
  const [rideCompleteButton, setRideCompleteButton] = useState(false);

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
          getCurrentLocation().then(currentLocation => {
            let userCurrentLocation = {
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            };
            getInitialMatrix(
              userCurrentLocation,
              pickUp_location,
              'phaseOne',
            ).then(distanceMatrix => {
              setDestinationDistance(distanceMatrix.distance);
              setDestinationTime(distanceMatrix.duration);
              getInitialMatrix(
                pickUp_location,
                dropOff_location,
                'phaseTwo',
              ).then(distanceMatrix => {
                setTotalDistance(destinationDistance + distanceMatrix.distance);
                setTotalTime(destinationTime + distanceMatrix.duration);
                setUserDropOff(distanceMatrix.distance);
                setUserName(receivedMessage.full_name);
                setUserEmail(receivedMessage.email);
                setUserContact(receivedMessage.contact);
                setUserEmergencyContact(receivedMessage.emergency_contact);
                setUserCNIC(receivedMessage.cnic);
                setUserToken(receivedMessage.token);
                setAlertVisible(true);
              });
            });
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

  ///////////////////////on ride connection/////////////////////////
  const handleLocationChangePhaseOne = async position => {
    const {latitude, longitude} = position;
    console.log(
      'handle loation sharing one ====.',
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
        distanceMatrix.title,
        distanceMatrix.message,
        distanceMatrix.route,
        ridePhase1,
        // distanceMatrix.rideCompleted,
      );
      // setStartRideButton(distanceMatrix.phaseTwo);
    });
  };

  const [rideCompleted, setRideCompleted] = useState(false);
  const handleLocationChangePhaseTwo = async position => {
    const {latitude, longitude} = position;
    console.log(
      'handle loation sharing two ====.',
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
        distanceMatrix.title,
        distanceMatrix.message,
        distanceMatrix.route,
        ridePhase2,
        // distanceMatrix.rideCompleted,
      );
      // setRideCompleted(distanceMatrix.rideCompleted);
    });
  };

  const onConfirmRide = () => {
    setRideConnected(true);
    setStartPhaseOne(true);
    setUserDetailCard(true);
    setStartRideButton(true);
    sendLocationOnRideConnected();
    setAlertVisible(false);
  };

  const sendLocationOnRideConnected = () => {
    getCurrentLocation().then(currentLocation => {
      const {latitude, longitude} = currentLocation;
      getDistanceMatrix(currentLocation, ridePhase1, 'phaseOne').then(
        distanceMatrix => {
          setDestinationDistance(distanceMatrix.distance);
          setDestinationTime(distanceMatrix.duration);
          shareLiveLocation(
            latitude,
            longitude,
            distanceMatrix.distance,
            distanceMatrix.duration,
            distanceMatrix.title,
            distanceMatrix.message,
            distanceMatrix.route,
            ridePhase1,
            // distanceMatrix.rideCompleted,
          );
        },
      );
      console.log('send on connect', currentLocation);
    });
  };

  const onCancelRide = () => {
    setAlertVisible(false);
    socket?.emit('cancel_request', 'canceled');
  };

  const handleRidePhase2 = () => {
    // console.log('Phase 2');
    sendLocationOnStartRide();
    setStartPhaseOne(false);
    setStartPhaseTwo(true);
    setRideConnected(true);
    setStartRideButton(false);
    setRideCompleteButton(true);
  };

  const sendLocationOnStartRide = () => {
    getCurrentLocation().then(currentLocation => {
      const {latitude, longitude} = currentLocation;
      getDistanceMatrix(currentLocation, ridePhase2, 'phaseTwo').then(
        distanceMatrix => {
          setDestinationDistance(distanceMatrix.distance);
          setDestinationTime(distanceMatrix.duration);
          shareLiveLocation(
            latitude,
            longitude,
            distanceMatrix.distance,
            distanceMatrix.duration,
            distanceMatrix.title,
            distanceMatrix.message,
            distanceMatrix.route,
            ridePhase2,
            // distanceMatrix.rideCompleted,
          );
        },
      );
      // console.log('start ridee', currentLocation);
    });
  };

  const shareLiveLocation = (
    lat,
    long,
    distance,
    duration,
    title,
    message,
    route,
    forZoom,
    // rideCompleted,
  ) => {
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
      title: title,
      message: message,
      status: 'active',
      route: route,
      zoom: forZoom,
      // rideCompleted: rideCompleted,
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

  const handleRideCompleted = () => {
    setRideCompleted(false);
    setRidePhase1({latitude: 0, longitude: 0});
    setRidePhase2({latitude: 0, longitude: 0});
    setDestinationDistance(null);
    setDestinationTime(null);
    setUserDropOff(null);
    setUserName('');
    setUserContact('');
    setUserToken('');
    socket?.disconnect();
  };

  const handleRideCompletedButtonClick = () => {
    socket?.emit('ride_completed', 'completed');

    /////////////////////////////////api////////////////////////////////
    handleDriversHistory(
      driver_contact,
      driver_name,
      company_email,
      company_name,
      vehicle_number,
      office_address,
      rideType,
      userName,
      userEmail,
      userContact,
      userEmergencyContact,
      userCNIC,
      ridePhase1,
      ridePhase2,
      totalDistance,
      totaltime,
    );
    // handleDriversHistory(
    //   driver_contact,
    //   driver_name,
    //   company_email,
    //   company_name,
    //   vehicle_number,
    //   office_address,
    //   rideType,
    //   userName,
    //   userEmail,
    //   userContact,
    //   userEmergencyContact,
    //   userCNIC,
    //   ridePhase1,
    //   ridePhase2,
    //   totalDistance,
    //   totaltime,
    // );
    // socket?.on('disconnect', () => {
    //   console.log(' driver socket id after disconnect', socket.id); // undefined
    // });
  };

  const handleDriversHistory = (
    driver_contact,
    driver_name,
    company_email,
    company_name,
    vehicle_number,
    office_address,
    rideType,
    userName,
    userEmail,
    userContact,
    userEmergencyContact,
    userCNIC,
    ridePhase1,
    ridePhase2,
    totalDistance,
    totaltime,
  ) => {
    const data = JSON.stringify({
      driver_contact: driver_contact,
      driver_name: driver_name,
      company_email: company_email,
      company_name: company_name,
      vehicle_number: vehicle_number,
      office_address: office_address,
      type: rideType,
      full_name: userName,
      email: userEmail,
      contact: userContact,
      emergency_contact: userEmergencyContact,
      cnic: userCNIC,
      pickUp_location: ridePhase1,
      dropOff_location: ridePhase2,
      distance_covered: totalDistance,
      total_time: totaltime,
    });
    // const data = JSON.stringify({
    //   driver_contact: 'driver_contact',
    //   driver_name: 'driver_name',
    //   company_email: 'company_email',
    //   company_name: 'company_name',
    //   vehicle_number: 'vehicle_number',
    //   office_address: 'office_address',
    //   type: 'rideType',
    //   full_name: 'userName',
    //   email: 'userEmail',
    //   contact: 'userContact',
    //   emergency_contact: 'userEmergencyContact',
    //   cnic: 'userCNIC',
    //   pickUp_location: 'ridePhase1',
    //   dropOff_location: 'ridePhase2',
    //   distance_covered: 'totalDistance',
    //   total_time: 'totaltime',
    // });
    console.log('data to send from api: ' + JSON.stringify(data));
    // let config = {
    //   method: 'post',
    //   maxBodyLength: Infinity,
    //   url: `${BASE_URL}/driver/activity`,
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   data: historyData,
    // };

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${BASE_URL}/driver/activity`,
      // url: 'http://192.168.100.21:8080/driver/activity',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios
      .request(config)
      .then(response => {
        console.log('response from new activity: ' + JSON.stringify(response));
        setRideCompleted(true);
        setRideCompleteButton(false);
        setStartPhaseOne(false);
        setStartPhaseTwo(false);
        setRideConnected(false);
        setUserDetailCard(false);
      })
      .catch(error => {
        setRideCompleted(true);
        setRideCompleteButton(false);
        setStartPhaseOne(false);
        setStartPhaseTwo(false);
        setRideConnected(false);
        setUserDetailCard(false);

        console.log('activity api: ', error);
      });
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
                source={images.AMBULANCE_MARKER}
                resizeMode="contain"
                style={{
                  height: '100%',
                  width: '100%',
                  // backgroundColor: 'red',
                }}
              />
            </Marker>
            {rideConnected === true && startPhaseOne === true ? (
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
                    latitude: ridePhase1.latitude,
                    longitude: ridePhase1.longitude,
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
            ) : null}
            {rideConnected === true && startPhaseTwo === true ? (
              <>
                <MapViewDirections
                  origin={{
                    latitude: region?.latitude,
                    longitude: region?.longitude,
                  }}
                  destination={{
                    latitude: ridePhase2.latitude,
                    longitude: ridePhase2.longitude,
                  }}
                  apikey={GOOGLE_MAPS_APIKEY}
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
                    latitude: ridePhase2.latitude,
                    longitude: ridePhase2.longitude,
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
          {rideCompleteButton === true ? (
            <TouchableOpacity
              onPress={handleRideCompletedButtonClick}
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
                Finish Ride!
              </Text>
            </TouchableOpacity>
          ) : null}
          {rideCompleted === true ? (
            <View
              style={{
                marginTop: hp(20),
                marginHorizontal: wp(5),
                paddingHorizontal: wp(2),
                position: 'absolute',
                height: hp(50),
                width: wp(90),
                borderRadius: wp(5),
                borderWidth: wp(0.2),
                borderColor: colors.BLACK,
                zIndex: 1,
                backgroundColor: colors.WHITE,
                // justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={images.LOGO}
                resizeMode="contain"
                style={{
                  marginTop: hp(6),
                  height: hp(8),
                  width: wp(80),
                  // marginHorizontal: wp(5),
                  // backgroundColor: 'red',
                }}
              />
              <Text
                // numberOfLines={1}
                style={{
                  marginTop: hp(4),
                  fontWeight: '400',
                  fontSize: fontsizes.px_22,
                  fontFamily: fonts.SEMI_BOLD,
                  color: colors.BLACK,
                  textAlign: 'center',
                }}>
                Ride Successful
              </Text>
              <Text
                numberOfLines={4}
                style={{
                  marginTop: hp(2),
                  fontWeight: '400',
                  fontSize: fontsizes.px_22,
                  fontFamily: fonts.LIGHT,
                  color: colors.BLACK,
                  textAlign: 'center',
                }}>
                Thank you for completing your trip. company will transfer your
                payment to your account
              </Text>
              <CustomButton
                title="Done"
                textColor={colors.WHITE}
                backgroundColor={colors.BLUE}
                marginTop={hp(4)}
                height={hp(6)}
                width={wp(80)}
                borderRadius={wp(2)}
                // marginHorizontal={wp(5)}
                onPress={handleRideCompleted}
              />
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
