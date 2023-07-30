import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  View,
  Image,
  Text,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import images from '../../../assets/images/images';
import colors from '../../../assets/colors/colors';

import CustomButton from '../../components/Button/Button';
import CustomHeader from '../../components/HeaderBar/Header';
import icons from '../../../assets/icons/icons';
import Divider from '../../components/Divider/Divider';
import fonts from '../../../assets/fonts/fonts';
import fontsizes from '../../../assets/fontsizes/fontsizes';
import {
  DRIVER_MAP,
  MY_BOTTOM_TABS,
  SIGN_IN,
  SIGN_UP,
  SIGN_UP_AS_DRIVER,
  TERMS_AND_CONDITIONS,
} from '../../constants/Navigator';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import {setData} from '../../asyncStorage/AsyncStorage';
import {setDriverInfo} from '../../redux/Action';
import {useDispatch} from 'react-redux';
import {BASE_URL} from '../../../config';

// type NavigationProps = {
//   navigate(APPEREANCE: string): unknown;
//   navigation: string;
//   goBack: () => void;
//   replace: any;
//   jumpTo: any;
// };

const SignUpAsDriver = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [toogleCheck, setToogleCheck] = useState(false);
  const [toogleCheckError, setToogleCheckError] = useState('');

  const [driverName, setDriverName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [signInIsLoaded, setSignInIsLoaded] = useState(false);

  //User Information After Validation
  const [userInfoValid, setUserInfoValid] = useState({
    driverNameValid: false,
    passwordValid: false,
  });

  const signUpValidation = () => {
    if (
      userInfoValid.driverNameValid === false ||
      userInfoValid.passwordValid === false
    ) {
      setDriverNameError('    ');
      setPasswordError('  ');
      setTimeout(() => {
        setDriverNameError('');
        setPasswordError('');
      }, 2000);
    } else {
      signUpUser(driverName, password);
    }
  };

  const signUpUser = (driverName, password) => {
    setSignInIsLoaded(true);

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${BASE_URL}/driver/login`,

      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        driver_name: driverName,
        password: password,
      },
    };

    axios
      .request(config)
      .then(response => {
        // console.log(JSON.stringify(response.data));
        if (response.data === 'Email does not exist') {
          Toast.showWithGravity(
            'This user does not exist on our record',
            Toast.SHORT,
            Toast.BOTTOM,
          );
          setSignInIsLoaded(false);
        } else if (response.data === 'Password does not match') {
          Toast.showWithGravity(
            'Password does not match',
            Toast.SHORT,
            Toast.BOTTOM,
          );
          setSignInIsLoaded(false);
        } else {
          const serializedValue = JSON.stringify(response.data);
          dispatch(setDriverInfo(serializedValue));
          setData({value: response.data, storageKey: 'DRIVER_INFO'});
          navigation.replace(MY_BOTTOM_TABS);
          setSignInIsLoaded(false);
        }
      })
      .catch(error => {
        console.log(error);
        Toast.showWithGravity('Try again', Toast.SHORT, Toast.BOTTOM);
        setSignInIsLoaded(false);
      });
  };

  const [driverNameError, setDriverNameError] = useState('');
  const driverNameValidation = value => {
    let reg = /^[a-zA-Z ]{3,30}$/;
    if (value.length == 0) {
      setDriverNameError('Required!');
      setTimeout(() => {
        setDriverNameError('');
      }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        driverNameValid: false,
      });
    } else if (reg.test(value) === false) {
      setDriverNameError('3-30 characters');

      setUserInfoValid({
        ...userInfoValid,
        driverNameValid: false,
      });
      //  console.log(userInfoValid);
    } else if (reg.test(value) === true) {
      setDriverNameError('');
      setUserInfoValid({
        ...userInfoValid,
        driverNameValid: true,
      });
      //  console.log(userInfoValid);
    }
  };

  const [passowrdError, setPasswordError] = useState('');
  const passwordValidation = value => {
    let reg =
      /^(?=.*?[a-zA-Z])(?=.*?[0-9])[a-zA-Z0-9!@#$%^&*()-_=+[\]{};:'",.<>/?`~|\\]{6,}$/;

    if (value.length == 0) {
      setPasswordError('Required!');
      setTimeout(() => {
        setPasswordError('');
      }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        passwordValid: false,
      });
    } else if (!value.trimEnd() || value.length <= 6) {
      setPasswordError('Atleast 6 characters');

      setUserInfoValid({
        ...userInfoValid,
        passwordValid: false,
      });
    } else if (!value.trimEnd() || value.length > 30) {
      setPasswordError('Max 30 characters');

      setUserInfoValid({
        ...userInfoValid,
        passwordValid: false,
      });
    } else if (reg.test(value) === false) {
      setPasswordError('Use Aplhabets and numbers');

      setUserInfoValid({
        ...userInfoValid,
        passwordValid: false,
      });
    } else if (reg.test(value) === true) {
      setPasswordError('');
      setUserInfoValid({
        ...userInfoValid,
        passwordValid: true,
      });
    }
    return reg.test(value);
  };

  const handleOnChangeText = (getValue, fieldName) => {
    switch (fieldName) {
      case 'driverName':
        driverNameValidation(getValue);
        break;
      case 'password':
        passwordValidation(getValue);
        break;

      default:
      // code block
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title="Sign in as driver"
        marginTop={hp(3)}
        leftIcon={icons.BACK_ARROW}
        onPressLeftIcon={() => {
          navigation.goBack();
        }}
        marginBottom={hp(10)}
      />
      <ScrollView>
        <Text
          style={{
            // marginBottom: hp(1),
            marginHorizontal: hp(3),
            fontWeight: '400',
            fontSize: fontsizes.px_15,
            fontFamily: fonts.REGULAR,
            color: colors.RED,
            textAlign: 'left',
            // backgroundColor: 'red',
          }}>
          {driverNameError}
        </Text>
        <TextInput
          value={driverName}
          onChangeText={value => {
            handleOnChangeText(value, 'driverName'), setDriverName(value);
          }}
          style={{
            ...styles.input,
            borderColor: driverNameError ? colors.RED : colors.BLUE,
            // marginBottom: hp(2),
          }}
          placeholder="Driver Name"
          placeholderTextColor={colors.BLUE}
          numberOfLines={1}
          multiline={false}
          maxLength={30}
          autoCapitalize="none"
        />
        <Text
          style={{
            // marginBottom: hp(1),
            marginHorizontal: hp(3),
            fontWeight: '400',
            fontSize: fontsizes.px_15,
            fontFamily: fonts.REGULAR,
            color: colors.RED,
            textAlign: 'left',
            // backgroundColor: 'red',
          }}>
          {passowrdError}
        </Text>
        <View style={styles.passwordInputView}>
          <TextInput
            value={password}
            onChangeText={value => {
              handleOnChangeText(value, 'password'), setPassword(value);
            }}
            style={{
              ...styles.input,
              borderColor: passowrdError ? colors.RED : colors.BLUE,
              // marginBottom: hp(2),
            }}
            placeholder="Enter your password"
            placeholderTextColor={colors.BLUE}
            secureTextEntry={showPassword ? false : true}
            numberOfLines={1}
            multiline={false}
            maxLength={30}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={{
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
              right: wp(6),
              // bottom: hp(2),
              height: hp(4),
              width: wp(8),
              // backgroundColor:"red"
            }}
            onPress={() => {
              setShowPassword(prevState => !prevState);
            }}>
            <Image
              style={styles.eyeIcon}
              resizeMode="contain"
              source={showPassword ? icons.EYE_OFF : icons.EYE}
            />
          </TouchableOpacity>
        </View>

        <CustomButton
          title="Sign in"
          textColor={colors.WHITE}
          backgroundColor={colors.BLUE}
          activityIndicator={signInIsLoaded}
          height={hp(6)}
          width={wp(90)}
          borderRadius={wp(2)}
          marginHorizontal={wp(5)}
          // marginTop={hp(2)}
          marginBottom={hp(2)}
          onPress={signUpValidation}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginHorizontal: wp(5),
            marginBottom: hp(2),
          }}>
          <Divider
            height={hp(0.1)}
            dividerColor={colors.BLACK}
            width={wp(36)}
            marginRight={wp(1.6)}
          />
          <Text
            style={{
              fontWeight: '400',
              fontSize: fontsizes.px_12,
              fontFamily: fonts.REGULAR,
              color: colors.GREY,
            }}>
            OR
          </Text>
          <Divider
            height={hp(0.1)}
            dividerColor={colors.BLACK}
            width={wp(36)}
            marginLeft={wp(1.6)}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            // marginBottom: hp(5),
          }}>
          <Text
            style={{
              fontWeight: '400',
              fontSize: fontsizes.px_15,
              fontFamily: fonts.REGULAR,
              color: colors.BLACK,
            }}>
            Don't have an account?
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(SIGN_UP_AS_DRIVER);
            }}>
            <Text
              style={{
                fontWeight: '400',
                fontSize: fontsizes.px_15,
                fontFamily: fonts.REGULAR,
                color: colors.BLUE,
              }}>
              {' '}
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUpAsDriver;
