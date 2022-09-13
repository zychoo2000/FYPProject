import React, {useState, useContext} from 'react';
import {View, Alert, Keyboard} from 'react-native';
import SuperSafeAreaView from '../SuperComponent/SuperSafeAreaView';
import COLORS from '../conts/color';
import DropDownPicker from 'react-native-dropdown-picker';
import db, {auth} from '../database/initializeDatabase';
import {useState as useHookState} from '@hookstate/core';
import {record} from '../module/GlobalVariable';
import {collection, addDoc} from 'firebase/firestore';
import SuperInput from '../SuperComponent/SuperInput';
import SuperLabel from '../SuperComponent/SuperLabel';
import SuperButton from '../SuperComponent/SuperButton';
import {AuthContext} from '../navigation/AuthProvider';

const AddBudget = ({navigation, route}) => {
  const globalVariable = useHookState(record);
  const {user} = useContext(AuthContext);
  const userId = user.uid;
  const moment = require('moment');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
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
  const [inputs, setInputs] = useState({
    budget: '',
  });
  const [errors, setErrors] = useState({});

  const addBudget = async () => {
    const docRef = collection(db, 'users', userId, 'budget');
    const dataToAdd = {
      month: checkMonthYear(),
      category: value,
      budget: parseFloat(inputs.budget),
    };
    await addDoc(docRef, dataToAdd);
  };

  const handleOnchange = (text, input) => {
    setInputs(prevState => ({...prevState, [input]: text}));
  };

  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };

  const checkMonthYear = () => {
    const date = moment();
    const month = date.format('MM');
    const year = date.format('YYYY');
    const currentMonthYear = month.concat('/', year);
    return currentMonthYear;
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
      checkExist();
    } else {
      Alert.alert(
        'Input incorrect',
        'Please make sure all the details are filled correctly',
      );
    }
  };
  const checkExist = () => {
    const catExist = globalVariable.budgetExist.get();
    if (catExist.includes(value)) {
      Alert.alert('Budget Add Failed', 'The budget is already exist!');
    } else {
      addBudget();
      navigation.navigate('Budget');
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
      <View style={{flex: 1, marginTop: 50}}>
        <SuperInput
          style={{width: 300}}
          onChangeText={text => handleOnchange(text, 'budget')}
          placeholder="Add Your Budget"
          label="Budget"
          keyboardType="numeric"
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
          />
        </View>
        <SuperButton
          text="Add Budget"
          onPress={() => {
            validate();
          }}
        />
      </View>
    </SuperSafeAreaView>
  );
};
export default AddBudget;
