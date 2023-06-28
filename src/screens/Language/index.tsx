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
import i18n from '../../../translations/i18n';

type NavigationProps = {
  navigate(APPEREANCE: string): unknown;
  navigation: string;
  goBack: any;
};

const Language = () => {
  const navigation = useNavigation<NavigationProps>();
  const dispatch = useDispatch();
  const THEME = useTypedSelector(state => state.app.theme);

  const handlePress = (language: string) => {
    setData({storageKey: 'LANGUAGE', value: language});
    // dispatch(setTheme(theme));
    // i18n.changeLanguage();
    console.log(language);
  };

  return (
    <CustomBackground>
      <View style={styles.container}>
        <CustomHeader
          title="Language Preference"
          leftIcon={icons.BACKWARD_ARROW}
          marginBottom={hp(5)}
        />
        <CustomCard
          title="German"
          onPress={() => {
            handlePress('gr');
          }}
          topRadius={wp(2.5)}
          divider={true}
          flagIcon={icons.GERMAN_FLAG}
        />
        <CustomCard
          title="English"
          onPress={() => {
            handlePress('en');
          }}
          divider={true}
          flagIcon={icons.ENGLAND_FLAG}
        />
        <CustomCard
          title="Spanish"
          onPress={() => {
            handlePress('sp');
          }}
          divider={true}
          flagIcon={icons.SPANISH_FLAG}
        />
        <CustomCard
          title="French"
          onPress={() => {
            handlePress('fr');
          }}
          divider={true}
          flagIcon={icons.FRENCH_FLAG}
        />
        <CustomCard
          title="Korean"
          onPress={() => {
            handlePress('ko');
          }}
          divider={true}
          flagIcon={icons.KOREAN_FLAG}
        />
        <CustomCard
          title="Chinese"
          onPress={() => {
            handlePress('ch');
          }}
          divider={true}
          flagIcon={icons.CHINESE_FLAG}
        />
        <CustomCard
          title="Turkish"
          onPress={() => {
            handlePress('tu');
          }}
          bottomRadius={wp(2.5)}
          divider={true}
          flagIcon={icons.TURKISH_FLAG}
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

export default Language;
