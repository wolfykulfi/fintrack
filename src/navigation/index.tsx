import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState } from '../store';
import { setTheme } from '../store/slices/themeSlice';
import { setUser } from '../store/slices/authSlice';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Main Screens
import DashboardScreen from '../screens/main/DashboardScreen';
import TransactionsScreen from '../screens/main/TransactionsScreen';
import AddTransactionScreen from '../screens/main/AddTransactionScreen';
import TransactionDetailScreen from '../screens/main/TransactionDetailScreen';
import BudgetsScreen from '../screens/main/BudgetsScreen';
import BudgetDetailScreen from '../screens/main/BudgetDetailScreen';
import InsightsScreen from '../screens/main/InsightsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import BillsScreen from '../screens/main/BillsScreen';
import BillDetailScreen from '../screens/main/BillDetailScreen';
import UploadStatementScreen from '../screens/main/UploadStatementScreen';

// Stack Navigators
const AuthStack = createStackNavigator();
const DashboardStack = createStackNavigator();
const TransactionsStack = createStackNavigator();
const BudgetsStack = createStackNavigator();
const InsightsStack = createStackNavigator();
const ProfileStack = createStackNavigator();

// Tab Navigator
const Tab = createBottomTabNavigator();

// Auth Navigator
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
};

// Dashboard Stack Navigator
const DashboardStackNavigator = () => {
  return (
    <DashboardStack.Navigator>
      <DashboardStack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
    </DashboardStack.Navigator>
  );
};

// Transactions Stack Navigator
const TransactionsStackNavigator = () => {
  return (
    <TransactionsStack.Navigator>
      <TransactionsStack.Screen name="Transactions" component={TransactionsScreen} options={{ headerShown: false }} />
      <TransactionsStack.Screen name="AddTransaction" component={AddTransactionScreen} options={{ title: 'Add Transaction' }} />
      <TransactionsStack.Screen name="TransactionDetail" component={TransactionDetailScreen} options={{ title: 'Transaction Details' }} />
      <TransactionsStack.Screen name="UploadStatement" component={UploadStatementScreen} options={{ title: 'Upload Bank Statement' }} />
    </TransactionsStack.Navigator>
  );
};

// Budgets Stack Navigator
const BudgetsStackNavigator = () => {
  return (
    <BudgetsStack.Navigator>
      <BudgetsStack.Screen name="Budgets" component={BudgetsScreen} options={{ headerShown: false }} />
      <BudgetsStack.Screen name="BudgetDetail" component={BudgetDetailScreen} options={{ title: 'Budget Details' }} />
      <BudgetsStack.Screen name="Bills" component={BillsScreen} options={{ title: 'Bills & Reminders' }} />
      <BudgetsStack.Screen name="BillDetail" component={BillDetailScreen} options={{ title: 'Bill Details' }} />
    </BudgetsStack.Navigator>
  );
};

// Insights Stack Navigator
const InsightsStackNavigator = () => {
  return (
    <InsightsStack.Navigator>
      <InsightsStack.Screen name="Insights" component={InsightsScreen} options={{ headerShown: false }} />
    </InsightsStack.Navigator>
  );
};

// Profile Stack Navigator
const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
    </ProfileStack.Navigator>
  );
};

// Main Tab Navigator
const TabNavigator = () => {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'DashboardTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'TransactionsTab') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'BudgetsTab') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'InsightsTab') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: isDarkMode ? '#6200ee' : '#6200ee',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#121212' : '#ffffff',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="DashboardTab" component={DashboardStackNavigator} options={{ title: 'Home' }} />
      <Tab.Screen name="TransactionsTab" component={TransactionsStackNavigator} options={{ title: 'Transactions' }} />
      <Tab.Screen name="BudgetsTab" component={BudgetsStackNavigator} options={{ title: 'Budgets' }} />
      <Tab.Screen name="InsightsTab" component={InsightsStackNavigator} options={{ title: 'Insights' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStackNavigator} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

// Root Navigator
const RootNavigator = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load theme preference from AsyncStorage
    const loadThemePreference = async () => {
      try {
        const themePreference = await AsyncStorage.getItem('isDarkMode');
        if (themePreference !== null) {
          dispatch(setTheme(JSON.parse(themePreference)));
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser({
          id: user.uid,
          email: user.email || '',
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: user.metadata.creationTime || new Date().toISOString(),
        }));
      } else {
        dispatch(setUser(null));
      }
      setIsLoading(false);
    });

    loadThemePreference();

    // Cleanup subscription
    return () => unsubscribe();
  }, [dispatch]);

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
      {user ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default RootNavigator; 