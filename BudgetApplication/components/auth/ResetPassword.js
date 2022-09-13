import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  Keyboard,
} from 'react-native';
import SuperButton from '../SuperComponent/SuperButton';
import SuperInput from '../SuperComponent/SuperInput';
import SuperSafeAreaView from '../SuperComponent/SuperSafeAreaView';
import {sendPasswordResetEmail} from 'firebase/auth';
const ResetPassword = ({navigation}) => {
  const [inputs, setInputs] = useState({
    email: '',
  });
  const [errors, setErrors] = useState({});

  const onResetPassword = () => {
    sendPasswordResetEmail(auth, inputs.email)
      .then(() => {
        Alert.alert(
          'Successfully Sent',
          'Please check your email to reset password',
          [
            {
              text: 'OK',
            },
          ],
        );
      })
      .catch(error => {
        Alert.alert('Failed to find email', 'Please check your input', [
          {
            text: 'OK',
          },
        ]);
      });
  };
  const handleOnchange = (text, input) => {
    setInputs(prevState => ({...prevState, [input]: text}));
  };
  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };
  const validate = () => {
    Keyboard.dismiss();
    let isValid = true;

    if (!inputs.email) {
      handleError('Please input email', 'email');
      isValid = false;
    } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
      handleError('Please input a valid email', 'email');
      isValid = false;
    }

    if (isValid) {
      onResetPassword();
    }
  };
  return (
    <SuperSafeAreaView
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
        width: '100%',
      }}>
      <View
        style={{
          flex: 1,
          marginTop: 20,
        }}>
        <SuperInput
          onChangeText={text => handleOnchange(text, 'email')}
          onFocus={() => handleError(null, 'email')}
          iconName="email-outline"
          label="Email"
          placeholder="Enter your email address"
          error={errors.email}
        />
        <SuperButton
          text="Reset Password"
          onPress={() => {
            validate();
          }}
        />
      </View>
    </SuperSafeAreaView>
  );
};
export default ResetPassword;
