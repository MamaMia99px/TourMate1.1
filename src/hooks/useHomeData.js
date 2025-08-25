// useHomeData.js - Custom hook for home screen data (SRP + DIP)
import { useState, useEffect } from 'react';
import AttractionsDataService from '../services/data/AttractionsDataService';
import DelicaciesDataService from '../services/data/DelicaciesDataService';

const useHomeData = () => {
  const [featuredAttractions, setFeaturedAttractions] = useState([]);
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [localDelicacies, setLocalDelicacies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setIsLoading(true);
      
      // Dependency Injection - Use services instead of direct data access
      const featured = AttractionsDataService.getFeaturedAttractions();
      const popular = AttractionsDataService.getPopularDestinations();
      const delicacies = DelicaciesDataService.getFeaturedDelicacies(3);
      
      setFeaturedAttractions(featured);
      setPopularDestinations(popular);
      setLocalDelicacies(delicacies);
    } catch (error) {
      console.error('Error loading home data:', error);
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

  return {
    featuredAttractions,
    popularDestinations,
    localDelicacies,
    isLoading,
    navigateToAttraction,
    navigateToDelicacy,
    refreshData
  };
};

export default useHomeData; 