import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../utils/theme';
import AdminDataService from '../../services/admin/AdminDataService';

const ManageContentScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  
  const [selectedCategory, setSelectedCategory] = useState('attractions');
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = [
    { key: 'attractions', label: 'Attractions', icon: '🏛️' },
    { key: 'restaurants', label: 'Restaurants', icon: '🍽️' },
    { key: 'beaches', label: 'Beaches', icon: '🏖️' },
    { key: 'destinations', label: 'Destinations', icon: '🌍' }
  ];

  useEffect(() => {
    loadContent();
  }, [selectedCategory]);

  const loadContent = async () => {
    try {
      setLoading(true);
      const result = await AdminDataService.getAllContent(
        AdminDataService.COLLECTIONS[selectedCategory.toUpperCase()]
      );
      if (result.success) {
        setContent(result.data);
      } else {
        setContent([]);
      }
    } catch (error) {
      console.error('Error loading content:', error);
      setContent([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadContent();
    setRefreshing(false);
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Delete Content',
      `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await AdminDataService.deleteContent(
                AdminDataService.COLLECTIONS[selectedCategory.toUpperCase()],
                item.id
              );
              if (result.success) {
                Alert.alert('Success', result.message);
                loadContent(); // Refresh the list
              } else {
                Alert.alert('Error', result.error);
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete content');
            }
          }
        }
      ]
    );
  };

  const handleEdit = (item) => {
    // Navigate to edit screen (you can implement this later)
    Alert.alert('Edit Feature', 'Edit functionality will be available in the next update');
  };

  const filteredContent = content.filter(item => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.name?.toLowerCase().includes(query) ||
      item.location?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query)
    );
  });

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 20,
      paddingTop: 40,
      backgroundColor: colors.primary,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 15,
    },
    categoriesContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: colors.cardBackground,
    },
    categoryButton: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 8,
      marginHorizontal: 5,
      borderRadius: 8,
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    activeCategoryButton: {
      backgroundColor: colors.primary,
    },
    categoryIcon: {
      fontSize: 20,
      marginBottom: 5,
    },
    categoryText: {
      fontSize: 12,
      color: colors.text,
      fontWeight: '500',
    },
    activeCategoryText: {
      color: '#FFFFFF',
    },
    searchContainer: {
      padding: 20,
      paddingBottom: 10,
    },
    searchInput: {
      backgroundColor: colors.cardBackground,
      borderRadius: 10,
      padding: 15,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border || '#E0E0E0',
    },
    contentContainer: {
      flex: 1,
      padding: 20,
      paddingTop: 10,
    },
    contentItem: {
      backgroundColor: colors.cardBackground,
      borderRadius: 15,
      padding: 15,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 10,
    },
    itemName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      flex: 1,
      marginRight: 10,
    },
    itemLocation: {
      fontSize: 14,
      color: colors.secondaryText,
      marginBottom: 5,
    },
    itemDescription: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
      marginBottom: 10,
    },
    itemFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: colors.border || '#E0E0E0',
    },
    itemDate: {
      fontSize: 12,
      color: colors.secondaryText,
    },
    itemActions: {
      flexDirection: 'row',
    },
    actionButton: {
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 6,
      marginLeft: 10,
    },
    editButton: {
      backgroundColor: colors.primary,
    },
    deleteButton: {
      backgroundColor: '#FF6B6B',
    },
    actionButtonText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '600',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    emptyText: {
      fontSize: 16,
      color: colors.secondaryText,
      textAlign: 'center',
      marginTop: 20,
    },
    emptyIcon: {
      fontSize: 48,
      marginBottom: 10,
    },
    scrollViewContent: {
      flexGrow: 1,
      paddingBottom: 20,
    },
    scrollView: {
      flex: 1,
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Content</Text>
      </View>

      <View style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.key}
            style={[
              styles.categoryButton,
              selectedCategory === category.key && styles.activeCategoryButton
            ]}
            onPress={() => setSelectedCategory(category.key)}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={[
              styles.categoryText,
              selectedCategory === category.key && styles.activeCategoryText
            ]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={`Search ${selectedCategory}...`}
          placeholderTextColor={colors.secondaryText}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.emptyText}>Loading {selectedCategory}...</Text>
        </View>
      ) : filteredContent.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>
            {searchQuery 
              ? `No ${selectedCategory} found matching "${searchQuery}"`
              : `No ${selectedCategory} found. Add some content to get started!`
            }
          </Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          bounces={true}
          alwaysBounceVertical={false}
        >
          {filteredContent.map((item) => (
            <View key={item.id} style={styles.contentItem}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{item.name}</Text>
              </View>
              
              <Text style={styles.itemLocation}>{item.location}</Text>
              <Text style={styles.itemDescription} numberOfLines={3}>
                {item.description}
              </Text>
              
              <View style={styles.itemFooter}>
                <Text style={styles.itemDate}>
                  Added: {formatDate(item.createdAt)}
                </Text>
                
                <View style={styles.itemActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => handleEdit(item)}
                  >
                    <Text style={styles.actionButtonText}>Edit</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDelete(item)}
                  >
                    <Text style={styles.actionButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default ManageContentScreen; 