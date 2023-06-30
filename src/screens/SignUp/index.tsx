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
import {DASHBOARD, SIGN_IN} from '../../constants/Navigator';

type NavigationProps = {
  navigate(APPEREANCE: string): unknown;
  navigation: string;
  goBack: () => void;
  replace: any;
  jumpTo: any;
};

const SignUp = () => {
  const navigation = useNavigation<NavigationProps>();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [emercencyContact, setEmercencyContact] = useState('');
  const [CNIC, setCNIC] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [signInIsLoaded, setSignInIsLoaded] = useState(false);
  const [facebookIsLoaded, setFacebookIsLoaded] = useState(false);
  const [gmailIsLoaded, setGmailIsLoaded] = useState(false);

  //User Information After Validation
  const [userInfoValid, setUserInfoValid] = useState({
    fullNameValid: false,
    emailValid: false,
    passwordValid: false,
    contactValid: false,
    addressValid: false,
    emercencyValid: false,
    CNICValid: false,
  });

  const signInValidation = () => {
    if (
      userInfoValid.fullNameValid === false ||
      userInfoValid.emailValid === false ||
      userInfoValid.passwordValid === false ||
      userInfoValid.contactValid === false ||
      userInfoValid.addressValid === false ||
      userInfoValid.emercencyValid === false ||
      userInfoValid.CNICValid === false
    ) {
      setFullNameError('  ');
      setEmailError('    ');
      setPasswordError('    ');
      setContactError('    ');
      setAddressError('    ');
      setEmergencyContactError('    ');
      setCNICError('    ');

      setTimeout(() => {
        setFullNameError('');
        setEmailError('');
        setPasswordError('');
        setContactError('');
        setAddressError('');
        setEmergencyContactError('');
        setCNICError('');
      }, 2000);
    } else {
      signInUser(
        fullName,
        email,
        password,
        contact,
        address,
        emercencyContact,
        CNIC,
      );
    }
  };

  const signInUser = (
    fullName?: string,
    email?: string,
    password?: string,
    contact?: string,
    address?: string,
    emercencyContact?: string,
    CNIC?: string,
  ) => {
    setSignInIsLoaded(true);
    let data = JSON.stringify({
      fullName: fullName,
      email: email,
      password: password,
      contact: contact,
      address: address,
      emercencyContact: emercencyContact,
      CNIC: CNIC,
    });

    setTimeout(() => {
      console.log(data);
      setSignInIsLoaded(false);
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

  const [fullNameError, setFullNameError] = useState('');
  const fullNameValidation = (value: string) => {
    if (value.length == 0) {
      setFullNameError('Required!');
      setTimeout(() => {
        setFullNameError('');
      }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        fullNameValid: false,
      });
    } else if (value.length >= 15) {
      setFullNameError('Invalid format');
      setTimeout(() => {
        setFullNameError('');
      }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        fullNameValid: false,
      });
      //  console.log(userInfoValid);
    } else {
      setFullNameError('');
      setUserInfoValid({
        ...userInfoValid,
        fullNameValid: true,
      });
      //  console.log(userInfoValid);
    }
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

  const [contactError, setContactError] = useState('');
  const contactValidation = (value: string) => {
    if (value.length == 0) {
      setContactError('Required!');
      setTimeout(() => {
        setContactError('');
      }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        contactValid: false,
      });
    } else if (value.length > 11) {
      setContactError('Invalid format');
      setTimeout(() => {
        setContactError('');
      }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        contactValid: false,
      });
      //  console.log(userInfoValid);
    } else {
      setContactError('');
      setUserInfoValid({
        ...userInfoValid,
        contactValid: true,
      });
      //  console.log(userInfoValid);
    }
  };

  const [addressError, setAddressError] = useState('');
  const addressValidation = (value: string) => {
    if (value.length == 0) {
      setAddressError('Required!');
      setTimeout(() => {
        setAddressError('');
      }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        addressValid: false,
      });
    } else if (value.length > 40) {
      setAddressError('Invalid format');
      setTimeout(() => {
        setAddressError('');
      }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        addressValid: false,
      });
      //  console.log(userInfoValid);
    } else {
      setAddressError('');
      setUserInfoValid({
        ...userInfoValid,
        addressValid: true,
      });
      //  console.log(userInfoValid);
    }
  };

  const [emergencyContactError, setEmergencyContactError] = useState('');
  const emergencyContactValidation = (value: string) => {
    if (value.length == 0) {
      setEmergencyContactError('Required!');
      setTimeout(() => {
        setEmergencyContactError('');
      }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        emercencyValid: false,
      });
    } else if (value.length > 11) {
      setEmergencyContactError('Invalid format');
      setTimeout(() => {
        setEmergencyContactError('');
      }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        emercencyValid: false,
      });
      //  console.log(userInfoValid);
    } else {
      setEmergencyContactError('');
      setUserInfoValid({
        ...userInfoValid,
        emercencyValid: true,
      });
      //  console.log(userInfoValid);
    }
  };

  const [CNICError, setCNICError] = useState('');
  const CNICValidation = (value: string) => {
    if (value.length == 0) {
      setCNICError('Required!');
      setTimeout(() => {
        setCNICError('');
      }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        CNICValid: false,
      });
    } else if (value.length > 13) {
      setCNICError('Invalid format');
      setTimeout(() => {
        setCNICError('');
      }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        CNICValid: false,
      });
      //  console.log(userInfoValid);
    } else {
      setCNICError('');
      setUserInfoValid({
        ...userInfoValid,
        CNICValid: true,
      });
      //  console.log(userInfoValid);
    }
  };

  const handleOnChangeText = (getValue: string, fieldName: string) => {
    switch (fieldName) {
      case 'fullName':
        fullNameValidation(getValue);
        break;
      case 'email':
        emailValidation(getValue);
        break;
      case 'password':
        passwordValidation(getValue);
        break;
      case 'contact':
        contactValidation(getValue);
        break;
      case 'address':
        addressValidation(getValue);
        break;
      case 'emergencyContact':
        emergencyContactValidation(getValue);
        break;
      case 'CNIC':
        CNICValidation(getValue);
        break;
      default:
      // code block
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title="Sign up"
        marginTop={hp(3)}
        leftIcon={icons.BACK_ARROW}
        onPressLeftIcon={() => {
          navigation.goBack();
        }}
        marginBottom={hp(6)}
      />
      <ScrollView>
        <TextInput
          value={fullName}
          onChangeText={value => {
            handleOnChangeText(value, 'fullName'), setFullName(value);
          }}
          style={{
            ...styles.input,
            borderColor: fullNameError ? colors.RED : colors.BLUE,
            marginBottom: hp(2),
          }}
          placeholder="Full Name"
          placeholderTextColor={colors.BLUE}
          numberOfLines={1}
          multiline={false}
          maxLength={30}
        />
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
              marginBottom: hp(2),
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
              bottom: hp(4),
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
        <TextInput
          value={contact}
          onChangeText={value => {
            handleOnChangeText(value, 'contact'), setContact(value);
          }}
          style={{
            ...styles.input,
            borderColor: contactError ? colors.RED : colors.BLUE,
            marginBottom: hp(2),
          }}
          keyboardType="numeric"
          placeholder="Contact"
          placeholderTextColor={colors.BLUE}
          numberOfLines={1}
          multiline={false}
          maxLength={30}
        />
        <TextInput
          value={address}
          onChangeText={value => {
            handleOnChangeText(value, 'address'), setAddress(value);
          }}
          style={{
            ...styles.input,
            borderColor: addressError ? colors.RED : colors.BLUE,
            marginBottom: hp(2),
          }}
          placeholder="Address"
          placeholderTextColor={colors.BLUE}
          numberOfLines={1}
          multiline={false}
          maxLength={30}
        />
        <TextInput
          value={emercencyContact}
          onChangeText={value => {
            handleOnChangeText(value, 'emergencyContact'),
              setEmercencyContact(value);
          }}
          style={{
            ...styles.input,
            borderColor: emergencyContactError ? colors.RED : colors.BLUE,
            marginBottom: hp(2),
          }}
          keyboardType="numeric"
          placeholder="Emergency contact"
          placeholderTextColor={colors.BLUE}
          numberOfLines={1}
          multiline={false}
          maxLength={30}
        />
        <TextInput
          value={CNIC}
          onChangeText={value => {
            handleOnChangeText(value, 'CNIC'), setCNIC(value);
          }}
          style={{
            ...styles.input,
            borderColor: CNICError ? colors.RED : colors.BLUE,
            marginBottom: hp(2),
          }}
          placeholder="CNIC"
          placeholderTextColor={colors.BLUE}
          numberOfLines={1}
          multiline={false}
          maxLength={30}
        />
        <CustomButton
          title="Sign Up"
          textColor={colors.WHITE}
          backgroundColor={colors.BLUE}
          activityIndicator={signInIsLoaded}
          height={hp(6)}
          width={wp(90)}
          borderRadius={wp(2)}
          marginHorizontal={wp(5)}
          marginTop={hp(2)}
          marginBottom={hp(2)}
          onPress={signInValidation}
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
            onPress={() => {
              // navigation.navigate(SIGN_UP);
            }}
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
            onPress={() => {
              // navigation.navigate(SIGN_UP);
            }}
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
            Already have an account?
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(SIGN_IN);
            }}>
            <Text
              style={{
                fontWeight: '400',
                fontSize: fontsizes.px_15,
                fontFamily: fonts.REGULAR,
                color: colors.BLUE,
              }}>
              {' '}
              Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
