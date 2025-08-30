import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AdminDataService from '../../services/admin/AdminDataService';
import AdminAuthService from '../../services/auth/AdminAuthService';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../utils/theme';
import { directLogout } from '../../utils/logoutUtils';

const AdminDashboard = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const styles = getStyles(colors, isDarkMode);

  const [isLoading, setIsLoading] = useState(true);
  const [adminRole, setAdminRole] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [stats, setStats] = useState({
    attractions: 0,
    restaurants: 0,
    beaches: 0,
    destinations: 0,
  });

  useEffect(() => {
    loadDashboardData();
    checkAdminRole();
  }, []);

  const checkAdminRole = async () => {
    try {
      // Get current user email from auth
      const user = await AdminAuthService.getCurrentUser();
      if (user && user.email) {
        const role = await AdminAuthService.getAdminRole(user.email);
        setAdminRole(role);
        setUserEmail(user.email);
      }
    } catch (error) {
      console.error('Error checking admin role:', error);
    }
  };

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [attractionsRes, restaurantsRes, beachesRes, destinationsRes] = await Promise.all([
        AdminDataService.getAllContent(AdminDataService.COLLECTIONS.ATTRACTIONS),
        AdminDataService.getAllContent(AdminDataService.COLLECTIONS.RESTAURANTS),
        AdminDataService.getAllContent(AdminDataService.COLLECTIONS.BEACHES),
        AdminDataService.getAllContent(AdminDataService.COLLECTIONS.DESTINATIONS),
      ]);

      setStats({
        attractions: attractionsRes.success ? attractionsRes.data.length : 0,
        restaurants: restaurantsRes.success ? restaurantsRes.data.length : 0,
        beaches: beachesRes.success ? beachesRes.data.length : 0,
        destinations: destinationsRes.success ? destinationsRes.data.length : 0,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    console.log('AdminDashboard: Logout button pressed');
    // Direct logout without confirmation
    directLogout(
      navigation,
      () => {
        console.log('AdminDashboard: Logout successful');
      },
      (error) => {
        console.error('AdminDashboard: Logout error:', error);
        Alert.alert('Logout Error', 'Failed to logout. Please try again.');
      }
    );
  };

    // Content management items for LGU Admins only
  const lguManagementItems = [
    {
      id: 'add-attraction',
      title: 'Add Attraction',
      subtitle: 'Add new tourist attractions',
      icon: 'business',
      color: colors.primary,
      backgroundColor: 'rgba(30, 58, 138, 0.1)',
      onPress: () => navigation.navigate('AddAttraction'),
    },
    {
      id: 'add-restaurant',
      title: 'Add Restaurant',
      subtitle: 'Add new dining establishments',
      icon: 'restaurant',
      color: colors.secondary,
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      onPress: () => navigation.navigate('AddRestaurant'),
    },
    {
      id: 'add-beach',
      title: 'Add Beach',
      subtitle: 'Add new beach destinations',
      icon: 'water',
      color: colors.tertiary,
      backgroundColor: 'rgba(96, 165, 250, 0.1)',
      onPress: () => navigation.navigate('AddBeach'),
    },
    {
      id: 'add-destination',
      title: 'Add Destination',
      subtitle: 'Add new travel destinations',
      icon: 'earth',
      color: colors.accent,
      backgroundColor: 'rgba(249, 115, 22, 0.1)',
      onPress: () => navigation.navigate('AddDestination'),
    },
    {
      id: 'manage-content',
      title: 'Manage Content',
      subtitle: 'View and edit existing content',
      icon: 'create',
      color: colors.accent,
      backgroundColor: 'rgba(249, 115, 22, 0.1)',
      onPress: () => navigation.navigate('ManageContent'),
    },
  ];

  // Reports-only items for regular admins
  const reportsItems = [
    {
      id: 'view-reports',
      title: 'View Reports',
      subtitle: 'Analytics and statistics',
      icon: 'bar-chart',
      color: colors.accent,
      backgroundColor: 'rgba(249, 115, 22, 0.1)',
      onPress: () => navigation.navigate('ViewReports'),
    },
  ];

  // Get appropriate items based on admin role
  const getManagementItems = () => {
    if (adminRole === 'lgu_admin') {
      return [...lguManagementItems, ...reportsItems];
    } else {
      return reportsItems;
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.navigate('MainApp', { screen: 'Profile' })}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>
                {adminRole === 'lgu_admin' ? 'LGU Admin Dashboard' : 'Admin Dashboard'}
              </Text>
              <Text style={styles.headerSubtitle}>
                {adminRole === 'lgu_admin' 
                  ? 'Manage Cebu Tourism Content' 
                  : 'View Tourism Analytics & Reports'
                }
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.logoutButton} 
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
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
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Content Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.attractions}</Text>
              <Text style={styles.statLabel}>Attractions</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.restaurants}</Text>
              <Text style={styles.statLabel}>Restaurants</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.beaches}</Text>
              <Text style={styles.statLabel}>Beaches</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.destinations}</Text>
              <Text style={styles.statLabel}>Destinations</Text>
            </View>
          </View>
        </View>

        {/* Management Section */}
        <View style={styles.managementContainer}>
          <Text style={styles.sectionTitle}>
            {adminRole === 'lgu_admin' ? 'Content Management' : 'Available Actions'}
          </Text>
          
          {adminRole === 'lgu_admin' && (
            <View style={styles.roleIndicator}>
              <Ionicons name="shield-checkmark" size={16} color={colors.success} />
              <Text style={styles.roleText}>LGU Administrator - Full Content Access</Text>
            </View>
          )}
          
          {adminRole === 'reports_admin' && (
            <View style={styles.roleIndicator}>
              <Ionicons name="analytics" size={16} color={colors.info} />
              <Text style={styles.roleText}>Reports Administrator - Analytics Access Only</Text>
            </View>
          )}

          {/* Content Status Section */}
          {adminRole === 'lgu_admin' && (
            <View style={styles.contentStatusContainer}>
              <Text style={styles.statusTitle}>📱 User App Content Status</Text>
              <Text style={styles.statusSubtitle}>
                Content added/updated here will be visible to users in the mobile app
              </Text>
              
              <View style={styles.statusGrid}>
                <View style={styles.statusCard}>
                  <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                  <Text style={styles.statusLabel}>Live Content</Text>
                  <Text style={styles.statusValue}>{stats.attractions + stats.restaurants + stats.beaches + stats.destinations} items</Text>
                </View>
                
                <View style={styles.statusCard}>
                  <Ionicons name="sync" size={24} color={colors.primary} />
                  <Text style={styles.statusLabel}>Auto Sync</Text>
                  <Text style={styles.statusValue}>Real-time</Text>
                </View>
              </View>
            </View>
          )}
          
          <View style={styles.managementGrid}>
            {getManagementItems().map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.managementCard, { backgroundColor: item.backgroundColor }]}
                onPress={item.onPress}
              >
                <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                  <Ionicons name={item.icon} size={28} color="#FFFFFF" />
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
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
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flex: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  backButton: {
    borderRadius: 12,
    padding: 12,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    fontWeight: '600',
    textAlign: 'center',
  },
  logoutButton: {
    borderRadius: 12,
    padding: 12,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
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
  statsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
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
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  managementContainer: {
    padding: 20,
    paddingTop: 0,
  },
  managementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    minWidth: '100%',
  },
  managementCard: {
    width: '48%',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  iconContainer: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  roleIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  roleText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
    marginLeft: 8,
  },
  contentStatusContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  statusSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    minWidth: '100%',
  },
  statusCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  statusLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.primary,
    marginTop: 4,
  },
});

export default AdminDashboard; 