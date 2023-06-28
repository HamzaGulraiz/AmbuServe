import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../../assets/colors/colors';
import fonts from '../../../assets/fonts/fonts';
import fontsizes from '../../../assets/fontsizes/fontsizes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  TM_VERSION: {
    fontSize: fontsizes.px_12,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: fonts.REGULAR,
    marginBottom: wp(2.5),
  },
  logoView: {
    // backgroundColor: 'red',
    // width: '100%',
    alignItems: 'center',
    marginHorizontal: wp(30),
    marginBottom: hp(1),
  },
  image: {
    height: hp(5),
    width: hp(6.9),
  },
});

export default styles;
