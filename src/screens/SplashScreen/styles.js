import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    marginHorizontal: wp(5),
    height: hp(10),
    marginBottom: hp(28),
  },
});

export default styles;
