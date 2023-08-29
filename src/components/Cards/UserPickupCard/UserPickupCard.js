import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../../../assets/colors/colors';
import fonts from '../../../../assets/fonts/fonts';
import fontsizes from '../../../../assets/fontsizes/fontsizes';
import images from '../../../../assets/images/images';
import icons from '../../../../assets/icons/icons';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';

const UserPickupCard = ({driverName, vehicleNumber, phoneCall}) => {
  return (
    <>
      <View
        style={{
          width: 'auto',
          // backgroundColor: 'red',
          justifyContent: 'center',
          alignItems: 'center',
          // marginTop: hp(1),
          marginBottom: hp(1),
        }}>
        <Image
          source={images.MESSAGE_IMAGE_1}
          resizeMode="contain"
          style={{
            height: hp(16),
            width: wp(40),
          }}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: wp(6),
          height: hp(10),
          borderRadius: wp(2),
          backgroundColor: '#e9eff2',
          // justifyContent: 'center',
          alignItems: 'center',

          // justifyContent:'space-between',
          // alignItems: 'center',
        }}>
        <Image
          source={images.DEFAULT_USER}
          resizeMode="contain"
          style={{
            // backgroundColor: 'green',
            marginLeft: wp(2),
            height: hp(8),
            width: wp(15),
            // borderRadius: wp(10),
            // marginRight: wp(5),
          }}
        />
        <View>
          <Text
            numberOfLines={1}
            style={{
              marginLeft: wp(2),
              // marg/inTop: hp(1),
              fontFamily: fonts.REGULAR,
              fontSize: fontsizes.px_18,
              color: colors.BLACK,
              fontWeight: '700',
              width: wp(30),
              // backgroundColor: 'pink',
              // textAlign: 'left',
            }}>
            {driverName}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              marginLeft: wp(2),
              // marginTop: hp(1),
              fontFamily: fonts.REGULAR,
              fontSize: fontsizes.px_12,
              color: colors.BLACK,
              fontWeight: '300',
              width: wp(30),
              // backgroundColor: 'pink',
              // textAlign: 'left',
            }}>
            {vehicleNumber}
          </Text>
        </View>
        <TouchableOpacity
          onPress={phoneCall}
          style={{
            // backgroundColor: 'red',
            width: wp(30),
            alignItems: 'flex-end',
          }}>
          <Image
            source={icons.PHONE_ICON}
            resizeMode="contain"
            style={{
              height: hp(6),
              width: wp(8),
            }}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default UserPickupCard;

const styles = StyleSheet.create({});
