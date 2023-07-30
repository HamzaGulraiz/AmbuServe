import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  Image,
  Text,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ToastAndroid,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
  ImageSourcePropType,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import MapView, {Marker, Callout} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import CustomHeader from '../../../components/HeaderBar/Header';
import colors from '../../../../assets/colors/colors';
import fonts from '../../../../assets/fonts/fonts';
import fontsizes from '../../../../assets/fontsizes/fontsizes';

let tripsData = [
  {
    id: 0,
    date: '1/04/22',
    from: 'form',
    to: 'here',
  },
  {
    id: 1,
    date: '1/04/22',
    from: 'form',
    to: 'here',
  },
  {
    id: 2,
    date: '1/04/22',
    from: 'form',
    to: 'here',
  },
  {
    id: 3,
    date: '1/04/22',
    from: 'form',
    to: 'here',
  },
  {
    id: 4,
    date: '1/04/22',
    from: 'form',
    to: 'here',
  },
  {
    id: 5,
    date: '1/04/22',
    from: 'form',
    to: 'here',
  },
  {
    id: 6,
    date: '1/04/22',
    from: 'form',
    to: 'here',
  },
  {
    id: 7,
    date: '1/04/22',
    from: 'form',
    to: 'here',
  },
  {
    id: 8,
    date: '1/04/22',
    from: 'form',
    to: 'here',
  },
  {
    id: 9,
    date: '1/04/22',
    from: 'form',
    to: 'here',
  },
];

const Activity = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Activity" marginTop={hp(2)} marginBottom={hp(6)} />
      <ScrollView style={styles.tripCardView}>
        {tripsData.map(item => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardInfoView}>
              <Text
                style={{
                  textAlign: 'left',
                  color: colors.GREY,
                  fontWeight: '300',
                  fontFamily: fonts.BOLD,
                  fontSize: fontsizes.px_16,
                }}>
                {item.date}
              </Text>
              <Text
                style={{
                  textAlign: 'left',
                  color: colors.BLACK,
                  fontWeight: '300',
                  fontFamily: fonts.BOLD,
                  fontSize: fontsizes.px_16,
                }}>
                {item.from}
              </Text>
              <Text
                style={{
                  textAlign: 'left',
                  color: colors.BLACK,
                  fontWeight: '300',
                  fontFamily: fonts.BOLD,
                  fontSize: fontsizes.px_16,
                }}>
                {item.to}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Activity;
