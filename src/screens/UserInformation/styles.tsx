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
  logOutButton: {
    marginHorizontal: wp(5),
    marginTop: hp(4),
    marginBottom: hp(2),
  },
  userImage: {
    height: hp(14),
    width: wp(30),
    alignSelf: 'center',
  },
  imageButton: {
    // backgroundColor: 'red',
    marginHorizontal: wp(35),
    marginBottom: hp(2),
    // justifyContent: 'flex-end',
    // alignContent: 'center',
  },
  editButton: {
    marginHorizontal: wp(5),
    marginBottom: wp(2),
  },
  input: {
    marginHorizontal: wp(5),
    height: hp(6),
    borderRadius: wp(2),
    paddingLeft: wp(4),
    backgroundColor: colors.TRANSPARENT,

    fontWeight: '300',
    fontFamily: fonts.REGULAR,
    borderWidth: hp(0.15),
  },
  passwordInputView: {
    marginBottom: hp(0.5),
    justifyContent: 'center',
  },
  eyeIcon: {
    tintColor: colors.BLUE,
    height: hp(2),
    width: wp(3.8),
  },
});

export default styles;
