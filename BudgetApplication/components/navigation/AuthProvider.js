import React, {createContext, useState} from 'react';
import {Alert} from 'react-native';
import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {useState as useHookState} from '@hookstate/core';

import {security, record} from '../module/GlobalVariable';
import {auth} from '../database/initializeDatabase';
export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const globalVariableRec = useHookState(record);

  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (email, password) => {
          try {
            signInWithEmailAndPassword(auth, email, password)
              .then(result => {
                // Alert.alert(
                //   'Successfully login',
                //   'You will be directed to home',
                //   [
                //     {
                //       text: 'OK',
                //       onPress: () => {},
                //     },
                //   ],
                // );
              })
              .catch(error => {
                console.log(error);
                Alert.alert(
                  'Failed to login',
                  'Your username or password is wrong',
                );
              });
          } catch (e) {
            console.log(e);
          }
        },

        register: async (email, password) => {
          try {
            createUserWithEmailAndPassword(auth, email, password)
              .then(result => {
                Alert.alert(
                  'Successfully register',
                  'You will be directed to home',
                );
              })
              .catch(error => {
                Alert.alert('Failed to register', 'The email is used', [
                  {text: 'OK', onPress: () => {}},
                ]);
              });
          } catch (e) {
            console.log(e);
          }
        },
        logout: async () => {
          try {
            await signOut(auth)
              .then(re => {
                globalVariableRec.expenseList.set([]);
                globalVariableRec.budgetList.set(null);
                globalVariableRec.budgetExist.set([]);
                globalVariableRec.totalEachCategory.set(null);
                globalVariableRec.budgetCategoryInfo.set(null);
              })
              .catch(err => {
                console.log(err);
                Alert.alert('Failed to logout', 'An error occur');
              });
          } catch (e) {
            console.log(e);
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};
