import React, {useState, useEffect, useRef} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../../assets/colors/colors';
import icons from '../../../assets/icons/icons';
import fonts from '../../../assets/fonts/fonts';
import images from '../../../assets/images/images';
import fontsizes from '../../../assets/fontsizes/fontsizes';
import CustomButton from '../Button/Button';

// type CustomALoadingProps = {
//   visible?: boolean;
// };

const CustomScreenLoading = ({visible}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Image
            source={images.LOGO}
            resizeMode="contain"
            style={styles.icon}
          />
          <ActivityIndicator size="large" color={colors.BLACK} />

          <View></View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomScreenLoading;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '60%',
    height: hp(20),
    backgroundColor: '#FFFFFF',
    borderRadius: wp(2),
    overflow: 'hidden',
    alignItems: 'center',
    // justifyContent: 'center',
    // marginHorizontal: wp(100),
  },
  icon: {
    marginTop: hp(4),
    marginBottom: hp(3),
    height: hp(4),
    width: wp(40),
  },
});
