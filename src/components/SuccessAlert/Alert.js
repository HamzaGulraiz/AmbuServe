import React, {useState} from 'react';
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
import {Rating, AirbnbRating} from 'react-native-ratings';
import {TextInput} from 'react-native-gesture-handler';

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
  const [text, onChangeText] = useState('');
  const [complainState, SetComplainState] = useState(false);
  const handleComplain = () => {
    SetComplainState(true);
  };
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View
          style={{
            ...styles.container,
            height: complainState ? hp(45) : hp(60),
          }}>
          {/* {onPressClose ? (
            <TouchableOpacity style={styles.closeButton} onPress={onPressClose}>
              <Image
                style={styles.closeButtonIcon}
                source={icons.CROSS}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ) : null} */}
          {complainState ? (
            <View>
              <Text
                style={{
                  marginTop: wp(4),
                  fontFamily: fonts.REGULAR,
                  fontSize: fontsizes.px_22,
                  color: colors.BLACK,
                  fontWeight: '700',
                  textAlign: 'center',
                }}>
                Complain
              </Text>
              <TextInput
                // style={styles.input}
                onChangeText={onChangeText}
                value={text}
                style={{
                  ...styles.input,
                  borderColor: colors.BLACK,
                  // marginBottom: hp(2),
                  color: colors.BLACK,
                  textAlignVertical: 'top',
                }}
                numberOfLines={10}
                multiline={true}
                maxLength={200}
              />
              <CustomButton
                title="Back"
                textColor={colors.WHITE}
                backgroundColor={colors.BLUE}
                // leftIcon={icons.BACK_ARROW_FOR_BUTTON}
                // activityIndicator={signInIsLoaded}
                marginTop={hp(3)}
                height={hp(6)}
                width={wp(80)}
                borderRadius={wp(2)}
                marginHorizontal={wp(5)}
                onPress={() => {
                  SetComplainState(false);
                }}
              />
              <CustomButton
                title="Submit"
                textColor={colors.WHITE}
                backgroundColor={'#ffb300'}
                // rightIcon={icons.FORWARD_ARROW_FOR_BUTTON}
                // activityIndicator={signInIsLoaded}
                marginTop={hp(2)}
                height={hp(6)}
                width={wp(80)}
                borderRadius={wp(2)}
                marginHorizontal={wp(5)}
                onPress={confirmButton}
              />
            </View>
          ) : (
            <>
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

              <AirbnbRating
                reviewColor="black"
                // selectedColor="#1e90ff"
                selectedColor={colors.BLUE}
                count={5}
                reviews={['bad', 'OK', 'Good', 'Very Good', 'Amazing']}
                defaultRating={3}
                size={30}
              />
              <CustomButton
                title="Back to Home"
                textColor={colors.WHITE}
                backgroundColor={colors.BLUE}
                leftIcon={icons.BACK_ARROW_FOR_BUTTON}
                // activityIndicator={signInIsLoaded}
                marginTop={hp(3)}
                height={hp(6)}
                width={wp(80)}
                borderRadius={wp(2)}
                marginHorizontal={wp(5)}
                onPress={confirmButton}
              />
              <CustomButton
                title="Complain"
                textColor={colors.WHITE}
                backgroundColor={'#ffb300'}
                rightIcon={icons.FORWARD_ARROW_FOR_BUTTON}
                // activityIndicator={signInIsLoaded}
                marginTop={hp(2)}
                height={hp(6)}
                width={wp(80)}
                borderRadius={wp(2)}
                marginHorizontal={wp(5)}
                onPress={handleComplain}
              />
            </>
          )}
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

  input: {
    marginTop: hp(2),
    marginHorizontal: wp(4),
    height: hp(15),
    // margin: 12,
    borderWidth: 1,
    borderRadius: wp(2),
    padding: wp(2),
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
