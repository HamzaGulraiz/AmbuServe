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
});

export default styles;
