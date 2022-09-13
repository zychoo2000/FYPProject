import {
  collection,
  getDoc,
  doc,
  setDoc,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import db, {auth} from './initializeDatabase';
import {useState as useHookState} from '@hookstate/core';
import {security} from '../module/GlobalVariable';
import moment from 'moment';

// var userId = auth.currentUser.uid;

// const addFunc = async (category, dataToAdd) => {
//   const docRef = doc(db, 'users', userId, 'expense', category);
//   await setDoc(docRef, dataToAdd, {merge: true});
// };
const addData = async (type, dataToAdd, userId) => {
  const docRef = collection(db, 'users', userId, type);
  await addDoc(docRef, dataToAdd);
};
const updateData = async (userId, type, docId, docField) => {
  const docRef = doc(db, 'users', userId, type, docId);
  await updateDoc(docRef, docField);
};

const deleteData = async (userId, type, docId) => {
  await deleteDoc(doc(db, 'users', userId, type, docId));
};
const checkMonthYear = () => {
  const date = moment();
  const month = date.format('MM');
  const year = date.format('YYYY');
  const currentMonthYear = month.concat('/', year);
  return currentMonthYear;
};
const queryBudgetData = async (budgetList, userId) => {
  // const globalVariable = useHookState(record);
  var budgetItem = [];
  const que = query(
    collection(db, 'users', userId, 'budget'),
    where('month', '==', checkMonthYear()),
  );
  // const querySnapshot = await getDocs(
  //   collection(db, 'users', userId, 'budget'),
  // );
  const querySnapshot = await getDocs(que);

  querySnapshot.forEach(doc => {
    var newObj = doc.data();
    newObj['id'] = doc.id;
    // doc.data() is never undefined for query doc snapshots
    budgetItem.push(newObj);
  });
  budgetList(budgetItem);
};
const getExpenseData = async (expenseList, userId) => {
  var expenses = [];
  const querySnapshot = await getDocs(
    collection(db, 'users', userId, 'expense'),
  );
  querySnapshot.forEach(doc => {
    let newObj = doc.data();
    newObj['id'] = doc.id;
    expenses.push(newObj);
  });
  expenseList(expenses);
};
export {addData, updateData, deleteData, queryBudgetData, getExpenseData};
