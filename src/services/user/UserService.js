import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

// Single Responsibility: Only handles user data operations
class UserService {
  static async getUserData(user) {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      let userData = {
        uid: user.uid,
        email: user.email,
        fullName: user.displayName || 'User',
        avatar: user.photoURL || 'https://via.placeholder.com/150/cccccc/969696?text=User',
      };
      
      if (userDocSnap.exists()) {
        const firestoreData = userDocSnap.data();
        userData = {
          ...userData,
          fullName: firestoreData.fullName || userData.fullName,
          phone: firestoreData.phone || '',
          avatar: firestoreData.avatar || userData.avatar,
          location: firestoreData.location || '',
        };
      }
      
      return {
        success: true,
        userData,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        userData: null,
        error: error
      };
    }
  }
}

export default UserService; 