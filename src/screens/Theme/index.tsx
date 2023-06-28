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
import CustomCard from '../../components/Card/Card';
import icons from '../../../assets/icons/icons';
import colors from '../../../assets/colors/colors';
import Divider from '../../components/Divider/Divider';
import images from '../../../assets/images/images';
import {setTheme} from '../../redux/Action';
import {setData} from '../../asyncStorage/AsyncStorage';
import {useDispatch} from 'react-redux';
import {useTypedSelector} from '../../redux/Store';

type NavigationProps = {
  navigate(APPEREANCE: string): unknown;
  navigation: string;
  goBack: any;
};

const Theme = () => {
  const navigation = useNavigation<NavigationProps>();
  const dispatch = useDispatch();
  const THEME = useTypedSelector(state => state.app.theme);

  const handlePress = (theme: string) => {
    setData({storageKey: 'THEME', value: theme});
    dispatch(setTheme(theme));
  };

  return (
    <CustomBackground>
      <View style={styles.container}>
        <CustomHeader
          title="Theme"
          leftIcon={icons.BACKWARD_ARROW}
          marginBottom={hp(5)}
        />
        <CustomCard
          title="Dark"
          onPress={() => {
            handlePress('Dark');
          }}
          topRadius={wp(2.5)}
          divider={true}
          leftIcon={icons.WALLET}
          leftIconTintColor="black"
        />
        <CustomCard
          title="Light"
          onPress={() => {
            handlePress('Light');
          }}
          divider={true}
          leftIcon={icons.WALLET}
          leftIconTintColor="black"
        />
        <CustomCard
          title="System"
          onPress={() => {
            handlePress('System');
          }}
          bottomRadius={wp(2.5)}
          divider={true}
          leftIcon={icons.WALLET}
          leftIconTintColor="black"
        />
        <View style={styles.TMView}>
          <Text style={{...styles.TM_VERSION, color: colors.DARK.WHITE_TEXT}}>
            TPBX Coin 1.0.9
          </Text>
          <Divider height={hp(0.117)} width={wp(40)} marginBottom={hp(1)} />
          <Text style={{...styles.TM_VERSION, color: colors.DARK.GREY_BUTTON}}>
            decentralized app
          </Text>
          <View style={styles.logoView}>
            <Image
              resizeMode="contain"
              source={images.LOGO}
              style={styles.image}
            />
          </View>
          <Text style={{...styles.TM_VERSION, color: colors.DARK.GREY_BUTTON}}>
            TPBX Coin
          </Text>
        </View>
      </View>
    </CustomBackground>
  );
};

export default Theme;
