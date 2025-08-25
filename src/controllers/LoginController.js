import AuthService from '../services/auth/AuthService';
import UserService from '../services/user/UserService';
import NavigationService from '../services/navigation/NavigationService';
import AlertService from '../utils/alert/AlertService';
import EmailHistoryService from '../services/storage/EmailHistoryService';
import AdminAuthService from '../services/auth/AdminAuthService';

class LoginController {
  constructor(securityService) {
    this.securityService = securityService;
  }

  async handleLogin(email, password, navigation) {
    if (!this.securityService.canAttemptLogin()) {
      AlertService.showTooManyAttempts();
      return { success: false };
    }

    if (__DEV__) {
      console.log('🔐 Attempting login for:', email);
    }

    const authResult = await AuthService.login(email, password);

    if (!authResult.success) {
      this.securityService.incrementAttempts();
      this._handleLoginError(authResult.error, email, navigation);
      return { success: false };
    }

    const userResult = await UserService.getUserData(authResult.user);

    if (!userResult.success) {
      AlertService.showError('Error', 'Failed to load user data');
      return { success: false };
    }

    this.securityService.resetAttempts();

    try {
      await EmailHistoryService.saveEmail(email);
    } catch (e) {
      if (__DEV__) {
        console.log('⚠️ Failed to save email history:', e.message);
      }
    }

    // Check admin role and redirect accordingly
    const adminRole = await AdminAuthService.getAdminRole(email);
    if (adminRole) {
      if (__DEV__) {
        console.log('✅ Admin login success, role:', adminRole, 'email:', email);
      }
      
      // LGU admins go directly to admin dashboard
      if (adminRole === 'lgu_admin') {
        navigation.navigate('Admin', { screen: 'AdminDashboard' });
      } else if (adminRole === 'reports_admin') {
        // Reports admins also go to admin dashboard (they'll see limited features)
        navigation.navigate('Admin', { screen: 'AdminDashboard' });
      }
    } else {
      NavigationService.navigateToMainApp(navigation, userResult.userData);
    }

    if (__DEV__) {
      console.log('✅ Login success:', userResult.userData.email);
    }

    return { success: true, userData: userResult.userData };
  }

  _handleLoginError(error, email, navigation) {
    if (__DEV__) {
      console.log('Login error (dev):', error?.code || error?.message);
    }

    const errorCode = error.code || error.message;

    switch (errorCode) {
      case 'auth/user-not-found':
        AlertService.showAccountNotFound(email, () => {
          NavigationService.navigateToSignup(navigation, email);
        });
        break;

      case 'auth/invalid-credential':
        if (email === 'romeoalbarando115@gmail.com' || email === 'ompadking77@gmail.com') {
          AlertService.showCorruptedAccountRecovery(
            email,
            () => this._handlePasswordReset(email),
            () => this._handleAccountRecreation(email, navigation)
          );
        } else {
          AlertService.showInvalidCredentials(
            email,
            () => this._handlePasswordReset(email),
            () => NavigationService.navigateToSignup(navigation, email)
          );
        }
        break;

      case 'auth/wrong-password':
        AlertService.showInvalidPassword();
        break;

      case 'auth/too-many-requests':
        AlertService.showTooManyAttempts();
        break;

      default:
        const message = AuthService.getErrorMessage(errorCode);
        AlertService.showError('Login Failed', message);
    }
  }

  async _handlePasswordReset(email) {
    const result = await AuthService.resetPassword(email);
    if (result.success) {
      AlertService.showError('Password Reset', 'A reset link was sent to your email.');
    } else {
      AlertService.showError('Reset Failed', 'Could not send password reset email.');
    }
  }

  async _handleAccountRecreation(email, navigation) {
    AlertService.showConfirmation(
      'Recreate Account',
      'This will create a new account using this email. Continue?',
      () => NavigationService.navigateToSignup(navigation, email),
      () => {
        if (__DEV__) {
          console.log('Account recreation canceled');
        }
      }
    );
  }
}

export default LoginController;
