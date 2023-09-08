import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import fontsizes from '../../../assets/fontsizes/fontsizes';
import colors from '../../../assets/colors/colors';
import fonts from '../../../assets/fonts/fonts';

// type CustomButtonProps = {
//   onPress?: () => void;
//   title?: string;
//   height?: number;
//   width?: number;
//   backgroundColor?: string;
//   activityIndicator?: boolean;
//   leftIcon?: any;
//   marginTop?: number;
//   marginBottom?: number;
//   marginHorizontal?: number;
//   textColor?: string;
//   borderRadius?: number;
//   borderWidth?: number;
//   borderColor?: string;
//   disable?: boolean;
// };

const CustomButton = ({
  title,
  onPress,
  height,
  width,
  marginTop,
  leftIcon,
  rightIcon,
  marginBottom,
  marginHorizontal,
  textColor,
  backgroundColor,
  borderRadius,
  borderWidth,
  borderColor,
  activityIndicator,
  disable,
}) => {
  return (
    <TouchableOpacity
      style={{
        ...styles.button,
        backgroundColor: backgroundColor ? backgroundColor : colors.TRANSPARENT,
        width: width ? width : '100%',
        marginHorizontal: marginHorizontal ? marginHorizontal : 0,
        height: height ? height : 0,
        marginTop: marginTop ? marginTop : 0,
        marginBottom: marginBottom ? marginBottom : 0,
        borderRadius: borderRadius ? borderRadius : 0,
        borderWidth: borderWidth ? borderWidth : 0,
        borderColor: borderColor ? borderColor : colors.TRANSPARENT,
      }}
      disabled={disable}
      onPress={onPress}>
      {activityIndicator ? (
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator
            size="small"
            color={colors.BLACK}
            style={
              {
                // marginLeft: wp(40),
                // alignContent: 'center',
              }
            }
          />
        </View>
      ) : (
        <>
          {leftIcon ? (
            <Image
              source={leftIcon}
              resizeMode="contain"
              tintColor={colors.WHITE}
              style={{...styles.icon, position: 'absolute', marginLeft: wp(10)}}
            />
          ) : null}
          <Text
            style={{
              ...styles.text,
              color: textColor ? textColor : colors.BLACK,
              width: '100%',
              textAlign: 'center',
              // marginLeft: leftIcon ? wp(1) : 0,
            }}>
            {title}
          </Text>
          {rightIcon ? (
            <Image
              source={rightIcon}
              resizeMode="contain"
              tintColor={colors.WHITE}
              style={{...styles.icon, position: 'absolute', right: wp(12)}}
            />
          ) : null}
        </>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: fontsizes.px_18,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: fonts.REGULAR,
  },
  icon: {
    // backgroundColor: 'red',
    // height: hp(2.7),
    height: hp(5.2),
    width: wp(12),
    // width: wp(5.8),
  },
});
