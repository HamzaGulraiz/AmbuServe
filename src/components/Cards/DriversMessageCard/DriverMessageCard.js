import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../../../assets/colors/colors';
import fonts from '../../../../assets/fonts/fonts';
import fontsizes from '../../../../assets/fontsizes/fontsizes';
import images from '../../../../assets/images/images';
import icons from '../../../../assets/icons/icons';
import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const DriverMessageCard = ({title, message}) => {
  return (
    <View
      style={{
        marginTop: hp(1),
        marginBottom: hp(1),
        height: hp(10),
        marginHorizontal: wp(2),
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'pink',
      }}>
      <Text
        numberOfLines={1}
        style={{
          fontFamily: fonts.REGULAR,
          fontSize: fontsizes.px_22,
          color: colors.BLACK,
          fontWeight: '700',
          // textAlign: 'left',
        }}>
        {title}
      </Text>
      <Text
        numberOfLines={2}
        style={{
          marginHorizontal: wp(4),
          fontFamily: fonts.REGULAR,
          fontSize: fontsizes.px_15,
          color: colors.GREY,
          fontWeight: '500',
          textAlign: 'center',
        }}>
        {message}
      </Text>
    </View>
  );
};

export default DriverMessageCard;

const styles = StyleSheet.create({});
