import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import COLORS from '../conts/color';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SuperLabel from './SuperLabel';
const SuperInput = ({
  label,
  iconName,
  error,
  password,
  onFocus = () => {},
  ...props
}) => {
  const [hidePassword, setHidePassword] = useState(password);
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View style={{marginBottom: 20}}>
      <SuperLabel style={style.label}>{label}</SuperLabel>
      <View
        style={[
          style.inputContainer,
          {
            borderColor: error
              ? COLORS.red
              : isFocused
              ? COLORS.darkBlue
              : COLORS.light,
            alignItems: 'center',
            ...props.style,
          },
        ]}>
        {iconName ? (
          <Icon
            name={iconName}
            style={{color: COLORS.darkBlue, fontSize: 22, marginRight: 10}}
          />
        ) : (
          <View />
        )}
        <TextInput
          autoCorrect={false}
          onFocus={() => {
            onFocus();
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={hidePassword}
          style={{color: COLORS.darkBlue, flex: 1}}
          {...props}
        />
        {password && (
          <Icon
            onPress={() => setHidePassword(!hidePassword)}
            name={hidePassword ? 'eye-outline' : 'eye-off-outline'}
            style={{color: COLORS.darkBlue, fontSize: 22}}
          />
        )}
      </View>
      {error ? (
        <SuperLabel
          mode={'small'}
          style={{width: 300, marginTop: 5, color: COLORS.red}}>
          {error}
        </SuperLabel>
      ) : (
        <View style={{marginTop: 20}} />
      )}
    </View>
  );
};

const style = StyleSheet.create({
  label: {
    marginVertical: 3,
    fontSize: 14,
    color: COLORS.grey,
  },
  inputContainer: {
    height: 55,
    // backgroundColor: COLORS.light,
    backgroundColor: '#FFFAFA',

    flexDirection: 'row',
    paddingHorizontal: 15,
    borderWidth: 0.5,
  },
});

export default SuperInput;
