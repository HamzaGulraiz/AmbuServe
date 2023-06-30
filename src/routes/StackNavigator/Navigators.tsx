import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  DASHBOARD,
  MAPS,
  SIGN_IN,
  SIGN_IN_AS_DRIVER,
  SIGN_UP,
  SIGN_UP_AS_DRIVER,
  SPLASH_SCREEN,
} from '../../constants/Navigator';
import SplashScreen from '../../screens/SplashScreen';
import SignIn from '../../screens/SignIn';
import SignUp from '../../screens/SignUp';
import SignInAsDriver from '../../screens/SignInAsDriver';
import SignUpAsDriver from '../../screens/SignUpAsDriver';
import DashBoard from '../../screens/DashBoard';
import Maps from '../../screens/MapView';

export type RootStackParams = {
  SplashScreen: any;
  SignIn: any;
  SignUp: any;
  SignInAsDriver: any;
  SignUpAsDriver: any;
  DashBoard: any;
  Maps: any;
};

const Stack = createStackNavigator<RootStackParams>();
const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={SPLASH_SCREEN} component={SplashScreen} />
      <Stack.Screen name={SIGN_IN} component={SignIn} />
      <Stack.Screen name={SIGN_UP} component={SignUp} />
      <Stack.Screen name={SIGN_IN_AS_DRIVER} component={SignInAsDriver} />
      <Stack.Screen name={SIGN_UP_AS_DRIVER} component={SignUpAsDriver} />
      <Stack.Screen name={DASHBOARD} component={DashBoard} />
      <Stack.Screen name={MAPS} component={Maps} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
