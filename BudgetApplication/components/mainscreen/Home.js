import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';
import SuperLabel from '../SuperComponent/SuperLabel';
import {useState as useHookState} from '@hookstate/core';
import {FAB, ActivityIndicator} from 'react-native-paper';
import SuperSafeAreaView from '../SuperComponent/SuperSafeAreaView';
import DropDownPicker from 'react-native-dropdown-picker';
import moment from 'moment';
import {collection, query, getDocs} from 'firebase/firestore';
import {orderBy} from 'firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';
import db, {auth} from '../database/initializeDatabase';
import {record} from '../module/GlobalVariable';
import {AuthContext} from '../navigation/AuthProvider';

const HomeScreen = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const userId = user.uid;
  console.log(userId);

  const globalVariable = useHookState(record);
  const [loading, setLoading] = useState(true);
  let expense = globalVariable.expenseList.get();
  const [expenseList, setExpenseList] = useState();
  const [state, setState] = useState({open: false});
  const [value, setValue] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [openDropDown, setOpenDropDown] = useState(false);
  const [items, setItems] = useState([
    {label: 'Within 1 Day', value: 'day'},
    {label: 'Within 1 Month', value: 'month'},
    {label: 'Within 1 Year', value: 'year'},
    {label: 'Lifetime', value: 'lifetime'},
  ]);

  const getExpenseData = async () => {
    var expenses = [];
    const expenseRef = collection(db, 'users', userId, 'expense');
    const expenseSnap = query(expenseRef, orderBy('firebasedate', 'desc'));
    const querySnapshot = await getDocs(expenseSnap);
    querySnapshot.forEach(doc => {
      let newObj = doc.data();
      newObj['id'] = doc.id;
      expenses.push(newObj);
    });
    setExpenseList(expenses);
    globalVariable.expenseList.set(expenses);
    if (loading) {
      setLoading(false);
    }
  };
  const onStateChange = ({open}) => setState({open});

  const {open} = state;
  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: false,
    }).then(image => {
      passApi(image);
    });
  };
  const chooseFromLibrary = () => {
    ImagePicker.openPicker({
      width: 3000,
      height: 4000,
      cropping: false,
    }).then(image => {
      passApi(image);
    });
  };
  const passApi = async image => {
    try {
      setOcrLoading(true);
      const data = new FormData();
      data.append('file', {
        name: image.path.replace(/^.*[\\\/]/, ''),
        type: image.mime,
        uri: image.path,
      });
      let response = await fetch('http://192.168.0.155:8000/receiptOcr', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: data,
      });
      let result = await response.json();
      setOcrLoading(false);
      navigation.navigate('AddExpense', result);
    } catch (error) {
      Alert.alert('Failed to process image', 'Something happened to server', [
        {
          text: 'OK',
          onPress: () => {
            setOcrLoading(false);
          },
        },
      ]);
    }
  };
  const getApi = async image => {
    try {
      const data = new FormData();
      data.append('file', {
        name: image.path.replace(/^.*[\\\/]/, ''),
        type: image.mime,
        uri: image.path,
      });
      fetch('http://192.168.0.155:8000/receiptOcr', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: data,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const getTodayExpense = () => {
    const currentDate = moment().format('DD/MM/YYYY');
    var filtered = expense.filter(item => {
      var date = moment(item.date, 'DD/MM/YYYY');
      return moment(currentDate, 'DD/MM/YYYY').isSame(date);
    });
    return filtered;
  };
  const getMonthExpense = () => {
    const currentDate = moment().format('DD/MM/YYYY');
    var filtered = expense.filter(item => {
      var date = moment(item.date, 'DD/MM/YYYY');
      return moment(currentDate, 'DD/MM/YYYY').isSame(date, 'month');
    });
    return filtered;
  };
  const getYearExpense = () => {
    const currentDate = moment().format('DD/MM/YYYY');
    var filtered = expense.filter(item => {
      var date = moment(item.date, 'DD/MM/YYYY');
      return moment(currentDate, 'DD/MM/YYYY').isSame(date, 'year');
    });
    return filtered;
  };

  const findTotalExpense = () => {
    const currentDate = moment().format('DD/MM/YYYY');
    var list = globalVariable.expenseList.get();
    var totalArr = {};
    if (list !== null || list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        var category = list[i]['category'];
        var total = 0;
        for (let x = 0; x < list.length; x++) {
          var date = moment(list[x]['date'], 'DD/MM/YYYY');
          if (
            moment(currentDate, 'DD/MM/YYYY').isSame(date, 'month') &&
            category === list[x]['category']
          ) {
            total = total + parseFloat(list[x]['expense']);
          }
        }
        if (total !== 0) {
          totalArr[category] = total;
        }
      }
      globalVariable.totalEachCategory.set(totalArr);
    }
  };

  useEffect(() => {
    getExpenseData();
    navigation.addListener('focus', () => setLoading(!loading));
  }, [navigation, loading]);
  useEffect(() => {
    findTotalExpense();
  });

  return (
    <SuperSafeAreaView
      style={{flex: 1}}
      mode={'mainScreen'}
      navigation={route.name}>
      {ocrLoading ? (
        <View>
          <Modal
            transparent={true}
            animationType={'none'}
            visible={ocrLoading}
            onRequestClose={() => {}}>
            <View style={styles.modalBackground}>
              <View style={styles.activityIndicatorWrapper}>
                <ActivityIndicator animating={ocrLoading} />
              </View>
            </View>
          </Modal>
        </View>
      ) : (
        <View style={{flex: 1, alignItems: 'center'}}>
          <View
            style={{
              height: 50,
              width: 300,
              margin: 12,
            }}>
            <DropDownPicker
              style={{
                borderRadius: 0,
                backgroundColor: !open ? 'white' : '#778899',
              }}
              open={openDropDown}
              value={value}
              items={items}
              setOpen={setOpenDropDown}
              setValue={setValue}
              setItems={setItems}
            />
          </View>
          <Modal
            transparent={true}
            animationType={'none'}
            visible={typeof expenseList === 'undefined'}
            onRequestClose={() => {
              console.log('close modal');
            }}>
            <View style={styles.modalBackground}>
              <View style={styles.activityIndicatorWrapper}>
                <ActivityIndicator
                  animating={typeof expenseList === 'undefined'}
                />
              </View>
            </View>
          </Modal>
          {!loading &&
          typeof expenseList !== 'undefined' &&
          expenseList.length == 0 ? (
            <View>
              <SuperLabel>No record</SuperLabel>
            </View>
          ) : (
            <FlatList
              contentContainerStyle={{
                flexGrow: 1,
              }}
              showsVerticalScrollIndicator={false}
              data={
                value === 'day'
                  ? getTodayExpense()
                  : value === 'month'
                  ? getMonthExpense()
                  : value === 'year'
                  ? getYearExpense()
                  : expenseList
              }
              renderItem={({item}) => (
                <TouchableOpacity
                  style={{
                    flex: 1,
                    height: 75,
                    width: 375,
                    margin: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    elevation: 5,
                    backgroundColor: 'white',
                  }}
                  onPress={() => navigation.navigate('UpdateExpense', item)}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      elevation: 5,
                    }}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        margin: 10,
                        marginRight: 20,
                      }}>
                      <SuperLabel mode={'medium'}>{item.title}</SuperLabel>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        justifyContent: 'flex-start',
                        backgroundColor: 'white',
                        margin: 10,
                      }}>
                      <SuperLabel mode={'medium'}>{item.date}</SuperLabel>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <View style={{justifyContent: 'flex-end', flex: 1}}>
                      <View
                        style={{
                          margin: 10,
                          justifyContent: 'center',
                          alignItems: 'flex-end',
                          flex: 1,
                        }}>
                        <SuperLabel mode={'large'} style={{fontSize: 20}}>
                          {'RM' + parseFloat(item.expense).toFixed(2)}
                        </SuperLabel>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
          <FAB.Group
            fabStyle={{
              backgroundColor: 'black',
            }}
            open={open}
            icon={open ? 'close' : 'plus'}
            actions={[
              {
                icon: 'camera',
                label: 'Camera',
                onPress: () => takePhotoFromCamera(),
              },
              {
                icon: 'file-document',
                label: 'Document',
                onPress: () => chooseFromLibrary(),
              },
              {
                icon: 'plus',
                label: 'Add Expense',
                onPress: () => navigation.navigate('AddExpense'),
              },
            ]}
            onStateChange={onStateChange}
            onPress={() => {
              if (open) {
              }
            }}
          />
        </View>
      )}
    </SuperSafeAreaView>
  );
};
const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
export default HomeScreen;
