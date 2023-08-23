import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../../../assets/colors/colors';
import fonts from '../../../../assets/fonts/fonts';
import fontsizes from '../../../../assets/fontsizes/fontsizes';
import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const DistanceCard = ({distance, duration}) => {
  return (
    <View
      style={{
        marginTop: hp(2),
        marginHorizontal: wp(5),
        position: 'absolute',
        height: hp(12),
        width: wp(90),
        borderRadius: wp(5),
        borderWidth: wp(0.2),
        borderColor: colors.BLACK,
        zIndex: 1,
        backgroundColor: colors.WHITE,
        justifyContent: 'center',
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: wp(5),
        }}>
        <Text
          numberOfLines={1}
          style={{
            fontWeight: '400',
            fontSize: fontsizes.px_22,
            fontFamily: fonts.REGULAR,
            color: colors.BLACK,
            textAlign: 'left',
          }}>
          Distance
        </Text>
        <Text
          numberOfLines={1}
          style={{
            fontWeight: '400',
            fontSize: fontsizes.px_22,
            fontFamily: fonts.REGULAR,
            color: colors.BLACK,
            width: wp(24),
            textAlign: 'right',
          }}>
          {distance}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: wp(5),
        }}>
        <Text
          numberOfLines={1}
          style={{
            fontWeight: '400',
            fontSize: fontsizes.px_22,
            fontFamily: fonts.REGULAR,
            color: colors.BLACK,
            textAlign: 'left',
          }}>
          Estimate time of travel
        </Text>
        <Text
          numberOfLines={1}
          style={{
            fontWeight: '400',
            fontSize: fontsizes.px_22,
            fontFamily: fonts.REGULAR,
            color: colors.BLACK,
            width: wp(24),
            textAlign: 'right',
          }}>
          {duration}
        </Text>
      </View>
    </View>
  );
};

export default DistanceCard;
