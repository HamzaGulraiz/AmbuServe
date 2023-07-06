import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';

type SetDataProps = {
  value: string;
  storageKey: string;
};

export const setData = async (props: SetDataProps): Promise<void> => {
  const {value, storageKey} = props;

  try {
    const serializedValue = JSON.stringify(value);
    await AsyncStorage.setItem(storageKey, serializedValue);
    console.log('object stored =>', value);
  } catch (e) {
    console.log('some error occured', e);
  }
};

type GetDataProps = {
  storageKey: string;
};

export const getData = async (props: GetDataProps): Promise<string | null> => {
  const {storageKey} = props;

  try {
    const serializedValue = await AsyncStorage.getItem(storageKey);
    // console.log('Serialized value:', serializedValue);
    // console.log('Type of serialized value:', typeof serializedValue);

    return serializedValue !== null ? serializedValue : null;
  } catch (e) {
    console.log('Error occurred:', e);
    return null;
  }
};

type RemoveDataProps = {
  storageKey: string;
};

export const removeData = async (props: RemoveDataProps): Promise<void> => {
  const {storageKey} = props;

  try {
    await AsyncStorage.removeItem(storageKey);
    console.log('Data removed');
  } catch (e) {
    console.log('Error occurred:', e);
  }
};
