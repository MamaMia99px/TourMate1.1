import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../firebase/firebaseConfig';

const FAVORITES_STORAGE_KEY = '@tourist_app_favorites';

class FavoritesService {
  constructor() {
    this.favorites = [];
    this.loadFavorites();
  }

  // Get user-specific storage key
  getUserStorageKey() {
    const user = auth.currentUser;
    if (user) {
      return `${FAVORITES_STORAGE_KEY}_${user.uid}`;
    }
    return `${FAVORITES_STORAGE_KEY}_guest`;
  }

  // Load favorites from AsyncStorage
  async loadFavorites() {
    try {
      // First, attempt migration if needed
      await this.migrateOldData();
      
      const storageKey = this.getUserStorageKey();
      const favoritesString = await AsyncStorage.getItem(storageKey);
      if (favoritesString) {
        this.favorites = JSON.parse(favoritesString);
      } else {
        this.favorites = [];
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      this.favorites = [];
    }
  }

  // Save favorites to AsyncStorage
  async saveFavorites() {
    try {
      const storageKey = this.getUserStorageKey();
      await AsyncStorage.setItem(storageKey, JSON.stringify(this.favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }

  // Get all favorites
  async getFavorites() {
    await this.loadFavorites();
    return this.favorites;
  }

  // Check if attraction is favorite
  async isFavorite(attractionId) {
    await this.loadFavorites();
    return this.favorites.some(fav => fav.id === attractionId);
  }

  // Add to favorites
  async addToFavorites(attraction) {
    await this.loadFavorites();
    
    // Check if already exists
    if (this.favorites.some(fav => fav.id === attraction.id)) {
      return false; // Already exists
    }

    const favoriteItem = {
      ...attraction,
      dateAdded: new Date().toISOString(),
    };

    this.favorites.push(favoriteItem);
    await this.saveFavorites();
    return true;
  }

  // Remove from favorites
  async removeFromFavorites(attractionId) {
    await this.loadFavorites();
    const initialLength = this.favorites.length;
    this.favorites = this.favorites.filter(fav => fav.id !== attractionId);
    
    if (this.favorites.length < initialLength) {
      await this.saveFavorites();
      return true;
    }
    return false; // Not found
  }

  // Get favorites count
  async getFavoritesCount() {
    await this.loadFavorites();
    return this.favorites.length;
  }

  // Clear all favorites (for testing or reset)
  async clearFavorites() {
    this.favorites = [];
    await this.saveFavorites();
  }

  // Migration method to move old shared data to user-specific storage
  async migrateOldData() {
    try {
      const user = auth.currentUser;
      if (!user) return; // Only migrate for authenticated users

      // Check if user already has data (don't migrate if they do)
      const userSpecificKey = this.getUserStorageKey();
      const existingUserData = await AsyncStorage.getItem(userSpecificKey);
      if (existingUserData) {
        return; // User already has their own data
      }

      // Try to get old shared data
      const oldSharedData = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (oldSharedData) {
        // Save it to user-specific storage
        await AsyncStorage.setItem(userSpecificKey, oldSharedData);
        console.log('Migrated favorites data for user:', user.email);
        
        // Clear the old shared data to prevent future conflicts
        await AsyncStorage.removeItem(FAVORITES_STORAGE_KEY);
        console.log('Cleared old shared favorites data');
      }
    } catch (error) {
      console.error('Error migrating favorites data:', error);
    }
  }
}

export default new FavoritesService(); 