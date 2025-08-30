import { collection, getDocs, query, where, orderBy, limit, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

class FirebaseDataService {
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

  // Get featured attractions (simplified - no complex queries)
  static async getFeaturedAttractions(limitCount = 5) {
    if (!this.isFirebaseAvailable()) {
      return {
        success: false,
        error: 'Firebase not available',
        data: []
      };
    }

    try {
      // Simple query - get all attractions and sort in memory
      const allResult = await this.getAllContent(this.COLLECTIONS.ATTRACTIONS);
      if (allResult.success) {
        const sortedAttractions = allResult.data
          .filter(item => item.status !== 'inactive') // Filter out inactive items
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, limitCount);
        
        return {
          success: true,
          data: sortedAttractions
        };
      } else {
        return allResult;
      }
    } catch (error) {
      console.error('Error fetching featured attractions:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  // Get popular destinations (simplified - no complex queries)
  static async getPopularDestinations(limitCount = 5) {
    if (!this.isFirebaseAvailable()) {
      return {
        success: false,
        error: 'Firebase not available',
        data: []
      };
    }

    try {
      // Simple query - get all destinations and sort in memory
      const allResult = await this.getAllContent(this.COLLECTIONS.DESTINATIONS);
      if (allResult.success) {
        const sortedDestinations = allResult.data
          .filter(item => item.status !== 'inactive') // Filter out inactive items
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, limitCount);
        
        return {
          success: true,
          data: sortedDestinations
        };
      } else {
        return allResult;
      }
    } catch (error) {
      console.error('Error fetching popular destinations:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  // Get featured restaurants (simplified - no complex queries)
  static async getFeaturedRestaurants(limitCount = 5) {
    if (!this.isFirebaseAvailable()) {
      return {
        success: false,
        error: 'Firebase not available',
        data: []
      };
    }

    try {
      // Simple query - get all restaurants and sort in memory
      const allResult = await this.getAllContent(this.COLLECTIONS.RESTAURANTS);
      if (allResult.success) {
        const sortedRestaurants = allResult.data
          .filter(item => item.status !== 'inactive') // Filter out inactive items
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, limitCount);
        
        return {
          success: true,
          data: sortedRestaurants
        };
      } else {
        return allResult;
      }
    } catch (error) {
      console.error('Error fetching featured restaurants:', error);
      return {
        success: false,
        error: error.message,
        data: []
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

  // Get content by location
  static async getContentByLocation(collectionName, location) {
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
        if (data.location && data.location.toLowerCase().includes(location.toLowerCase())) {
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
      console.error('Error fetching content by location:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  // Get nearby restaurants for an attraction
  static async getNearbyRestaurants(attractionLocation, limitCount = 5) {
    if (!this.isFirebaseAvailable()) {
      return {
        success: false,
        error: 'Firebase not available',
        data: []
      };
    }

    try {
      const result = await this.getContentByLocation(this.COLLECTIONS.RESTAURANTS, attractionLocation);
      if (result.success) {
        return {
          success: true,
          data: result.data.slice(0, limitCount)
        };
      } else {
        return result;
      }
    } catch (error) {
      console.error('Error fetching nearby restaurants:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }
}

export default FirebaseDataService;
