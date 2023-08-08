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

const CustomAlert = ({
  visible,
  name,
  number,
  pickup,
  dropoff,
  message,
  onPressClose,
  confirmButton,
  cancelButton,
}) => {
  // console.log('alert', pickup?.distance, dropoff?.distance);
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {onPressClose ? (
            <TouchableOpacity style={styles.closeButton} onPress={onPressClose}>
              <Image
                style={styles.closeButtonIcon}
                source={icons.CROSS}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ) : null}
          {message ? (
            <View style={styles.messageContaier}>
              <Text numberOfLines={2} style={styles.message}>
                {message}
              </Text>
            </View>
          ) : null}
          {name ? (
            <View style={styles.labelContaier}>
              <Text style={styles.title}>Rider name:</Text>
              <Text numberOfLines={1} style={styles.text}>
                {name}
              </Text>
            </View>
          ) : null}
          {number ? (
            <View style={styles.labelContaier}>
              <Text style={styles.title}>Number: </Text>
              <Text numberOfLines={1} style={styles.text}>
                {number}
              </Text>
            </View>
          ) : null}
          {pickup ? (
            <View style={styles.labelContaier}>
              <Text style={styles.title}>Pickup Distance:</Text>
              <Text numberOfLines={1} style={styles.text}>
                {pickup}
              </Text>
            </View>
          ) : null}
          {dropoff ? (
            <View style={styles.labelContaier}>
              <Text style={styles.title}>Drop Distance:</Text>
              <Text numberOfLines={1} style={styles.text}>
                {dropoff}
              </Text>
            </View>
          ) : null}
        </View>
        {confirmButton ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              marginTop: hp(1),
            }}>
            <TouchableOpacity
              onPress={cancelButton}
              style={{
                height: hp(6),
                width: wp(35),
                backgroundColor: colors.RED,
                borderRadius: wp(2),
                marginHorizontal: wp(5),
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontWeight: '400',
                  fontSize: fontsizes.px_18,
                  fontFamily: fonts.REGULAR,
                  color: colors.WHITE,
                  textAlign: 'center',
                }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={confirmButton}
              style={{
                height: hp(6),
                width: wp(35),
                backgroundColor: colors.BLUE,
                borderRadius: wp(2),
                marginHorizontal: wp(5),
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontWeight: '400',
                  fontSize: fontsizes.px_18,
                  fontFamily: fonts.REGULAR,
                  color: colors.WHITE,
                  textAlign: 'center',
                }}>
                Confirm
              </Text>
            </TouchableOpacity>
            {/* <CustomButton
              title="Cancel"
              textColor={colors.WHITE}
              backgroundColor={colors.RED}
              // activityIndicator={signInIsLoaded}
              height={hp(6)}
              width={wp(35)}
              borderRadius={wp(2)}
              marginHorizontal={wp(5)}
              // marginTop={hp(2)}
              onPress={cancelButton}
            />
            <CustomButton
              title="Confirm"
              textColor={colors.WHITE}
              backgroundColor={colors.BLUE}
              // activityIndicator={signInIsLoaded}
              height={hp(6)}
              width={wp(35)}
              borderRadius={wp(2)}
              marginHorizontal={wp(5)}
              // marginTop={hp(1)}
              onPress={confirmButton}
            /> */}
          </View>
        ) : null}
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
    // height: hp(40),
    backgroundColor: '#FFFFFF',
    borderRadius: wp(2),
    overflow: 'hidden',
    marginTop: hp(2),
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
});

export default CustomAlert;
