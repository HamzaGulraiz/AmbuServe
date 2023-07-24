import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import React, {useState, useEffect} from 'react';
import {Text, View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useTypedSelector} from '../../redux/Store';
import icons from '../../../assets/icons/icons';
import colors from '../../../assets/colors/colors';
import fonts from '../../../assets/fonts/fonts';
import fontsizes from '../../../assets/fontsizes/fontsizes';
import {
  DRIVER_Activity,
  DRIVER_MAP,
  DRIVER_Profile,
} from '../../constants/Navigator';
import DriverMap from '../../screens/DriversFlow/Maps';
import Activity from '../../screens/DriversFlow/Activity';
import Profile from '../../screens/DriversFlow/Profile';
import CustomAlert from '../../components/Alert/Alert';
import {getData, removeData} from '../../asyncStorage/AsyncStorage';
import {
  Database,
  child,
  push,
  ref,
  set,
  remove,
  onValue,
} from 'firebase/database';
import {db} from '../../components/firebase/config';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import {BASE_URL} from '../../../config';
// Import Socket.IO client library

const socketDriver = new WebSocket(
  'ws:https://ambu-serve.vercel.app',
  'driver',
);

// const driverIdentifier = 'driver456'; // Unique identifier for the driver
// const socketDriver = new WebSocket('ws://192.168.100.21:8080', 'driver', {
//   headers: {
//     'sec-websocket-protocol': driverIdentifier,
//   },
// });

const Tab = createBottomTabNavigator();

