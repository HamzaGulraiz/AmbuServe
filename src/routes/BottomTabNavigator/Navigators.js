import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import React, {useState, useEffect} from 'react';
import {Text, View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import icons from '../../../assets/icons/icons';
import {
  DRIVER_Activity,
  DRIVER_MAP,
  DRIVER_Profile,
} from '../../constants/Navigator';
import DriverMap from '../../screens/DriversFlow/Maps';
import Activity from '../../screens/DriversFlow/Activity';
import Profile from '../../screens/DriversFlow/Profile';

const Tab = createBottomTabNavigator();
function MyBottomTabs() {
  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            // backgroundColor: colors.DARK.BACKGROUND,
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
                    }}
                  />
                </>
              ),
          }}
        />
      </Tab.Navigator>
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
