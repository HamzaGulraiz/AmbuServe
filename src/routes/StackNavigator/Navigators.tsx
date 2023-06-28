import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  GET_STARTED,
  LANGUAGE,
  MY_BOTTOM_TABS,
  SPLASH_SCREEN,
  THEME,
} from '../../constants/Navigator';
import SplashScreen from '../../screens/SplashScreen';
import GetStarted from '../../screens/GetStarted';

import MyBottomTabs from '../BottomTabNavigator/Navigators';
import Theme from '../../screens/Theme';
import Language from '../../screens/Language';

export type RootStackParams = {
  SplashScreen: any;
  GetStarted: any;
  MyBottomTabs: any;
  Theme: any;
  Language: any;
};

const Stack = createStackNavigator<RootStackParams>();
const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={SPLASH_SCREEN} component={SplashScreen} />
      {/* <Stack.Screen name={GET_STARTED} component={GetStarted} />
      <Stack.Screen name={MY_BOTTOM_TABS} component={MyBottomTabs} />
      <Stack.Screen name={THEME} component={Theme} />
      <Stack.Screen name={LANGUAGE} component={Language} /> */}
    </Stack.Navigator>
  );
};

export default StackNavigator;
