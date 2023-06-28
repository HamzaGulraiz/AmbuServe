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
import {LANGUAGE, THEME} from '../../constants/Navigator';

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

const Settings = () => {
  const navigation = useNavigation<NavigationProps>();

  return (
    <CustomBackground>
      <View style={styles.container}>
        <CustomHeader title="Settings" marginBottom={hp(5)} />
        <CustomCard
          title="Manage Wallets"
          divider={true}
          topRadius={wp(2.5)}
          leftIcon={icons.WALLET}
          leftIconTintColor="black"
        />
        <CustomCard
          title="Security Center"
          bottomRadius={wp(2.5)}
          marginBottom={hp(2)}
          leftIcon={icons.WALLET}
          leftIconTintColor="black"
        />
        <CustomCard
          title="Wallet Connet"
          topRadius={wp(2.5)}
          bottomRadius={wp(2.5)}
          marginBottom={hp(2)}
          leftIcon={icons.WALLET}
          leftIconTintColor="black"
        />
        <CustomCard
          title="Launch Screen"
          divider={true}
          topRadius={wp(2.5)}
          leftIcon={icons.WALLET}
          leftIconTintColor="black"
        />
        <CustomCard
          title="Base Currency"
          divider={true}
          leftIcon={icons.WALLET}
          leftIconTintColor="black"
          selectedText="USD"
        />
        <CustomCard
          title="Language"
          onPress={() => {
            navigation.navigate(LANGUAGE);
          }}
          divider={true}
          leftIcon={icons.WALLET}
          leftIconTintColor="black"
          selectedText="English"
        />
        <CustomCard
          title="Theme"
          onPress={() => {
            navigation.navigate(THEME);
          }}
          divider={true}
          leftIcon={icons.WALLET}
          leftIconTintColor="black"
          selectedText="Dark"
        />
        <CustomCard
          title="Experimental"
          bottomRadius={wp(2.5)}
          leftIcon={icons.WALLET}
          leftIconTintColor="black"
          marginBottom={hp(3.2)}
        />

        <Text style={{...styles.TM_VERSION, color: colors.DARK.WHITE_TEXT}}>
          TPBX Coin 1.0.9
        </Text>
        <Divider height={hp(0.117)} width={wp(30)} marginBottom={hp(1)} />
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
    </CustomBackground>
  );
};

export default Settings;
