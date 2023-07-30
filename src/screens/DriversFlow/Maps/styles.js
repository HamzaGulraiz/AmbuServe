import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../../../assets/colors/colors';
import fonts from '../../../../assets/fonts/fonts';
import fontsizes from '../../../../assets/fontsizes/fontsizes';

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // justifyContent: 'center',
    // alignItems: 'center',
  },
  searchBarFrom: {
    marginTop: hp(2),
    paddingHorizontal: wp(5),
    position: 'absolute',
    // height: hp(6),
    width: '100%',
    zIndex: 1,
  },
  searchBarTo: {
    marginTop: hp(8),
    paddingHorizontal: wp(5),
    position: 'absolute',
    // height: hp(6),
    width: '100%',
    zIndex: 1,
  },
  map: {
    flex: 1,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
  },
  labelContaier: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  title: {
    width: wp(30),
    fontFamily: fonts.REGULAR,
    fontSize: fontsizes.px_22,
    color: colors.BLACK,
    fontWeight: '400',
    // marginBottom: hp(6),
    textAlign: 'center',
    // backgroundColor: 'red',
  },

  text: {
    width: wp(40),
    fontFamily: fonts.REGULAR,
    fontSize: fontsizes.px_22,
    color: colors.BLACK,
    fontWeight: '400',
    // marginBottom: hp(6),
    textAlign: 'left',
    // backgroundColor: 'green',
  },
});

export default styles;
