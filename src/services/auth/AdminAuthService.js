import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import AuthService from './AuthService';
import { Environment } from '../../config/environment';

// Admin authentication service with role-based access
class AdminAuthService extends AuthService {
  
  // Admin email lists from environment configuration
  static adminEmails = Environment.ADMIN_EMAILS;
  static lguAdminEmails = Environment.LGU_ADMIN_EMAILS;

  static async checkIfAdmin(user) {
    try {
      if (!user) return { isAdmin: false, role: 'user' };
      
      const userEmail = user.email.toLowerCase();
      
      // Check if email is in any admin list
      const isReportsAdmin = this.adminEmails.includes(userEmail);
      const isLguAdmin = this.lguAdminEmails.includes(userEmail);
      
      if (isLguAdmin) {
        return {
          isAdmin: true,
          role: 'lgu_admin'
        };
      } else if (isReportsAdmin) {
        return {
          isAdmin: true,
          role: 'reports_admin'
        };
      }
      
      return {
        isAdmin: false,
        role: 'user'
      };
    } catch (error) {
      console.error('AdminAuthService: Error checking admin status:', error);
      return { isAdmin: false, role: 'user' };
    }
  }

  static async checkAdminStatus(email) {
    try {
      if (!email) return false;
      
      const lowerEmail = email.toLowerCase();
      
      // Check if user is any type of admin
      return this.adminEmails.includes(lowerEmail) || this.lguAdminEmails.includes(lowerEmail);
    } catch (error) {
      console.error('AdminAuthService: Error checking admin status by email:', error);
      return false;
    }
  }

  static async getAdminRole(email) {
    try {
      if (!email) return null;
      
      const lowerEmail = email.toLowerCase();
      
      if (this.lguAdminEmails.includes(lowerEmail)) {
        return 'lgu_admin';
      } else if (this.adminEmails.includes(lowerEmail)) {
        return 'reports_admin';
      }
      
      return null;
    } catch (error) {
      console.error('AdminAuthService: Error getting admin role:', error);
      return null;
    }
  }

  // Note: Admin roles are now managed via predefined email lists
  // No longer using Firestore for admin role storage

  static async loginAsAdmin(email, password) {
    try {
      const loginResult = await this.login(email, password);
      
      if (loginResult.success) {
        const adminCheck = await this.checkIfAdmin(loginResult.user);
        
        if (adminCheck.isAdmin) {
          return {
            ...loginResult,
            isAdmin: true,
            role: adminCheck.role
          };
        } else {
          return {
            success: false,
            user: null,
            error: { code: 'auth/unauthorized', message: 'Access denied. Admin privileges required.' },
            isAdmin: false
          };
        }
      }
      
      return loginResult;
    } catch (error) {
      return {
        success: false,
        user: null,
        error,
        isAdmin: false
      };
    }
  }

  static async getCurrentUser() {
    try {
      return auth.currentUser;
    } catch (error) {
      console.error('AdminAuthService: Error getting current user:', error);
      return null;
    }
  }

  static async logoutAdmin() {
    try {
      console.log('AdminAuthService: Starting logout process...');
      console.log('AdminAuthService: Current user before logout:', auth.currentUser?.email);
      
      await signOut(auth);
      
      console.log('AdminAuthService: signOut completed');
      console.log('AdminAuthService: Current user after logout:', auth.currentUser);
      console.log('AdminAuthService: Admin logout successful');
      
      return { success: true };
    } catch (error) {
      console.error('AdminAuthService: Error during admin logout:', error);
      return { success: false, error };
    }
  }
}

export default AdminAuthService; 