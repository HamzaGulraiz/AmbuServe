import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import colors from '../../../assets/colors/colors';
import Divider from '../Divider/Divider';
import {TouchableOpacity} from 'react-native-gesture-handler';
import fonts from '../../../assets/fonts/fonts';
import fontsizes from '../../../assets/fontsizes/fontsizes';
import icons from '../../../assets/icons/icons';

type CustomCardProps = {
  onPress?: () => void;
  title?: string;
  textColor?: string;
  leftIcon?: any;
  leftIconTintColor?: string;
  flagIcon?: any;
  switchButton?: boolean;
  selectedText?: string;
  selectTextColor?: string;
  height?: number;
  width?: number;
  divider?: boolean;
  backgroundColor?: string;
  marginTop?: number;
  marginBottom?: number;
  marginHorizontal?: number;
  radius?: number;
  topRadius?: number;
  bottomRadius?: number;
};

const CustomCard: React.FC<CustomCardProps> = ({
  onPress,
  title,
  textColor,
  leftIcon,
  leftIconTintColor,
  flagIcon,
  switchButton,
  selectedText,
  selectTextColor,
  divider,
  height,
  width,
  backgroundColor,
  marginTop,
  marginBottom,
  marginHorizontal,
  radius,
  topRadius,
  bottomRadius,
}) => {
  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        style={{
          ...styles.container,
          backgroundColor: backgroundColor ? backgroundColor : colors.DARK.CARD,
          height: height ? height : hp(6.8),
          width: width ? width : wp(88.8),
          marginHorizontal: marginHorizontal ? marginHorizontal : wp(5.5),
          borderRadius: radius ? radius : 0,
          borderTopStartRadius: topRadius ? topRadius : 0,
          borderTopEndRadius: topRadius ? topRadius : 0,
          borderBottomStartRadius: bottomRadius ? bottomRadius : 0,
          borderBottomEndRadius: bottomRadius ? bottomRadius : 0,
          marginTop: marginTop ? marginTop : 0,
          marginBottom: marginBottom ? marginBottom : 0,
        }}>
        {leftIcon ? (
          <Image
            source={leftIcon}
            resizeMode="contain"
            style={{
              ...styles.icon,
              tintColor: leftIconTintColor
                ? leftIconTintColor
                : colors.DARK.WHITE_BUTTON,
            }}
          />
        ) : null}
        {flagIcon ? (
          <Image
            source={flagIcon}
            resizeMode="contain"
            style={styles.flagIcon}
          />
        ) : null}
        <Text
          numberOfLines={1}
          style={{...styles.title, color: colors.DARK.WHITE_TEXT}}>
          {title}
        </Text>
        {selectedText ? (
          <Text
            numberOfLines={1}
            style={{
              ...styles.selectedText,
              color: selectTextColor ? selectTextColor : colors.DARK.WHITE_TEXT,
            }}>
            {selectedText}
          </Text>
        ) : null}
        <Image
          source={icons.FORWARD_ARROW}
          resizeMode="contain"
          style={styles.arrowIcon}
        />
      </TouchableOpacity>
      {divider ? (
        <Divider height={hp(0.117)} width={wp(88.8)} />
      ) : (
        <Divider
          height={hp(0.117)}
          dividerColor={colors.DARK.TRANSPARENT}
          width={wp(88.8)}
        />
      )}
    </>
  );
};

export default CustomCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: wp(5.5),
    alignItems: 'center',
    // backgroundColor: 'blue',
  },
  title: {
    width: wp(45),
    fontSize: fontsizes.px_15,
    fontWeight: '500',
    textAlign: 'left',
    fontFamily: fonts.REGULAR,
    marginLeft: wp(4.8),
    // backgroundColor: 'red',
  },
  selectedText: {
    // backgroundColor: 'red',
    width: wp(15),
    fontSize: fontsizes.px_12,
    fontWeight: '500',
    textAlign: 'right',
    fontFamily: fonts.REGULAR,
    // position: 'absolute',
  },
  icon: {
    marginLeft: wp(5.8),
    height: hp(2.81),
    width: wp(6.1),
  },
  flagIcon: {
    marginLeft: wp(5.8),
    height: hp(4.6),
    width: wp(8),
  },
  arrowIcon: {
    position: 'absolute',
    right: wp(2.5),
    bottom: hp(2.4),
    height: hp(2.81),
    width: wp(6.1),
  },
});
