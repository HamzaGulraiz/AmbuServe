import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../../../assets/colors/colors';
import fonts from '../../../../assets/fonts/fonts';
import fontsizes from '../../../../assets/fontsizes/fontsizes';
import images from '../../../../assets/images/images';
import icons from '../../../../assets/icons/icons';

import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';

const UserPaymentCard = ({paymentOnpress}) => {
  return (
    <View
      style={{
        // marginTop: hp(2),
        // marginHorizontal: wp(5),
        // position: 'absolute',
        height: hp(49),
        width: '100%',
        // width: wp(100),
        // borderRadius: wp(5),
        // borderWidth: wp(0.2),
        borderColor: colors.BLACK,
        zIndex: 1,
        bottom: hp(0),
        backgroundColor: colors.WHITE,
        // justifyContent: 'center',
      }}>
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
          Arrived Destination!
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
          AmbuServe is the right choice to serve as your ambulance service and
          event medical services provider.
        </Text>
      </View>
      <View
        style={{
          width: 'auto',
          // backgroundColor: 'red',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={images.PAYMENT_PHASE_ICON}
          resizeMode="contain"
          style={{
            height: hp(18),
            width: wp(30),
          }}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: wp(4),
          height: hp(11),
          borderRadius: wp(2),
          backgroundColor: '#e9eff2',
          // justifyContent: 'center',
          alignItems: 'center',

          // justifyContent:'space-between',
          // alignItems: 'center',
        }}>
        <View>
          <Text
            numberOfLines={2}
            style={{
              marginLeft: wp(2),
              // marg/inTop: hp(1),
              fontFamily: fonts.REGULAR,
              fontSize: fontsizes.px_18,
              color: colors.BLUE,
              fontWeight: '700',
              width: wp(45),
              // backgroundColor: 'pink',
              // textAlign: 'left',
            }}>
            Chosse payment method
          </Text>
        </View>
        <TouchableOpacity
          onPress={paymentOnpress}
          style={{
            // backgroundColor: 'red',
            // width: wp(40),
            alignItems: 'flex-end',
          }}>
          <Image
            source={icons.CASH_ICON}
            resizeMode="contain"
            style={{
              marginLeft: wp(10),
              height: hp(5),
              width: wp(7),
              tintColor: colors.BLUE,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={paymentOnpress}
          style={{
            // backgroundColor: 'red',
            // width: wp(40),
            alignItems: 'flex-end',
          }}>
          <Image
            source={icons.CREDIT_CARD_ICON}
            resizeMode="contain"
            style={{
              marginLeft: wp(4),
              height: hp(5),
              width: wp(7),
              tintColor: colors.BLUE,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={paymentOnpress}
          style={{
            // backgroundColor: 'red',
            // width: wp(40),
            alignItems: 'flex-end',
          }}>
          <Image
            source={icons.BANK_TRANSFER_ICON}
            resizeMode="contain"
            style={{
              marginLeft: wp(4),
              height: hp(5),
              width: wp(7),
              tintColor: colors.BLUE,
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserPaymentCard;

const styles = StyleSheet.create({});
