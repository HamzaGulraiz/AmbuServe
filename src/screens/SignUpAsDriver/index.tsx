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
} from 'react-native';
import React, {useEffect} from 'react';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import images from '../../../assets/images/images';
import colors from '../../../assets/colors/colors';

import CustomButton from '../../components/Button/Button';

type NavigationProps = {
  navigate(APPEREANCE: string): unknown;
  navigation: string;
  goBack: () => void;
  replace: any;
  jumpTo: any;
};

const SignUpAsDriver = () => {
  const navigation = useNavigation<NavigationProps>();

  // useEffect(() => {
  //   setTimeout(() => {
  //     navigation.navigate(GET_STARTED);
  //   }, 2000); // 2 seconds delay
  // }, []);
  return (
    <SafeAreaView style={styles.container}>
      <CustomButton
        title="Sign in as Driver"
        textColor={colors.BLUE}
        backgroundColor={colors.TRANSPARENT}
        height={hp(5)}
        width={wp(90)}
        marginHorizontal={wp(5)}
        borderRadius={wp(2)}
        marginTop={hp(2)}
        marginBottom={hp(35)}
        onPress={() => {}}
      />
      <Image resizeMode="contain" source={images.LOGO} style={styles.image} />
      <CustomButton
        title="Create and account"
        textColor={colors.WHITE}
        backgroundColor={colors.BLUE}
        height={hp(5)}
        width={wp(90)}
        borderRadius={wp(2)}
        marginHorizontal={wp(5)}
        // marginTop={hp(2)}
        marginBottom={hp(2)}
        onPress={() => {}}
      />
      <CustomButton
        title="Sign in as user"
        textColor={colors.BLUE}
        backgroundColor={colors.TRANSPARENT}
        height={hp(5)}
        width={wp(90)}
        marginHorizontal={wp(5)}
        borderRadius={wp(2)}
        borderWidth={hp(0.1)}
        borderColor={colors.BLUE}
        // marginTop={hp(2)}
        // marginBottom={hp(35)}
        onPress={() => {}}
      />
    </SafeAreaView>
  );
};

export default SignUpAsDriver;
