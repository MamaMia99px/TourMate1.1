// FirebaseDebug.js - Utility to debug Firebase authentication and permissions
import { auth, db } from '../../services/firebase/firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';

class FirebaseDebug {
  static logAuthStatus() {
    console.log('=== FIREBASE AUTH DEBUG ===');
    console.log('Current user:', auth.currentUser ? 'AUTHENTICATED' : 'NOT AUTHENTICATED');
    if (auth.currentUser) {
      console.log('User ID:', auth.currentUser.uid);
      console.log('User email:', auth.currentUser.email);
      console.log('Email verified:', auth.currentUser.emailVerified);
      console.log('Display name:', auth.currentUser.displayName);
    }
    console.log('==========================');
  }

  static async testFirestoreConnection() {
    console.log('=== FIRESTORE CONNECTION TEST ===');
    
    if (!auth.currentUser) {
      console.log('❌ Cannot test Firestore: User not authenticated');
      return false;
    }

    try {
      // Test read access
      console.log('Testing read access to recentEmails collection...');
      const testQuery = collection(db, 'recentEmails');
      const snapshot = await getDocs(testQuery);
      console.log('✅ Read access successful:', snapshot.size, 'documents found');

      // Test write access
      console.log('Testing write access to recentEmails collection...');
      const testDoc = await addDoc(collection(db, 'recentEmails'), {
        email: 'test@example.com',
        timestamp: new Date(),
        userId: auth.currentUser.uid,
        isTest: true
      });
      console.log('✅ Write access successful, test document ID:', testDoc.id);

      return true;
    } catch (error) {
      console.log('❌ Firestore test failed:', error.code, error.message);
      
      if (error.code === 'permission-denied') {
        console.log('🔧 SOLUTION: Update your Firestore security rules');
        console.log('   See FIRESTORE_SECURITY_RULES_SETUP.md for instructions');
      }
      
      return false;
    }
  }

  static async runFullDiagnostic() {
    console.log('\n🔍 STARTING FIREBASE DIAGNOSTIC...\n');
    
    this.logAuthStatus();
    
    if (auth.currentUser) {
      await this.testFirestoreConnection();
    }
    
    console.log('\n🔍 FIREBASE DIAGNOSTIC COMPLETE\n');
  }
}

export default FirebaseDebug; 