import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import icons from '../../../assets/icons/icons';
import colors from '../../../assets/colors/colors';
import fonts from '../../../assets/fonts/fonts';
import fontsizes from '../../../assets/fontsizes/fontsizes';

type CustomHeaderProps = {
  title?: string;
  leftIcon?: ImageSourcePropType;
  onPressLeftIcon?(): void;
  rightIcon?: ImageSourcePropType;
  onPressRightIcon?(): void;
  secondRightIcon?: ImageSourcePropType;
  onPressSecondRightIcon?(): void;
  thirdRightIcon?: ImageSourcePropType;
  onPressThirdRightIcon?(): void;
  marginTop?: number;
  marginBottom?: number;
  pictureIcon?: ImageSourcePropType;
  onPressPictureIcon?(): void;
};

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  leftIcon,
  onPressLeftIcon,
  rightIcon,
  onPressRightIcon,
  secondRightIcon,
  onPressSecondRightIcon,
  thirdRightIcon,
  onPressThirdRightIcon,
  marginTop,
  marginBottom,
  pictureIcon,
  onPressPictureIcon,
}) => {
  return (
    <View
      style={{
        ...styles.container,
        marginTop: marginTop ? marginTop : hp(3),
        marginBottom: marginBottom ? marginBottom : 0,
      }}>
      {pictureIcon ? (
        <TouchableOpacity
          style={styles.pictureIcon}
          onPress={onPressPictureIcon}>
          <Image
            source={pictureIcon}
            resizeMode="contain"
            style={styles.image}
          />
        </TouchableOpacity>
      ) : null}
      {leftIcon ? (
        <TouchableOpacity style={styles.icon} onPress={onPressLeftIcon}>
          <Image source={leftIcon} resizeMode="contain" style={styles.image} />
        </TouchableOpacity>
      ) : null}
      {rightIcon ? (
        <TouchableOpacity
          style={{...styles.rightIcon, position: 'absolute', right: wp(0)}}
          onPress={onPressRightIcon}>
          <Image source={rightIcon} resizeMode="contain" style={styles.image} />
        </TouchableOpacity>
      ) : null}
      {secondRightIcon ? (
        <TouchableOpacity
          style={{...styles.rightIcon, position: 'absolute', right: wp(12)}}
          onPress={onPressSecondRightIcon}>
          <Image
            source={secondRightIcon}
            resizeMode="contain"
            style={styles.image}
          />
        </TouchableOpacity>
      ) : null}
      {thirdRightIcon ? (
        <TouchableOpacity
          style={{...styles.rightIcon, position: 'absolute', right: wp(24)}}
          onPress={onPressThirdRightIcon}>
          <Image
            source={thirdRightIcon}
            resizeMode="contain"
            style={styles.image}
          />
        </TouchableOpacity>
      ) : null}
      {title ? <Text style={styles.title}>{title}</Text> : null}
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: wp(5.5),
    alignItems: 'center',
    // backgroundColor: 'blue',
  },
  title: {
    // marginRight: wp(2),
    marginLeft: wp(6),
    fontWeight: '700',
    fontSize: fontsizes.px_22,
    fontFamily: fonts.BOLD,
    color: colors.DARK.WHITE_TEXT,
  },
  icon: {
    height: hp(2),
    width: wp(5.8),
  },
  rightIcon: {
    height: hp(4.9),
    width: wp(10.6),
  },
  pictureIcon: {
    height: hp(4),
    width: wp(8.6),
  },
  image: {
    height: '100%',
    width: '100%',
  },
});
