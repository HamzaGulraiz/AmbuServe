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
import {AppState, StyleSheet, Text, View} from 'react-native';

const AppContainer = () => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      // dispatch(setAppState(appState.current));
      // console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const [routeName, setRouteName] = useState();
  const [userInfornation, setUserInfornation] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getData({storageKey: 'USER_INFO'});
        if (result === null) {
          try {
            const driverInfo = await getData({storageKey: 'DRIVER_INFO'});
            if (driverInfo === null) {
              setRouteName(SPLASH_SCREEN);
              console.log('no result on index.js from storage');
            } else {
              setRouteName(MY_BOTTOM_TABS);
              console.log('driver result on index.js from storage');
            }
          } catch (e) {
            console.log('drivers catch index', e);
          }
        } else {
          const responseObj = JSON.parse(result);
          setUserInfornation(responseObj);
          setRouteName(DASHBOARD);
          console.log('Data token on index.js ==>', responseObj);
        }
      } catch (error) {
        console.log('Error occurred at index.js from storage', error);
      }
    };
    fetchData();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <App
          routeName={routeName}
          appState={appState.current}
          userInformation={userInfornation}
        />
      </NavigationContainer>
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => AppContainer);
