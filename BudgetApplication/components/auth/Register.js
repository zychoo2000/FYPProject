import React, {useState, useContext} from 'react';
import {View, Keyboard, Alert} from 'react-native';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import db, {auth} from '../database/initializeDatabase';
import SuperSafeAreaView from '../SuperComponent/SuperSafeAreaView';
import SuperInput from '../SuperComponent/SuperInput';
import SuperButton from '../SuperComponent/SuperButton';
import {collection, doc, setDoc} from 'firebase/firestore';
import {AuthContext} from '../navigation/AuthProvider';
const RegisterScreen = ({navigation}) => {
  const {user, register} = useContext(AuthContext);
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const onSignUp = () => {
    // register(inputs.email, inputs.password);
    // createUserWithEmailAndPassword(auth, inputs.email, inputs.password)
    //   .then(result => {
    //     Alert.alert('Successfully register', 'You will be directed to login', [
    //       {text: 'OK', onPress: () => navigation.navigate('Login')},
    //     ]);
    //   })
    //   .catch(error => {
    //     Alert.alert('Failed to register', 'The email is used', [
    //       {text: 'OK', onPress: () => {}},
    //     ]);
    //   });
  };
  const validate = () => {
    Keyboard.dismiss();
    let isValid = true;
    const rgx = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})',
    );
    if (!inputs.email.trim()) {
      handleError('Please input email', 'email');
      isValid = false;
    } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
      handleError('Please input a valid email', 'email');
      isValid = false;
    }

    if (!inputs.password) {
      handleError('Please input password', 'password');
      isValid = false;
    } else if (!inputs.password.match(rgx)) {
      handleError(
        'Password should contain more than 8 characters with at least 1 uppercase, lowercase, number, and symbol',
        'password',
      );
      isValid = false;
    }
    if (!inputs.confirmPassword) {
      handleError('Please input confirm password', 'confirmPassword');
      isValid = false;
    } else if (inputs.password !== inputs.confirmPassword) {
      handleError(
        'Password and Confirm Password is not the same',
        'confirmPassword',
      );
      isValid = false;
    }
    if (isValid) {
      // onSignUp();
      register(inputs.email, inputs.password);
    }
  };
  const handleOnchange = (text, input) => {
    setInputs(prevState => ({...prevState, [input]: text}));
  };
  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };
  return (
    <SuperSafeAreaView
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
        width: '100%',
        backgroundColor: '#FFEFD5',
      }}>
      <View style={{flex: 1, marginTop: 50}}>
        <SuperInput
          onChangeText={text => handleOnchange(text.trim(), 'email')}
          onFocus={() => handleError(null, 'email')}
          iconName="email-outline"
          label="Email"
          placeholder="Enter your email address"
          error={errors.email}
        />
        <SuperInput
          onChangeText={text => handleOnchange(text, 'password')}
          onFocus={() => handleError(null, 'password')}
          iconName="lock-outline"
          label="Password"
          placeholder="Enter your password"
          error={errors.password}
          password
        />
        <SuperInput
          onChangeText={text => handleOnchange(text, 'confirmPassword')}
          onFocus={() => handleError(null, 'confirmPassword')}
          iconName="lock-outline"
          label="Confirm Password"
          placeholder="Enter your password"
          error={errors.confirmPassword}
          password
        />
        <SuperButton
          text="Register"
          onPress={() => {
            validate();
          }}
        />
        <SuperButton text="Back" onPress={() => navigation.navigate('Login')} />
      </View>
    </SuperSafeAreaView>
  );
};

export default RegisterScreen;
