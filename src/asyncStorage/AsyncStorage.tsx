import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';

type SetDataProps = {
  value: string;
  storageKey: string;
};

export const setData = async (props: SetDataProps): Promise<void> => {
  const { value, storageKey } = props;

  try {
    await AsyncStorage.setItem(storageKey, value);
    console.log("value stored =>",value);
  } catch (e) {
    console.log("some error occured",e);
    
  }
};


type GetDataProps = {
    storageKey: string;
  };
  
  export const getData = async (props: GetDataProps): Promise<void | string> => {
    const { storageKey } = props;
    try {
      const value = await AsyncStorage.getItem(storageKey);
      if (value !== null) {
        return value;
      }
    } catch (e) {
        console.log("some error occured",e);
    }
  };