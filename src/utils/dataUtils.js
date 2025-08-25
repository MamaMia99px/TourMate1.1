import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../services/firebase/firebaseConfig';

/**
 * Data utility functions for managing user-specific data storage
 */
class DataUtils {
  /**
   * Clear all old shared data that might cause conflicts between users
   */
  static async clearOldSharedData() {
    try {
      console.log('Clearing old shared data...');
      
      // Clear old shared keys
      await AsyncStorage.removeItem('@tourist_app_favorites');
      await AsyncStorage.removeItem('@tourist_app_reviews');
      
      console.log('✅ Old shared data cleared successfully');
      return true;
    } catch (error) {
      console.error('❌ Error clearing old shared data:', error);
      return false;
    }
  }

  /**
   * Get current user's unique storage prefix
   */
  static getUserStoragePrefix() {
    const user = auth.currentUser;
    if (user) {
      return `user_${user.uid}`;
    }
    return 'guest';
  }

  /**
   * List all user-specific storage keys (for debugging)
   */
  static async listUserStorageKeys() {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log('No authenticated user');
        return [];
      }

      const allKeys = await AsyncStorage.getAllKeys();
      const userKeys = allKeys.filter(key => key.includes(user.uid));
      
      console.log(`Storage keys for user ${user.email}:`, userKeys);
      return userKeys;
    } catch (error) {
      console.error('Error listing user storage keys:', error);
      return [];
    }
  }

  /**
   * Debug function to show data separation status
   */
  static async debugDataSeparation() {
    try {
      const user = auth.currentUser;
      console.log('\n=== DATA SEPARATION DEBUG ===');
      console.log('Current user:', user ? user.email : 'Not authenticated');
      
      if (user) {
        console.log('User ID:', user.uid);
        console.log('Expected favorites key:', `@tourist_app_favorites_${user.uid}`);
        console.log('Expected reviews key:', `@tourist_app_reviews_${user.uid}`);
      }
      
      // Check for old shared data
      const oldFavorites = await AsyncStorage.getItem('@tourist_app_favorites');
      const oldReviews = await AsyncStorage.getItem('@tourist_app_reviews');
      
      console.log('Old shared favorites data exists:', !!oldFavorites);
      console.log('Old shared reviews data exists:', !!oldReviews);
      
      if (user) {
        const userFavorites = await AsyncStorage.getItem(`@tourist_app_favorites_${user.uid}`);
        const userReviews = await AsyncStorage.getItem(`@tourist_app_reviews_${user.uid}`);
        
        console.log('User-specific favorites data exists:', !!userFavorites);
        console.log('User-specific reviews data exists:', !!userReviews);
      }
      
      console.log('==============================\n');
    } catch (error) {
      console.error('Error in debug function:', error);
    }
  }
}

export default DataUtils; 