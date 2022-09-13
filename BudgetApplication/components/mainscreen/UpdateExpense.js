import React, {useState, useContext} from 'react';
import {TextInput, View, TouchableOpacity, Keyboard, Alert} from 'react-native';
import COLORS from '../conts/color';
import SuperSafeAreaView from '../SuperComponent/SuperSafeAreaView';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import db from '../database/initializeDatabase';
import SuperInput from '../SuperComponent/SuperInput';
import SuperButton from '../SuperComponent/SuperButton';
import SuperLabel from '../SuperComponent/SuperLabel';
import {Timestamp} from 'firebase/firestore';
import {updateData} from '../database/crudDatabase';
import {doc, deleteDoc} from 'firebase/firestore';
import {AuthContext} from '../navigation/AuthProvider';

const UpdateExpense = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const userId = user.uid;
  const selectedItem = route.params;

  const moment = require('moment');

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
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
  const [inputs, setInputs] = useState({
    title: selectedItem['title'],
    expense: selectedItem['expense'].toString(),
    date: selectedItem['date'],
  });
  const [errors, setErrors] = useState({});

  const deleteExpense = async () => {
    await deleteDoc(doc(db, 'users', userId, 'expense', selectedItem['id']));
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
          deleteExpense();
          navigation.navigate('Home');
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
            width: 100,
            alignItems: 'flex-end',
            marginBottom: 20,
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
  const validate = () => {
    Keyboard.dismiss();
    let isValid = true;
    const expenseSub = () => {
      if (inputs.expense.indexOf('.') != -1) {
        return inputs.expense.substring(inputs.expense.indexOf('.') + 1).length;
      }
      return -1;
    };

    const rgx = /^[0-9]*\.?[0-9]*$/;
    if (!inputs.title.trim()) {
      handleError('Please input title', 'title');
      isValid = false;
    }

    if (!inputs.expense.trim()) {
      handleError('Please input expense', 'expense');
      isValid = false;
    } else if (inputs.expense.trim() == '.') {
      handleError('Input must contain at least 1 numbers', 'budget');
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
      updateData(userId, 'expense', selectedItem['id'], {
        title: inputs.title.trim(),
        date: inputs.date,
        expense: parseFloat(inputs.expense),
        category: value,
        firebasedate: Timestamp.fromDate(new Date()),
      });
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
          onChangeText={text => handleOnchange(text, 'title')}
          placeholder="Add Title for Expense"
          value={inputs.title}
          error={errors.title}
        />

        <SuperInput
          style={{width: 300}}
          onChangeText={text => handleOnchange(text, 'expense')}
          placeholder="Add Your Expense"
          label="Expense"
          keyboardType="numeric"
          value={inputs.expense}
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
        </View>
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

        <SuperButton
          text="Edit Expense"
          onPress={() => {
            validate();
          }}
        />
      </View>
    </SuperSafeAreaView>
  );
};

export default UpdateExpense;
