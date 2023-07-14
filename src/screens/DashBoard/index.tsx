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
} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import images from '../../../assets/images/images';
import colors from '../../../assets/colors/colors';

import CustomButton from '../../components/Button/Button';
import {MAPS, SPLASH_SCREEN, USER_INFORMATION} from '../../constants/Navigator';
import fontsizes from '../../../assets/fontsizes/fontsizes';
import fonts from '../../../assets/fonts/fonts';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {PermissionsAndroid} from 'react-native';
import {removeData} from '../../asyncStorage/AsyncStorage';

type NavigationProps = {
  navigate(APPEREANCE: string): unknown;
  navigation: string;
  goBack: () => void;
  replace: any;
  jumpTo: any;
};

const DashBoard = () => {
  const navigation = useNavigation<NavigationProps>();

  useEffect(() => {
    locationAccess();
  }, []);

  const [currentLocation, setCurrentLocation] = useState(false);

  const locationAccess = async () => {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (granted) {
      console.log('Location already given ');
      setCurrentLocation(true);
    } else {
      console.log('Trying to get location ');
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('location granted by asking');
          setCurrentLocation(true);
        } else {
          console.log('location permission denied');
          setCurrentLocation(false);
          ToastAndroid.showWithGravityAndOffset(
            'AmbuServe would like to access your location',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            wp(8),
            hp(4),
          );
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const handleSOS = () => {
    locationAccess();
    if (currentLocation === true) {
      console.log('location');
      navigation.navigate(MAPS);
    } else {
      ToastAndroid.showWithGravityAndOffset(
        'AmbuServe would like to access your location',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        wp(8),
        hp(4),
      );
    }
  };
  const handleChoseHospital = () => {
    locationAccess();
    if (currentLocation === true) {
      console.log('location');
      navigation.navigate(MAPS);
    } else {
      ToastAndroid.showWithGravityAndOffset(
        'AmbuServe would like to access your location',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        wp(8),
        hp(4),
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoutButtonView}>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          navigation.navigate(USER_INFORMATION);
        }}>
        <Image
          source={images.DEFAULT_USER}
          resizeMode="contain"
          style={styles.userImage}
          />
      </TouchableOpacity>
          </View>
      <Image
        resizeMode="contain"
        source={images.AMBULANCE}
        style={styles.image}
      />

      <Text
        style={{
          marginHorizontal: wp(10),
          textAlign: 'center',
          color: colors.BLUE,
          fontWeight: '300',
          fontFamily: fonts.BOLD,
          fontSize: fontsizes.px_25,
          marginBottom: hp(2),
        }}>
        Get to the Nearest Hospital quickly & without stress
      </Text>
      <Text
        style={{
          marginHorizontal: wp(10),
          textAlign: 'center',
          color: colors.GREY,
          fontWeight: '300',
          fontFamily: fonts.BOLD,
          fontSize: fontsizes.px_16,
          marginBottom: hp(2),
        }}>
        Lets give you a well deserve support in getting to the hospital in time
        of emergency
      </Text>
      <View style={styles.SOSButtonView}>

      <TouchableOpacity style={styles.SOSView} onPress={handleSOS}>
        <Image
          source={images.SOS}
          resizeMode="contain"
          style={styles.SOSButton}
          />
      </TouchableOpacity>
          </View>
      <CustomButton
        title="Choose hospital"
        textColor={colors.WHITE}
        backgroundColor={colors.BLUE}
        height={hp(6)}
        width={wp(90)}
        borderRadius={wp(2)}
        marginHorizontal={wp(5)}
        // marginTop={hp(2)}
        // marginBottom={hp(2)}
        onPress={handleChoseHospital}
      />
    </SafeAreaView>
  );
};

export default DashBoard;
