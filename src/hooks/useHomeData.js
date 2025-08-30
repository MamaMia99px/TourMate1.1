// useHomeData.js - Custom hook for home screen data (SRP + DIP)
import { useState, useEffect } from 'react';
import FirebaseDataService from '../services/data/FirebaseDataService';
import AttractionsDataService from '../services/data/AttractionsDataService'; // Fallback

const useHomeData = () => {
  const [featuredAttractions, setFeaturedAttractions] = useState([]);
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [localDelicacies, setLocalDelicacies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useFirebase, setUseFirebase] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setIsLoading(true);
      
      if (useFirebase) {
        // Try to fetch from Firebase first
        const [attractionsRes, destinationsRes, restaurantsRes] = await Promise.all([
          FirebaseDataService.getFeaturedAttractions(3),
          FirebaseDataService.getPopularDestinations(3),
          FirebaseDataService.getFeaturedRestaurants(3)
        ]);

        // Check if Firebase data is available
        if (attractionsRes.success && attractionsRes.data.length > 0) {
          setFeaturedAttractions(attractionsRes.data);
        } else {
          // Fallback to static data
          setFeaturedAttractions(AttractionsDataService.getFeaturedAttractions());
        }

        if (destinationsRes.success && destinationsRes.data.length > 0) {
          setPopularDestinations(destinationsRes.data);
        } else {
          // Fallback to static data
          setPopularDestinations(AttractionsDataService.getPopularDestinations());
        }

        if (restaurantsRes.success && restaurantsRes.data.length > 0) {
          setLocalDelicacies(restaurantsRes.data);
        } else {
          // Fallback to static data for delicacies
          setLocalDelicacies([]);
        }
      } else {
        // Use static data as fallback
        const featured = AttractionsDataService.getFeaturedAttractions();
        const popular = AttractionsDataService.getPopularDestinations();
        
        setFeaturedAttractions(featured);
        setPopularDestinations(popular);
        setLocalDelicacies([]);
      }
    } catch (error) {
      console.error('Error loading home data:', error);
      // Fallback to static data on error
      const featured = AttractionsDataService.getFeaturedAttractions();
      const popular = AttractionsDataService.getPopularDestinations();
      
      setFeaturedAttractions(featured);
      setPopularDestinations(popular);
      setLocalDelicacies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToAttraction = (navigation, attraction) => {
    navigation.navigate('AttractionDetails', { 
      attraction,
      userData: null 
    });
  };

  const navigateToDelicacy = (navigation, delicacy) => {
    navigation.navigate('AttractionDetails', { 
      attraction: delicacy,
      userData: null 
    });
  };

  const refreshData = () => {
    loadHomeData();
  };

  const toggleDataSource = () => {
    setUseFirebase(!useFirebase);
    loadHomeData();
  };

  return {
    featuredAttractions,
    popularDestinations,
    localDelicacies,
    isLoading,
    useFirebase,
    navigateToAttraction,
    navigateToDelicacy,
    refreshData,
    toggleDataSource
  };
};

export default useHomeData; 