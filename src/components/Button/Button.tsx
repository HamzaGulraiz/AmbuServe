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

type CustomButtonProps = {
  onPress: () => void;
  title: string;
  height: number;
  width: number;
  backgroundColor: string;
  activityIndicator?: boolean;
  leftIcon?: any;
  marginTop?: number;
  marginBottom?: number;
  marginHorizontal?: number;
  textColor?: string;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
};

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  height,
  width,
  marginTop,
  leftIcon,
  marginBottom,
  marginHorizontal,
  textColor,
  backgroundColor,
  borderRadius,
  borderWidth,
  borderColor,
  activityIndicator,
}) => {
  return (
    <TouchableOpacity
      style={{
        ...styles.button,
        backgroundColor: backgroundColor
          ? backgroundColor
          : colors.DARK.TRANSPARENT,
        width: width ? width : '100%',
        marginHorizontal: marginHorizontal ? marginHorizontal : 0,
        height: height ? height : 0,
        marginTop: marginTop ? marginTop : 0,
        marginBottom: marginBottom ? marginBottom : 0,
        borderRadius: borderRadius ? borderRadius : 0,
        borderWidth: borderWidth ? borderWidth : 0,
        borderColor: borderColor ? borderColor : colors.DARK.TRANSPARENT,
      }}
      onPress={onPress}>
      {activityIndicator ? (
        <ActivityIndicator size="small" color={colors.DARK.BLACK_TEXT} />
      ) : (
        <>
          {leftIcon ? (
            <Image source={leftIcon} resizeMode="contain" style={styles.icon} />
          ) : null}
          <Text
            style={{
              ...styles.text,
              color: textColor ? textColor : colors.DARK.BLACK_TEXT,
              marginLeft: leftIcon ? wp(2) : 0,
            }}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    // marginHorizontal: wp(6.4),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: fontsizes.px_15,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: fonts.REGULAR,
  },
  icon: {
    height: hp(2.7),
    width: wp(5.8),
  },
});
