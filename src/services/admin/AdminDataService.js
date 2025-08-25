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

  // Add new attraction
  static async addAttraction(attractionData) {
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
    try {
      await deleteDoc(doc(db, collection, id));
      
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

  // Get all content from a collection
  static async getAllContent(collectionName) {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const content = [];
      
      querySnapshot.forEach((doc) => {
        content.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return {
        success: true,
        data: content
      };
    } catch (error) {
      console.error('Error getting content:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  // Get content by ID
  static async getContentById(collectionName, id) {
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
          error: 'Content not found'
        };
      }
    } catch (error) {
      console.error('Error getting content by ID:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Search content
  static async searchContent(collectionName, searchTerm) {
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