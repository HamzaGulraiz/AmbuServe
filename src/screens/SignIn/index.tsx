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

import {GoogleSignin} from '@react-native-google-signin/google-signin';

type NavigationProps = {
  navigate(APPEREANCE: string): unknown;
  navigation: string;
  goBack: () => void;
  replace: any;
  jumpTo: any;
};

// GoogleSignin.configure({
//   scopes: ['email', 'profile'],
//   webClientId:
//     '202538919074-ib0e9pej33eugb41k92lenmgvtcq47jl.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
//   offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
//   // hostedDomain: '', // specifies a hosted domain restriction
//   forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
//   // accountName: '', // [Android] specifies an account name on the device that should be used
//   // iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
//   // googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
//   // openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
//   profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
// });

const SignIn = () => {
  const navigation = useNavigation<NavigationProps>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [signUpIsLoaded, setSignUpIsLoaded] = useState(false);
  const [facebookIsLoaded, setFacebookIsLoaded] = useState(false);
  const [gmailIsLoaded, setGmailIsLoaded] = useState(false);

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
      signUpUser(email, password);
    }
  };

  const signUpUser = (email?: string, password?: string) => {
    setSignUpIsLoaded(true);
    let data = JSON.stringify({
      email: email,
      password: password,
    });

    setTimeout(() => {
      console.log(data);
      setSignUpIsLoaded(false);
      navigation.replace(DASHBOARD);
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

  const [passowrdError, setPasswordError] = useState('');
  const passwordValidation = (value: string): boolean => {
    let reg = /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
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
      case 'password':
        passwordValidation(getValue);
        break;
      default:
      // code block
    }
  };

  // const handleGoogleSignIN = async () => {
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     const userInfo = await GoogleSignin.signIn();
  //     console.log('Google signin =>', userInfo);
  //     // setState({ userInfo });
  //   } catch (error: any) {
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       // user cancelled the login flow
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //       // operation (e.g. sign in) is in progress already
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       // play services not available or outdated
  //     } else {
  //       // some other error happened
  //     }
  //   }
  // };

  // const handleGoodleSignOut = async () => {
  //   try {
  //     await GoogleSignin.signOut();
  //     // setState({ user: null }); // Remember to remove the user from your app's state as well
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  useEffect(() => {
    // Configure GoogleSignin
    GoogleSignin.configure({
      webClientId:
        '202538919074-ib0e9pej33eugb41k92lenmgvtcq47jl.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
      // offlineAccess: true,
      // accessType: "offline", // add this line
      // forceCodeForRefreshToken: true,
    });
    isSignedIN();
  }, []);

  // Sign in with Google
  const signIn = async () => {
    await GoogleSignin.hasPlayServices()
      .then(hasPlayService => {
        if (hasPlayService) {
          getUSerINfo();
        }
      })
      .catch(e => {
        console.log('ERROR IS on 299: ' + JSON.stringify(e));
      });
  };
  const getUSerINfo = async () => {
    await GoogleSignin.signIn()
      .then(userInfo => {
        let res = userInfo;
        console.log('getuserinfo =>>', res);

        // console.log('=======>>>>>', userInfo?.user);
        // dispatch(userData(userInfo?.user))
        // _storeData(userInfo)

        // navigation.navigate('HamburgerMenu');
      })
      .catch(e => {
        console.log('ERROR IS on 315: ' + e);
      });
  };

  const isSignedIN = async () => {
    // await GoogleSignin.signOut();
    const isSignedIN = await GoogleSignin.isSignedIn();
    if (!!isSignedIN) {
      // await GoogleSignin.signOut()
      getCurrentUserInto();
    } else {
      console.log('Please Login');
    }
  };

  const getCurrentUserInto = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      console.log('GEt USer DATA', userInfo);
      // _storeData(userInfo)
      // setUser(userInfo);
    } catch (err) {
      console.log(err);
    }
  };
  // const _storeData = async (userInfo) => {
  //   try {
  //     await AsyncStorage.setItem(
  //       'userInfo',
  //       JSON.stringify(userInfo),
  //     );
  //   } catch (error) {
  //     // Error saving data
  //   }
  // };

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
        <TextInput
          value={email}
          onChangeText={value => {
            handleOnChangeText(value, 'email'), setEmail(value);
          }}
          style={{
            ...styles.input,
            borderColor: emailError ? colors.RED : colors.BLUE,
            marginBottom: hp(2),
          }}
          placeholder="Email"
          placeholderTextColor={colors.BLUE}
          numberOfLines={1}
          multiline={false}
          maxLength={30}
        />
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
          />
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: wp(8),
              bottom: hp(2),
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
            marginHorizontal: wp(5),
            justifyContent: 'space-evenly',
            marginBottom: hp(2),
          }}>
          <CustomButton
            title="FaceBook"
            textColor={colors.BLUE}
            backgroundColor={colors.TRANSPARENT}
            leftIcon={icons.FACEBOOK}
            borderWidth={hp(0.1)}
            borderColor={colors.BLUE}
            height={hp(6)}
            width={wp(40)}
            borderRadius={wp(2)}
            // marginHorizontal={wp(5)}
            // marginTop={hp(2)}
            // marginBottom={hp(2)}
            onPress={() => {}}
          />
          <CustomButton
            title="Google"
            textColor={colors.RED}
            backgroundColor={colors.TRANSPARENT}
            leftIcon={icons.GMAIL}
            borderWidth={hp(0.1)}
            borderColor={colors.RED}
            height={hp(6)}
            width={wp(40)}
            borderRadius={wp(2)}
            // marginHorizontal={wp(5)}
            // marginTop={hp(2)}
            // marginBottom={hp(2)}
            onPress={signIn}
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
