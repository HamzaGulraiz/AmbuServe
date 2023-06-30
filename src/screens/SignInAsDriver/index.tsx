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
import {SIGN_IN, SIGN_UP} from '../../constants/Navigator';

type NavigationProps = {
  navigate(APPEREANCE: string): unknown;
  navigation: string;
  goBack: () => void;
  replace: any;
  jumpTo: any;
};

const SignInAsDriver = () => {
  const navigation = useNavigation<NavigationProps>();

  const [toogleCheck, setToogleCheck] = useState(false);
  const [toogleCheckError, setToogleCheckError] = useState('');

  const [companyName, setCompanyName] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverNumber, setDriverNumber] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [signUpIsLoaded, setSignUpIsLoaded] = useState(false);
  const [facebookIsLoaded, setFacebookIsLoaded] = useState(false);
  const [gmailIsLoaded, setGmailIsLoaded] = useState(false);

  //User Information After Validation
  const [userInfoValid, setUserInfoValid] = useState({
    companyNameValid: false,
    vehicleNumberValid: false,
    driverNameValid: false,
    driverNumberValid: false,
    officeAddressValid: false,
    companyEmailValid: false,
  });

  const signUpValidation = () => {
    if (
      userInfoValid.companyNameValid === false ||
      userInfoValid.vehicleNumberValid === false ||
      userInfoValid.driverNameValid === false ||
      userInfoValid.driverNumberValid === false ||
      userInfoValid.officeAddressValid === false ||
      userInfoValid.companyEmailValid === false
    ) {
      setCompanyNameError('    ');
      setVehicleNumberError('    ');
      setDriverNameError('    ');
      setDriverNumberError('    ');
      setOfficeAddressError('    ');
      setCompanyEmailError('    ');
      setTimeout(() => {
        setCompanyNameError('');
        setVehicleNumberError('');
        setDriverNameError('');
        setDriverNumberError('');
        setOfficeAddressError('');
        setCompanyEmailError('');
      }, 2000);
    } else {
      if (toogleCheck === true) {
        signUpUser(
          companyName,
          vehicleNumber,
          driverName,
          driverNumber,
          officeAddress,
          companyEmail,
        );
      } else {
        setToogleCheckError('    ');
        setTimeout(() => {
          setToogleCheckError('');
        }, 2000);
      }
    }
  };

  const signUpUser = (
    companyName?: string,
    vehicleNumber?: string,
    driverName?: string,
    driverNumber?: string,
    officeAddress?: string,
    companyEmail?: string,
  ) => {
    setSignUpIsLoaded(true);
    let data = JSON.stringify({
      companyName: companyName,
      vehicleNumber: vehicleNumber,
      driverName: driverName,
      driverNumber: driverNumber,
      officeAddress: officeAddress,
      companyEmail: companyEmail,
    });

    setTimeout(() => {
      console.log(data);
      setSignUpIsLoaded(false);
      // navigation.replace(MY_TABS);
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

  const [companyNameError, setCompanyNameError] = useState('');
  const companyNameValidation = (value: string) => {
    if (value.length == 0) {
      setCompanyNameError('Required!');
      setTimeout(() => {
        setCompanyNameError('');
      }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        companyNameValid: false,
      });
    } else if (value.length > 20) {
      setCompanyNameError('Invalid format');
      setTimeout(() => {
        setCompanyNameError('');
      }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        companyNameValid: false,
      });
      //  console.log(userInfoValid);
    } else {
      setCompanyNameError('');
      setUserInfoValid({
        ...userInfoValid,
        companyNameValid: true,
      });
      //  console.log(userInfoValid);
    }
  };

  const [vehicleNumberError, setVehicleNumberError] = useState('');
  const vehicleNumberValidation = (value: string) => {
    if (value.length == 0) {
      setVehicleNumberError('Required!');
      setTimeout(() => {
        setVehicleNumberError('');
      }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        vehicleNumberValid: false,
      });
    } else if (value.length > 10) {
      setVehicleNumberError('Invalid format');
      setTimeout(() => {
        setVehicleNumberError('');
      }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        vehicleNumberValid: false,
      });
      //  console.log(userInfoValid);
    } else {
      setVehicleNumberError('');
      setUserInfoValid({
        ...userInfoValid,
        vehicleNumberValid: true,
      });
      //  console.log(userInfoValid);
    }
  };

  const [driverNameError, setDriverNameError] = useState('');
  const driverNameValidation = (value: string) => {
    if (value.length == 0) {
      setDriverNameError('Required!');
      setTimeout(() => {
        setDriverNameError('');
      }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        driverNameValid: false,
      });
    } else if (value.length > 15) {
      setDriverNameError('Invalid format');
      setTimeout(() => {
        setDriverNameError('');
      }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        driverNameValid: false,
      });
      //  console.log(userInfoValid);
    } else {
      setDriverNameError('');
      setUserInfoValid({
        ...userInfoValid,
        driverNameValid: true,
      });
      //  console.log(userInfoValid);
    }
  };

  const [driverNumberError, setDriverNumberError] = useState('');
  const driverNumberValidation = (value: string) => {
    if (value.length == 0) {
      setDriverNumberError('Required!');
      setTimeout(() => {
        setDriverNumberError('');
      }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        driverNumberValid: false,
      });
    } else if (value.length > 11) {
      setDriverNumberError('Invalid format');
      setTimeout(() => {
        setDriverNumberError('');
      }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        driverNumberValid: false,
      });
      //  console.log(userInfoValid);
    } else {
      setDriverNumberError('');
      setUserInfoValid({
        ...userInfoValid,
        driverNumberValid: true,
      });
      //  console.log(userInfoValid);
    }
  };

  const [officeAddressError, setOfficeAddressError] = useState('');
  const officeAddressValidation = (value: string) => {
    if (value.length == 0) {
      setOfficeAddressError('Required!');
      setTimeout(() => {
        setOfficeAddressError('');
      }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        officeAddressValid: false,
      });
    } else if (value.length > 40) {
      setOfficeAddressError('Invalid format');
      setTimeout(() => {
        setOfficeAddressError('');
      }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        officeAddressValid: false,
      });
      //  console.log(userInfoValid);
    } else {
      setOfficeAddressError('');
      setUserInfoValid({
        ...userInfoValid,
        officeAddressValid: true,
      });
      //  console.log(userInfoValid);
    }
  };

  const [companyEmailError, setCompanyEmailError] = useState('');
  const companyEmailValidation = (value: string) => {
    let regx = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (value.length == 0) {
      setCompanyEmailError('Required!');
      setTimeout(() => {
        setCompanyEmailError('');
      }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        companyEmailValid: false,
      });
    } else if (regx.test(value) === false) {
      setCompanyEmailError('Invalid format');
      setTimeout(() => {
        setCompanyEmailError('');
      }, 2000);
      setUserInfoValid({
        ...userInfoValid,
        companyEmailValid: false,
      });
      //  console.log(userInfoValid);
    } else if (regx.test(value) === true) {
      setCompanyEmailError('');
      setUserInfoValid({
        ...userInfoValid,
        companyEmailValid: true,
      });
      //  console.log(userInfoValid);
    }
  };

  const handleOnChangeText = (getValue: string, fieldName: string) => {
    switch (fieldName) {
      case 'companyName':
        companyNameValidation(getValue);
        break;
      case 'vehicleNumber':
        vehicleNumberValidation(getValue);
        break;
      case 'driverName':
        driverNameValidation(getValue);
        break;
      case 'driverNumber':
        driverNumberValidation(getValue);
        break;
      case 'officeAddress':
        officeAddressValidation(getValue);
        break;
      case 'companyEmail':
        companyEmailValidation(getValue);
        break;

      default:
      // code block
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title="Registeration Form"
        marginTop={hp(3)}
        leftIcon={icons.BACK_ARROW}
        onPressLeftIcon={() => {
          navigation.goBack();
        }}
        marginBottom={hp(10)}
      />
      <ScrollView>
        <TextInput
          value={companyName}
          onChangeText={value => {
            handleOnChangeText(value, 'companyName'), setCompanyName(value);
          }}
          style={{
            ...styles.input,
            borderColor: companyNameError ? colors.RED : colors.BLUE,
            marginBottom: hp(2),
          }}
          placeholder="Company Name"
          placeholderTextColor={colors.BLUE}
          numberOfLines={1}
          multiline={false}
          maxLength={30}
        />
        <TextInput
          value={vehicleNumber}
          onChangeText={value => {
            handleOnChangeText(value, 'vehicleNumber'), setVehicleNumber(value);
          }}
          style={{
            ...styles.input,
            borderColor: vehicleNumberError ? colors.RED : colors.BLUE,
            marginBottom: hp(2),
          }}
          placeholder="Vehicle Number"
          placeholderTextColor={colors.BLUE}
          numberOfLines={1}
          multiline={false}
          maxLength={30}
        />
        <TextInput
          value={driverName}
          onChangeText={value => {
            handleOnChangeText(value, 'driverName'), setDriverName(value);
          }}
          style={{
            ...styles.input,
            borderColor: driverNameError ? colors.RED : colors.BLUE,
            marginBottom: hp(2),
          }}
          placeholder="Driver Name"
          placeholderTextColor={colors.BLUE}
          numberOfLines={1}
          multiline={false}
          maxLength={30}
        />
        <TextInput
          value={driverNumber}
          onChangeText={value => {
            handleOnChangeText(value, 'driverNumber'), setDriverNumber(value);
          }}
          style={{
            ...styles.input,
            borderColor: driverNumberError ? colors.RED : colors.BLUE,
            marginBottom: hp(2),
          }}
          placeholder="Driver Number"
          keyboardType="numeric"
          placeholderTextColor={colors.BLUE}
          numberOfLines={1}
          multiline={false}
          maxLength={30}
        />
        <TextInput
          value={officeAddress}
          onChangeText={value => {
            handleOnChangeText(value, 'officeAddress'), setOfficeAddress(value);
          }}
          style={{
            ...styles.input,
            borderColor: officeAddressError ? colors.RED : colors.BLUE,
            marginBottom: hp(2),
          }}
          placeholder="Office Address"
          placeholderTextColor={colors.BLUE}
          numberOfLines={1}
          multiline={false}
          maxLength={30}
        />
        <TextInput
          value={companyEmail}
          onChangeText={value => {
            handleOnChangeText(value, 'companyEmail'), setCompanyEmail(value);
          }}
          style={{
            ...styles.input,
            borderColor: companyEmailError ? colors.RED : colors.BLUE,
            marginBottom: hp(2),
          }}
          placeholder="Company Email"
          placeholderTextColor={colors.BLUE}
          numberOfLines={1}
          multiline={false}
          maxLength={30}
        />

        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: wp(5),
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              setToogleCheck(prevState => !prevState);
            }}
            style={{
              height: hp(2),
              width: wp(4),
              // borderRadius: hp(1),
              borderWidth: hp(0.1),
              borderColor: colors.BLACK,
              justifyContent: 'center',
              alignItems: 'center',
              // backgroundColor: 'red',
            }}>
            {toogleCheck && (
              <Image
                source={icons.CHECK}
                resizeMode="contain"
                style={{height: hp(1.5), width: wp(3)}}
              />
            )}
          </TouchableOpacity>
          <Text
            style={{
              marginLeft: hp(1),
              fontWeight: '400',
              fontSize: fontsizes.px_15,
              fontFamily: fonts.REGULAR,
              color: toogleCheckError ? colors.RED : colors.BLACK,
            }}>
            I agree to terms and conditions
          </Text>
        </View>

        <CustomButton
          title="Apply"
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignInAsDriver;
