import React, {useState, useEffect} from 'react';
import StackNavigator from './src/routes/StackNavigator/Navigators';
import {useDispatch} from 'react-redux';
import {
  setUserInfo,
  setDriverInfo,
  setDriverActivity,
} from './src/redux/Action';
import {getData, setData} from './src/asyncStorage/AsyncStorage';
import {
  DASHBOARD,
  MY_BOTTOM_TABS,
  SPLASH_SCREEN,
} from './src/constants/Navigator';
import {useIsFocused} from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid, Platform} from 'react-native';
import axios from 'axios';
import {BASE_URL} from './config';

// type Props = {
//   routeName: string;
//   userInformation: string;
//   driverInformation: string;
// };
const App = (
  {
    // routeName,
    // userInformation,
    // driverInformation,
  },
) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [routeName, setRouteName] = useState('');
  // const [userInfo, setUserInfo] = useState('');
  // const [driverInfo, setDriverInfo] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInformation = await getData({storageKey: 'USER_INFO'});
        if (userInformation === null) {
          try {
            const driverInfo = await getData({storageKey: 'DRIVER_INFO'});
            if (driverInfo === null) {
              setRouteName(SPLASH_SCREEN);
              console.log('Index.js: routing to splash screen');
            } else {
              driversActivityCallback(driverInfo);

              console.log('Index.js: routing to Bottom tabs');
            }
          } catch (e) {
            console.log('Index.js: drivers async catch', e);
          }
        } else {
          console.log('Index.js: routing to Dashboard');
          // setUserInfo(userInformation);
          dispatch(setUserInfo(userInformation));
          setRouteName(DASHBOARD);
        }
      } catch (error) {
        console.log('Index.js: user async catch', error);
      }
    };
    fetchData();
  }, [isFocused]);

  const driversActivityCallback = driverInfo => {
    const {driver_contact} = JSON.parse(driverInfo);
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${BASE_URL}/driver/rides/${driver_contact}`,
      // url: `http://192.168.100.21:8080/driver/rides/03244421921`,
      headers: {},
    };

    axios
      .request(config)
      .then(response => {
        if (response.data !== null) {
          setRouteName(MY_BOTTOM_TABS);
          dispatch(setDriverInfo(driverInfo));
          dispatch(setDriverActivity(response.data));
        }
      })
      .catch(error => {
        console.log(error);
        setRouteName(MY_BOTTOM_TABS);
        dispatch(setDriverInfo(driverInfo));
        dispatch(setDriverActivity([]));
      });
  };

  const androidPermission = async () => {
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
        // console.log('You can use the location');
      } else {
        // console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      androidPermission();
    } else {
      // IOS
      // Geolocation.requestAuthorization();
    }
  }, [isFocused]);

  // React.useEffect(() => {
  //   dispatch(setUserInfo(userInformation));
  //   dispatch(setDriverInfo(driverInformation));
  // }, []);
  return <StackNavigator routeName={routeName} />;
};

export default App;
