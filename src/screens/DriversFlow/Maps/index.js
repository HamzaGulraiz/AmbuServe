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
import {Double} from 'react-native/Libraries/Types/CodegenTypes';
import colors from '../../../../assets/colors/colors';
import CustomAlert from '../../../components/Alert/Alert';
import {GOOGLE_API_KEY, WEB_SOCKET} from '../../../../config';
import useLiveLocation, {
  Location,
} from '../../../components/CustomHooks/useLiveLocation';
import {useTypedSelector} from '../../../redux/Store';
import MapViewDirections from 'react-native-maps-directions';

const DriverMap = () => {
  const GOOGLE_MAPS_APIKEY = GOOGLE_API_KEY;
  const socketDriver = new WebSocket(WEB_SOCKET, 'driver');
  const navigation = useNavigation();
  const [liveLocation, isLoading] = useLiveLocation();
  const mapRef = useRef();
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
  const [region, setRegion] = useState(null);

  useEffect(() => {
    if (liveLocation?.latitude && liveLocation?.longitude) {
      setRegion({
        latitude: liveLocation.latitude,
        longitude: liveLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      if (rideConnected) {
        shareLiveLocation(liveLocation.latitude, liveLocation.longitude);
      }
    }
  }, [liveLocation]);

  const [alertVisible, setAlertVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [userContact, setUserContact] = useState('');
  const [userPickUp, setUserPickUp] = useState({latitude: 0, longitude: 0});
  const [userDropOff, setUserDropOff] = useState({latitude: 0, longitude: 0});

  const [userToken, setUserToken] = useState('');
  const [userInformation, setUserInformation] = useState('');

  const [rideConnected, setRideConnected] = useState(false);

  socketDriver.onmessage = e => {
    // a message was received
    console.log('message from socket node js in drivers maps ===>', e);

    const receivedMessage = JSON.parse(e.data);

    if (receivedMessage.type === 'user') {
      setUserName(receivedMessage.full_name);
      setUserContact(receivedMessage.contact);
      const {pickUp_location, dropOff_location} = receivedMessage;
      if (pickUp_location) {
        const {latitude, longitude} = pickUp_location.location;
        setUserPickUp({
          latitude: latitude,
          longitude: longitude,
        });
      }
      if (dropOff_location) {
        const {latitude, longitude} = dropOff_location.location;
        setUserDropOff({
          latitude: latitude,
          longitude: longitude,
        });
      }
      setUserToken(receivedMessage.token);
      setAlertVisible(true);
    }
    // console.log('====================>', receivedMessage);
  };

  const [userReqCancel, setUserReqCancel] = useState({
    type: 'driver',
    message: 'canceled',
    driver_name: '',
    contact: '',
    currentLocation: '',
    usertoken: userToken,
    status: 'canceled',
  });

  const onConfirmRide = () => {
    setAlertVisible(false);
    setRideConnected(true);
  };
  const onCancelRide = () => {
    setAlertVisible(false);
    const data = JSON.stringify(userReqCancel);
    socketDriver.send(data);
    socketDriver.close();
  };

  const [userReqConnect, setUserReqConnect] = useState({});

  const shareLiveLocation = (lat, long) => {
    setUserReqConnect({
      type: 'driver',
      message: 'active',
      driver_name: driver_name,
      contact: driver_contact,
      currentLocation: {
        latitude: lat,
        longitude: long,
      },
      usertoken: userToken,
      status: 'active',
    });

    const data = JSON.stringify(userReqConnect);
    console.log('ride accepted=========>', data);
    socketDriver.send(data);
  };

  const handleShowUserLocation = () => {
    mapRef.current.animateToRegion(region, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      {region != null ? (
        <>
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
            region={region}>
            <Marker
              coordinate={{
                latitude: region.latitude,
                longitude: region.longitude,
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
                    latitude: region.latitude,
                    longitude: region.longitude,
                  }}
                  destination={{
                    latitude: userPickUp.latitude,
                    longitude: userPickUp.longitude,
                  }}
                  apikey={GOOGLE_MAPS_APIKEY}
                  strokeWidth={3}
                  strokeColor={colors.BLACK}
                />
                <Marker
                  coordinate={{
                    latitude: userPickUp?.latitude,
                    longitude: userPickUp?.longitude,
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
          {/* {rideConnected ? (
            <View
              // onPress={handleShowUserLocation}
              style={{
                position: 'absolute',
                left: wp(2),
                bottom: hp(1),
                width: wp(80),
                height: hp(10),
                borderRadius: hp(3),
                borderWidth: wp(0.5),
                backgroundColor: colors.TRANSPARENT,
                borderColor: colors.BLACK,
                // padding: wp(8),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={styles.labelContaier}>
                <Text style={styles.title}>{userName}</Text>
                <Text numberOfLines={1} style={styles.text}>
                  {userContact}
                </Text>
              </View>

              <View style={styles.labelContaier}>
                <Text style={styles.title}>{userPickUp}</Text>
                <Text numberOfLines={1} style={styles.text}>
                  {userDropOff}
                </Text>
              </View>
            </View>
          ) : null} */}
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
              // pickup={userPickUp}
              // dropoff={userDropOff}
              visible={alertVisible}
              onPressClose={() => {
                setAlertVisible(false);
              }}
              confirmButton={onConfirmRide}
              cancelButton={onCancelRide}
            />
          )}
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
