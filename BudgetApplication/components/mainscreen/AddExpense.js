import React, {useState, useContext} from 'react';
import {TextInput, View, TouchableOpacity, Keyboard, Alert} from 'react-native';
import COLORS from '../conts/color';
import SuperSafeAreaView from '../SuperComponent/SuperSafeAreaView';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {addData} from '../database/crudDatabase';
import db, {auth} from '../database/initializeDatabase';
import SuperInput from '../SuperComponent/SuperInput';
import SuperButton from '../SuperComponent/SuperButton';
import SuperLabel from '../SuperComponent/SuperLabel';
import {Timestamp} from 'firebase/firestore';
import {AuthContext} from '../navigation/AuthProvider';

const AddExpense = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const userId = user.uid;
  const result = route.params ? route.params : '';
  const moment = require('moment');

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
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
    title: '',
    expense: result === '' ? '' : result['totalPrice'],
    date: result === '' ? '' : result['date'],
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    Keyboard.dismiss();
    const expenseSub = () => {
      if (inputs.expense.indexOf('.') != -1) {
        return inputs.expense.substring(inputs.expense.indexOf('.') + 1).length;
      }
      return -1;
    };
    const rgx = /^[0-9]*\.?[0-9]*$/;
    let isValid = true;
    if (!inputs.title.trim()) {
      handleError('Please input title', 'title');
      isValid = false;
    }

    if (!inputs.expense.trim()) {
      handleError('Please input expense', 'expense');
      isValid = false;
    } else if (inputs.expense.trim() == '.') {
      handleError('Input must contain at least 1 numbers', 'expense');
      isValid = false;
    } else if (!inputs.expense.match(rgx)) {
      handleError('Input can only contain numbers and a dot', 'expense');
      isValid = false;
    } else if (expenseSub() > 2) {
      handleError('Input can only have 2 decimal places', 'expense');
      isValid = false;
    }
    if (!inputs.date) {
      isValid = false;
    }
    if (!value) {
      isValid = false;
    }
    if (isValid) {
      addData(
        'expense',
        {
          title: inputs.title,
          date: inputs.date,
          expense: parseFloat(inputs.expense),
          category: value,
          firebasedate: Timestamp.fromDate(new Date()),
        },
        userId,
      );
      navigation.navigate('Home');
    } else {
      Alert.alert(
        'Failed to add record',
        'Please make sure all the details are filled correctly',
      );
    }
  };
  const handleOnchange = (text, input) => {
    setInputs(prevState => ({...prevState, [input]: text}));
  };
  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    hideDatePicker();
    let formattedDate = moment(new Date(date)).format('DD/MM/YYYY');
    setInputs(prevState => ({...prevState, date: formattedDate}));
  };

  return (
    <SuperSafeAreaView
      style={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#F0F8FF',
        width: '100%',
      }}>
      <View style={{flex: 1, marginTop: 50}}>
        <SuperInput
          style={{width: 300}}
          label="Title"
          onChangeText={text => handleOnchange(text.trim(), 'title')}
          placeholder="Add Title for Expense"
          error={errors.title}
        />

        <SuperInput
          style={{width: 300}}
          onChangeText={text => handleOnchange(text.trim(), 'expense')}
          placeholder="Add Your Expense"
          label="Expense"
          keyboardType="numeric"
          value={inputs.expense.trim()}
          error={errors.expense}
        />
        <View>
          <SuperLabel
            style={{marginVertical: 3, fontSize: 14, color: COLORS.grey}}>
            Date
          </SuperLabel>
          <TouchableOpacity
            onPress={showDatePicker}
            style={{
              height: 50,
              borderWidth: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 5,
              backgroundColor: 'white',
            }}>
            <TextInput
              placeholder="Add a date"
              value={inputs.date}
              editable={false}
              onChangeText={text => handleOnchange(text, 'date')}
            />

            <View style={{justifyContent: 'center', alignItems: 'flex-end'}}>
              <AntDesign
                style={{color: 'black'}}
                name="calendar"
                size={25}></AntDesign>
            </View>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            maximumDate={new Date(moment())}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
          <View style={{marginVertical: 40}}>
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
        </View>

        <SuperButton
          text="Add Expense"
          onPress={() => {
            validate();
          }}
        />
      </View>
    </SuperSafeAreaView>
  );
};

export default AddExpense;
