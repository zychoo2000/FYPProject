import {createState} from '@hookstate/core';
export const security = createState({
  // isLoggedIn: false,
  // isLoaded: true,
  // userId: '',
});
export const record = createState({
  biggestNum: {},
  dataChanged: true,
  expenseList: [],
  budgetList: null,
  budgetExist: [],
  totalEachCategory: null,
  budgetCategoryInfo: null,
  totalExpenseMonth: 0,
});
