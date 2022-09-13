// import React from 'react';
// import moment from 'moment';
// import {useState as useHookState} from '@hookstate/core';
// import {record} from '../module/GlobalVariable';
// const globalVariable = useHookState(record);
// let expense = globalVariable.expenseList.get();

// const dayFilter = () => {
//   var obj = {};
//   Object.keys(expense).map((key, record) => {
//     var date = expense[key]['date'];
//     if (date.isSame(moment().format('DD-MM-YYYY'))) {
//       obj[key] = record;
//     }
//   });
//   return obj;
// };
// const checkMonthYear = () => {
//   const date = moment();

//   const month = date.format('MM');
//   const year = date.format('YYYY');
//   const currentMonthYear = month.concat('/', year);
//   return currentMonthYear;
// };
// const datetime = () => {
//   var CurrentDate = moment().format();
//   console.log(CurrentDate);
// };
// export {dayFilter, checkMonthYear, datetime};
