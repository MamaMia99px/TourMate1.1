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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AdminDataService from '../../services/admin/AdminDataService';
import AdminAuthService from '../../services/auth/AdminAuthService';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../utils/theme';

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
    Alert.alert(
      'Logout',
      'Are you sure you want to logout from admin panel?',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => console.log('Logout cancelled') },
        {
          text: 'Logout',
          onPress: async () => {
            console.log('AdminDashboard: User confirmed logout');
            try {
              console.log('AdminDashboard: Calling AdminAuthService.logoutAdmin()');
              const logoutResult = await AdminAuthService.logoutAdmin();
              console.log('AdminDashboard: Logout result:', logoutResult);
              
              if (logoutResult.success) {
                console.log('AdminDashboard: Logout successful, resetting navigation');
                // Reset the navigation stack to Auth and go to Landing
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Auth', params: { screen: 'Landing' } }],
                });
              } else {
                console.log('AdminDashboard: Logout failed:', logoutResult.error);
                Alert.alert('Logout Error', 'Failed to logout. Please try again.');
              }
            } catch (error) {
              console.error('AdminDashboard: Logout error:', error);
              Alert.alert('Logout Error', 'An error occurred during logout.');
            }
          },
        },
      ]
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
      backgroundColor: 'rgba(255, 107, 53, 0.1)',
      onPress: () => navigation.navigate('AddAttraction'),
    },
    {
      id: 'add-restaurant',
      title: 'Add Restaurant',
      subtitle: 'Add new dining establishments',
      icon: 'restaurant',
      color: colors.secondary,
      backgroundColor: 'rgba(78, 205, 196, 0.1)',
      onPress: () => navigation.navigate('AddRestaurant'),
    },
    {
      id: 'add-beach',
      title: 'Add Beach',
      subtitle: 'Add new beach destinations',
      icon: 'water',
      color: colors.tertiary,
      backgroundColor: 'rgba(69, 183, 209, 0.1)',
      onPress: () => navigation.navigate('AddBeach'),
    },
    {
      id: 'add-destination',
      title: 'Add Destination',
      subtitle: 'Add new travel destinations',
      icon: 'earth',
      color: colors.primary,
      backgroundColor: 'rgba(255, 107, 53, 0.1)',
      onPress: () => navigation.navigate('AddDestination'),
    },
    {
      id: 'manage-content',
      title: 'Manage Content',
      subtitle: 'View and edit existing content',
      icon: 'create',
      color: colors.warning,
      backgroundColor: 'rgba(243, 156, 18, 0.1)',
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
      color: colors.success,
      backgroundColor: 'rgba(39, 174, 96, 0.1)',
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        bounces={true}
        alwaysBounceVertical={false}
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
  },
  scrollViewContent: {
    paddingBottom: 80, // Add padding at the bottom for content
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
});

export default AdminDashboard; 