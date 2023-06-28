import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {StyleSheet, Text, View, StatusBar, ImageBackground} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../../../assets/colors/colors';
import images from '../../../assets/images/images';

type CustomBackgroundProps = {
  children: JSX.Element;
};

const STYLES = ['default', 'light-content', 'dark-content'] as const;

const CustomBackground: React.FC<CustomBackgroundProps> = ({children}) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={colors.DARK.BACKGROUND}
        barStyle={STYLES[0]}
      />
      {children}
    </SafeAreaView>
  );
};

export default CustomBackground;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.DARK.BACKGROUND,
  },
});
