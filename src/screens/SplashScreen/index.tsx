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
} from 'react-native';
import React, {useEffect} from 'react';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import images from '../../../assets/images/images';
import colors from '../../../assets/colors/colors';
import {GET_STARTED} from '../../constants/Navigator';
import CustomBackground from '../../components/Background/Background';

type NavigationProps = {
  navigate(APPEREANCE: string): unknown;
  navigation: string;
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
      <Image resizeMode="cover" source={images.LOGO} style={styles.image} />
    </SafeAreaView>
  );
};

export default SplashScreen;
