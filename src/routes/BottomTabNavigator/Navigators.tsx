import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import React, {useState} from 'react';
import {Text, View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useTypedSelector} from '../../redux/Store';
import icons from '../../../assets/icons/icons';
import colors from '../../../assets/colors/colors';
import fonts from '../../../assets/fonts/fonts';
import fontsizes from '../../../assets/fontsizes/fontsizes';
import {
  ACTIVITY,
  HOME,
  TRADES,
  WALLET,
  SETTINGS,
} from '../../constants/Navigator';
import Home from '../../screens/Home';
import Trades from '../../screens/Trades';
import Activity from '../../screens/Activity';
import Wallet from '../../screens/Wallet';
import Settings from '../../screens/Settings';

const Tab = createBottomTabNavigator();

function MyBottomTabs() {
  // const THEME = useTypedSelector(state => state.app.theme);
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.DARK.BACKGROUND,
          // marginHorizontal: wp(4),
          // marginBottom: hp(2),
          // borderRadius: wp(5),
          // height: hp(8),
        },
      }}>
      <Tab.Screen
        name={HOME}
        component={Home}
        options={{
          tabBarIcon: ({focused}) =>
            focused ? (
              <>
                <Image
                  source={icons.HOME}
                  resizeMode="contain"
                  style={{
                    ...styles.tabIcon,
                    tintColor: colors.DARK.LIGHT_BLUE_BUTTON,
                  }}
                />
              </>
            ) : (
              <>
                <Image
                  source={icons.HOME}
                  resizeMode="contain"
                  style={{
                    ...styles.tabIcon,
                    tintColor: colors.DARK.GREY_BUTTON,
                  }}
                />
              </>
            ),
        }}
      />
      <Tab.Screen
        name={WALLET}
        component={Wallet}
        options={{
          tabBarIcon: ({focused}) =>
            focused ? (
              <>
                <Image
                  source={icons.WALLET}
                  resizeMode="contain"
                  style={{
                    ...styles.tabIcon,
                    tintColor: colors.DARK.LIGHT_BLUE_BUTTON,
                  }}
                />
              </>
            ) : (
              <>
                <Image
                  source={icons.WALLET}
                  resizeMode="contain"
                  style={{
                    ...styles.tabIcon,
                    tintColor: colors.DARK.GREY_BUTTON,
                  }}
                />
              </>
            ),
        }}
      />
      <Tab.Screen
        name={TRADES}
        component={Trades}
        options={{
          tabBarIcon: ({focused}) =>
            focused ? (
              <>
                <Image
                  source={icons.TRADES}
                  resizeMode="contain"
                  style={{
                    ...styles.tabIcon,
                    tintColor: colors.DARK.LIGHT_BLUE_BUTTON,
                  }}
                />
              </>
            ) : (
              <>
                <Image
                  source={icons.TRADES}
                  resizeMode="contain"
                  style={{
                    ...styles.tabIcon,
                    tintColor: colors.DARK.GREY_BUTTON,
                  }}
                />
              </>
            ),
        }}
      />
      <Tab.Screen
        name={ACTIVITY}
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
                    tintColor: colors.DARK.LIGHT_BLUE_BUTTON,
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
                    tintColor: colors.DARK.GREY_BUTTON,
                  }}
                />
              </>
            ),
        }}
      />
      <Tab.Screen
        name={SETTINGS}
        component={Settings}
        options={{
          tabBarStyle: {
            display: 'none',
          },
          tabBarIcon: ({focused}) =>
            focused ? (
              <>
                <Image
                  source={icons.SETTINGS}
                  resizeMode="contain"
                  style={{
                    ...styles.tabIcon,
                    tintColor: colors.DARK.LIGHT_BLUE_BUTTON,
                  }}
                />
              </>
            ) : (
              <>
                <Image
                  source={icons.SETTINGS}
                  resizeMode="contain"
                  style={{
                    ...styles.tabIcon,
                    tintColor: colors.DARK.GREY_BUTTON,
                  }}
                />
              </>
            ),
        }}
      />
    </Tab.Navigator>
  );
}

export default MyBottomTabs;

const styles = StyleSheet.create({
  tabIcon: {
    width: wp(8.1),
    height: hp(3.7),
  },
});
