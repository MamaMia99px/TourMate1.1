import { signInWithEmailAndPassword, sendPasswordResetEmail, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { ErrorHandler } from '../../utils/ErrorHandler';

// Single Responsibility: Only handles authentication
export class AuthService {
  static async login(email, password) {
    try {
      console.log('AuthService: Attempting to sign in with email:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('AuthService: Sign in successful, user ID:', userCredential.user.uid);
      return {
        success: true,
        user: userCredential.user,
        error: null
      };
    } catch (error) {
      console.log('AuthService: Sign in failed with error:', error.code, error.message);
      return {
        success: false,
        user: null,
        error: error
      };
    }
  }

  static async resetPassword(email) {
    try {
      console.log('AuthService: Sending password reset email to:', email);
      await sendPasswordResetEmail(auth, email);
      return { success: true, error: null };
    } catch (error) {
      console.log('AuthService: Password reset failed:', error.code, error.message);
      return { success: false, error: error };
    }
  }

  static async createAccount(email, password) {
    try {
      console.log('AuthService: Creating new account for email:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('AuthService: Account created successfully, user ID:', userCredential.user.uid);
      return {
        success: true,
        user: userCredential.user,
        error: null
      };
    } catch (error) {
      console.log('AuthService: Account creation failed:', error.code, error.message);
      return {
        success: false,
        user: null,
        error: error
      };
    }
  }

  static getErrorMessage(errorCode) {
    const errorMessages = {
      'auth/user-not-found': 'Account not found',
      'auth/invalid-credential': 'Invalid credentials. Try resetting your password or creating a new account.',
      'auth/wrong-password': 'Invalid password',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'default': 'Login failed. Please check your credentials.'
    };
    return errorMessages[errorCode] || errorMessages.default;
  }

  static async signIn(email, password) {
    return ErrorHandler.handleAsyncOperation(async () => {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    }, 'AuthService.signIn');
  }

  static async signUp(email, password) {
    return ErrorHandler.handleAsyncOperation(async () => {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    }, 'AuthService.signUp');
  }

  static async signOut() {
    return ErrorHandler.handleAsyncOperation(async () => {
      await signOut(auth);
    }, 'AuthService.signOut');
  }
}

export default AuthService; 