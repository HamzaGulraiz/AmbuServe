import AsyncStorage from '@react-native-async-storage/async-storage';

// type SetDataProps = {
//   value: string;
//   storageKey: string;
// };

export const setData = async props => {
  const {value, storageKey} = props;

  try {
    const serializedValue = JSON.stringify(value);
    await AsyncStorage.setItem(storageKey, serializedValue);
    console.log('async storage: value stored as string =>', value);
  } catch (e) {
    console.log('some error occured', e);
  }
};

// type GetDataProps = {
//   storageKey: string;
// };

export const getData = async props => {
  const {storageKey} = props;

  try {
    const serializedValue = await AsyncStorage.getItem(storageKey);
    return serializedValue !== null ? serializedValue : null;
  } catch (e) {
    console.log('Error occurred:', e);
    return null;
  }
};

// type RemoveDataProps = {
//   storageKey: string;
// };

export const removeData = async props => {
  const {storageKey} = props;

  try {
    await AsyncStorage.removeItem(storageKey);
    console.log('async storage: data removed of', storageKey);
  } catch (e) {
    console.log('Error occurred:', e);
  }
};
