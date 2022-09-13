import React, {useEffect, useState, useContext} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import db, {auth} from '../database/initializeDatabase';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ProgressBar, Divider} from 'react-native-paper';
import {useState as useHookState} from '@hookstate/core';
import SuperSafeAreaView from '../SuperComponent/SuperSafeAreaView';
import moment from 'moment';
import SuperLabel from '../SuperComponent/SuperLabel';
import {record} from '../module/GlobalVariable';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getDocs, collection} from 'firebase/firestore';
import {AuthContext} from '../navigation/AuthProvider';

const BudgetScreen = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const userId = user.uid;
  const [loading, setLoading] = useState(true);
  const globalVariable = useHookState(record);
  const getBudgetData = async () => {
    var budget = [];
    const querySnapshot = await getDocs(
      collection(db, 'users', userId, 'budget'),
    );
    querySnapshot.forEach(doc => {
      let newObj = doc.data();
      newObj['id'] = doc.id;
      budget.push(newObj);
    });

    globalVariable.budgetList.set(getMonthBudget(budget));
    var budgetCat = globalVariable.budgetList
      .get()
      .map(budgetObj => budgetObj.category);
    globalVariable.budgetExist.set(budgetCat);
    // budgetExist();
    mergeObj();
    if (loading) {
      setLoading(false);
    }
  };

  const unique = (value, index, self) => {
    return self.indexOf(value) === index;
  };
  const budgetExist = budget => {
    const list = globalVariable.budgetList.get();

    let category = [];
    let uniqCategory = null;
    if (list !== null || list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        category.push(list[i]['category']);
      }
      uniqCategory = category.filter(unique);
    }
    globalVariable.budgetExist.set(uniqCategory);
  };
  const getMonthBudget = budget => {
    const currentDate = moment().format('DD/MM/YYYY');
    var filtered = budget.filter(item => {
      var date = moment(item.month, 'MM/YYYY');
      return moment(currentDate, 'DD/MM/YYYY').isSame(date, 'month');
    });
    return filtered;
  };
  const mergeObj = () => {
    const budgetList = globalVariable.budgetList.get();
    const totalExpenseList = globalVariable.totalEachCategory.get();
    if (totalExpenseList !== null && totalExpenseList !== undefined) {
      var expenseArr = [];
      var totalExpenseByMonth = 0;
      for (let i = 0; i < budgetList.length; i++) {
        var totalExpense = 0;
        if (totalExpenseList[budgetList[i]['category']] !== undefined) {
          totalExpenseByMonth =
            totalExpenseByMonth + totalExpenseList[budgetList[i]['category']];
          totalExpense =
            totalExpense + totalExpenseList[budgetList[i]['category']];
        }
        var obj = {};
        obj = {...budgetList[i], totalExpense: totalExpense};
        expenseArr.push(obj);
      }
      globalVariable.budgetCategoryInfo.set(expenseArr);

      globalVariable.totalExpenseMonth.set(totalExpenseByMonth);
      console.log(globalVariable.totalExpenseMonth.get());
      console.log('hi');
    }
  };

  const FlatListSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '90%',
          backgroundColor: 'grey',
          alignSelf: 'center',
        }}
      />
    );
  };
  useEffect(() => {
    getBudgetData();
    navigation.addListener('focus', () => setLoading(!loading));
  }, [navigation, loading]);
  return (
    <SuperSafeAreaView navigation={route.name} mode={'mainScreen'}>
      {/* <ScrollView contentContainerStyle={{flexGrow: 1, alignItems: 'center'}}> */}
      <View style={{alignItems: 'center'}}>
        <View
          style={{
            margin: 10,
            borderRadius: 5,
            elevation: 2,
            shadowOffset: {width: 1, height: 1},
            backgroundColor: 'white',
            width: '90%',
          }}>
          <View
            style={{
              flexDirection: 'row',
              margin: 10,
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
              <SuperLabel mode={'large'} style={{marginTop: 3}}>
                Budgets
              </SuperLabel>
              <SuperLabel mode={'small'} style={{marginTop: 3, color: 'grey'}}>
                This Month
              </SuperLabel>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AddBudget');
              }}>
              <AntDesign styles={{}} color={'black'} size={25} name="plus" />
            </TouchableOpacity>
          </View>
          <Divider bold={true} style={{width: 2}} />
          <Modal
            transparent={true}
            animationType={'none'}
            visible={loading}
            onRequestClose={() => {}}>
            <View style={styles.modalBackground}>
              <View style={styles.activityIndicatorWrapper}>
                <ActivityIndicator animating={loading} />
              </View>
            </View>
          </Modal>
          {globalVariable.budgetCategoryInfo.get() &&
          globalVariable.budgetCategoryInfo.get().length > 0 ? (
            <FlatList
              ItemSeparatorComponent={FlatListSeparator}
              contentContainerStyle={{
                flexGrow: 1,
              }}
              showsVerticalScrollIndicator={false}
              data={globalVariable.budgetCategoryInfo.get()}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={{
                    flex: 1,
                    height: 75,
                    width: 350,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    boxShadow: 20,
                  }}
                  onPress={() => navigation.navigate('EditBudget', item)}>
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
                      <SuperLabel mode={'medium'}>{item.category}</SuperLabel>
                    </View>

                    <View
                      style={{
                        margin: 10,
                      }}>
                      <ProgressBar
                        progress={item.totalExpense / parseFloat(item.budget)}
                        style={{
                          backgroundColor: 'grey',
                          height: 10,
                          width: 156,
                          borderRadius: 20,
                        }}
                        color={
                          item.totalExpense / parseFloat(item.budget) > 0.5
                            ? 'red'
                            : 'green'
                        }
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <View
                      style={{
                        justifyContent: 'flex-end',
                        flex: 1,
                      }}>
                      <View
                        style={{
                          margin: 10,
                          justifyContent: 'space-between',
                          alignItems: 'flex-end',
                          flex: 1,
                        }}>
                        <SuperLabel mode={'medium'} style={{}}>
                          {parseInt(
                            (item.totalExpense / parseFloat(item.budget)) * 100,
                          ).toString() + '%'}
                        </SuperLabel>
                        <SuperLabel mode={'medium'}>
                          {'RM ' + item.totalExpense.toFixed(2)}
                        </SuperLabel>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            <View style={{height: 150, justifyContent: 'center'}}>
              <SuperLabel style={{textAlign: 'center'}}>
                No budget yet
              </SuperLabel>
            </View>
          )}
        </View>
        {/* </ScrollView> */}
      </View>
      <TouchableOpacity
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
          borderRadius: 50,
          backgroundColor: 'black',
          width: 55,
          height: 55,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('ChartScreen')}>
        <Ionicons name="ios-stats-chart" color={'white'} size={20} />
      </TouchableOpacity>
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
export default BudgetScreen;
