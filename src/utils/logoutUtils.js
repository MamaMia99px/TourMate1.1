import { Platform } from 'react-native';
import AdminAuthService from '../services/auth/AdminAuthService';

/**
 * Handles admin logout with proper navigation and cleanup
 * @param {Object} navigation - Navigation object from React Navigation
 * @param {Function} onSuccess - Optional callback on successful logout
 * @param {Function} onError - Optional callback on logout error
 */
export const handleAdminLogout = async (navigation, onSuccess, onError) => {
  try {
    console.log('LogoutUtils: Starting admin logout process...');
    
    // Call the auth service logout
    const logoutResult = await AdminAuthService.logoutAdmin();
    
    if (logoutResult.success) {
      console.log('LogoutUtils: Logout successful, navigating to login');
      
      // Navigate based on platform
      if (Platform.OS === 'web') {
        // For web, reset to AdminLogin
        navigation.reset({
          index: 0,
          routes: [{ name: 'AdminLogin' }],
        });
      } else {
        // For mobile, navigate back to main app
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainApp' }],
        });
      }
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } else {
      console.error('LogoutUtils: Logout failed:', logoutResult.error);
      
      // Call error callback if provided
      if (onError) {
        onError(logoutResult.error);
      } else {
        // Default error handling
        throw new Error(logoutResult.error?.message || 'Logout failed');
      }
    }
  } catch (error) {
    console.error('LogoutUtils: Error during logout:', error);
    
    // Call error callback if provided
    if (onError) {
      onError(error);
    } else {
      // Default error handling
      throw error;
    }
  }
};

/**
 * Shows logout confirmation dialog
 * @param {Function} onConfirm - Callback when user confirms logout
 * @param {Function} onCancel - Callback when user cancels logout
 */
export const showLogoutConfirmation = (onConfirm, onCancel) => {
  // Import Alert dynamically to avoid issues
  const { Alert } = require('react-native');
  
  Alert.alert(
    'Logout',
    'Are you sure you want to logout from admin panel?',
    [
      { 
        text: 'Cancel', 
        style: 'cancel', 
        onPress: () => {
          console.log('Logout cancelled by user');
          if (onCancel) onCancel();
        }
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          console.log('Logout confirmed by user');
          if (onConfirm) onConfirm();
        }
      }
    ]
  );
};

/**
 * Handles complete logout flow with confirmation
 * @param {Object} navigation - Navigation object from React Navigation
 * @param {Function} onSuccess - Optional callback on successful logout
 * @param {Function} onError - Optional callback on logout error
 */
export const logoutWithConfirmation = (navigation, onSuccess, onError) => {
  showLogoutConfirmation(
    () => handleAdminLogout(navigation, onSuccess, onError),
    () => {
      console.log('Logout cancelled');
      if (onError) onError(new Error('Logout cancelled'));
    }
  );
};

/**
 * Direct logout without confirmation dialog
 * @param {Object} navigation - Navigation object from React Navigation
 * @param {Function} onSuccess - Optional callback on successful logout
 * @param {Function} onError - Optional callback on logout error
 */
export const directLogout = (navigation, onSuccess, onError) => {
  handleAdminLogout(navigation, onSuccess, onError);
};
