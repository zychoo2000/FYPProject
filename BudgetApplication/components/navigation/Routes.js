import React, {useContext, useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {onAuthStateChanged} from 'firebase/auth';
import {AuthContext} from './AuthProvider';
import {auth} from '../database/initializeDatabase';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import {createStackNavigator} from '@react-navigation/stack';

const Routes = () => {
  // const auth = getAuth();

  const {user, setUser} = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);

  const onAuthStateChange = user => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, onAuthStateChange);
    return subscriber;
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Routes;
