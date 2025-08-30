import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

class AdminDataService {
  
  // Collection names
  static COLLECTIONS = {
    ATTRACTIONS: 'attractions',
    RESTAURANTS: 'restaurants',
    BEACHES: 'beaches',
    DESTINATIONS: 'destinations'
  };

  // Check if Firebase is available
  static isFirebaseAvailable() {
    try {
      return db && typeof db === 'object';
    } catch (error) {
      console.log('Firebase not available:', error.message);
      return false;
    }
  }

  // Get all content from a collection
  static async getAllContent(collectionName) {
    if (!this.isFirebaseAvailable()) {
      return {
        success: false,
        error: 'Firebase not available',
        data: []
      };
    }

    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const content = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        content.push({
          id: doc.id,
          ...data
        });
      });
      
      return {
        success: true,
        data: content
      };
    } catch (error) {
      console.error('Error fetching content:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  // Add new attraction
  static async addAttraction(attractionData) {
    if (!this.isFirebaseAvailable()) {
      return {
        success: false,
        error: 'Firebase not available. Cannot add attraction.'
      };
    }

    try {
      const docRef = await addDoc(collection(db, this.COLLECTIONS.ATTRACTIONS), {
        ...attractionData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active'
      });
      
      return {
        success: true,
        id: docRef.id,
        message: 'Attraction added successfully!'
      };
    } catch (error) {
      console.error('Error adding attraction:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Add new restaurant
  static async addRestaurant(restaurantData) {
    if (!this.isFirebaseAvailable()) {
      return {
        success: false,
        error: 'Firebase not available. Cannot add restaurant.'
      };
    }

    try {
      const docRef = await addDoc(collection(db, this.COLLECTIONS.RESTAURANTS), {
        ...restaurantData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active'
      });
      
      return {
        success: true,
        id: docRef.id,
        message: 'Restaurant added successfully!'
      };
    } catch (error) {
      console.error('Error adding restaurant:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Add new beach
  static async addBeach(beachData) {
    if (!this.isFirebaseAvailable()) {
      return {
        success: false,
        error: 'Firebase not available. Cannot add beach.'
      };
    }

    try {
      const docRef = await addDoc(collection(db, this.COLLECTIONS.BEACHES), {
        ...beachData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active',
        type: 'beach'
      });
      
      return {
        success: true,
        id: docRef.id,
        message: 'Beach added successfully!'
      };
    } catch (error) {
      console.error('Error adding beach:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Add new destination
  static async addDestination(destinationData) {
    if (!this.isFirebaseAvailable()) {
      return {
        success: false,
        error: 'Firebase not available. Cannot add destination.'
      };
    }

    try {
      const docRef = await addDoc(collection(db, this.COLLECTIONS.DESTINATIONS), {
        ...destinationData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active'
      });
      
      return {
        success: true,
        id: docRef.id,
        message: 'Destination added successfully!'
      };
    } catch (error) {
      console.error('Error adding destination:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update existing content
  static async updateContent(collection, id, updateData) {
    if (!this.isFirebaseAvailable()) {
      return {
        success: false,
        error: 'Firebase not available. Cannot update content.'
      };
    }

    try {
      const docRef = doc(db, collection, id);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: new Date()
      });
      
      return {
        success: true,
        message: 'Content updated successfully!'
      };
    } catch (error) {
      console.error('Error updating content:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete content
  static async deleteContent(collection, id) {
    if (!this.isFirebaseAvailable()) {
      return {
        success: false,
        error: 'Firebase not available. Cannot delete content.'
      };
    }

    try {
      const docRef = doc(db, collection, id);
      await deleteDoc(docRef);
      
      return {
        success: true,
        message: 'Content deleted successfully!'
      };
    } catch (error) {
      console.error('Error deleting content:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get content by ID
  static async getContentById(collectionName, id) {
    if (!this.isFirebaseAvailable()) {
      return {
        success: false,
        error: 'Firebase not available',
        data: null
      };
    }

    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          success: true,
          data: {
            id: docSnap.id,
            ...docSnap.data()
          }
        };
      } else {
        return {
          success: false,
          error: 'Content not found',
          data: null
        };
      }
    } catch (error) {
      console.error('Error fetching content by ID:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  // Search content
  static async searchContent(collectionName, searchTerm) {
    if (!this.isFirebaseAvailable()) {
      return {
        success: false,
        error: 'Firebase not available',
        data: []
      };
    }

    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const content = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const name = data.name ? data.name.toLowerCase() : '';
        const location = data.location ? data.location.toLowerCase() : '';
        const description = data.description ? data.description.toLowerCase() : '';
        
        if (name.includes(searchTerm.toLowerCase()) || 
            location.includes(searchTerm.toLowerCase()) ||
            description.includes(searchTerm.toLowerCase())) {
          content.push({
            id: doc.id,
            ...data
          });
        }
      });
      
      return {
        success: true,
        data: content
      };
    } catch (error) {
      console.error('Error searching content:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }
}

export default AdminDataService; 