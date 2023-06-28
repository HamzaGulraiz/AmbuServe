import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  ImageSourcePropType,
} from 'react-native';
import React, {useState} from 'react';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import CustomBackground from '../../components/Background/Background';
import CustomHeader from '../../components/HeaderBar/Header';
import icons from '../../../assets/icons/icons';
import colors from '../../../assets/colors/colors';

type NavigationProps = {
  navigate(APPEREANCE: string): unknown;
  navigation: string;
  goBack: any;
};

type HomeButtonCardProps = {
  id: number;
  title: string;
  onPress: () => void;
  icon: ImageSourcePropType;
};

const Activity = () => {
  const navigation = useNavigation<NavigationProps>();

  return <View style={styles.container}></View>;
};

export default Activity;
