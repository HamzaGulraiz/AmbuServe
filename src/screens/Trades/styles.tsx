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
    // backgroundColor: colors.backGround,
  },
  card: {
    height: hp(9.2),
    width: wp(21.7),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIcon: {
    height: hp(4.9),
    width: wp(10.6),
  },
  cardTitle: {
    fontWeight: '400',
    fontSize: fontsizes.px_12,
    fontFamily: fonts.Bold,
    color: colors.WHITE_LIGHT_TEXT,
    textAlign: 'center',
  },
});

export default styles;
