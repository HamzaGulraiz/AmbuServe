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
  tripCardView: {
    paddingHorizontal: wp(5),
  },

  card: {
    backgroundColor: '#FFFFFA',
    flexDirection: 'row',
    alignItems: 'center',
    height: hp(12),
    // width: wp(86.6),
    paddingLeft: wp(6),
    marginBottom: hp(1.125),
    borderRadius: wp(2),
    elevation: hp(0.5),
  },
  cardInfoView: {},
});

export default styles;
