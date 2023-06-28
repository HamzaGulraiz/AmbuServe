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
} from 'react-native';
import React, {useState} from 'react';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import colors from '../../../assets/colors/colors';
import images from '../../../assets/images/images';
import CustomBackground from '../../components/Background/Background';
import CustomButton from '../../components/Button/Button';
import {MY_BOTTOM_TABS} from '../../constants/Navigator';

type NavigationProps = {
  navigate(APPEREANCE: string): unknown;
  navigation: string;
};

const GetStarted = () => {
  const navigation = useNavigation<NavigationProps>();

  // const onBoardingInformation = [
  //   {
  //     image: images.LOGO,
  //     title: 'Unchain Assets',
  //     description:
  //       'Don’t lock yourself in and don’t let others do that to you',

  //   },
  //   {
  //     image: images.LOGO,
  //     title: 'Go Borderless'),
  //     description: t('Bypass conditional barriers and access markets globally'),
  //   },
  //   {
  //     image: images.LOGO,
  //     title: t('Stay Private'),
  //     description: t(
  //       'Do not leak your private and financial data to the world',
  //     ),
  //   },
  // ];

  // const [id, setId] = useState(0);
  // const [detail, setDetail] = useState({
  //   images: onBoardingInformation[0].image,
  //   title: onBoardingInformation[0].title,
  //   description: onBoardingInformation[0].description,
  // });

  // const handlePress = () => {
  //   if (id < 2) {
  //     setDetail({
  //       images: onBoardingInformation[id + 1].image,
  //       title: onBoardingInformation[id + 1].title,
  //       description: onBoardingInformation[id + 1].description,
  //     });
  //     setId(id + 1);
  //   } else {
  //     navigation.navigate(MY_BOTTOM_TABS);
  //   }
  // };

  return (
    <CustomBackground>
      <View>
        {/* <View style={styles.imageView}>
          <Image
            resizeMode="contain"
            source={detail.images}
            style={styles.image}
          />
        </View>
        <Text style={styles.title}>{detail.title}</Text>
        <Text style={styles.description}>{detail.description}</Text>
        <View style={styles.dotView}>
          <View
            style={{
              ...styles.dot,
              backgroundColor:
                id === 0 ? colors.DARK.DOTACTIVE : colors.DARK.DOTINACTIVE,
            }}></View>
          <View
            style={{
              ...styles.dot,
              backgroundColor:
                id === 1 ? colors.DARK.DOTACTIVE : colors.DARK.DOTINACTIVE,
            }}></View>
          <View
            style={{
              ...styles.dot,
              backgroundColor:
                id === 2 ? colors.DARK.DOTACTIVE : colors.DARK.DOTINACTIVE,
            }}></View>
        </View>

        <CustomButton
          title={t('Get Started')}
          onPress={handlePress}
          height={hp(6.5)}
          width={wp(82.4)}
          backgroundColor={colors.DARK.WHITE_BUTTON}
          marginHorizontal={wp(10.6)}
        /> */}
      </View>
    </CustomBackground>
  );
};

export default GetStarted;
