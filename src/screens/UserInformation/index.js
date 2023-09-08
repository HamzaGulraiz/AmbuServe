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
import {MAPS, SIGN_IN, SPLASH_SCREEN} from '../../constants/Navigator';
import fontsizes from '../../../assets/fontsizes/fontsizes';
import fonts from '../../../assets/fonts/fonts';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {PermissionsAndroid} from 'react-native';
import {getData, removeData, setData} from '../../asyncStorage/AsyncStorage';
import icons from '../../../assets/icons/icons';
// import {useTypedSelector} from '../../redux/Store';
import CustomHeader from '../../components/HeaderBar/Header';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import {useDispatch} from 'react-redux';
import {setUserInfo} from '../../redux/Action';
import {BASE_URL} from '../../../config';
import {useTypedSelector} from '../../redux/Store';

const UserInformation = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userInfoString = useTypedSelector(state => state.reducer.userInfo);
  const userInfo = JSON.parse(userInfoString);
  const {
    full_name,
    email,
    password,
    contact,
    address,
    emergency_contact,
    cnic,
    token,
  } = userInfo;
  const [editButton, setEditButton] = useState(false);

  const [updateFullName, setUpdateFullName] = useState(full_name);
  const [updateEmail, setUpdateEmail] = useState(email);
  const [updatePassword, setUpdatePassword] = useState(password);
  const [updateContact, setUpdateContact] = useState(contact);
  const [updateAddress, setUpdateAddress] = useState(address);
  const [updateemergencyContact, setUpdateEmergencyContact] =
    useState(emergency_contact);
  const [updateCNIC, setUpdateCNIC] = useState(cnic);
  const [showPassword, setShowPassword] = useState(false);
  const [signInIsLoaded, setSignInIsLoaded] = useState(false);

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
        updateFullName,
        updateEmail,
        updatePassword,
        updateContact,
        updateAddress,
        updateemergencyContact,
        updateCNIC,
      );
    }
  };

  const updateUserInfo = (
    fullName,
    email,
    password,
    contact,
    address,
    emergencyContact,
    CNIC,
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

    axios
      .request(config)
      .then(response => {
        Toast.showWithGravity('Updated', Toast.SHORT, Toast.BOTTOM);
        const serializedValue = JSON.stringify(response.data);
        dispatch(setUserInfo(serializedValue));
        setData({value: response.data, storageKey: 'USER_INFO'});
        setEditButton(false);
        setSignInIsLoaded(false);
      })
      .catch(error => {
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
  const fullNameValidation = value => {
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

      setUserInfoValid({
        ...userInfoValid,
        fullNameValid: false,
      });
    } else if (value.length >= 30) {
      setFullNameError('Max 30 characters');

      setUserInfoValid({
        ...userInfoValid,
        fullNameValid: false,
      });
    } else {
      setFullNameError('');
      setUserInfoValid({
        ...userInfoValid,
        fullNameValid: true,
      });
    }
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

      setUserInfoValid({
        ...userInfoValid,
        emailValid: false,
      });
    } else if (regx.test(value) === true) {
      setEmailError('');
      setUserInfoValid({
        ...userInfoValid,
        emailValid: true,
      });
    }
  };

  const [passowrdError, setPasswordError] = useState('');
  const passwordValidation = value => {
    let reg =
      /^(?=.*?[a-zA-Z])(?=.*?[0-9])[a-zA-Z0-9!@#$%^&*()-_=+[\]{};:'",.<>/?`~|\\]{8,}$/;
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
      setPasswordError('Use Aplhabets Numbers');

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
  const contactValidation = value => {
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
    } else if (reg.test(value) === false) {
      setContactError('Invalid format');

      setUserInfoValid({
        ...userInfoValid,
        contactValid: false,
      });
    } else if (reg.test(value) === true) {
      setContactError('');
      setUserInfoValid({
        ...userInfoValid,
        contactValid: true,
      });
    }
  };

  const [addressError, setAddressError] = useState('');
  const addressValidation = value => {
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

      setUserInfoValid({
        ...userInfoValid,
        addressValid: false,
      });
    } else {
      setAddressError('');
      setUserInfoValid({
        ...userInfoValid,
        addressValid: true,
      });
    }
  };

  const [emergencyContactError, setEmergencyContactError] = useState('');
  const emergencyContactValidation = value => {
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

      setUserInfoValid({
        ...userInfoValid,
        emergencyValid: false,
      });
    } else if (reg.test(value) === true) {
      setEmergencyContactError('');
      setUserInfoValid({
        ...userInfoValid,
        emergencyValid: true,
      });
    }
  };

  const [CNICError, setCNICError] = useState('');
  const CNICValidation = value => {
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

      setUserInfoValid({
        ...userInfoValid,
        CNICValid: false,
      });
    } else if (reg.test(value) === true) {
      setCNICError('');
      setUserInfoValid({
        ...userInfoValid,
        CNICValid: true,
      });
    }
  };

  const handleOnChangeText = (getValue, fieldName) => {
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
            right: hp(1.4),
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
          value={updateFullName}
          onChangeText={value => {
            handleOnChangeText(value, 'fullName'), setUpdateFullName(value);
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
          value={updateEmail}
          onChangeText={value => {
            handleOnChangeText(value, 'email'), setUpdateEmail(value);
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
            value={updatePassword}
            onChangeText={value => {
              handleOnChangeText(value, 'password'), setUpdatePassword(value);
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
        </View>
        <TextInput
          value={updateContact}
          onChangeText={value => {
            handleOnChangeText(value, 'contact'), setUpdateContact(value);
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
          value={updateAddress}
          onChangeText={value => {
            handleOnChangeText(value, 'address'), setUpdateAddress(value);
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
          value={updateemergencyContact}
          onChangeText={value => {
            handleOnChangeText(value, 'emergencyContact'),
              setUpdateEmergencyContact(value);
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
          value={updateCNIC}
          onChangeText={value => {
            handleOnChangeText(value, 'CNIC'), setUpdateCNIC(value);
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
          backgroundColor={editButton ? colors.BLUE : colors.GREY}
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
