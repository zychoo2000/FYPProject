import React from 'react';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../mainscreen/Home';
import BudgetScreen from '../mainscreen/Budget';
import ProfileScreen from '../mainscreen/Profile';
import AddExpense from '../mainscreen/AddExpense';
import AddBudget from '../mainscreen/AddBudget';
import EditBudget from '../mainscreen/EditBudget';
import ChartScreen from '../mainscreen/Chart';
import UpdateExpense from '../mainscreen/UpdateExpense';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{
        headerShown: false,
        tabBarLabel: 'Home',
        tabBarIcon: ({color, size}) => (
          <Ionicons name="home" color={color} size={20} />
        ),
      }}
    />

    <Stack.Screen
      name="UpdateExpense"
      component={UpdateExpense}
      options={{
        title: 'Edit Expense',

        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: '#fff',
          elevation: 0,
        },
      }}
    />
    <Stack.Screen
      name="AddExpense"
      component={AddExpense}
      options={{
        title: 'Add Expense',
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: '#fff',
          elevation: 0,
        },
      }}
    />
  </Stack.Navigator>
);

const BudgetStack = ({navigation}) => (
  <Stack.Navigator initialRouteName="Budget">
    <Stack.Screen
      name="Budget"
      component={BudgetScreen}
      options={{
        headerShown: false,
        tabBarLabel: 'Budget',
        tabBarIcon: ({color, size}) => (
          <Ionicons name="chart" color={color} size={20} />
        ),
      }}
    />
    <Stack.Screen name="AddBudget" component={AddBudget} />
    <Stack.Screen name="EditBudget" component={EditBudget} options={{}} />

    <Stack.Screen
      name="ChartScreen"
      component={ChartScreen}
      options={{headerTitle: 'Chart'}}
    />
  </Stack.Navigator>
);
const AppStack = () => {
  const getTabBarVisibility = route => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? '';

    if (routeName == 'AddExpense') {
      return 'none';
    } else if (routeName == 'UpdateExpense') {
      return 'none';
    } else if (routeName == 'ChartScreen') {
      return 'none';
    } else if (routeName == 'AddBudget') {
      return 'none';
    } else if (routeName == 'EditBudget') {
      return 'none';
    } else return 'flex';
  };

  return (
    <Tab.Navigator
      screenOptions={{
        activeTintColor: '#2e64e5',
        initialRouteName: 'HomeStack',
      }}>
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={({route}) => ({
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarVisible: route.state && route.state.index === 0,
          tabBarStyle: {display: getTabBarVisibility(route)},
          tabBarIcon: ({color, size}) => (
            <Ionicons name="home" color={color} size={20} />
          ),
        })}
      />
      <Tab.Screen
        name="BudgetStack"
        component={BudgetStack}
        options={({route}) => ({
          headerShown: false,
          tabBarLabel: 'Budget',
          tabBarStyle: {display: getTabBarVisibility(route)},
          tabBarVisible: route.state && route.state.index === 0,
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="attach-money" color={color} size={size} />
          ),
        })}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={({route}) => ({
          headerShown: false,
          tabBarStyle: {display: getTabBarVisibility(route)},
          tabBarIcon: ({color, size}) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        })}
      />
    </Tab.Navigator>
  );
};

export default AppStack;
