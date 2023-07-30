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
  tcP: {
    marginTop: hp(1),
    marginBottom: hp(1),
    fontSize: fontsizes.px_13,
    fontFamily: fonts.REGULAR,
    color:  colors.BLACK,
},
// tcP:{
//     marginTop: 10,
//     fontSize: 12
// },
tcL:{
    marginLeft: wp(2),
    marginTop: hp(1),
    marginBottom: hp(1),
    fontSize: fontsizes.px_13,
    fontFamily: fonts.REGULAR,
    color:  colors.BLACK,
},
});

export default styles;
