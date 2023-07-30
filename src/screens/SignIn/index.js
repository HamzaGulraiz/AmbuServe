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
import {DASHBOARD, SIGN_IN, SIGN_UP} from '../../constants/Navigator';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import {BASE_URL} from '../../../config';
import {setData} from '../../asyncStorage/AsyncStorage';
import {useDispatch} from 'react-redux';
import {setUserInfo} from '../../redux/Action';

// type NavigationProps = {
//   navigate(APPEREANCE: string): unknown;
//   navigation: string;
//   goBack: () => void;
//   replace: any;
//   jumpTo: any;
// };

const SignIn = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [signUpIsLoaded, setSignUpIsLoaded] = useState(false);

  //User Information After Validation
  const [userInfoValid, setUserInfoValid] = useState({
    emailValid: false,
    passwordValid: false,
  });

  const signUpValidation = () => {
    if (
      userInfoValid.emailValid === false ||
      userInfoValid.passwordValid === false
    ) {
      setEmailError('    ');
      setPasswordError('    ');

      setTimeout(() => {
        setEmailError('');
        setPasswordError('');
      }, 2000);
    } else {
      signInUser(email, password);
    }
  };

  const signInUser = (email, password) => {
    setSignUpIsLoaded(true);

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${BASE_URL}/login`,
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        email: email,
        password: password,
      },
    };

    axios
      .request(config)
      .then(response => {
        if (response.data === 'Email does not exist') {
          Toast.showWithGravity(
            'This user does not exist on our record',
            Toast.SHORT,
            Toast.BOTTOM,
          );
          setSignUpIsLoaded(false);
        } else if (response.data === 'Password does not match') {
          Toast.showWithGravity(
            'Password does not match',
            Toast.SHORT,
            Toast.BOTTOM,
          );
          setSignUpIsLoaded(false);
        } else {
          const serializedValue = JSON.stringify(response.data);
          dispatch(setUserInfo(serializedValue));
          setData({value: response.data, storageKey: 'USER_INFO'});
          navigation.replace(DASHBOARD);
          setSignUpIsLoaded(false);
        }
      })
      .catch(error => {
        console.log(error);
        Toast.showWithGravity('Try again', Toast.SHORT, Toast.BOTTOM);
        setSignUpIsLoaded(false);
      });
  };

  const [emailError, setEmailError] = useState('');
  const emailValidation = value => {
    let regx = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (value.length == 0) {
      setEmailError('Required!');
      setTimeout(() => {
        setEmailError('');
      }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        emailValid: false,
      });
    } else if (regx.test(value) === false) {
      setEmailError('Invalid format');
      // setTimeout(() => {
      //   setEmailError('');
      // }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        emailValid: false,
      });
      //  console.log(userInfoValid);
    } else if (regx.test(value) === true) {
      setEmailError('');
      setUserInfoValid({
        ...userInfoValid,
        emailValid: true,
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
      // setTimeout(() => {
      //   setPasswordError('');
      // }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        passwordValid: false,
      });
    } else if (!value.trimEnd() || value.length > 30) {
      setPasswordError('Max 30 characters');
      // setTimeout(() => {
      //   setPasswordError('');
      // }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        passwordValid: false,
      });
    } else if (reg.test(value) === false) {
      setPasswordError('Use Aplhabets and numbers');
      // setTimeout(() => {
      //   setPasswordError('');
      // }, 2000);
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
      case 'email':
        emailValidation(getValue);
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
        title="Sign In"
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
          {emailError}
        </Text>
        <TextInput
          value={email}
          onChangeText={value => {
            handleOnChangeText(value, 'email'), setEmail(value);
          }}
          style={{
            ...styles.input,
            borderColor: emailError ? colors.RED : colors.BLUE,
          }}
          placeholder="Email"
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

        <TouchableOpacity
          style={{
            justifyContent: 'center',
            marginHorizontal: wp(5),
          }}
          onPress={() => {
            // navigation.navigate(SIGN_UP);
          }}>
          <Text
            style={{
              fontWeight: '400',
              fontSize: fontsizes.px_15,
              fontFamily: fonts.REGULAR,
              color: colors.BLUE,
              textAlign: 'right',
            }}>
            {' '}
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <CustomButton
          title="Sign In"
          textColor={colors.WHITE}
          backgroundColor={colors.BLUE}
          activityIndicator={signUpIsLoaded}
          height={hp(6)}
          width={wp(90)}
          borderRadius={wp(2)}
          marginHorizontal={wp(5)}
          marginTop={hp(2)}
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
              navigation.navigate(SIGN_UP);
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

export default SignIn;
