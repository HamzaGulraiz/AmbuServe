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
import {getData, removeData,setData} from '../../asyncStorage/AsyncStorage';
import icons from '../../../assets/icons/icons';
import {useTypedSelector} from '../../redux/Store';
import {set} from 'mongoose';
import CustomHeader from '../../components/HeaderBar/Header';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import {useDispatch} from 'react-redux';
import {setUserInfo} from '../../redux/Action';
import { BASE_URL } from '../../../config';

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



const UserInformation = () => {
  const navigation = useNavigation<NavigationProps>();
  const dispatch = useDispatch();
  const userInfo = useTypedSelector(state => state.app.userInfo) as UserInfo;
  const appState = useTypedSelector(state => state.app.appState);
  const [editButton, setEditButton] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [CNIC, setCNIC] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [signInIsLoaded, setSignInIsLoaded] = useState(false);

 
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
          setEmergencyContact(responseObj.emergency_contact);
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
    fullNameValid: true,
    emailValid: true,
    passwordValid: true,
    contactValid: true,
    addressValid: true,
    emergencyValid: true,
    CNICValid: true,
  });

  const updateValidation = () => {
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
      updateUserInfo(
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

  const updateUserInfo = (
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
      emercency_contact: emergencyContact,
      cnic: CNIC,
    });

    let config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: `${BASE_URL}/update`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    // console.log("data sent on user info edit ===> " , data);
    
    axios
      .request(config)
      .then(response => {
        //setErrorMessage(response.data.message);
        // console.log('axios then', response);
        Toast.showWithGravity(
          "Updated",
          Toast.SHORT,
          Toast.BOTTOM,
        );
        dispatch(setUserInfo(response.data));
        setData({value: response.data, storageKey: 'USER_INFO'});
        setEditButton(false);
        // if (response.data === 'Email already exists') {
        //   Toast.showWithGravity(
        //     'Email already exists. Try another email',
        //     Toast.SHORT,
        //     Toast.BOTTOM,
        //   );
          setSignInIsLoaded(false);
        // } else {
        //   setData({value: response.data, storageKey: 'USER_INFO'});
        //   navigation.replace(DASHBOARD);
        //   setSignInIsLoaded(false);
        // }
      })
      .catch((error: any) => {
        // console.log(error);
        
        console.log('user info update Catch', error);
        setSignInIsLoaded(false);
        Toast.showWithGravity(
          'some error occuoured. Try again',
          Toast.SHORT,
          Toast.BOTTOM,
        );
      });
    setSignInIsLoaded(false);
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
    } 
    else if (value.length < 3) {
      setFullNameError('Atleast 3 characters');
      // setTimeout(() => {
      //   setFullNameError('');
      // }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        fullNameValid: false,
      });
      //  console.log(userInfoValid);
    }
    
    else if (value.length >= 30) {
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
    let reg = /^(?=.*?[a-zA-Z])(?=.*?[0-9])[a-zA-Z0-9!@#$%^&*()-_=+[\]{};:'",.<>/?`~|\\]{8,}$/
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
    }  else if (reg.test(value) === false) {
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
    let reg =/^[0-9]{5}-[0-9]{7}-[0-9]$/;
    if (value.length == 0) {
      setCNICError('Required!');
      setTimeout(() => {
        setCNICError('');
      }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        CNICValid: false,
      });
    }    else if (reg.test(value) === false) {
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
        <CustomHeader
        // title="Sign up"
        marginTop={hp(3)}
        leftIcon={icons.BACK_ARROW}
        onPressLeftIcon={() => {
          navigation.goBack();
        }}
        marginBottom={hp(6)}
      />
      <View style={styles.logOutButtonView}>

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
            </View>

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
            color: colors.BLACK,
          }}
          placeholder="Email"
          placeholderTextColor={colors.BLUE}
          numberOfLines={1}
          multiline={false}
          maxLength={30}
          editable={false}
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
            secureTextEntry={editButton ? false : true}
            numberOfLines={1}
            multiline={false}
            maxLength={30}
            editable={editButton}

          />
          {/* <TouchableOpacity
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
          </TouchableOpacity> */}
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
          value={emergencyContact}
          onChangeText={value => {
            handleOnChangeText(value, 'emergencyContact'),
              setEmergencyContact(value);
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
          title="Update"
          textColor={colors.WHITE}
          backgroundColor={editButton? colors.BLUE : colors.GREY}
          activityIndicator={signInIsLoaded}
          height={hp(6)}
          width={wp(90)}
          borderRadius={wp(2)}
          marginHorizontal={wp(5)}
          // marginTop={hp(2)}
          marginBottom={hp(2)}
          disable={!editButton}
          onPress={updateValidation}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserInformation;
