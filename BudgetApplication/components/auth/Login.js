import React, {useState, useContext} from 'react';
import {View, Image, Alert} from 'react-native';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../database/initializeDatabase';
import {security} from '../module/GlobalVariable';
import {useState as useHookState} from '@hookstate/core';
import SuperSafeAreaView from '../SuperComponent/SuperSafeAreaView';
import SuperInput from '../SuperComponent/SuperInput';
import SuperButton from '../SuperComponent/SuperButton';
import SuperLabel from '../SuperComponent/SuperLabel';
import {AuthContext} from '../navigation/AuthProvider';
const LoginScreen = ({navigation}) => {
  const {login, resetPassword, user} = useContext(AuthContext);
  const globalVariable = useHookState(security);
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
  });

  const handleOnchange = (text, input) => {
    setInputs(prevState => ({...prevState, [input]: text}));
  };
  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };
  const [errors, setErrors] = useState({});
  return (
    <SuperSafeAreaView
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
        width: '100%',
        backgroundColor: '#FFEFD5',
      }}>
      <View
        style={{
          marginTop: 80,
          backgroundColor: '#FFFACD',
          borderRadius: 100,
          height: 150,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          style={{height: 150, width: 150, marginBottom: 10}}
          source={require('../../images/Logo.png')}
        />
      </View>
      <SuperLabel
        style={{
          color: 'black',
          fontStyle: 'italic',
          textShadowRadius: 20,
          fontFamily: 'Roboto',
          letterSpacing: 8,
          fontWeight: 'bold',
          fontSize: 16,
          marginTop: 15,
        }}>
        BYPB
      </SuperLabel>
      <View style={{flex: 1, marginTop: 20}}>
        <SuperInput
          onChangeText={text => handleOnchange(text, 'email')}
          onFocus={() => handleError(null, 'email')}
          iconName="email-outline"
          label="Email"
          placeholder="Enter your email address"
        />
        <SuperInput
          onChangeText={text => handleOnchange(text, 'password')}
          onFocus={() => handleError(null, 'password')}
          iconName="lock-outline"
          label="Password"
          placeholder="Enter your password"
          loginPassword={'yes'}
          password
        />
        <View
          style={{
            backgroundColor: 'white',
          }}></View>
        <SuperButton
          text="sign in"
          onPress={() => {
            login(inputs.email, inputs.password);
          }}
        />
        <SuperButton
          text="sign up"
          onPress={() => navigation.navigate('Register')}
        />
        <SuperButton
          style={{backgroundColor: 'transparent'}}
          text="Forgot Password?"
          textStyle={{
            marginTop: 3,
            fontSize: 12,
            color: '#1E90FF',
          }}
          onPress={() => navigation.navigate('ResetPassword')}
        />
      </View>
    </SuperSafeAreaView>
  );
};

export default LoginScreen;
