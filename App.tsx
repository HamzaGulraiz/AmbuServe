import React, {useEffect, useState, useRef} from 'react';
import {AppState, StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigator from './src/routes/StackNavigator/Navigators';
import {getData} from './src/asyncStorage/AsyncStorage';
import {useDispatch} from 'react-redux';

import {
  DASHBOARD,
  MY_BOTTOM_TABS,
  SPLASH_SCREEN,
} from './src/constants/Navigator';
import {setAppState, setUserInfo} from './src/redux/Action';
import UserInformation from './src/screens/UserInformation';

type Props = {
  routeName: any;
  userInformation: any;
  appState: string;
};
const App: React.FC<Props> = ({routeName, userInformation, appState}) => {
  const dispatch = useDispatch();
  console.log('routname on app => ', routeName);
  // console.log('AppState & userInfo', userInformation, appState);

  useEffect(() => {
    const settingDataToRedux = () => {
      dispatch(setAppState(appState));
      dispatch(setUserInfo(userInformation));
    };
    settingDataToRedux();
  }, [userInformation]);

  // return <StackNavigator routeName={routeName} />;

  return <StackNavigator routeName={routeName} />;
};

export default App;
