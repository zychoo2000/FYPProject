import React from 'react';
import RegisterScreen from '../auth/Register';
import LoginScreen from '../auth/Login';
import {createStackNavigator} from '@react-navigation/stack';
import ResetPassword from '../auth/ResetPassword';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{}}
      />
    </Stack.Navigator>
  );
};
export default AuthStack;
