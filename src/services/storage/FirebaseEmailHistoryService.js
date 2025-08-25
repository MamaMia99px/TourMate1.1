// FirebaseEmailHistoryService.js - Firebase implementation following SOLID principles (DIP)
import { collection, query, orderBy, limit, getDocs, addDoc, deleteDoc, doc, where } from 'firebase/firestore';
import { db, auth } from '../../services/firebase/firebaseConfig';

class FirebaseEmailHistoryService {
  static collectionName = 'recentEmails';

  // Helper method to check if user is authenticated
  static isAuthenticated() {
    return auth.currentUser !== null;
  }

  static async getEmailHistory(maxEmails = 10) {
    try {
      // Check if user is authenticated
      if (!this.isAuthenticated()) {
        console.log('Firebase: User not authenticated, skipping Firebase email history (will use AsyncStorage)');
        return [];
      }

      const q = query(
        collection(db, this.collectionName), 
        orderBy('timestamp', 'desc'), 
        limit(maxEmails)
      );
      const snapshot = await getDocs(q);
      const emails = snapshot.docs.map(doc => doc.data().email);
      
      // Remove duplicates and return unique emails
      return [...new Set(emails)];
    } catch (error) {
      console.error('Error fetching email history from Firebase:', error);
      
      // If it's a permissions error, provide helpful information
      if (error.code === 'permission-denied') {
        console.error('Permission denied: Firestore security rules may not allow access to recentEmails collection');
        console.error('Please ensure you have proper Firestore security rules configured');
      }
      
      return [];
    }
  }

  static async addEmail(email) {
    try {
      // Check if user is authenticated
      if (!this.isAuthenticated()) {
        console.log('Firebase: User not authenticated, skipping Firebase save (will use AsyncStorage fallback)');
        return;
      }

      // Check if email already exists to avoid duplicates
      const existingQuery = query(
        collection(db, this.collectionName),
        where('email', '==', email)
      );
      const existingSnapshot = await getDocs(existingQuery);
      
      if (existingSnapshot.empty) {
        await addDoc(collection(db, this.collectionName), {
          email: email,
          timestamp: new Date(),
          userId: auth.currentUser.uid // Add user ID for better security
        });
        console.log('Firebase: Email saved successfully');
      } else {
        console.log('Firebase: Email already exists, skipping duplicate');
      }
    } catch (error) {
      console.error('Error adding email to Firebase:', error);
      
      if (error.code === 'permission-denied') {
        console.error('Permission denied: Firestore security rules may not allow write access to recentEmails collection');
      }
    }
  }

  static async removeEmail(email) {
    try {
      // Check if user is authenticated
      if (!this.isAuthenticated()) {
        console.log('Firebase: User not authenticated, skipping Firebase remove (will use AsyncStorage fallback)');
        return;
      }

      const q = query(
        collection(db, this.collectionName),
        where('email', '==', email),
        where('userId', '==', auth.currentUser.uid) // Only remove user's own emails
      );
      const snapshot = await getDocs(q);
      
      snapshot.docs.forEach(async (docSnapshot) => {
        await deleteDoc(doc(db, this.collectionName, docSnapshot.id));
      });
    } catch (error) {
      console.error('Error removing email from Firebase:', error);
      
      if (error.code === 'permission-denied') {
        console.error('Permission denied: Firestore security rules may not allow delete access to recentEmails collection');
      }
    }
  }

  static async clearHistory() {
    try {
      // Check if user is authenticated
      if (!this.isAuthenticated()) {
        console.log('Firebase: User not authenticated, skipping Firebase clear (will use AsyncStorage fallback)');
        return;
      }

      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', auth.currentUser.uid) // Only clear user's own emails
      );
      const snapshot = await getDocs(q);
      
      snapshot.docs.forEach(async (docSnapshot) => {
        await deleteDoc(doc(db, this.collectionName, docSnapshot.id));
      });
    } catch (error) {
      console.error('Error clearing email history from Firebase:', error);
      
      if (error.code === 'permission-denied') {
        console.error('Permission denied: Firestore security rules may not allow delete access to recentEmails collection');
      }
    }
  }
}

export default FirebaseEmailHistoryService; 