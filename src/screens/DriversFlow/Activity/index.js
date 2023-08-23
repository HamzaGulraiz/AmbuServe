import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  Text,
  SafeAreaView,
  View,
  RefreshControl,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
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
import {useTypedSelector} from '../../../redux/Store';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import {setDriverActivity} from '../../../redux/Action';
import {BASE_URL} from '../../../../config';

const Activity = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const driverInfoString = useTypedSelector(state => state.reducer.driverInfo);
  const driverInfo = JSON.parse(driverInfoString);
  const {driver_contact} = driverInfo;
  const driverActivityObject = useTypedSelector(
    state => state.reducer.driverActivity,
  );
  const driverActivity = driverActivityObject.drivers;
  console.log(typeof driverActivity, 'driverActivity', driverActivity);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    reCallDriverActivityApi();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const reCallDriverActivityApi = () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${BASE_URL}/driver/rides/${driver_contact}`,
      // url: `http://192.168.100.21:8080/driver/rides/03244421921`,
      headers: {},
    };

    axios
      .request(config)
      .then(response => {
        dispatch(setDriverActivity(response.data));
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Activity" marginTop={hp(2)} marginBottom={hp(6)} />

      {driverActivity === undefined || driverActivity.length < 1 ? (
        <ScrollView
          contentContainerStyle={{flex: 1, justifyContent: 'center'}}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <Text
            style={{
              textAlign: 'center',
              color: colors.GREY,
              fontWeight: '500',
              fontFamily: fonts.BOLD,
              fontSize: fontsizes.px_25,
            }}>
            No Activity
          </Text>
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={styles.tripCardView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {driverActivity.map(item => (
            <View key={item._id} style={styles.card}>
              <Text
                style={{
                  marginTop: hp(1),
                  textAlign: 'center',
                  color: colors.GREY,
                  fontWeight: '300',
                  fontFamily: fonts.BOLD,
                  fontSize: fontsizes.px_16,
                }}>
                {item.date}
              </Text>
              <View style={styles.cardInfoView}>
                <Text
                  style={{
                    // marginTop: hp(1),
                    textAlign: 'left',
                    width: wp(40),
                    color: colors.BLACK,
                    fontWeight: '500',
                    fontFamily: fonts.REGULAR,
                    fontSize: fontsizes.px_16,
                    // backgroundColor: 'green',
                  }}>
                  Request Type
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    textAlign: 'left',
                    width: wp(40),
                    color: colors.BLACK,
                    fontWeight: '700',
                    fontFamily: fonts.REGULAR,
                    fontSize: fontsizes.px_16,
                    // backgroundColor: 'green',
                  }}>
                  {item.type}
                </Text>
              </View>
              <View style={styles.cardInfoView}>
                <Text
                  style={{
                    // marginTop: hp(1),
                    textAlign: 'left',
                    width: wp(40),
                    color: colors.BLACK,
                    fontWeight: '500',
                    fontFamily: fonts.REGULAR,
                    fontSize: fontsizes.px_16,
                    // backgroundColor: 'green',
                  }}>
                  Rider Name
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    textAlign: 'left',
                    width: wp(40),
                    color: colors.BLACK,
                    fontWeight: '700',
                    fontFamily: fonts.REGULAR,
                    fontSize: fontsizes.px_16,
                    // backgroundColor: 'green',
                  }}>
                  {item.full_name}
                </Text>
              </View>
              <View style={styles.cardInfoView}>
                <Text
                  style={{
                    // marginTop: hp(1),
                    textAlign: 'left',
                    width: wp(40),
                    color: colors.BLACK,
                    fontWeight: '500',
                    fontFamily: fonts.REGULAR,
                    fontSize: fontsizes.px_16,
                    // backgroundColor: 'green',
                  }}>
                  Rider Number
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    textAlign: 'left',
                    width: wp(40),
                    color: colors.BLACK,
                    fontWeight: '700',
                    fontFamily: fonts.REGULAR,
                    fontSize: fontsizes.px_16,
                    // backgroundColor: 'green',
                  }}>
                  {item.contact}
                </Text>
              </View>
              <View style={styles.cardInfoView}>
                <Text
                  style={{
                    // marginTop: hp(1),
                    textAlign: 'left',
                    width: wp(40),
                    color: colors.BLACK,
                    fontWeight: '500',
                    fontFamily: fonts.REGULAR,
                    fontSize: fontsizes.px_16,
                    // backgroundColor: 'green',
                  }}>
                  Rider Pickup
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    textAlign: 'left',
                    width: wp(40),
                    color: colors.BLACK,
                    fontWeight: '700',
                    fontFamily: fonts.REGULAR,
                    fontSize: fontsizes.px_16,
                    // backgroundColor: 'green',
                  }}>
                  {item.pickup_location}
                </Text>
              </View>
              <View style={styles.cardInfoView}>
                <Text
                  style={{
                    // marginTop: hp(1),
                    textAlign: 'left',
                    width: wp(40),
                    color: colors.BLACK,
                    fontWeight: '500',
                    fontFamily: fonts.REGULAR,
                    fontSize: fontsizes.px_16,
                    // backgroundColor: 'green',
                  }}>
                  Rider DropOff
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    textAlign: 'left',
                    width: wp(40),
                    color: colors.BLACK,
                    fontWeight: '700',
                    fontFamily: fonts.REGULAR,
                    fontSize: fontsizes.px_16,
                    // backgroundColor: 'green',
                  }}>
                  {item.dropOff_location}
                </Text>
              </View>
              <View style={styles.cardInfoView}>
                <Text
                  style={{
                    // marginTop: hp(1),
                    textAlign: 'left',
                    width: wp(40),
                    color: colors.BLACK,
                    fontWeight: '500',
                    fontFamily: fonts.REGULAR,
                    fontSize: fontsizes.px_16,
                    // backgroundColor: 'green',
                  }}>
                  Distance
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    textAlign: 'left',
                    width: wp(40),
                    color: colors.BLACK,
                    fontWeight: '700',
                    fontFamily: fonts.REGULAR,
                    fontSize: fontsizes.px_16,
                  }}>
                  {item.distance_covered}
                </Text>
              </View>
              <View style={styles.cardInfoView}>
                <Text
                  style={{
                    textAlign: 'left',
                    width: wp(40),
                    color: colors.BLACK,
                    fontWeight: '500',
                    fontFamily: fonts.REGULAR,
                    fontSize: fontsizes.px_16,
                  }}>
                  Time
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    textAlign: 'left',
                    width: wp(40),
                    color: colors.BLACK,
                    fontWeight: '700',
                    fontFamily: fonts.REGULAR,
                    fontSize: fontsizes.px_16,
                  }}>
                  {item.total_time}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Activity;
