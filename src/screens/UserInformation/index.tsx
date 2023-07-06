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
  TextInput,
  ScrollView,
  View,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import images from '../../../assets/images/images';
import colors from '../../../assets/colors/colors';

import CustomButton from '../../components/Button/Button';
import {MAPS, SPLASH_SCREEN} from '../../constants/Navigator';
import fontsizes from '../../../assets/fontsizes/fontsizes';
import fonts from '../../../assets/fonts/fonts';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {PermissionsAndroid} from 'react-native';
import {getData, removeData} from '../../asyncStorage/AsyncStorage';
import icons from '../../../assets/icons/icons';
import {useTypedSelector} from '../../redux/Store';
import {set} from 'mongoose';

type NavigationProps = {
  navigate(APPEREANCE: string): unknown;
  navigation: string;
  goBack: () => void;
  replace: any;
  jumpTo: any;
};

interface UserInfo {
  __v: number;
  _id: string;
  address: string;
  cnic: string;
  contact: string;
  email: string;
  full_name: string;
  password: string;
  token: string;
}

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const result = await getData({storageKey: 'USER_INFO'}); // Call the getData function
//       if (result === null) {
//         console.log(result, 'null');
//       } else if (typeof result === 'string') {
//         // console.log('Data on splash screen ==>', result);
//         const responseObj = JSON.parse(result);
//         setFullName(responseObj.full_name);
//         setEmail(responseObj.email);
//         setPassword(responseObj.password);
//         setContact(responseObj.contact);
//         setAddress(responseObj.address);
//         setEmercencyContact(responseObj.emercency_contact);
//         setCNIC(responseObj.cnic);
//         // console.log(responseObj.token);
//       }
//     } catch (error) {
//       console.log('Error occurred:', error);
//     }
//   };
//   fetchData();
// }, []);

