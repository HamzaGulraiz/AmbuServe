import React, {useState, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  DASHBOARD,
  DRIVER_Activity,
  DRIVER_MAP,
  DRIVER_Profile,
  MAPS,
  MY_BOTTOM_TABS,
  SIGN_IN,
  SIGN_IN_AS_DRIVER,
  SIGN_UP,
  SPLASH_SCREEN,
  USER_INFORMATION,
} from '../../constants/Navigator';
import SplashScreen from '../../screens/SplashScreen';
import SignIn from '../../screens/SignIn';
import SignUp from '../../screens/SignUp';
import SignInAsDriver from '../../screens/SignInAsDriver';

import DashBoard from '../../screens/DashBoard';
import Maps from '../../screens/MapView';
import {getData} from '../../asyncStorage/AsyncStorage';
import UserInformation from '../../screens/UserInformation';
import {useTypedSelector} from '../../redux/Store';
import MyBottomTabs from '../BottomTabNavigator/Navigators';

// import { RootStackParams } from './types';

export type RootStackParams = {
  SplashScreen: any;
  SignIn: any;
  SignUp: any;
  SignInAsDriver: any;
  DashBoard: any;
  Maps: any;
  UserInformation: any;
  MyBottomTabs: any;
};

// type RouteName = {
//   routeName?: any;
// };

type RouteName = {
  routeName?: keyof RootStackParams | undefined;
};

const Stack = createStackNavigator<RootStackParams>();
const StackNavigator: React.FC<RouteName> = ({routeName}) => {
  console.log('routeName on stack nav =>', routeName);
  const [initialRouteName, setInitialRouteName] = useState<
    keyof RootStackParams | undefined
  >(undefined);

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
      <Stack.Screen name={SIGN_IN_AS_DRIVER} component={SignInAsDriver} />

      <Stack.Screen name={DASHBOARD} component={DashBoard} />
      <Stack.Screen name={MAPS} component={Maps} />
      <Stack.Screen name={USER_INFORMATION} component={UserInformation} />
      <Stack.Screen name={MY_BOTTOM_TABS} component={MyBottomTabs} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
