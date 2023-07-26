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

type CustomAlertProps = {
  visible?: boolean;
  name?: string;
  number?: string;
  pickup?: string;
  dropoff?: string;
  message?: string;
  onPressClose?: () => void;
  confirmButton?: () => void;
  cancelButton?: () => void;
};

const CustomAlert: React.FC<CustomAlertProps> = ({
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
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onPressClose}>
            <Image
              style={styles.closeButtonIcon}
              source={icons.CROSS}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={styles.content}>
            <View style={styles.titleIconContainer}>
              <Image
                style={styles.titleIcon}
                source={images.LOGO}
                resizeMode="contain"
              />
            </View>

            {message ? (
              <View style={styles.messageContaier}>
                <Text numberOfLines={1} style={styles.message}>
                  {message}
                </Text>
              </View>
            ) : null}
            {name ? (
              <View style={styles.labelContaier}>
                <Text style={styles.title}>Name:</Text>
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
                <Text style={styles.title}>From:</Text>
                <Text numberOfLines={1} style={styles.text}>
                  {pickup}
                </Text>
              </View>
            ) : null}
            {dropoff ? (
              <View style={styles.labelContaier}>
                <Text style={styles.title}>To:</Text>
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
              }}>
              <CustomButton
                title="Cancel"
                textColor={colors.WHITE}
                backgroundColor={colors.RED}
                // activityIndicator={signInIsLoaded}
                height={hp(6)}
                width={wp(30)}
                borderRadius={wp(2)}
                marginHorizontal={wp(5)}
                marginTop={hp(2)}
                // marginBottom={hp(2)}
                onPress={cancelButton}
              />
              <CustomButton
                title="Confirm"
                textColor={colors.WHITE}
                backgroundColor={colors.BLUE}
                // activityIndicator={signInIsLoaded}
                height={hp(6)}
                width={wp(30)}
                borderRadius={wp(2)}
                marginHorizontal={wp(5)}
                marginTop={hp(2)}
                // marginBottom={hp(2)}
                onPress={confirmButton}
              />
            </View>
          ) : null}
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
    justifyContent: 'center',
  },
  container: {
    width: '90%',
    height: hp(40),
    backgroundColor: '#FFFFFF',
    borderRadius: wp(2),
    overflow: 'hidden',
  },
  closeButton: {
    marginLeft: wp(2),
    marginTop: hp(1),
    // marginBottom: hp(2),
    height: hp(3),
    width: wp(5),
  },
  closeButtonIcon: {
    height: '100%',
    width: '100%',
  },
  content: {
    // marginTop: hp(1),
    // marginBottom: hp(1),
    // padding: 20,
    // backgroundColor: 'blue',
    marginHorizontal: wp(6),
  },
  labelContaier: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  messageContaier: {
    // flexDirection: 'row',
    // justifyContent: 'space-around',
    // alignItems: 'center',
  },
  title: {
    width: wp(30),
    fontFamily: fonts.REGULAR,
    fontSize: fontsizes.px_24,
    color: colors.BLACK,
    fontWeight: '400',
    // marginBottom: hp(6),
    textAlign: 'left',
    // backgroundColor: 'red',
  },
  message: {
    // width: wp(80),
    fontFamily: fonts.REGULAR,
    fontSize: fontsizes.px_24,
    color: colors.BLACK,
    fontWeight: '400',
    marginTop: hp(4),
    // marginBottom: hp(6),
    textAlign: 'center',
    // backgroundColor: 'green',
  },
  text: {
    width: wp(40),
    fontFamily: fonts.REGULAR,
    fontSize: fontsizes.px_24,
    color: colors.BLACK,
    fontWeight: '400',
    // marginBottom: hp(6),
    textAlign: 'left',
    // backgroundColor: 'green',
  },
  titleIconContainer: {
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(6),
  },
  titleIcon: {
    // resizeMode: 'contain',
    height: hp(5),
    width: wp(40),
  },
});

export default CustomAlert;

// {dataUsed ? (
//             <View>
//               <View style={styles.dataUsedView}>
//                 <View style={styles.dataUsedImageContainer}>
//                   <Image style={styles.titleIcon} source={icons.logo} />
//                 </View>
//                 <View style={styles.dataIcon}>
//                   <Image style={styles.titleIcon} source={icons.data} />
//                 </View>
//                 <View style={styles.textView}>
//                   <Text style={styles.dataText}>
//                     Data used: {dataUsed} MB of {totalData} MB
//                   </Text>
//                 </View>
//               </View>
//               <View style={styles.progressBarContainer}>
//                 <View style={styles.greyProgressBar}>
//                   <View
//                     style={{
//                       ...styles.blueProgressBar,
//                       width: `${dataPercentage}%`,
//                     }}></View>
//                 </View>
//               </View>
//               <Divider marginBottom={hp(5)} dividerColor={colors.black} />
//             </View>
//           ) : null}
