import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // justifyContent: 'center',
    // alignItems: 'center',
  },

  tripCardView: {
    paddingHorizontal: wp(5),
  },

  card: {
    backgroundColor: '#FFFFFA',
    // flexDirection: 'row',
    // alignItems: 'center',
    height: hp(26),
    // width: wp(86.6),
    paddingLeft: wp(6),
    marginBottom: hp(1.125),
    borderRadius: wp(2),
    elevation: hp(0.5),
    // backgroundColor: 'pink',
  },
  cardInfoView: {
    flexDirection: 'row',
    // height: hp(2),
    marginTop: hp(0.5),
    // marginBottom: hp(1),
    // alignItems: 'center',
    // justifyContent: 'space-between',
    // width: wp(80),
  },
});

export default styles;
