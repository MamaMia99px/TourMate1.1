import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AdminDataService from '../../services/admin/AdminDataService';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../utils/theme';
import { directLogout } from '../../utils/logoutUtils';

const ViewReportsScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const styles = getStyles(colors, isDarkMode);

  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState({
    totalContent: 0,
    contentByType: {},
    recentAdditions: [],
    topLocations: [],
    statusBreakdown: { active: 0, inactive: 0 }
  });

  useEffect(() => {
    loadReportsData();
  }, []);

  const loadReportsData = async () => {
    try {
      setIsLoading(true);
      
      const [attractionsRes, restaurantsRes, beachesRes, destinationsRes] = await Promise.all([
        AdminDataService.getAllContent(AdminDataService.COLLECTIONS.ATTRACTIONS),
        AdminDataService.getAllContent(AdminDataService.COLLECTIONS.RESTAURANTS),
        AdminDataService.getAllContent(AdminDataService.COLLECTIONS.BEACHES),
        AdminDataService.getAllContent(AdminDataService.COLLECTIONS.DESTINATIONS),
      ]);

      const allContent = [
        ...(attractionsRes.success ? attractionsRes.data.map(item => ({...item, type: 'attractions'})) : []),
        ...(restaurantsRes.success ? restaurantsRes.data.map(item => ({...item, type: 'restaurants'})) : []),
        ...(beachesRes.success ? beachesRes.data.map(item => ({...item, type: 'beaches'})) : []),
        ...(destinationsRes.success ? destinationsRes.data.map(item => ({...item, type: 'destinations'})) : []),
      ];

      const processedData = processReportData(allContent);
      setReportData(processedData);

    } catch (error) {
      console.error('Error loading reports data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processReportData = (allContent) => {
    const totalContent = allContent.length;
    
    const contentByType = {
      attractions: allContent.filter(item => item.type === 'attractions').length,
      restaurants: allContent.filter(item => item.type === 'restaurants').length,
      beaches: allContent.filter(item => item.type === 'beaches').length,
      destinations: allContent.filter(item => item.type === 'destinations').length,
    };

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentAdditions = allContent
      .filter(item => {
        const createdAt = item.createdAt?.toDate ? item.createdAt.toDate() : new Date(item.createdAt || item.dateAdded);
        return createdAt > thirtyDaysAgo;
      })
      .sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || a.dateAdded);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || b.dateAdded);
        return dateB - dateA;
      })
      .slice(0, 5);

    const locationCounts = {};
    allContent.forEach(item => {
      if (item.location) {
        locationCounts[item.location] = (locationCounts[item.location] || 0) + 1;
      }
    });
    
    const topLocations = Object.entries(locationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([location, count]) => ({ location, count }));

    const statusBreakdown = {
      active: allContent.filter(item => item.status === 'active').length,
      inactive: allContent.filter(item => item.status !== 'active').length,
    };

    return {
      totalContent,
      contentByType,
      recentAdditions,
      topLocations,
      statusBreakdown
    };
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <View style={[styles.statIcon, { backgroundColor: color }]}>
          <Ionicons name={icon} size={24} color="#FFFFFF" />
        </View>
        <View style={styles.statContent}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
          {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
        </View>
      </View>
    </View>
  );

  const ChartBar = ({ label, value, maxValue, color }) => {
    const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
    return (
      <View style={styles.chartBarContainer}>
        <Text style={styles.chartLabel}>{label}</Text>
        <View style={styles.chartBarTrack}>
          <View 
            style={[
              styles.chartBarFill, 
              { width: `${percentage}%`, backgroundColor: color }
            ]} 
          />
        </View>
        <Text style={styles.chartValue}>{value}</Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading reports...</Text>
      </View>
    );
  }

  const maxContentValue = Math.max(...Object.values(reportData.contentByType));
  const maxLocationValue = Math.max(...reportData.topLocations.map(l => l.count), 1);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Analytics & Reports</Text>
              <Text style={styles.headerSubtitle}>Content performance insights</Text>
            </View>
            <TouchableOpacity style={styles.refreshButton} onPress={loadReportsData}>
              <Ionicons name="refresh" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={() => directLogout(navigation)}>
              <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.scrollViewContent}
        bounces={true}
        alwaysBounceVertical={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        testID="scroll-view"
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Total Content"
              value={reportData.totalContent}
              icon="library"
              color={colors.primary}
              subtitle="All items"
            />
            <StatCard
              title="Active Items"
              value={reportData.statusBreakdown.active}
              icon="checkmark-circle"
              color={colors.success}
              subtitle="Published"
            />
            <StatCard
              title="Recent Adds"
              value={reportData.recentAdditions.length}
              icon="add-circle"
              color={colors.info}
              subtitle="Last 30 days"
            />
            <StatCard
              title="Locations"
              value={reportData.topLocations.length}
              icon="location"
              color={colors.warning}
              subtitle="Unique places"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏛️ Content by Category</Text>
          <View style={styles.chartContainer}>
            <ChartBar
              label="Attractions"
              value={reportData.contentByType.attractions}
              maxValue={maxContentValue}
              color={colors.primary}
            />
            <ChartBar
              label="Restaurants"
              value={reportData.contentByType.restaurants}
              maxValue={maxContentValue}
              color={colors.secondary}
            />
            <ChartBar
              label="Beaches"
              value={reportData.contentByType.beaches}
              maxValue={maxContentValue}
              color={colors.tertiary}
            />
            <ChartBar
              label="Destinations"
              value={reportData.contentByType.destinations}
              maxValue={maxContentValue}
              color={colors.warning}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Top Locations</Text>
          <View style={styles.chartContainer}>
            {reportData.topLocations.length > 0 ? (
              reportData.topLocations.map((location, index) => (
                <ChartBar
                  key={location.location}
                  label={location.location}
                  value={location.count}
                  maxValue={maxLocationValue}
                  color={[colors.primary, colors.secondary, colors.tertiary, colors.warning, colors.success][index]}
                />
              ))
            ) : (
              <Text style={styles.emptyText}>No location data available</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🕒 Recent Additions</Text>
          <View style={styles.recentContainer}>
            {reportData.recentAdditions.length > 0 ? (
              reportData.recentAdditions.map((item, index) => (
                <View key={`${item.type}-${index}`} style={styles.recentItem}>
                  <View style={[styles.recentIcon, { backgroundColor: getTypeColor(item.type, colors) }]}>
                    <Ionicons name={getTypeIcon(item.type)} size={16} color="#FFFFFF" />
                  </View>
                  <View style={styles.recentContent}>
                    <Text style={styles.recentTitle}>{item.name}</Text>
                    <Text style={styles.recentDetails}>
                      {item.location} • {item.type.charAt(0).toUpperCase() + item.type.slice(0, -1)}
                    </Text>
                  </View>
                  <Text style={styles.recentDate}>
                    {formatRecentDate(item.createdAt || item.dateAdded)}
                  </Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="calendar" size={48} color={colors.textPlaceholder} />
                <Text style={styles.emptyText}>No recent additions</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const getTypeColor = (type, colors) => {
  const colorMap = {
    attractions: colors.primary,
    restaurants: colors.secondary,
    beaches: colors.tertiary,
    destinations: colors.warning,
  };
  return colorMap[type] || colors.primary;
};

const getTypeIcon = (type) => {
  const iconMap = {
    attractions: 'business',
    restaurants: 'restaurant',
    beaches: 'water',
    destinations: 'earth',
  };
  return iconMap[type] || 'document';
};

const formatRecentDate = (date) => {
  const d = date?.toDate ? date.toDate() : new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now - d);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Today';
  if (diffDays === 2) return 'Yesterday';
  if (diffDays <= 7) return `${diffDays - 1} days ago`;
  return d.toLocaleDateString();
};

const getStyles = (colors, isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 12,
  },
  headerContent: {
    flex: 1,
    paddingHorizontal: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  backButton: {
    borderRadius: 12,
    padding: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  headerTextContainer: {
    flex: 1,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    marginTop: 2,
  },
  refreshButton: {
    borderRadius: 12,
    padding: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logoutButton: {
    borderRadius: 12,
    padding: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    minWidth: '100%',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    borderRadius: 10,
    padding: 8,
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 2,
  },
  statSubtitle: {
    fontSize: 10,
    color: colors.textPlaceholder,
    marginTop: 1,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minWidth: '100%',
  },
  chartBarContainer: {
    marginBottom: 16,
  },
  chartLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  chartBarTrack: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  chartBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  chartValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    textAlign: 'right',
  },
  recentContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minWidth: '100%',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  recentIcon: {
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  recentContent: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  recentDetails: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  recentDate: {
    fontSize: 11,
    color: colors.textPlaceholder,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textPlaceholder,
    marginTop: 12,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    ...(Platform.OS === 'web' && {
      overflow: 'auto',
      height: '100vh',
      maxHeight: '100vh',
    }),
  },
  scrollViewContent: {
    paddingBottom: 80, // Add padding at the bottom for content
    minWidth: '100%',
    ...(Platform.OS === 'web' && {
      minHeight: '100%',
    }),
  },
});

export default ViewReportsScreen; 