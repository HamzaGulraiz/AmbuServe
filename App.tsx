import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigator from './src/routes/StackNavigator/Navigators';
import {getData} from './src/asyncStorage/AsyncStorage';
import {useDispatch} from 'react-redux';
import {setTheme} from './src/redux/Action';

const App = () => {
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const value = await getData({storageKey: 'THEME'});

  //     if (typeof value === 'string') {
  //       console.log('async value in app.tsx', value);
  //       dispatch(setTheme(value));
  //     } else {
  //       // Handle the case when value is void or undefined
  //       console.log('Error occurred or value is undefined');
  //     }
  //   };
  //   fetchData();
  // }, []);
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
};
export default App;
