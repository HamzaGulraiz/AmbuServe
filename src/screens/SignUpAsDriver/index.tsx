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
  TERMS_AND_CONDITIONS,
} from '../../constants/Navigator';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import {setData} from '../../asyncStorage/AsyncStorage';
import {setUserInfo} from '../../redux/Action';
import {useDispatch} from 'react-redux';
import {BASE_URL} from '../../../config';

type NavigationProps = {
  navigate(APPEREANCE: string): unknown;
  navigation: string;
  goBack: () => void;
  replace: any;
  jumpTo: any;
};

const SignUpAsDriver = () => {
  const navigation = useNavigation<NavigationProps>();
  const dispatch = useDispatch();

  const [toogleCheck, setToogleCheck] = useState(false);
  const [toogleCheckError, setToogleCheckError] = useState('');

  const [driverNumber,setDriverNumber] = useState('');
  const [officeAddress,setOfficeAddress] = useState('');
  const [companyEmail,setCompanyEmail] = useState('');
  const [companyName,setCompanyName] = useState('');
  const [vehicleNumber,setVehicleNumber] = useState('');
  const [driverName, setDriverName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [signInIsLoaded, setSignInIsLoaded] = useState(false);

  //User Information After Validation
  const [userInfoValid, setUserInfoValid] = useState({
    companyNameValid:false,
    driverNameValid: false,
    passwordValid: false,
    vehicleNumberValid:false,
    driverNumberValid:false,
    officeAddressValid:false,
    companyEmailValid:false,
  });

  const signUpValidation = () => {
    if (
      userInfoValid.companyEmailValid === false ||
      userInfoValid.driverNameValid === false ||
      userInfoValid.vehicleNumberValid === false ||
      userInfoValid.driverNumberValid === false ||
      userInfoValid.officeAddressValid === false ||
      userInfoValid.companyNameValid === false ||
      userInfoValid.passwordValid === false 
    ) {
      setDriverNameError('    ');
      setPasswordError("  ")
      setCompanyEmailError(' ')
      setCompanyNameError('  ')
      setDriverNumberError('   ')
      setVehicleNumberError('  ')
      setOfficeAddressError('  ')
      setTimeout(() => {
        setDriverNameError('');
        setPasswordError("")
        setCompanyEmailError('')
        setCompanyNameError('')
        setDriverNumberError('')
        setVehicleNumberError('')
        setOfficeAddressError('')
      
      }, 2000);
    } else {
      if (toogleCheck === true) {
        signUpUser(
          driverName,
          password,
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
    driverName?: string,
    password?: string,
   
  ) => {
    setSignInIsLoaded(true);
    // let data = JSON.stringify({
    //   driver_name: driverName,
    //   password: password,
    // });


 
    // let params = new URLSearchParams(data);


    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${BASE_URL}/driver/create`,
      // url: 'http://192.168.100.21:8000/driver/login',
      // url:`http://192.168.100.21:8000/driver/login?${params}`,
      headers: { 
        'Content-Type': 'application/json'
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
        console.log(
          'data came from node response in sign in as driver =>',
          response.data,
        );
        // dispatch(setUserInfo(response.data));
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
    } else if (value.length > 30) {
      setCompanyNameError('Max 30 characters');
      // setTimeout(() => {
      //   setCompanyNameError('');
      // }, 2000);
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
        // ~: false,
      });
    } else if (value.length > 10) {
      setVehicleNumberError('Max 10 characters');
      // setTimeout(() => {
      //   setVehicleNumberError('');
      // }, 2000);
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
    let reg = /^[a-zA-Z ]{3,30}$/
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
      // setTimeout(() => {
      //   setDriverNameError('');
      // }, 2000);
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
  const passwordValidation = (value: string): boolean => {
    let reg = /^(?=.*?[a-zA-Z])(?=.*?[0-9])[a-zA-Z0-9!@#$%^&*()-_=+[\]{};:'",.<>/?`~|\\]{6,}$/

    
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
    } else if (value.length < 11) {
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
    } else if (value.length > 50) {
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
      // setTimeout(() => {
      //   setCompanyEmailError('');
      // }, 2000);
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
        case 'password':
          passwordValidation(getValue);
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
        title="Sign up as driver"
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
          {companyNameError}
        </Text>
        <TextInput
          value={companyName}
          onChangeText={value => {
            handleOnChangeText(value, 'companyName'), setCompanyName(value);
          }}
          style={{
            ...styles.input,
            borderColor: companyNameError ? colors.RED : colors.BLUE,
            // marginBottom: hp(2),
          }}
          placeholder="Company Name"
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
          {companyEmailError}
        </Text>
        <TextInput
          value={companyEmail}
          onChangeText={value => {
            handleOnChangeText(value, 'companyEmail'), setCompanyEmail(value);
          }}
          style={{
            ...styles.input,
            borderColor: companyEmailError ? colors.RED : colors.BLUE,
            // marginBottom: hp(1),
          }}
          placeholder="Company Email"
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
          {officeAddressError}
        </Text>
        <TextInput
          value={officeAddress}
          onChangeText={value => {
            handleOnChangeText(value, 'officeAddress'), setOfficeAddress(value);
          }}
          style={{
            ...styles.input,
            borderColor: officeAddressError ? colors.RED : colors.BLUE,
            // marginBottom: hp(2),
          }}
          placeholder="Office Address"
          placeholderTextColor={colors.BLUE}
          numberOfLines={1}
          multiline={false}
          maxLength={50}
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
          {driverNumberError}
        </Text>
        <TextInput
          value={driverNumber}
          onChangeText={value => {
            handleOnChangeText(value, 'driverNumber'), setDriverNumber(value);
          }}
          style={{
            ...styles.input,
            borderColor: driverNumberError ? colors.RED : colors.BLUE,
            // marginBottom: hp(2),
          }}
          placeholder="Driver Number"
          keyboardType="numeric"
          placeholderTextColor={colors.BLUE}
          numberOfLines={1}
          multiline={false}
          maxLength={11}
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
          {vehicleNumberError}
        </Text>
        <TextInput
          value={vehicleNumber}
          onChangeText={value => {
            handleOnChangeText(value, 'vehicleNumber'), setVehicleNumber(value);
          }}
          style={{
            ...styles.input,
            borderColor: vehicleNumberError ? colors.RED : colors.BLUE,
            // marginBottom: hp(2),
          }}
          placeholder="Vehicle Number"
          placeholderTextColor={colors.BLUE}
          numberOfLines={1}
          multiline={false}
          maxLength={10}
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
              justifyContent:"center",
              alignItems:"center",
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

     


        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: wp(6),
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
          <TouchableOpacity 
          onPress={()=>{
            navigation.navigate(TERMS_AND_CONDITIONS)
          }}
          >
            <Text style={{
              marginLeft: hp(0.5),
              fontWeight: '400',
              fontSize: fontsizes.px_15,
              fontFamily: fonts.REGULAR,
              color: colors.BLUE,
              textDecorationLine:"underline"
            }}>policies</Text>
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
          marginTop={hp(2)}
          marginBottom={hp(2)}
          onPress={signUpValidation}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUpAsDriver;
