import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
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
// import Stars from 'react-native-stars';

// type CustomAlertProps = {
//   visible?: boolean;
//   name?: string;
//   number?: string;
//   pickup?: string;
//   dropoff?: string;
//   message?: string;
//   onPressClose?: () => void;
//   confirmButton?: () => void;
//   cancelButton?: () => void;
// };

const CustomSuccessAlert = ({visible, onPressClose, confirmButton}) => {
  // console.log('alert', pickup?.distance, dropoff?.distance);

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* {onPressClose ? (
            <TouchableOpacity style={styles.closeButton} onPress={onPressClose}>
              <Image
                style={styles.closeButtonIcon}
                source={icons.CROSS}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ) : null} */}
          <View
            style={{
              alignItems: 'center',
              marginTop: hp(2),
            }}>
            <Image
              source={images.STAR}
              resizeMode="contain"
              style={{
                height: wp(35),
                width: wp(35),
              }}
            />
          </View>
          <Text
            style={{
              marginTop: wp(4),
              fontFamily: fonts.REGULAR,
              fontSize: fontsizes.px_22,
              color: colors.BLACK,
              fontWeight: '700',
              textAlign: 'center',
            }}>
            Ride Successful
          </Text>
          <Text
            style={{
              marginTop: wp(2),
              fontFamily: fonts.REGULAR,
              fontSize: fontsizes.px_18,
              color: colors.BLACK,
              fontWeight: '400',
              textAlign: 'center',
            }}>
            how was your trip?
          </Text>
          <View
            style={{
              alignItems: 'center',
              marginTop: hp(2),
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: wp(16),
            }}>
            <Image
              source={icons.FULL_STAR}
              resizeMode="contain"
              style={{
                height: hp(5),
                width: wp(10),
                tintColor: colors.BLUE,
              }}
            />
            <Image
              source={icons.FULL_STAR}
              resizeMode="contain"
              style={{
                height: hp(5),
                width: wp(10),
                tintColor: colors.BLUE,
              }}
            />
            <Image
              source={icons.FULL_STAR}
              resizeMode="contain"
              style={{
                height: hp(5),
                width: wp(10),
                tintColor: colors.BLUE,
              }}
            />
            <Image
              source={icons.FULL_STAR}
              resizeMode="contain"
              style={{
                height: hp(5),
                width: wp(10),
                tintColor: colors.BLUE,
              }}
            />
            <Image
              source={icons.FULL_STAR}
              resizeMode="contain"
              style={{
                height: hp(5),
                width: wp(10),
                tintColor: colors.BLUE,
              }}
            />
            {/* <Stars
              default={1}
              count={5}
              half={true}
              starSize={50}
              fullStar={icons.FULL_STAR}
              emptyStar={icons.EMPTY_STAR}
              halfStar={icons.HALF_STAR}
            /> */}
          </View>
          <CustomButton
            title="Back to Home"
            textColor={colors.WHITE}
            backgroundColor={colors.BLUE}
            // activityIndicator={signInIsLoaded}
            marginTop={hp(6)}
            height={hp(6)}
            width={wp(80)}
            borderRadius={wp(2)}
            marginHorizontal={wp(5)}
            onPress={confirmButton}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  container: {
    width: '90%',
    height: hp(60),
    backgroundColor: '#FFFFFF',
    borderRadius: wp(2),
    overflow: 'hidden',
    marginTop: hp(10),
    borderRadius: wp(5),
    borderWidth: wp(0.2),
    // marginHorizontal: wp(5),
    borderColor: colors.BLACK,
    zIndex: 1,
  },
  closeButton: {
    marginLeft: wp(2),
    marginTop: hp(1),
    height: hp(3),
    width: wp(5),
  },
  closeButtonIcon: {
    height: '100%',
    width: '100%',
  },
  content: {
    marginHorizontal: wp(6),
  },
  labelContaier: {
    marginHorizontal: wp(2),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  messageContaier: {
    // marginHorizontal: wp(2),
  },
  title: {
    width: wp(35),
    fontFamily: fonts.REGULAR,
    fontSize: fontsizes.px_18,
    color: colors.BLACK,
    fontWeight: '400',
    textAlign: 'left',
    // backgroundColor: 'green',
  },
  message: {
    fontFamily: fonts.REGULAR,
    fontSize: fontsizes.px_24,
    color: colors.BLACK,
    fontWeight: '400',
    // marginTop: hp(4),
    marginBottom: hp(3),
    textAlign: 'center',
  },
  text: {
    width: wp(40),
    fontFamily: fonts.REGULAR,
    fontSize: fontsizes.px_22,
    color: colors.BLACK,
    fontWeight: '400',
    textAlign: 'left',
    // backgroundColor: 'blue',
  },
  titleIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(6),
  },
  titleIcon: {
    height: hp(5),
    width: wp(40),
  },
  myStarStyle: {
    color: colors.BLACK,
    backgroundColor: 'transparent',
    textShadowColor: 'black',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  myEmptyStarStyle: {
    color: 'white',
  },
});

export default CustomSuccessAlert;
