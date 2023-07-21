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
import {BASE_URL} from '../../../config';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import {setData} from '../../asyncStorage/AsyncStorage';
import {setUserInfo} from '../../redux/Action';
import {useDispatch} from 'react-redux';

type NavigationProps = {
  navigate(APPEREANCE: string): unknown;
  navigation: string;
  goBack: () => void;
  replace: any;
  jumpTo: any;
};

const SignUp = () => {
  const navigation = useNavigation<NavigationProps>();
  const dispatch = useDispatch();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
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
    emergencyValid: false,
    CNICValid: false,
  });

  const signInValidation = () => {
    if (
      userInfoValid.fullNameValid === false ||
      userInfoValid.emailValid === false ||
      userInfoValid.passwordValid === false ||
      userInfoValid.contactValid === false ||
      userInfoValid.addressValid === false ||
      userInfoValid.emergencyValid === false ||
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
        emergencyContact,
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
    emergencyContact?: string,
    CNIC?: string,
  ) => {
    setSignInIsLoaded(true);
    let data = JSON.stringify({
      full_name: fullName,
      email: email,
      password: password,
      contact: contact,
      address: address,
      emergency_contact: emergencyContact,
      cnic: CNIC,
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${BASE_URL}/create`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios
      .request(config)
      .then(response => {
        //setErrorMessage(response.data.message);
        // console.log('axios then', response.data);
        if (response.data === 'Email already exists') {
          Toast.showWithGravity(
            'Email already exists. Try another email',
            Toast.SHORT,
            Toast.BOTTOM,
          );
          setSignInIsLoaded(false);
        } else {
          console.log(
            'data came from node response in signup =>',
            response.data,
          );
          dispatch(setUserInfo(response.data));
          setData({value: response.data, storageKey: 'USER_INFO'});
          setSignInIsLoaded(false);
          navigation.replace(DASHBOARD);
        }
      })
      .catch(error => {
        console.log('Register Catch', error);
        setSignInIsLoaded(false);
        Toast.showWithGravity(
          'some error occuoured. Try again',
          Toast.SHORT,
          Toast.BOTTOM,
        );
      });
    // setSignInIsLoaded(false);
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
    } else if (value.length < 3) {
      setFullNameError('Atleast 3 characters');
      // setTimeout(() => {
      //   setFullNameError('');
      // }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        fullNameValid: false,
      });
      //  console.log(userInfoValid);
    } else if (value.length >= 30) {
      setFullNameError('Max 30 characters');
      // setTimeout(() => {
      //   setFullNameError('');
      // }, 2000);
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
  const passwordValidation = (value: string): boolean => {
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
      setPasswordError('Use Aplhabets Numbers');
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

  const [contactError, setContactError] = useState('');
  const contactValidation = (value: string) => {
    let reg = /^(?=.*?[0-9])[0-9]{11}$/i;
    if (value.length == 0) {
      setContactError('Required!');
      setTimeout(() => {
        setContactError('');
      }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        contactValid: false,
      });
    }
    //  else if (value.length > 11) {
    //   setContactError('Invalid format');
    //   // setTimeout(() => {
    //   //   setContactError('');
    //   // }, 2000);
    //   setUserInfoValid({
    //     ...userInfoValid,
    //     contactValid: false,
    //   });
    //   //  console.log(userInfoValid);
    // }
    else if (reg.test(value) === false) {
      setContactError('Invalid format');
      // setTimeout(() => {
      //   setContactError('');
      // }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        contactValid: false,
      });
      //  console.log(userInfoValid);
    } else if (reg.test(value) === true) {
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
      // setTimeout(() => {
      //   setAddressError('');
      // }, 2000);
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
    let reg = /^(?=.*?[0-9])[0-9]{11}$/i;
    if (value.length == 0) {
      setEmergencyContactError('Required!');
      setTimeout(() => {
        setEmergencyContactError('');
      }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        emergencyValid: false,
      });
    } else if (reg.test(value) === false) {
      setEmergencyContactError('Invalid format');
      // setTimeout(() => {
      //   setEmergencyContactError('');
      // }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        emergencyValid: false,
      });
      //  console.log(userInfoValid);
    }
    // else if (value.length < 11) {
    //   setEmergencyContactError('Invalid format');
    //   setTimeout(() => {
    //     setEmergencyContactError('');
    //   }, 2000);
    //   setUserInfoValid({
    //     ...userInfoValid,
    //     emergencyValid: false,
    //   });
    //   //  console.log(userInfoValid);
    // }
    else if (reg.test(value) === true) {
      setEmergencyContactError('');
      setUserInfoValid({
        ...userInfoValid,
        emergencyValid: true,
      });
      //  console.log(userInfoValid);
    }
  };

  const [CNICError, setCNICError] = useState('');
  const CNICValidation = (value: string) => {
    // let reg = /^(?=.*?[0-9])[0-9]{13}$/i;
    let reg = /^[0-9]{5}-[0-9]{7}-[0-9]$/;
    if (value.length == 0) {
      setCNICError('Required!');
      setTimeout(() => {
        setCNICError('');
      }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        CNICValid: false,
      });
    } else if (reg.test(value) === false) {
      setCNICError('00000-0000000-0');
      // setTimeout(() => {
      //   setCNICError('');
      // }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        CNICValid: false,
      });
      //  console.log(userInfoValid);
    }
    // else if (reg.test(value) === true) {
    //   setCNICError('13 characters');
    //   setTimeout(() => {
    //     setCNICError('');
    //   }, 2000);
    //   setUserInfoValid({
    //     ...userInfoValid,
    //     CNICValid: false,
    //   });
    //   //  console.log(userInfoValid);
    // }
    else if (reg.test(value) === true) {
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
          {fullNameError}
        </Text>
        <TextInput
          value={fullName}
          onChangeText={value => {
            handleOnChangeText(value, 'fullName'), setFullName(value);
          }}
          style={{
            ...styles.input,
            borderColor: fullNameError ? colors.RED : colors.BLUE,
            // marginBottom: hp(2),
          }}
          placeholder="Full Name"
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
            // marginBottom: hp(2),
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
          {contactError}
        </Text>
        <TextInput
          value={contact}
          onChangeText={value => {
            handleOnChangeText(value, 'contact'), setContact(value);
          }}
          style={{
            ...styles.input,
            borderColor: contactError ? colors.RED : colors.BLUE,
            // marginBottom: hp(2),
          }}
          keyboardType="numeric"
          placeholder="Contact"
          placeholderTextColor={colors.BLUE}
          numberOfLines={1}
          multiline={false}
          maxLength={30}
          // autoCapitalize="none"
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
          {addressError}
        </Text>
        <TextInput
          value={address}
          onChangeText={value => {
            handleOnChangeText(value, 'address'), setAddress(value);
          }}
          style={{
            ...styles.input,
            borderColor: addressError ? colors.RED : colors.BLUE,
            // marginBottom: hp(2),
          }}
          placeholder="Address"
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
          {emergencyContactError}
        </Text>
        <TextInput
          value={emergencyContact}
          onChangeText={value => {
            handleOnChangeText(value, 'emergencyContact'),
              setEmergencyContact(value);
          }}
          style={{
            ...styles.input,
            borderColor: emergencyContactError ? colors.RED : colors.BLUE,
            // marginBottom: hp(2),
          }}
          keyboardType="numeric"
          placeholder="Emergency contact"
          placeholderTextColor={colors.BLUE}
          numberOfLines={1}
          multiline={false}
          maxLength={30}
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
          {CNICError}
        </Text>
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
          keyboardType="numeric"
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
        {/* <View
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
        </View> */}
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
