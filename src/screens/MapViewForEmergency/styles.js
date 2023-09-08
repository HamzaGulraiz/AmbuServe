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
  rideConnectedCardView: {
    height: hp(44),
    width: '100%',
    borderColor: colors.BLACK,
    zIndex: 1,
    bottom: hp(0),
    backgroundColor: colors.WHITE,
  },
});

export default styles;
