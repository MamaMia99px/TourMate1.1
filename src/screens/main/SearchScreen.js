import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../utils/theme';
import FirebaseDataService from '../../services/data/FirebaseDataService';
import AttractionsDataService from '../../services/data/AttractionsDataService'; // Fallback

const SearchScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const styles = getStyles(colors, isDarkMode);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [allAttractions, setAllAttractions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useFirebase, setUseFirebase] = useState(true);

  const categories = ['All', 'Historical', 'Cultural', 'Nature', 'Beach', 'Adventure', 'Viewpoint'];

  useEffect(() => {
    loadAttractions();
  }, []);

  const loadAttractions = async () => {
    try {
      setIsLoading(true);
      
      if (useFirebase) {
        // Try to fetch from Firebase first
        const [attractionsRes, destinationsRes, beachesRes] = await Promise.all([
          FirebaseDataService.getAllContent(FirebaseDataService.COLLECTIONS.ATTRACTIONS),
          FirebaseDataService.getAllContent(FirebaseDataService.COLLECTIONS.DESTINATIONS),
          FirebaseDataService.getAllContent(FirebaseDataService.COLLECTIONS.BEACHES)
        ]);

        let firebaseAttractions = [];
        
        if (attractionsRes.success) {
          firebaseAttractions = [...firebaseAttractions, ...attractionsRes.data];
        }
        if (destinationsRes.success) {
          firebaseAttractions = [...firebaseAttractions, ...destinationsRes.data];
        }
        if (beachesRes.success) {
          firebaseAttractions = [...firebaseAttractions, ...beachesRes.data];
        }

        if (firebaseAttractions.length > 0) {
          setAllAttractions(firebaseAttractions);
        } else {
          // Fallback to static data
          const staticAttractions = [
            ...AttractionsDataService.getFeaturedAttractions(),
            ...AttractionsDataService.getPopularDestinations()
          ];
          setAllAttractions(staticAttractions);
        }
      } else {
        // Use static data as fallback
        const staticAttractions = [
          ...AttractionsDataService.getFeaturedAttractions(),
          ...AttractionsDataService.getPopularDestinations()
        ];
        setAllAttractions(staticAttractions);
      }
    } catch (error) {
      console.error('Error loading attractions:', error);
      // Fallback to static data on error
      const staticAttractions = [
        ...AttractionsDataService.getFeaturedAttractions(),
        ...AttractionsDataService.getPopularDestinations()
      ];
      setAllAttractions(staticAttractions);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAttractions = allAttractions.filter((attraction) => {
    const matchesSearch =
      attraction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attraction.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || attraction.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item && styles.selectedCategory,
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item && styles.selectedCategoryText,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderAttractionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.attractionCard}
      onPress={() => navigation.navigate('AttractionDetails', { attraction: item })}
    >
      <Image source={item.image} style={styles.attractionImage} />
      <View style={styles.attractionInfo}>
        <Text style={styles.attractionName}>{item.name}</Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.attractionLocation}>{item.location}</Text>
        </View>
        <View style={styles.ratingPrice}>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading attractions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Explore Destinations</Text>
        <Text style={styles.headerSubtitle}>Discover amazing places in Cebu</Text>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search destinations..."
          placeholderTextColor={colors.textPlaceholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <FlatList
        data={filteredAttractions}
        renderItem={renderAttractionItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.attractionsList}
      />
    </View>
  );
};

const getStyles = (colors, isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: colors.textSecondary,
    fontSize: 16,
  },
  header: {
    padding: 20,
    paddingTop: 50, // Adjust for status bar
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.cardBackground,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: colors.text,
    paddingVertical: 3,
    height: 28,
  },
  categoriesContainer: {
    marginBottom: 15,
  },
  categoryItem: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedCategory: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  selectedCategoryText: {
    color: '#fff',
  },
  attractionsList: {
    padding: 15,
  },
  attractionCard: {
    flexDirection: 'row',
    borderRadius: 15,
    marginBottom: 15,
    backgroundColor: colors.cardBackground,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  attractionImage: {
    width: 120,
    height: 120,
  },
  attractionInfo: {
    flex: 1,
    padding: 15,
  },
  attractionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  attractionLocation: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 5,
  },
  ratingPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  rating: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SearchScreen; 