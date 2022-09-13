import React, {useState, useEffect, useContext} from 'react';
import {View, StyleSheet, Keyboard, Alert} from 'react-native';
import SuperSafeAreaView from '../SuperComponent/SuperSafeAreaView';
import DropDownPicker from 'react-native-dropdown-picker';
import db, {auth} from '../database/initializeDatabase';
import {useState as useHookState} from '@hookstate/core';
import {record} from '../module/GlobalVariable';
import SuperInput from '../SuperComponent/SuperInput';
import SuperLabel from '../SuperComponent/SuperLabel';
import SuperButton from '../SuperComponent/SuperButton';
import COLORS from '../conts/color';
import {doc, updateDoc, deleteDoc} from 'firebase/firestore';
import {AuthContext} from '../navigation/AuthProvider';

const EditBudget = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const userId = user.uid;

  const globalVariable = useHookState(record);
  const selectedItem = route.params;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(selectedItem['category']);
  const [items, setItems] = useState([
    {label: 'Clothing', value: 'clothing'},
    {label: 'Entertainment', value: 'entertainment'},
    {label: 'Electronics', value: 'electronics'},
    {label: 'Food and Beverage', value: 'foodandbeverage'},
    {label: 'Healthcare', value: 'healthcare'},
    {label: 'Housing', value: 'housing'},
    {label: 'Shopping', value: 'shopping'},
    {label: 'Transportation', value: 'transportation'},
    {label: 'Utility', value: 'utility'},
  ]);
  const deleteBudget = async () => {
    await deleteDoc(doc(db, 'users', userId, 'budget', selectedItem['id']));
  };
  const alertDelete = () => {
    Alert.alert('Delete Message', 'Are you sure you want to delete this item', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          deleteBudget();
          navigation.navigate('Budget');
        },
      },
    ]);
  };
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <SuperButton
          style={{
            backgroundColor: 'white',
            alignItems: 'flex-end',
            marginBottom: 20,
            width: 100,
            marginRight: 15,
          }}
          textStyle={{
            color: 'black',
          }}
          onPress={() => alertDelete()}
          text="Delete"
        />
      ),
    });
  }, [navigation]);
  const [inputs, setInputs] = useState({
    budget: selectedItem['budget'].toString(),
  });
  const [errors, setErrors] = useState({});

  const updateBudget = async () => {
    const docRef = doc(db, 'users', userId, 'budget', selectedItem.id);
    const docField = {budget: inputs.budget};
    await updateDoc(docRef, docField);
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
    const budgetSub = () => {
      if (inputs.budget.indexOf('.') != -1) {
        return inputs.budget.substring(inputs.budget.indexOf('.') + 1).length;
      }
      return -1;
    };
    const rgx = /^[0-9]*\.?[0-9]*$/;
    if (!inputs.budget.trim()) {
      handleError('Please input Budget', 'budget');
      isValid = false;
    } else if (inputs.budget.trim() == '.') {
      handleError('Input must contain at least 1 numbers', 'budget');
      isValid = false;
    } else if (!inputs.budget.match(rgx)) {
      handleError('Input can only contain numbers and a dot', 'budget');
      isValid = false;
    } else if (budgetSub() > 2) {
      handleError('Input can only have 2 decimal places', 'budget');
      isValid = false;
    }

    if (!value) {
      isValid = false;
    }
    if (isValid) {
      updateBudget();
      navigation.navigate('Budget');
    } else {
      Alert.alert(
        'Input incorrect',
        'Please make sure all the details are filled correctly',
      );
    }
  };
  return (
    <SuperSafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F0F8FF',
        padding: 20,
      }}>
      <SuperInput
        style={{width: 300}}
        onChangeText={text => handleOnchange(text, 'budget')}
        placeholder="Add Your Expense"
        label="Expense"
        keyboardType="numeric"
        value={inputs.budget}
        error={errors.budget}
      />
      <View style={{marginBottom: 20}}>
        <SuperLabel
          style={{marginVertical: 3, fontSize: 14, color: COLORS.grey}}>
          Category
        </SuperLabel>
        <DropDownPicker
          style={{
            borderRadius: 0,
            width: 300,
          }}
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          disabled={true}
        />
      </View>
      <SuperButton
        text="Edit Budget"
        onPress={() => {
          validate();
        }}
      />
    </SuperSafeAreaView>
  );
};
export default EditBudget;
