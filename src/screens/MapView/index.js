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

import {
  // GooglePlaceData,
  GooglePlacesAutocomplete,
} from 'react-native-google-places-autocomplete';
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

import CustomScreenLoading from '../../components/ScreenLoading/ScreenLoading';
import MapViewDirections from 'react-native-maps-directions';
import {useFocusEffect} from '@react-navigation/native';
import fontsizes from '../../../assets/fontsizes/fontsizes';
import fonts from '../../../assets/fonts/fonts';
import getDistanceMatrix from '../../DistanceMatrix/DistanceMatrix';
import io from 'socket.io-client';
import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid} from 'react-native';

import {useIsFocused} from '@react-navigation/native';
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
  const [userInfoForRide, setUserInfoForRide] = useState({});
  const [route, setRoute] = useState(null);
  const [driverRoute, setDriverRoute] = useState(false);
  const [requestPhase, setRequestPhase] = useState(true);
  const [driverAcceptPhase, setDriverAcceptPhase] = useState(false);

  const [screenLoading, setScreenLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [ambulanceMessage, setAmbulanceMessage] = useState('......');

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
    socket?.on('driver_response', response => {
      console.log('Received driver response:', response);
      const driverData = JSON.parse(response);
      // const distanceValue = parseFloat(driverData.distance_Matrix.distance); // Parse float
      // const distanceInKm = distanceValue;

      setDriversInformation(prevDriversInfo => ({
        ...prevDriversInfo,
        ...driverData,
      }));
      if (driverData.currentLocation) {
        ////////////////////////// check this
        setScreenLoading(false);
        setRequestPhase(false);
        setDriverRoute(true);
        setDriverAcceptPhase(true);
        // notification(distanceInKm);
      }
    });
  }, [socket]);

  // const notification = distance => {
  //   console.log('Distance in integer:', distance);
  //   if (distance > 1) {
  //     setAmbulanceMessage('You ambulance is on the way ');
  //   } else if (distance < 1 && distance > 0.5) {
  //     setAmbulanceMessage('Get Ready..');
  //   } else if (distance < 0.5) {
  //     setAmbulanceMessage('Ambulance is here');
  //   }
  // };

  const sendRequest = request => {
    console.log('data sending ======>>>>', request);
    socket?.emit('user_request', request);
  };

  const [distanceData, setDistanceData] = useState(null);

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
      Geolocation.watchPosition(
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
          interval: 2000,
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
  }, []);

  const getCurrentPositionOnFocus = async () => {
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
          maximumAge: 1000,
          // interval: 3000,
          // distanceFilter: 3,
          // forceRequestLocation: true,
        },
      );
    } catch (error) {
      console.error('Error fetching current location:', error);
      setIsLoadingLocation(true);
    }
  };

  useEffect(() => {
    if (isFocused) {
      getCurrentPositionOnFocus();
    }
  }, [isFocused]);

  const handleShowUserLocation = () => {
    mapRef.current.animateToRegion(region, 1000);
  };

  useEffect(() => {
    // Check if both originPlace and destinationPlace are not null
    if (originPlace && destinationPlace) {
      setRoute(true);
    }
  }, [originPlace, destinationPlace]);

  const cancelRideHandle = () => {};

  const handleOriginPlaceChange = location => {
    // console.log('Setting origin place:', location);
    setOriginPlace(location);
  };
  const handleDestinationPlaceChange = location => {
    // console.log('Setting origin place:', location);
    setDestinationPlace(location);
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
                    {driversInformation?.distance}
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
                    {driversInformation?.duration}
                  </Text>
                </View>
              </View>
            ) : null}
            {requestPhase ? (
              <>
                <View style={styles.searchBarFrom}>
                  <GooglePlacesAutocomplete
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
              minZoomLevel={14}
              maxZoomLevel={18}
              region={region}>
              <Marker
                coordinate={{
                  latitude: region?.latitude,
                  longitude: region?.longitude,
                }}>
                <Image
                  source={icons.PERSON}
                  resizeMode="center"
                  style={{
                    height: hp(2.5),
                    width: wp(5),
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
                      latitude: originPlace?.location?.latitude,
                      longitude: originPlace?.location?.longitude,
                    }}>
                    <Image
                      source={icons.START_POINT}
                      resizeMode="center"
                      style={{
                        height: hp(2.5),
                        width: wp(5),
                      }}
                    />
                  </Marker>
                  <Marker
                    coordinate={{
                      latitude: destinationPlace?.location?.latitude,
                      longitude: destinationPlace?.location?.longitude,
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
              {driverRoute ? (
                <>
                  <MapViewDirections
                    origin={driversInformation?.currentLocation}
                    destination={originPlace?.location}
                    apikey={MY_KEY}
                    strokeWidth={3}
                    strokeColor={colors.BLACK}
                  />
                  <Marker
                    coordinate={{
                      latitude: driversInformation?.currentLocation.latitude,
                      longitude: driversInformation?.currentLocation.longitude,
                    }}>
                    <Image
                      source={images.AMBULANCE_MARKER}
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
            {driverAcceptPhase ? (
              <View
                style={{
                  // marginTop: hp(2),
                  marginHorizontal: wp(5),
                  position: 'absolute',
                  height: hp(25),
                  width: wp(90),
                  borderRadius: wp(5),
                  borderWidth: wp(0.2),
                  borderColor: colors.BLACK,
                  zIndex: 1,
                  bottom: hp(2),
                  backgroundColor: colors.WHITE,
                  // justifyContent: 'center',
                }}>
                <View
                  style={{
                    marginTop: hp(2),
                    marginBottom: hp(2),
                    height: hp(4),
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
                    {driversInformation?.message}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: wp(2),
                    height: hp(11),
                    borderRadius: wp(2),
                    backgroundColor: '#f2f2f2',
                    // justifyContent: 'center',
                    alignItems: 'center',

                    // justifyContent:'space-between',
                    // alignItems: 'center',
                  }}>
                  <Image
                    source={images.DEFAULT_USER}
                    resizeMode="contain"
                    style={{
                      // backgroundColor: 'green',
                      marginLeft: wp(1),
                      height: hp(8),
                      width: wp(15),
                      // borderRadius: wp(10),
                      // marginRight: wp(5),
                    }}
                  />
                  <View>
                    <Text
                      numberOfLines={1}
                      style={{
                        marginLeft: wp(2),
                        // marg/inTop: hp(1),
                        fontFamily: fonts.REGULAR,
                        fontSize: fontsizes.px_22,
                        color: colors.BLACK,
                        fontWeight: '400',
                        width: wp(32),
                        // backgroundColor: 'pink',
                        // textAlign: 'left',
                      }}>
                      {driversInformation?.driver_name}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        marginLeft: wp(2),
                        // marginTop: hp(1),
                        fontFamily: fonts.REGULAR,
                        fontSize: fontsizes.px_22,
                        color: colors.BLACK,
                        fontWeight: '400',
                        width: wp(32),
                        // backgroundColor: 'pink',
                        // textAlign: 'left',
                      }}>
                      {driversInformation?.vehicle_number}
                    </Text>
                  </View>
                  <View>
                    <Text
                      numberOfLines={1}
                      style={{
                        width: wp(32),
                        // backgroundColor: 'pink',
                        marginLeft: wp(2),
                        // marginTop: hp(1),
                        fontFamily: fonts.REGULAR,
                        fontSize: fontsizes.px_22,
                        color: colors.BLACK,
                        fontWeight: '400',
                        // textAlign: 'left',
                      }}>
                      {driversInformation?.contact}
                    </Text>

                    <Text
                      numberOfLines={1}
                      style={{
                        width: wp(32),
                        // backgroundColor: 'pink',
                        marginLeft: wp(2),
                        // marginTop: hp(1),
                        fontFamily: fonts.REGULAR,
                        fontSize: fontsizes.px_22,
                        color: colors.BLACK,
                        fontWeight: '400',
                        // textAlign: 'left',
                      }}>
                      4.5
                    </Text>
                  </View>
                </View>
                {/* <TouchableOpacity
                  onPress={cancelRideHandle}
                  style={{
                    width: wp(80),
                    height: hp(4),
                    marginHorizontal: wp(2),
                    justifyContent: 'center',
                    alignItems: 'center',
                    // backgroundColor: 'red',
                    // marginLeft: wp(2),
                    marginTop: hp(1),
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      // width: wp(32),
                      // backgroundColor: 'pink',
                      marginLeft: wp(2),
                      // marginTop: hp(1),
                      fontFamily: fonts.REGULAR,
                      fontSize: fontsizes.px_22,
                      color: colors.RED,
                      fontWeight: '400',
                      textAlign: 'center',
                    }}>
                    Cancel ride
                  </Text>
                </TouchableOpacity> */}
              </View>
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

      {screenLoading === true ? (
        <CustomScreenLoading visible={screenLoading} />
      ) : null}
    </>
  );
};

export default Maps;
