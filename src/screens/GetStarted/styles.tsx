import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import fonts from '../../../assets/fonts/fonts';
import colors from '../../../assets/colors/colors';
import fontsizes from '../../../assets/fontsizes/fontsizes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageView: {
    // marginTop: hp(13.7),
    marginTop: hp(19),
    marginBottom: hp(8.3),
    marginHorizontal: wp(26.2),
    width: wp(47.8),
    height: hp(22),
  },
  image: {
    height: '100%',
    width: '100%',
  },
  title: {
    marginBottom: hp(1.6),
    fontWeight: '800',
    fontFamily: fonts.REGULAR,
    fontSize: fontsizes.px_25,
    color: colors.DARK.WHITE_TEXT,
    textAlign: 'center',
  },
  description: {
    marginHorizontal: wp(13.2),
    marginBottom: hp(4.1),
    fontWeight: '500',
    fontFamily: fonts.LIGHT,
    fontSize: fontsizes.px_15,
    color: colors.DARK.WHITE_TEXT,
    textAlign: 'center',
  },
  dotView: {
    marginHorizontal: wp(40),
    marginBottom: hp(12),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    // backgroundColor: 'white',
  },
  dot: {
    height: hp(1.5),
    width: wp(3),
    borderRadius: wp(3),
  },
});

export default styles;
