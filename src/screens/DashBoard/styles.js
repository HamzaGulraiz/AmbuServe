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
  drawerButton: {
    backgroundColor: '#0174CF',
    height: hp(5),
    width: wp(11),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(2),
  },
  drawerImage: {height: hp(4), width: wp(5)},
  userImage: {
    height: hp(4.5),
    width: wp(12),
  },
  logoutButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(14),
    borderWidth: wp(0.2),
    borderColor: colors.BLACK,
    height: hp(7),
    width: wp(14),
  },
  logoutButtonView: {
    // backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(2),
    marginHorizontal: wp(5),
    marginBottom: hp(8),
    // alignSelf: 'flex-end',
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
  SOSButtonView: {
    marginHorizontal: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(2),
    // backgroundColor: 'red',
  },
  SOSView: {
    // marginHorizontal: wp(5),
    // justifyContent: 'center',
    // alignItems: 'center',
    // marginBottom: hp(2),
    // backgroundColor: 'red',
  },
  SOSButton: {
    height: hp(14),
    width: wp(28),
  },
});

export default styles;
