import React, {useState, useEffect, ComponentType} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  DASHBOARD,
  MAPS,
  MY_BOTTOM_TABS,
  SIGN_IN,
  SIGN_IN_AS_DRIVER,
  SIGN_UP,
  SIGN_UP_AS_DRIVER,
  SPLASH_SCREEN,
  TERMS_AND_CONDITIONS,
  USER_INFORMATION,
} from '../../constants/Navigator';
import SplashScreen from '../../screens/SplashScreen';
import SignIn from '../../screens/SignIn';
import SignUp from '../../screens/SignUp';
import SignInAsDriver from '../../screens/SignInAsDriver';
import SignUpAsDriver from '../../screens/SignUpAsDriver';
import DashBoard from '../../screens/DashBoard';
import Maps from '../../screens/MapView';
import UserInformation from '../../screens/UserInformation';

import MyBottomTabs from '../BottomTabNavigator/Navigators';
import TermsAndConditions from '../../screens/TermsandConditions';

const Stack = createStackNavigator();
const StackNavigator = ({routeName}) => {
  const [initialRouteName, setInitialRouteName] = useState();

  useEffect(() => {
    if (routeName) {
      setInitialRouteName(routeName);
    }
  }, [routeName]);

  if (!initialRouteName) {
    return null; // or render a loading state if desired
  }

  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={initialRouteName}>
      <Stack.Screen name={SPLASH_SCREEN} component={SplashScreen} />

      <Stack.Screen name={SIGN_IN} component={SignIn} />
      <Stack.Screen name={SIGN_UP} component={SignUp} />
      <Stack.Screen name={DASHBOARD} component={DashBoard} />
      <Stack.Screen name={MAPS} component={Maps} />
      <Stack.Screen name={USER_INFORMATION} component={UserInformation} />

      <Stack.Screen name={SIGN_IN_AS_DRIVER} component={SignInAsDriver} />
      <Stack.Screen name={SIGN_UP_AS_DRIVER} component={SignUpAsDriver} />
      <Stack.Screen
        name={TERMS_AND_CONDITIONS}
        component={TermsAndConditions}
      />
      <Stack.Screen name={MY_BOTTOM_TABS} component={MyBottomTabs} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
