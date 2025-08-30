import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import './src/styles/webScrollFix.css';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { fixWebScrolling } from './src/utils/webScrollFix';
import { createStackNavigator } from '@react-navigation/stack';
import MainNavigator from './src/navigation/MainNavigator';
import AdminNavigator from './src/navigation/AdminNavigator';
import LandingScreen from './src/screens/auth/LandingScreen';
import Login from './src/screens/auth/Login';
import Signup from './src/screens/auth/Signup';
import AttractionDetails from './src/screens/main/AttractionDetails';
import EditProfileScreen from './src/screens/profile/EditProfileScreen';
import FavoriteSpotsScreen from './src/screens/profile/FavoriteSpotsScreen';
import MyReviewsScreen from './src/screens/profile/MyReviewsScreen';
import TravelHistoryScreen from './src/screens/profile/TravelHistoryScreen';
import LanguageScreen from './src/screens/settings/LanguageScreen';
import SettingsScreen from './src/screens/settings/SettingsScreen';
import HelpSupportScreen from './src/screens/settings/HelpSupportScreen';
import { ErrorBoundary } from './src/components/common/ErrorBoundary';
import { LogBox } from 'react-native';
import { Environment } from './src/config/environment';
import { NavigationContainer } from '@react-navigation/native';
import { useTheme } from './src/contexts/ThemeContext';
import { getThemeColors } from './src/utils/theme';

LogBox.ignoreLogs([
  'Sending `onAnimatedValueUpdate` with no listeners registered.',
]);

const Stack = createStackNavigator();

// Mobile Navigator with full functionality including authentication
const MobileNavigator = () => {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  const getHeaderOptions = (title) => ({
    headerShown: true,
    title: title,
    headerStyle: {
      backgroundColor: colors.cardBackground,
    },
    headerTintColor: colors.primary,
    headerTitleStyle: {
      color: colors.text,
      fontWeight: '600',
    },
  });

  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        headerStyle: {
          backgroundColor: colors.cardBackground,
        },
        headerTintColor: colors.primary,
        headerTitleStyle: {
          color: colors.text,
          fontWeight: '600',
        },
      }}
    >
      {/* Authentication Screens */}
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      
      {/* Main App with Tabs */}
      <Stack.Screen name="MainApp" component={MainNavigator} />
      
      {/* Additional Screens */}
      <Stack.Screen
        name="AttractionDetails"
        component={AttractionDetails}
        options={getHeaderOptions('Details')}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={getHeaderOptions('Edit Profile')}
      />
      <Stack.Screen
        name="FavoriteSpots"
        component={FavoriteSpotsScreen}
        options={getHeaderOptions('Favorite Cebu Spots')}
      />
      <Stack.Screen
        name="MyReviews"
        component={MyReviewsScreen}
        options={getHeaderOptions('My Reviews')}
      />
      <Stack.Screen
        name="TravelHistory"
        component={TravelHistoryScreen}
        options={getHeaderOptions('Travel History')}
      />
      <Stack.Screen
        name="Language"
        component={LanguageScreen}
        options={getHeaderOptions('Language')}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={getHeaderOptions('Settings')}
      />
      <Stack.Screen
        name="HelpSupport"
        component={HelpSupportScreen}
        options={getHeaderOptions('Help & Support')}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  // Validate configuration on app start
  if (!Environment.isConfigurationValid()) {
    console.warn('App configuration validation failed');
  }

  // Fix web scrolling issues
  useEffect(() => {
    if (Platform.OS === 'web') {
      fixWebScrolling();
    }
  }, []);

  // Platform detection to determine which dashboard to show
  const isWeb = Platform.OS === 'web';
  
  // For web platform, show Admin Dashboard directly
  // For mobile platforms (ios/android), show full User Dashboard with navigation
  const renderContent = () => {
    if (isWeb) {
      return <AdminNavigator />;
    } else {
      // For mobile, show full mobile navigation with all features
      return <MobileNavigator />;
    }
  };

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NavigationContainer>
          {renderContent()}
        </NavigationContainer>
      </ThemeProvider>
    </ErrorBoundary>
  );
} 