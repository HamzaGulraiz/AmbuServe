import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {View, Text, FlexAlignType} from 'react-native';
import React from 'react';
import colors from '../../../assets/colors/colors';

type DividerProps = {
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  height?: number;
  width?: number;
  alignSelf?: 'auto' | FlexAlignType | undefined;
  dividerColor?: string;
};

const Divider: React.FC<DividerProps> = ({
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  height,
  width,
  alignSelf,
  dividerColor,
}) => {
  return (
    <View
      style={{
        backgroundColor: dividerColor ? dividerColor : colors.DIVIDER,
        height: height ? height : 0,
        width: width ? width : 0,
        alignSelf: alignSelf ? alignSelf : 'center',
        marginTop: marginTop ? marginTop : 0,
        marginBottom: marginBottom ? marginBottom : 0,
        marginLeft: marginLeft ? marginLeft : 0,
        marginRight: marginRight ? marginRight : 0,
      }}
    />
  );
};

export default Divider;