function MyBottomTabs() {
  const appState = useTypedSelector(state => state.app.appState);
  const [driversToken, setDriversToken] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [userContact, setUserContact] = useState('');
  const [userPickUp, setUserPickUp] = useState('');
  const [userDropOff, setUserDropOff] = useState('');
  const [userToken, setUserToken] = useState('');
  const [userInformation, setUserInformation] = useState('');

  // useEffect(() => {
  //   if (appState === 'active') {
  //     fetchData();
  //   } else if (appState === 'background') {
  //     // removeDriverFromDb();
  //   }
  // }, [appState]);

  // useEffect(() => {
  // fetchData();
  // }, []);

  useEffect(() => {
    socketDriver.onmessage = e => {
      // a message was received
      console.log('message from socket node js in drivers maps ===>', e);

      const receivedMessage = JSON.parse(e.data);

      if (receivedMessage.type === 'user') {
        // console.log('User name:', receivedMessage.full_name);
        // You can also access other fields of the received message here if needed
        // setUserInformation(receivedMessage);
        setUserName(receivedMessage.full_name);
        setUserContact(receivedMessage.contact);
        setUserPickUp(receivedMessage.pickup_location);
        setUserDropOff(receivedMessage.drop_location);
        setUserToken(receivedMessage.token);
        setAlertVisible(true);
      }
    };
  }, []);

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
  };
  const onCancelRide = () => {
    setAlertVisible(false);
    // setUserReqCancel(prevState => ({
    //   ...prevState,
    //   status: 'canceled', // Set the status to 'canceled' when the driver cancels the ride request
    // }));
    // console.log('canceled from driver');
    const data = JSON.stringify(userReqCancel);
    socketDriver.send(data);
  };

  const driveSockect = (responseObj: any) => {
    // console.log('drivers data for sockct =====> ', responseObj);
    // socketDriver.addEventListener('open', () => {
    //   console.log('Connected to WebSocket server');
    //   // Send a message to the server
    //   const data = JSON.stringify(responseObj);
    //   socketDriver.send(data);
    // });
    // socketDriver.onmessage = e => {
    //   // a message was received
    //   console.log('message from socket node js in user maps ===>', e.data);
    // };
  };

  const fetchData = async () => {
    try {
      const result = await getData({storageKey: 'DRIVER_INFO'});
      if (result === null) {
        console.log('no result on driver info  Screen from storage');
      } else {
        const responseObj = JSON.parse(result);
        // setVehicleNumber(responseObj.vehicle_number);
        // setDriversToken(responseObj.token);
        if (driversToken === '') {
          fetchData();
        } else {
          // createDriverOnFirebase(responseObj.vehicle_number);
          // driverStateApi(responseObj);
          // driveSockect(responseObj);
        }
      }
    } catch (error) {
      console.log('Error occurred at userinfo screen from storage', error);
    }
  };

  const createDriverOnFirebase = async (vehicleNumber: string) => {
    const starCountRef = ref(db, 'onlineDrivers/' + vehicleNumber);
    onValue(starCountRef, snapshot => {
      const data = snapshot.val();
      if (data != null) {
        console.log(
          'bottom tabs => user already exist in firebase : ',
          vehicleNumber,
        );
      } else {
        set(ref(db, 'onlineDrivers/' + vehicleNumber), {
          lat: 0,
          long: 0,
        })
          .then(() => {
            console.log(
              'bottom tab => user created on firebase',
              vehicleNumber,
            );
          })
          .catch(e => {
            console.log('bottom tab => error', e);
          });
      }
    });
  };

  const removeDriverFromDb = () => {
    setDriversToken('');
    setVehicleNumber('');
    // remove(ref(db, 'onlineDrivers/' + vehicleNumber));
    console.log('App state on drivers map ===>', appState);
    let config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: `${BASE_URL}/driver/delete/${driversToken}`,
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

  const driverStateApi = (responseObj: Object) => {
    // console.log("bottom tab => data sent to api mongodb :",responseObj);
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${BASE_URL}/driver/online`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: responseObj,
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

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            // backgroundColor: colors.DARK.BACKGROUND,
            // marginHorizontal: wp(4),
            // marginBottom: hp(2),
            // borderRadius: wp(5),
            // height: hp(8),
          },
        }}>
        <Tab.Screen
          name={DRIVER_MAP}
          component={DriverMap}
          options={{
            tabBarIcon: ({focused}) =>
              focused ? (
                <>
                  <Image
                    source={icons.MAP}
                    resizeMode="contain"
                    style={{
                      ...styles.tabIcon,
                      // tintColor: colors.DARK.LIGHT_BLUE_BUTTON,
                    }}
                  />
                </>
              ) : (
                <>
                  <Image
                    source={icons.MAP}
                    resizeMode="contain"
                    style={{
                      ...styles.tabIcon,
                      // tintColor: colors.DARK.GREY_BUTTON,
                    }}
                  />
                </>
              ),
          }}
        />
        <Tab.Screen
          name={DRIVER_Activity}
          component={Activity}
          options={{
            tabBarIcon: ({focused}) =>
              focused ? (
                <>
                  <Image
                    source={icons.ACTIVITY}
                    resizeMode="contain"
                    style={{
                      ...styles.tabIcon,
                      // tintColor: colors.DARK.LIGHT_BLUE_BUTTON,
                    }}
                  />
                </>
              ) : (
                <>
                  <Image
                    source={icons.ACTIVITY}
                    resizeMode="contain"
                    style={{
                      ...styles.tabIcon,
                      // tintColor: colors.DARK.GREY_BUTTON,
                    }}
                  />
                </>
              ),
          }}
        />
        <Tab.Screen
          name={DRIVER_Profile}
          component={Profile}
          options={{
            tabBarIcon: ({focused}) =>
              focused ? (
                <>
                  <Image
                    source={icons.PROFILE}
                    resizeMode="contain"
                    style={{
                      ...styles.tabIcon,
                      // tintColor: colors.DARK.LIGHT_BLUE_BUTTON,
                    }}
                  />
                </>
              ) : (
                <>
                  <Image
                    source={icons.PROFILE}
                    resizeMode="contain"
                    style={{
                      ...styles.tabIcon,
                      // tintColor: colors.DARK.GREY_BUTTON,
                    }}
                  />
                </>
              ),
          }}
        />
      </Tab.Navigator>
      {alertVisible !== null && (
        <CustomAlert
          name={userName}
          number={userContact}
          pickup={userPickUp}
          dropoff={userDropOff}
          visible={alertVisible}
          onPressClose={() => {
            setAlertVisible(false);
          }}
          confirmButton={onConfirmRide}
          cancelButton={onCancelRide}
        />
      )}
    </>
  );
}

export default MyBottomTabs;

const styles = StyleSheet.create({
  tabIcon: {
    width: wp(8.1),
    height: hp(3.7),
  },
});
