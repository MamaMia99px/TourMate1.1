import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeColors } from '../utils/theme';

// Admin Screens
import AdminLoginScreen from '../screens/admin/AdminLoginScreen';
import AdminDashboard from '../screens/admin/AdminDashboard';
import AddAttractionScreen from '../screens/admin/AddAttractionScreen';
import AddRestaurantScreen from '../screens/admin/AddRestaurantScreen';
import AddBeachScreen from '../screens/admin/AddBeachScreen';
import AddDestinationScreen from '../screens/admin/AddDestinationScreen';
import ManageContentScreen from '../screens/admin/ManageContentScreen';
import ViewReportsScreen from '../screens/admin/ViewReportsScreen';
import ImageTestScreen from '../screens/admin/ImageTestScreen';

const Stack = createStackNavigator();

const AdminNavigator = () => {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  const getHeaderOptions = (title) => ({
    headerShown: true,
    title: title,
    headerStyle: {
      backgroundColor: colors.primary,
    },
    headerTintColor: '#FFFFFF',
    headerTitleStyle: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
    headerRight: () => (
      <TouchableOpacity
        style={{ marginRight: 15, padding: 5 }}
        onPress={() => {
          // Import and use logout utility
          const { directLogout } = require('../utils/logoutUtils');
          directLogout(navigation);
        }}
      >
        <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    ),
  });

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          color: '#FFFFFF',
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="AdminLogin" 
        component={AdminLoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="AdminDashboard" 
        component={AdminDashboard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddAttraction"
        component={AddAttractionScreen}
        options={getHeaderOptions('Add Attraction')}
      />
      <Stack.Screen
        name="AddRestaurant"
        component={AddRestaurantScreen}
        options={getHeaderOptions('Add Restaurant')}
      />
      <Stack.Screen
        name="AddBeach"
        component={AddBeachScreen}
        options={getHeaderOptions('Add Beach')}
      />
      <Stack.Screen
        name="AddDestination"
        component={AddDestinationScreen}
        options={getHeaderOptions('Add Destination')}
      />
      <Stack.Screen
        name="ManageContent"
        component={ManageContentScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ViewReports"
        component={ViewReportsScreen}
        options={getHeaderOptions('View Reports')}
      />
      <Stack.Screen
        name="ImageTest"
        component={ImageTestScreen}
        options={getHeaderOptions('Image Upload Test')}
      />
    </Stack.Navigator>
  );
};

export default AdminNavigator; 