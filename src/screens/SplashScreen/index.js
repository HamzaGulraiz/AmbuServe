import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Image, SafeAreaView} from 'react-native';
import React, {useEffect} from 'react';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import images from '../../../assets/images/images';
import colors from '../../../assets/colors/colors';
import CustomButton from '../../components/Button/Button';
import {SIGN_IN, SIGN_IN_AS_DRIVER} from '../../constants/Navigator';

const SplashScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <CustomButton
        title="Continue as driver"
        textColor={colors.BLUE}
        backgroundColor={colors.TRANSPARENT}
        height={hp(6)}
        width={wp(90)}
        marginHorizontal={wp(5)}
        borderRadius={wp(2)}
        borderWidth={hp(0.1)}
        borderColor={colors.BLUE}
        marginTop={hp(4)}
        marginBottom={hp(35)}
        onPress={() => {
          navigation.navigate(SIGN_IN_AS_DRIVER);
        }}
      />
      <Image resizeMode="contain" source={images.LOGO} style={styles.image} />
      <CustomButton
        title="Continue as user"
        textColor={colors.WHITE}
        backgroundColor={colors.BLUE}
        height={hp(6)}
        width={wp(90)}
        borderRadius={wp(2)}
        marginHorizontal={wp(5)}
        marginTop={hp(4)}
        marginBottom={hp(2)}
        onPress={() => {
          navigation.navigate(SIGN_IN);
        }}
      />
    </SafeAreaView>
  );
};

export default SplashScreen;
