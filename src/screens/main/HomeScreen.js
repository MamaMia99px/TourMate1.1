// HomeScreen.js - Premium tourism experience with enhanced UI
import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, ImageBackground, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../utils/theme';
import HorizontalCarousel from '../../components/home/HorizontalCarousel';
import useHomeData from '../../hooks/useHomeData';

const HomeScreen = ({ navigation, route, userData: userDataProp }) => {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const styles = getStyles(colors, isDarkMode);
  
  // Dependency Injection - All data logic separated into custom hook
  const {
    featuredAttractions,
    popularDestinations,
    localDelicacies,
    isLoading,
    navigateToAttraction,
    navigateToDelicacy
  } = useHomeData();

  // Handle navigation with proper data passing
  const handleAttractionPress = (attraction) => {
    navigateToAttraction(navigation, attraction);
  };

  const handleDelicacyPress = (delicacy) => {
    navigateToDelicacy(navigation, delicacy);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Discovering paradise...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
        alwaysBounceVertical={false}
      >
        {/* Full Screen Welcome Section */}
        <View style={styles.fullScreenWelcomeWrapper}>
          <ImageBackground
            source={require('../../../assets/images/kawasan-falls.jpg')}
            style={styles.welcomeBackground}
            resizeMode="cover"
          >
            <LinearGradient
              colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.7)']}
              style={styles.welcomeGradient}
            >
              <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeTitle}>Discover Cebu</Text>
                <Text style={styles.welcomeSubtitle}>Your gateway to paradise</Text>
                <View style={styles.welcomeDescriptionContainer}>
                  <Text style={styles.welcomeDescription}>
                    Discover the breathtaking beauty of Cebu's pristine beaches. Immerse yourself in vibrant culture, unique adventures, and warm hospitality. In the Queen City of the South, every moment is a journey worth cherishing.
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* Content Sections with Enhanced Spacing */}
        <View style={styles.contentContainer}>
          {/* Featured Attractions Section */}
          <HorizontalCarousel
            title="✨ Featured Attractions"
            data={featuredAttractions}
            onItemPress={handleAttractionPress}
            colors={colors}
            showRating={true}
          />

          {/* Popular Destinations Section */}
          <HorizontalCarousel
            title="🔥 Popular Destinations"
            data={popularDestinations}
            onItemPress={handleAttractionPress}
            colors={colors}
          />

          {/* Local Delicacies Section */}
          <HorizontalCarousel
            title="🍽️ Local Delicacies"
            data={localDelicacies}
            onItemPress={handleDelicacyPress}
            colors={colors}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (colors, isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Increased padding to ensure content doesn't overlap with bottom navigation
  },
  welcomeBackground: {
    width: '100%',
    height: 600, // Fixed height for better control
  },
  welcomeGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  welcomeContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeTitle: {
    fontSize: 28, // Reduced from 40 to 28 as requested
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12, // Increased spacing
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
  },
  welcomeSubtitle: {
    fontSize: 18, // Reduced from 19 to 18 as requested
    fontWeight: '600', // Semi-bold as requested
    color: '#FFFFFF',
    marginBottom: 24, // Increased spacing
    textAlign: 'center',
    opacity: 0.95,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  welcomeDescriptionContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Added overlay for better text readability
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 8,
    width: '100%',
    maxWidth: 400,
  },
  welcomeDescription: {
    fontSize: 16, // Reduced from 17 to 16 as requested
    color: '#FFFFFF',
    lineHeight: 24, // Added lineHeight as requested
    textAlign: 'left', // Changed from center to left for better readability
    opacity: 0.98,
    fontWeight: '400',
    letterSpacing: 0.2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  contentContainer: {
    paddingTop: 32, // Increased padding
    paddingBottom: 32, // Increased padding
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenWelcomeWrapper: {
    width: '100%',
  },
});

export default HomeScreen; 