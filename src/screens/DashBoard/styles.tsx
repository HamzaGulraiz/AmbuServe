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
  userImage: {
    height: hp(6),
    width: wp(14),
    alignSelf: 'flex-end',
  },
  logoutButton: {
    // backgroundColor: 'red',
    marginTop: hp(2),
    marginHorizontal: wp(5),
    marginBottom: hp(8),
    // justifyContent: 'flex-end',
    // alignContent: 'center',
  },
  image: {
    marginHorizontal: wp(5),
    height: hp(30),
    width: wp(90),
    borderRadius: wp(30),
    // marginTop: hp(14),
    marginBottom: hp(5),
    // backgroundColor: 'red',
  },
  SOSView: {
    marginHorizontal: wp(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(2),
    // backgroundColor: 'red',
  },
  SOSButton: {
    height: hp(14),
    width: wp(28),
  },
});

export default styles;
