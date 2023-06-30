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
  marginTop,
  marginBottom,
  pictureIcon,
  onPressPictureIcon,
}) => {
  return (
    <View
      style={{
        ...styles.container,
        marginTop: marginTop ? marginTop : 0,
        marginBottom: marginBottom ? marginBottom : 0,
      }}>
      {leftIcon ? (
        <TouchableOpacity
          style={{
            ...styles.icon,
            position: 'absolute',
            left: wp(0),
            top: hp(1),
          }}
          onPress={onPressLeftIcon}>
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
      {title ? <Text style={styles.title}>{title}</Text> : null}
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
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    // flexDirection: 'row',
    marginHorizontal: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'blue',
  },
  title: {
    fontWeight: '700',
    fontSize: fontsizes.px_22,
    fontFamily: fonts.BOLD,
    color: colors.BLACK,
    textAlign: 'right',
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
