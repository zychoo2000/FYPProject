import React, {useEffect, useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import SuperLabel from './SuperLabel';

const SuperButton = ({text, onPress = () => {}, textStyle = {}, ...props}) => {
  return (
    <TouchableOpacity
      style={{
        width: 300,
        height: 40,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        ...props.style,
      }}
      onPress={() => {
        onPress();
      }}>
      <SuperLabel
        mode={'large'}
        style={{
          color: 'black',
          textTransform: 'uppercase',
          textAlign: 'center',
          color: 'white',
          letterSpacing: 2,
          fontWeight: 'bold',
          ...textStyle,
        }}>
        {text}
      </SuperLabel>
    </TouchableOpacity>
  );
};
export default SuperButton;
