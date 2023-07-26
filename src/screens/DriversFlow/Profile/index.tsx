import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  Image,
  Text,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ToastAndroid,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import MapView, {Marker, Callout} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {getData, removeData} from '../../../asyncStorage/AsyncStorage';
import {
  SIGN_IN_AS_DRIVER,
  SPLASH_SCREEN,
  USER_STACK,
} from '../../../constants/Navigator';
import colors from '../../../../assets/colors/colors';
import fonts from '../../../../assets/fonts/fonts';
import fontsizes from '../../../../assets/fontsizes/fontsizes';
import images from '../../../../assets/images/images';
import icons from '../../../../assets/icons/icons';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import {BASE_URL} from '../../../../config';
import SplashScreen from '../../SplashScreen';

type NavigationProps = {
  navigate(APPEREANCE: string): unknown;
  navigation: string;
  goBack: () => void;
  replace: any;
  jumpTo: any;
};

const Profile = () => {
  const navigation = useNavigation<NavigationProps>();

  const [companyName, setCompanyName] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverNumber, setDriverNumber] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [driversToken, setDriversToken] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getData({storageKey: 'DRIVER_INFO'});
        if (result === null) {
          console.log('no result on driver info  Screen from storage');
        } else {
          const responseObj = JSON.parse(result);
          setCompanyName(responseObj.company_name);
          setVehicleNumber(responseObj.vehicle_number);
          setDriverName(responseObj.driver_name);
          setDriverNumber(responseObj.driver_contact);
          setOfficeAddress(responseObj.office_address);
          setCompanyEmail(responseObj.company_email);
          setDriversToken(responseObj.token);
          console.log('Data on driverinfo screen ==>', responseObj);
        }
      } catch (error) {
        console.log('Error occurred at userinfo screen from storage', error);
      }
    };
    fetchData();
  }, []);

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

  const removeDriverFromDb = () => {
    let config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: `${BASE_URL}/driver/delete/${driversToken}`,
    };

    // axios
    //   .request(config)
    //   .then(response => {
    //     console.log(JSON.stringify(response.data));
    //     removeData({storageKey: 'DRIVER_INFO'});
    //     navigation.navigate(SPLASH_SCREEN);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //     removeData({storageKey: 'DRIVER_INFO'});
    //     navigation.navigate(SPLASH_SCREEN);
    //   });
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
            right: hp(3),
            zIndex: 1,
          }}></View>
        <Image
          source={images.DEFAULT_USER}
          resizeMode="contain"
          style={styles.userImage}
        />
      </TouchableOpacity>

      <TextInput
        value={companyName}
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
        value={vehicleNumber}
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
        value={driverName}
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
        value={driverNumber}
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
        value={officeAddress}
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
        value={companyEmail}
        // onChangeText={value => {
        //   handleOnChangeText(value, 'CNIC'), setCNIC(value);
        // }}
        style={{
          ...styles.input,
          borderColor: colors.BLUE,
          marginBottom: hp(2),
          color: colors.BLACK,
        }}
        placeholder="CNIC"
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
