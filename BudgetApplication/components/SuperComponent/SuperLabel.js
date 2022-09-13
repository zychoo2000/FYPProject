import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';

const SuperLabel = ({mode = 'small', ...props}) => {
  return (
    <Text
      style={{
        color: 'black',
        fontSize: mode === 'small' ? 12 : mode === 'medium' ? 14 : 16,
        textTransform: 'uppercase',
        ...props.style,
      }}>
      {props.children}
    </Text>
  );
};
export default SuperLabel;
