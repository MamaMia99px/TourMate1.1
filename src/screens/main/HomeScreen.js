// HomeScreen.js - Premium tourism experience with enhanced UI
import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, ImageBackground } from 'react-native';
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting at the top */}
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
                <View style={styles.welcomeBadge}>
                  <Text style={styles.welcomeBadgeText}>🏝️</Text>
                </View>
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
    </View>
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
    paddingBottom: 20,
  },
  welcomeBackground: {
    flex: 1,
    overflow: 'hidden',
  },
  welcomeGradient: {
    height: 650,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'justify',
    width: '100%',
  },
  welcomeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 50,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  welcomeBadgeText: {
    fontSize: 28,
    fontWeight: '900',
  },
  welcomeTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 6,
    textAlign: 'center',
    alignSelf: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
    letterSpacing: 1,
    width: '100%',
  },
  welcomeSubtitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 1,
    textAlign: 'center',
    opacity: 0.95,
    letterSpacing: 0.5,
  },
  welcomeDescriptionContainer: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 28,
    marginHorizontal: 2,
    marginTop: 8,
    backdropFilter: 'blur(10px)',
  },
  welcomeDescription: {
    fontSize: 17,
    color: '#FFFFFF',
    lineHeight: 28,
    textAlign: 'center',
    justifyContent: 'center',
    opacity: 0.98,
    Width: 400,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  contentContainer: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  scrollIndicator: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollIndicatorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    opacity: 0.9,
    letterSpacing: 0.5,
  },
  scrollIndicatorIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  greetingContainer: {
    padding: 20,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  fullScreenWelcomeWrapper: {
    flex: 1,
  },
});

export default HomeScreen; 