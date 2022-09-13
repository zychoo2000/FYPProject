import React, {useContext} from 'react';
import {Alert} from 'react-native';
import {auth} from '../database/initializeDatabase';
import {security, record} from '../module/GlobalVariable';
import {useState as useHookState} from '@hookstate/core';
import SuperSafeAreaView from '../SuperComponent/SuperSafeAreaView';
import {getAuth, sendPasswordResetEmail} from 'firebase/auth';
import SuperButton from '../SuperComponent/SuperButton';
import {AuthContext} from '../navigation/AuthProvider';

const ProfileScreen = ({navigation, route}) => {
  const {logout} = useContext(AuthContext);
  const globalVariableSec = useHookState(security);
  const globalVariableRec = useHookState(record);

  const onChangePassword = () => {
    sendPasswordResetEmail(auth, auth.currentUser.email)
      .then(() => {
        Alert.alert('Successfully Sent', 'Please check your email');
      })
      .catch(error => {
        Alert.alert('Failed to Sent', 'An error occur');
      });
  };
  return (
    <SuperSafeAreaView
      style={{flex: 1, width: '100%'}}
      navigation={route.name}
      mode={'mainScreen'}>
      <SuperButton
        style={{width: 390, marginTop: 0}}
        text="Change Password"
        onPress={() => onChangePassword()}
      />
    </SuperSafeAreaView>
  );
};
export default ProfileScreen;
