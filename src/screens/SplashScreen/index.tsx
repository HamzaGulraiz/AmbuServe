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
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import images from '../../../assets/images/images';
import colors from '../../../assets/colors/colors';

import CustomButton from '../../components/Button/Button';
import {SIGN_IN, SIGN_IN_AS_DRIVER, SIGN_UP, SIGN_UP_AS_DRIVER} from '../../constants/Navigator';

type NavigationProps = {
  navigate(APPEREANCE: string): unknown;
  navigation: string;
  goBack: () => void;
  replace: any;
  jumpTo: any;
};

const SplashScreen = () => {
  const navigation = useNavigation<NavigationProps>();

  // useEffect(() => {
  //   setTimeout(() => {
  //     navigation.navigate(GET_STARTED);
  //   }, 2000); // 2 seconds delay
  // }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View style={{
        flexDirection:"row",
        marginBottom:hp(35),
        // backgroundColor:"red"
      }}>
      <CustomButton
        title="Sign in as Driver"
        textColor={colors.BLUE}
        backgroundColor={colors.TRANSPARENT}
        height={hp(6)}
        width={wp(40)}
        marginHorizontal={wp(5)}
        borderRadius={wp(2)}
        marginTop={hp(2)}
        // marginBottom={hp(35)}
        onPress={() => {
          navigation.navigate(SIGN_IN_AS_DRIVER);
        }}
        />
        <CustomButton
        title="Sign up as Driver"
        textColor={colors.BLUE}
        backgroundColor={colors.TRANSPARENT}
        height={hp(6)}
        width={wp(40)}
        marginHorizontal={wp(5)}
        borderRadius={wp(2)}
        marginTop={hp(2)}
        // marginBottom={hp(35)}
        onPress={() => {
          navigation.navigate(SIGN_UP_AS_DRIVER);
        }}
        />
        </View>
      <Image resizeMode="contain" source={images.LOGO} style={styles.image} />
      <CustomButton
        title="Create and account"
        textColor={colors.WHITE}
        backgroundColor={colors.BLUE}
        height={hp(6)}
        width={wp(90)}
        borderRadius={wp(2)}
        marginHorizontal={wp(5)}
        // marginTop={hp(2)}
        marginBottom={hp(2)}
        onPress={() => {
          navigation.navigate(SIGN_UP);
        }}
      />
      <CustomButton
        title="Sign in"
        textColor={colors.BLUE}
        backgroundColor={colors.TRANSPARENT}
        height={hp(6)}
        width={wp(90)}
        marginHorizontal={wp(5)}
        borderRadius={wp(2)}
        borderWidth={hp(0.1)}
        borderColor={colors.BLUE}
        // marginTop={hp(2)}
        // marginBottom={hp(35)}
        onPress={() => {
          navigation.navigate(SIGN_IN);
        }}
      />
    </SafeAreaView>
  );
};

export default SplashScreen;
