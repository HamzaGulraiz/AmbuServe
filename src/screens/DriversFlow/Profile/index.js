import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  Image,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import {removeData} from '../../../asyncStorage/AsyncStorage';
import {SPLASH_SCREEN} from '../../../constants/Navigator';
import colors from '../../../../assets/colors/colors';
import fonts from '../../../../assets/fonts/fonts';
import fontsizes from '../../../../assets/fontsizes/fontsizes';
import images from '../../../../assets/images/images';
import {useTypedSelector} from '../../../redux/Store';

const Profile = () => {
  const navigation = useNavigation();
  const driverInfoString = useTypedSelector(state => state.reducer.driverInfo);
  const driverInfo = JSON.parse(driverInfoString);
  const {
    company_name,
    vehicle_number,
    driver_name,
    company_email,
    driver_contact,
    office_address,
  } = driverInfo;

  const handleLogOut = () => {
    Alert.alert('AmbuServe', 'See you soon', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          removeData({storageKey: 'DRIVER_INFO'});
          navigation.navigate(SPLASH_SCREEN);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleLogOut} style={styles.logOutButton}>
        <Text
          style={{
            textAlign: 'right',
            color: colors.RED,
            fontWeight: '300',
            fontFamily: fonts.BOLD,
            fontSize: fontsizes.px_16,
          }}>
          Log out
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.imageButton}
        onPress={() => {
          // handleLogOut();
        }}>
        <View
          style={{
            position: 'absolute',
            height: hp(1.5),
            width: wp(3),
            borderRadius: wp(3),
            backgroundColor: 'green',
            bottom: hp(1),
            right: hp(1.4),
            zIndex: 1,
          }}></View>
        <Image
          source={images.DEFAULT_USER}
          resizeMode="contain"
          style={styles.userImage}
        />
      </TouchableOpacity>

      <TextInput
        value={company_name}
        style={{
          ...styles.input,
          borderColor: colors.BLUE,
          marginBottom: hp(2),
          color: colors.BLACK,
        }}
        numberOfLines={1}
        multiline={false}
        maxLength={30}
        editable={false}
      />
      <TextInput
        value={vehicle_number}
        style={{
          ...styles.input,
          borderColor: colors.BLUE,
          marginBottom: hp(2),
          color: colors.BLACK,
        }}
        numberOfLines={1}
        multiline={false}
        maxLength={30}
        editable={false}
      />

      <TextInput
        value={driver_name}
        style={{
          ...styles.input,
          borderColor: colors.BLUE,
          marginBottom: hp(2),
          color: colors.BLACK,
        }}
        numberOfLines={1}
        multiline={false}
        maxLength={30}
        editable={false}
      />
      <TextInput
        value={driver_contact}
        style={{
          ...styles.input,
          borderColor: colors.BLUE,
          marginBottom: hp(2),
          color: colors.BLACK,
        }}
        numberOfLines={1}
        multiline={false}
        maxLength={30}
        editable={false}
      />
      <TextInput
        value={office_address}
        style={{
          ...styles.input,
          borderColor: colors.BLUE,
          marginBottom: hp(2),
          color: colors.BLACK,
        }}
        numberOfLines={1}
        multiline={false}
        maxLength={30}
        editable={false}
      />
      <TextInput
        value={company_email}
        style={{
          ...styles.input,
          borderColor: colors.BLUE,
          marginBottom: hp(2),
          color: colors.BLACK,
        }}
        placeholderTextColor={colors.BLUE}
        numberOfLines={1}
        multiline={false}
        maxLength={30}
        editable={false}
      />
    </SafeAreaView>
  );
};

export default Profile;
