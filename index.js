/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import store from './src/redux/Store';
import {NavigationContainer} from '@react-navigation/native';
import {
  DASHBOARD,
  MY_BOTTOM_TABS,
  SPLASH_SCREEN,
} from './src/constants/Navigator';
import {getData} from './src/asyncStorage/AsyncStorage';
import React, {useEffect, useState, useRef} from 'react';

const AppContainer = () => {
  // const [routeName, setRouteName] = useState('');
  // const [userInfo, setUserInfo] = useState();
  // const [driverInfo, setDriverInfo] = useState();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const userInformation = await getData({storageKey: 'USER_INFO'});
  //       if (userInformation === null) {
  //         try {
  //           const driverInfo = await getData({storageKey: 'DRIVER_INFO'});
  //           if (driverInfo === null) {
  //             setRouteName(SPLASH_SCREEN);
  //             console.log('Index.js: routing to splash screen');
  //           } else {
  //             setRouteName(MY_BOTTOM_TABS);
  //             setDriverInfo(driverInfo);
  //             console.log('Index.js: routing to Bottom tabs');
  //           }
  //         } catch (e) {
  //           console.log('Index.js: drivers async catch', e);
  //         }
  //       } else {
  //         console.log('Index.js: routing to Dashboard');
  //         setUserInfo(userInformation);
  //         setRouteName(DASHBOARD);
  //       }
  //     } catch (error) {
  //       console.log('Index.js: user async catch', error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <App
        // routeName={routeName}
        // userInformation={userInfo}
        // driverInformation={driverInfo}
        />
      </NavigationContainer>
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => AppContainer);