const UserInformation = () => {
  const navigation = useNavigation<NavigationProps>();
  const userInfo = useTypedSelector(state => state.app.userInfo) as UserInfo;
  const appState = useTypedSelector(state => state.app.appState);
  const [editButton, setEditButton] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [emercencyContact, setEmercencyContact] = useState('');
  const [CNIC, setCNIC] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [signInIsLoaded, setSignInIsLoaded] = useState(false);

  // useEffect(() => {
  //   setFullName(userInfo.full_name);
  //   setEmail(userInfo.email);
  //   setPassword(userInfo.password);
  //   setContact(userInfo.contact);
  //   setAddress(userInfo.address);
  //   // setEmercencyContact(userInfo.emergency_contact);
  //   setCNIC(userInfo.cnic);
  //   console.log('userInfo page', appState, userInfo);
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getData({storageKey: 'USER_INFO'});
        if (result === null) {
          console.log('no result on userinformation Screen from storage');
        } else {
          const responseObj = JSON.parse(result);
          setFullName(responseObj.full_name);
          setEmail(responseObj.email);
          setPassword(responseObj.password);
          setContact(responseObj.contact);
          setAddress(responseObj.address);
          setEmercencyContact(responseObj.emergency_contact);
          setCNIC(responseObj.cnic);
          console.log('Data on userinfo screen ==>', responseObj);
        }
      } catch (error) {
        console.log('Error occurred at userinfo screen from storage', error);
      }
    };
    fetchData();
  }, []);

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
    // setSignInIsLoaded(true);
    let data = JSON.stringify({
      full_name: fullName,
      email: email,
      password: password,
      contact: contact,
      address: address,
      emercency_contact: emercencyContact,
      cnic: CNIC,
    });

    // let config = {
    //   method: 'post',
    //   maxBodyLength: Infinity,
    //   url: `${BASE_URL}/create`,
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   data: data,
    // };

    // axios
    //   .request(config)
    //   .then(response => {
    //     //setErrorMessage(response.data.message);
    //     // console.log('axios then', response.data);
    //     if (response.data === 'Email already exists') {
    //       Toast.showWithGravity(
    //         'Email already exists. Try another email',
    //         Toast.SHORT,
    //         Toast.BOTTOM,
    //       );
    //       setSignInIsLoaded(false);
    //     } else {
    //       setData({value: response.data, storageKey: 'USER_INFO'});
    //       navigation.replace(DASHBOARD);
    //       setSignInIsLoaded(false);
    //     }
    //   })
    //   .catch(error => {
    //     console.log('Register Catch', error);
    //     setSignInIsLoaded(false);
    //     Toast.showWithGravity(
    //       'some error occuoured. Try again',
    //       Toast.SHORT,
    //       Toast.BOTTOM,
    //     );
    //   });
    // // setSignInIsLoaded(false);
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

  const handleLogOut = () => {
    Alert.alert('AmbuServe', 'See you soon', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          removeData({storageKey: 'USER_INFO'});
          navigation.navigate(SPLASH_SCREEN);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleLogOut} style={styles.logOutButton}>
        <Text
          style={{
            textAlign: 'right',
            color: colors.RED,
            fontWeight: '300',
            fontFamily: fonts.BOLD,
            fontSize: fontsizes.px_16,
          }}>
          Log out
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.imageButton}
        onPress={() => {
          // handleLogOut();
        }}>
        <View
          style={{
            position: 'absolute',
            height: hp(1.5),
            width: wp(3),
            borderRadius: wp(3),
            backgroundColor: 'green',
            bottom: hp(1),
            right: hp(3),
            zIndex: 1,
          }}></View>
        <Image
          source={images.DEFAULT_USER}
          resizeMode="contain"
          style={styles.userImage}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setEditButton(prev => !prev);
        }}
        style={styles.editButton}>
        <Text
          style={{
            textAlign: 'right',
            color: colors.BLUE,
            fontWeight: '300',
            fontFamily: fonts.BOLD,
            fontSize: fontsizes.px_16,
          }}>
          Edit
        </Text>
      </TouchableOpacity>
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
            color: editButton ? colors.BLUE : colors.BLACK,
          }}
          placeholder="Full Name"
          placeholderTextColor={colors.BLUE}
          numberOfLines={1}
          multiline={false}
          maxLength={30}
          editable={editButton}
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
            color: editButton ? colors.BLUE : colors.BLACK,
          }}
          placeholder="Email"
          placeholderTextColor={colors.BLUE}
          numberOfLines={1}
          multiline={false}
          maxLength={30}
          editable={editButton}
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
              color: editButton ? colors.BLUE : colors.BLACK,
            }}
            placeholder="Enter your password"
            placeholderTextColor={colors.BLUE}
            secureTextEntry={showPassword ? false : true}
            numberOfLines={1}
            multiline={false}
            maxLength={30}
            editable={editButton}
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
            color: editButton ? colors.BLUE : colors.BLACK,
          }}
          keyboardType="numeric"
          placeholder="Contact"
          placeholderTextColor={colors.BLUE}
          numberOfLines={1}
          multiline={false}
          maxLength={30}
          editable={editButton}
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
            color: editButton ? colors.BLUE : colors.BLACK,
          }}
          placeholder="Address"
          placeholderTextColor={colors.BLUE}
          numberOfLines={1}
          multiline={false}
          maxLength={30}
          editable={editButton}
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
            color: editButton ? colors.BLUE : colors.BLACK,
          }}
          keyboardType="numeric"
          placeholder="Emergency contact"
          placeholderTextColor={colors.BLUE}
          numberOfLines={1}
          multiline={false}
          maxLength={30}
          editable={editButton}
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
            color: editButton ? colors.BLUE : colors.BLACK,
          }}
          placeholder="CNIC"
          placeholderTextColor={colors.BLUE}
          numberOfLines={1}
          multiline={false}
          maxLength={30}
          editable={editButton}
        />

        <CustomButton
          title="Continue"
          textColor={colors.WHITE}
          backgroundColor={colors.BLUE}
          activityIndicator={signInIsLoaded}
          height={hp(6)}
          width={wp(90)}
          borderRadius={wp(2)}
          marginHorizontal={wp(5)}
          // marginTop={hp(2)}
          marginBottom={hp(2)}
          onPress={signInValidation}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserInformation;
