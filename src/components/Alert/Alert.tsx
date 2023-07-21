import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../../assets/colors/colors';
import icons from '../../../assets/icons/icons';
import fonts from '../../../assets/fonts/fonts';
import images from '../../../assets/images/images';


type CustomAlertProps = {
    visible?:boolean;
    title?: string;
    message?:string;
    onPressClose?: () => void;
    confirmButton?:boolean;
    cancelButton?:boolean;

  };

const CustomAlert : React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  onPressClose,
  confirmButton,
  cancelButton,
}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View
          style={{
            ...styles.container,
            backgroundColor:colors.WHITE,
          }}>
          <TouchableOpacity style={styles.closeButton} onPress={onPressClose}>
            <Image style={styles.closeButtonIcon} source={icons.CROSS} resizeMode="contain" />
          </TouchableOpacity>
          <View style={styles.content}>
              <View style={styles.titleIconContainer}>
                <Image style={styles.titleIcon} source={images.LOGO} resizeMode="contain" />
              </View>
         
            {title ? <Text style={styles.title}>{title}</Text> : null}
            {message ? <Text style={styles.message}>{message}</Text> : null}
           

            {/* {dataUsed ? (
              <View>
                <View style={styles.dataUsedView}>
                  <View style={styles.dataUsedImageContainer}>
                    <Image style={styles.titleIcon} source={icons.logo} />
                  </View>
                  <View style={styles.dataIcon}>
                    <Image style={styles.titleIcon} source={icons.data} />
                  </View>
                  <View style={styles.textView}>
                    <Text style={styles.dataText}>
                      Data used: {dataUsed} MB of {totalData} MB
                    </Text>
                  </View>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={styles.greyProgressBar}>
                    <View
                      style={{
                        ...styles.blueProgressBar,
                        width: `${dataPercentage}%`,
                      }}></View>
                  </View>
                </View>
                <Divider marginBottom={hp(5)} dividerColor={colors.black} />
              </View>
            ) : null} */}


          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '90%',
    height:hp(40),
    backgroundColor: '#FFFFFF',
    borderRadius: wp(2),
    overflow: 'hidden',
  },
  closeButton: {
    marginLeft: wp(2),
    marginTop: hp(1),
    height: hp(3),
    width: wp(5),
    // backgroundColor:"red"
  },
  closeButtonIcon: {
    // resizeMode: 'contain',
    height: '100%',
    width: '100%',
  },
  content: {
    // marginTop: hp(1),
    //marginBottom: hp(1),
    // padding: 20,
    // backgroundColor: 'blue',
  },
  title: {
    fontFamily: fonts.REGULAR,
    fontSize: hp(3.4),
    color: colors.BLACK,
    fontWeight: '500',
    // marginBottom: hp(6),
    textAlign: 'center',
  },
  titleIconContainer: {
    // backgroundColor: 'red',
    justifyContent:"center",
    alignItems:"center",
  },
  titleIcon: {
    // resizeMode: 'contain',
    height: hp(5),
    width: wp(40),
    
  },
  message: {
    fontFamily: fonts.REGULAR,
    fontWeight: '400',
    color: colors.BLACK,
    marginLeft: wp(7),
    marginRight: wp(4.4),
    marginBottom: hp(4.3),
    fontSize: wp(3.9),
    textAlign: 'center',
  },
 

});

export default CustomAlert;