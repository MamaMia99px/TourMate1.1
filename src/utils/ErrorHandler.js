import { Alert } from 'react-native';
import { Environment } from '../config/environment';

export class ErrorHandler {
  static logError(error, context = '') {
    if (Environment.ENABLE_LOGS) {
      console.error(`[${context}] Error:`, error);
    }
  }

  static showUserFriendlyError(error, context = '') {
    this.logError(error, context);

    let userMessage = 'Something went wrong. Please try again.';
    let title = 'Error';

    // Handle specific error types
    if (error?.code) {
      switch (error.code) {
        case 'auth/network-request-failed':
          userMessage = 'Please check your internet connection and try again.';
          title = 'Connection Error';
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          userMessage = 'Invalid email or password. Please try again.';
          title = 'Login Failed';
          break;
        case 'auth/email-already-in-use':
          userMessage = 'This email is already registered. Please use a different email.';
          title = 'Registration Failed';
          break;
        case 'auth/weak-password':
          userMessage = 'Password is too weak. Please choose a stronger password.';
          title = 'Weak Password';
          break;
        case 'permission-denied':
          userMessage = 'You don\'t have permission to perform this action.';
          title = 'Access Denied';
          break;
        case 'unavailable':
          userMessage = 'Service is temporarily unavailable. Please try again later.';
          title = 'Service Unavailable';
          break;
      }
    }

    Alert.alert(title, userMessage, [{ text: 'OK', style: 'default' }]);
  }

  static async handleAsyncOperation(operation, context = '', showError = true) {
    try {
      const result = await operation();
      return { success: true, data: result };
    } catch (error) {
      this.logError(error, context);
      if (showError) {
        this.showUserFriendlyError(error, context);
      }
      return { success: false, error };
    }
  }

  static createRetryWrapper(operation, maxRetries = 3, delay = 1000) {
    return async (...args) => {
      let lastError;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await operation(...args);
        } catch (error) {
          lastError = error;
          
          if (attempt === maxRetries) {
            throw error;
          }
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
      }
      
      throw lastError;
    };
  }
} 