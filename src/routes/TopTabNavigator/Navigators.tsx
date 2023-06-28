import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import fontsizes from '../../../assets/fontsizes/fontsizes';
import fonts from '../../../assets/fonts/fonts';
import colors from '../../../assets/colors/colors';

type CustomTopTabProps = {
  setFormButton?: any;
  formButton?: any;
};

const CustomTopTabNavigator: React.FC<CustomTopTabProps> = ({
  formButton,
  setFormButton,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          setFormButton('Signin');
        }}
        style={{
          ...styles.button,
          backgroundColor:
            formButton === 'Signin'
              ? colors.BACKGROUND
              : colors.CARD_BACKGROUND,
        }}>
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setFormButton('Signup');
        }}
        style={{
          ...styles.button,
          backgroundColor:
            formButton === 'Signup'
              ? colors.BACKGROUND
              : colors.CARD_BACKGROUND,
        }}>
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomTopTabNavigator;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: wp(5.7),
    height: hp(5.5),
    borderRadius: wp(2.9),
    backgroundColor: colors.CARD_BACKGROUND,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(6),
  },
  buttonText: {
    fontWeight: '400',
    fontSize: fontsizes.px_14,
    fontFamily: fonts.Regular,
    color: colors.WHITE_LIGHT_TEXT,
  },
  button: {
    marginHorizontal: wp(1),
    height: hp(4.2),
    width: wp(42),
    borderRadius: wp(2.9),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
