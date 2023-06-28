import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import fontsizes from '../../../../assets/fontsizes/fontsizes';
import fonts from '../../../../assets/fonts/fonts';
import colors from '../../../../assets/colors/colors';
import icons from '../../../../assets/icons/icons';
import CustomButton from '../../Button/Button';
import images from '../../../../assets/images/images';
import {useNavigation} from '@react-navigation/native';
import {MYBOTTOMTABS} from '../../../constants/Navigator';

type NavigationProps = {
  navigate(APPEREANCE: string): unknown;
  navigation: string;
  goBack: any;
  replace: any;
};

const SignIn = () => {
  const navigation = useNavigation<NavigationProps>();
  const [showPassword, setShowPassword] = useState(false);
  const [signInWithMobile, setSignInWithMobile] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [signinIsLoaded, setSigninIsLoaded] = useState(false);
  const [facebookIsLoaded, setFacebookIsLoaded] = useState(false);
  const [gmailIsLoaded, setGmailIsLoaded] = useState(false);

  //User Information After Validation
  const [userInfoValid, setUserInfoValid] = useState({
    emailValid: false,
    numberValid: false,
    passwordValid: false,
  });

  const [informationError, setInformationError] = useState('');
  const loginValidation = () => {
    if (signInWithMobile === false) {
      if (
        userInfoValid.emailValid === false ||
        userInfoValid.passwordValid === false
      ) {
        setInformationError('All fields are required');
        setTimeout(() => {
          setInformationError('');
        }, 2000);
      } else {
        loginUser(email, password);
      }
    } else {
      if (
        userInfoValid.numberValid === false ||
        userInfoValid.passwordValid === false
      ) {
        setInformationError('All fields are required');
        setTimeout(() => {
          setInformationError('');
        }, 2000);
      } else {
        loginUser(mobileNumber, password);
      }
    }
  };

  const loginUser = (
    email?: string,
    password?: string,
    mobileNumber?: string,
  ) => {
    setSigninIsLoaded(true);
    let data = JSON.stringify({
      email: email,
      mobileNumber: mobileNumber,
      password: password,
    });

    setTimeout(() => {
      console.log(data);
      setSigninIsLoaded(false);
      navigation.replace(MYBOTTOMTABS);
    }, 2000);

    // let config = {
    //   method: 'post',
    //   maxBodyLength: Infinity,
    //   url: `${Config.base_Url}register`,
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   data: data,
    // };

    // axios
    //   .request(config)
    //   .then(response => {
    //     //setErrorMessage(response.data.message);
    //     console.log('axios then', JSON.stringify(response.data));

    //     ////Storing token in async/////
    //     const tokenValue = response.data.data.token;
    //     console.log('token sent by async register', tokenValue);
    //     AsyncStorage.setItem('userToken', tokenValue);
    //     /////////Userinformation
    //     const userInfo = JSON.stringify(response.data.data);
    //     console.log('user Info sent from login', userInfo);
    //     AsyncStorage.setItem('userInfo', userInfo);
    //     ////Redux storage
    //     dispatch(
    //       userTokenRedux({
    //         token: tokenValue,
    //       }),
    //     );

    //     setIsLoaded(true);
    //     navigation.navigate('DrawerNavigation');
    //   })
    //   .catch(error => {
    //     console.log('Register Catch', error.response);
    //     setIsLoaded(true);
    //     setErrorMessage(error.response.data.message);
    //     Toast.show(errorMessage, {
    //       duration: Toast.durations.LONG,
    //       position: Toast.positions.BOTTOM,
    //       shadow: true,
    //       animation: true,
    //       hideOnPress: true,
    //       delay: 0,
    //     });
    //   });
  };

  const [emailError, setEmailError] = useState('');
  const emailValidation = (value: string) => {
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
      setTimeout(() => {
        setEmailError('');
      }, 2000);
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

  const [mobileNumberError, setMobileNumberError] = useState('');
  const numberValidation = (value: string) => {
    // console.log(value);
    // let regx = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (value.length == 0) {
      setMobileNumberError('Number required');
      setTimeout(() => {
        setMobileNumberError('');
      }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        numberValid: false,
      });
    } else if (!value.trimEnd() || value.length <= 6 || value.length > 13) {
      setMobileNumberError('6-13');
      setTimeout(() => {
        setMobileNumberError('');
      }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        numberValid: false,
      });
    } else {
      setMobileNumberError('');
      setTimeout(() => {
        setMobileNumberError('');
      }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        numberValid: true,
      });
    }
  };

  const [passowrdError, setPasswordError] = useState('');
  const passwordValidation = (value: string): boolean => {
    let reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
    if (value.length == 0) {
      setPasswordError('Required!');
      setTimeout(() => {
        setPasswordError('');
      }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        passwordValid: false,
      });
    } else if (!value.trimEnd() || value.length <= 6 || value.length > 15) {
      setPasswordError('6-15 characters');
      setTimeout(() => {
        setPasswordError('');
      }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        passwordValid: false,
      });
    } else if (reg.test(value) === false) {
      setPasswordError('Invalid password format');
      setTimeout(() => {
        setPasswordError('');
      }, 2000);
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

  const handleOnChangeText = (getValue: string, fieldName: string) => {
    switch (fieldName) {
      case 'email':
        emailValidation(getValue);
        break;
      case 'phoneNumber':
        numberValidation(getValue);
        break;
      case 'password':
        passwordValidation(getValue);
        break;
      default:
      // code block
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <View style={styles.labelView}>
        <Text style={styles.label}>
          {signInWithMobile ? 'Mobile Number' : 'Email'}
        </Text>
        {informationError ? (
          <Text style={styles.error}>{informationError}</Text>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setSignInWithMobile(prevState => !prevState);
            }}>
            <Text style={styles.link}>
              {signInWithMobile ? `Sign in with email` : `Sign in with mobile`}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {signInWithMobile ? (
        <>
          <TextInput
            value={mobileNumber}
            onChangeText={value => {
              handleOnChangeText(value, 'phoneNumber'), setMobileNumber(value);
            }}
            style={{
              ...styles.input,
              borderColor: mobileNumberError
                ? colors.RED_TEXT
                : colors.TRANSPARENT,
              marginBottom: hp(1.3),
            }}
            placeholder="Enter your mobile"
            placeholderTextColor={colors.GREY_TEXT}
            keyboardType="phone-pad"
            numberOfLines={1}
            multiline={false}
            maxLength={30}
          />
          <Text style={{...styles.error, marginBottom: hp(0)}}>
            {mobileNumberError}
          </Text>
        </>
      ) : (
        <>
          <TextInput
            value={email}
            onChangeText={value => {
              handleOnChangeText(value, 'email'), setEmail(value);
            }}
            style={{
              ...styles.input,
              borderColor: emailError ? colors.RED_TEXT : colors.TRANSPARENT,
              marginBottom: hp(1.3),
            }}
            placeholder="Enter your email"
            placeholderTextColor={colors.GREY_TEXT}
            numberOfLines={1}
            multiline={false}
            maxLength={30}
          />
          <Text style={{...styles.error, marginBottom: hp(0)}}>
            {emailError}
          </Text>
        </>
      )}
      <View style={styles.labelView}>
        <Text style={styles.label}>Password</Text>
      </View>
      <View style={styles.passwordInput}>
        <TextInput
          value={password}
          onChangeText={value => {
            handleOnChangeText(value, 'password'), setPassword(value);
          }}
          style={{
            ...styles.input,
            borderColor: passowrdError ? colors.RED_TEXT : colors.TRANSPARENT,
            // marginBottom: hp(6),
          }}
          placeholder="Enter your password"
          placeholderTextColor={colors.GREY_TEXT}
          secureTextEntry={showPassword ? false : true}
        />
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: hp(2),
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
        style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{...styles.link, marginBottom: hp(4.4)}}>
          Forgot password?
        </Text>
        <Text style={styles.error}>{passowrdError}</Text>
      </TouchableOpacity>

      <CustomButton
        title="Sign in"
        height={hp(6)}
        width={wp(88.4)}
        activityIndicator={signinIsLoaded}
        backgroundColor={colors.GREEN_BUTTON}
        onPress={loginValidation}
        marginBottom={hp(2.2)}
      />
      <Text style={styles.orLogin}>Or login with</Text>
      <View style={styles.socialMediaButtonView}>
        <CustomButton
          title="Facebook"
          height={hp(6)}
          width={wp(41.7)}
          activityIndicator={facebookIsLoaded}
          leftIcon={icons.FACEBOOK}
          backgroundColor={colors.WHITE_BOLD_TEXT}
          onPress={() => {}}
          marginBottom={hp(2.2)}
        />
        <CustomButton
          title="Google"
          height={hp(6)}
          width={wp(41.7)}
          activityIndicator={gmailIsLoaded}
          leftIcon={icons.GMAIL}
          backgroundColor={colors.WHITE_BOLD_TEXT}
          onPress={() => {}}
          marginBottom={hp(2.2)}
        />
      </View>

      <TouchableOpacity
        style={styles.fingerPrintView}
        onPress={() => {
          navigation.replace(MYBOTTOMTABS);
        }}>
        <Image
          source={images.FINGERPRINT_ACTIVE}
          resizeMode="contain"
          style={styles.fingerPrint}
        />
      </TouchableOpacity>
      <Text style={styles.orLogin}>Use fingerprint instead?</Text>
    </ScrollView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: wp(5.7),
    bottom: hp(2),
  },
  title: {
    marginBottom: hp(6),
    fontWeight: '700',
    fontSize: fontsizes.px_32,
    fontFamily: fonts.Regular,
    color: colors.WHITE_BOLD_TEXT,
  },
  labelView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1.3),
  },
  link: {
    fontWeight: '400',
    fontSize: fontsizes.px_14,
    fontFamily: fonts.Regular,
    color: colors.GREEN_TEXT,
  },
  orLogin: {
    fontWeight: '400',
    fontSize: fontsizes.px_14,
    fontFamily: fonts.Regular,
    color: colors.GREY_TEXT,
    textAlign: 'center',
    marginBottom: hp(2.2),
  },
  label: {
    fontWeight: '400',
    fontSize: fontsizes.px_14,
    fontFamily: fonts.Regular,
    color: colors.WHITE_LIGHT_TEXT,
  },
  input: {
    height: hp(6),
    borderRadius: wp(2.9),
    width: '100%',
    paddingLeft: wp(4),
    backgroundColor: colors.CARD_BACKGROUND,
    color: colors.GREY_TEXT,
    borderWidth: 1,
  },
  passwordInput: {
    flexDirection: 'row',
    // backgroundColor: colors.WHITE_BOLD_TEXT,
    alignItems: 'center',
    marginBottom: hp(1.3),
  },
  eyeIcon: {
    height: hp(2.7),
    width: wp(5.8),
    tintColor: colors.GREY_BUTTON,
  },
  socialMediaButtonView: {
    flexDirection: 'row',
    // backgroundColor: 'red',
    justifyContent: 'space-evenly',
    marginBottom: hp(6),
    // width: '100%',
  },
  fingerPrintView: {
    alignItems: 'center',
    marginBottom: hp(2.2),
  },
  fingerPrint: {
    height: hp(4.4),
    width: wp(9.6),
  },
  error: {
    fontWeight: '400',
    fontSize: fontsizes.px_14,
    fontFamily: fonts.Regular,
    color: colors.RED_TEXT,
    textAlign: 'right',
  },
});
