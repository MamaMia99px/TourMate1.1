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
  RefreshControl,
  Platform,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../utils/theme';
import AdminDataService from '../../services/admin/AdminDataService';
import { directLogout } from '../../utils/logoutUtils';

const ManageContentScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  
  const [selectedCategory, setSelectedCategory] = useState('attractions');
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    location: '',
    description: '',
    rating: '',
    priceRange: '',
    openHours: '',
    specialties: '',
  });
  
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

  const handleDelete = async (item) => {
    try {
      const result = await AdminDataService.deleteContent(
        AdminDataService.COLLECTIONS[selectedCategory.toUpperCase()],
        item.id
      );
      if (result.success) {
        // Show success message briefly
        Alert.alert('Success', `${item.name} has been deleted successfully.`);
        loadContent(); // Refresh the list
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      console.error('Error deleting content:', error);
      Alert.alert('Error', 'Failed to delete content. Please try again.');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setEditForm({
      name: item.name || '',
      location: item.location || '',
      description: item.description || '',
      rating: item.rating ? item.rating.toString() : '',
      priceRange: item.priceRange || '',
      openHours: item.openHours || '',
      specialties: item.specialties ? item.specialties.join(', ') : '',
    });
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!editForm.name.trim() || !editForm.location.trim() || !editForm.description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields (Name, Location, Description)');
      return;
    }

    try {
      const updateData = {
        name: editForm.name.trim(),
        location: editForm.location.trim(),
        description: editForm.description.trim(),
        rating: editForm.rating ? parseFloat(editForm.rating) : null,
        priceRange: editForm.priceRange.trim() || null,
        openHours: editForm.openHours.trim() || null,
        specialties: editForm.specialties.trim() ? editForm.specialties.split(',').map(s => s.trim()) : null,
      };

      const result = await AdminDataService.updateContent(
        AdminDataService.COLLECTIONS[selectedCategory.toUpperCase()],
        editingItem.id,
        updateData
      );

      if (result.success) {
        Alert.alert('Success', result.message);
        setEditModalVisible(false);
        setEditingItem(null);
        loadContent(); // Refresh the list
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update content');
    }
  };

  const handleCancelEdit = () => {
    setEditModalVisible(false);
    setEditingItem(null);
    setEditForm({
      name: '',
      location: '',
      description: '',
      rating: '',
      priceRange: '',
      openHours: '',
      specialties: '',
    });
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

  const renderEditModal = () => (
    <Modal
      visible={editModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancelEdit}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Edit {selectedCategory.slice(0, -1)}</Text>
            <TouchableOpacity onPress={handleCancelEdit}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text }]}>Name *</Text>
              <TextInput
                style={[styles.formInput, { 
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                value={editForm.name}
                onChangeText={(text) => setEditForm({...editForm, name: text})}
                placeholder="Enter name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text }]}>Location *</Text>
              <TextInput
                style={[styles.formInput, { 
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                value={editForm.location}
                onChangeText={(text) => setEditForm({...editForm, location: text})}
                placeholder="Enter location"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text }]}>Description *</Text>
              <TextInput
                style={[styles.formTextArea, { 
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                value={editForm.description}
                onChangeText={(text) => setEditForm({...editForm, description: text})}
                placeholder="Enter description"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text }]}>Rating</Text>
              <TextInput
                style={[styles.formInput, { 
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                value={editForm.rating}
                onChangeText={(text) => setEditForm({...editForm, rating: text})}
                placeholder="Enter rating (1-5)"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>

            {selectedCategory === 'restaurants' && (
              <>
                <View style={styles.formGroup}>
                  <Text style={[styles.formLabel, { color: colors.text }]}>Price Range</Text>
                  <TextInput
                    style={[styles.formInput, { 
                      backgroundColor: colors.background,
                      color: colors.text,
                      borderColor: colors.border
                    }]}
                    value={editForm.priceRange}
                    onChangeText={(text) => setEditForm({...editForm, priceRange: text})}
                    placeholder="e.g., ₱100-250"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={[styles.formLabel, { color: colors.text }]}>Opening Hours</Text>
                  <TextInput
                    style={[styles.formInput, { 
                      backgroundColor: colors.background,
                      color: colors.text,
                      borderColor: colors.border
                    }]}
                    value={editForm.openHours}
                    onChangeText={(text) => setEditForm({...editForm, openHours: text})}
                    placeholder="e.g., 11:00 AM - 9:00 PM"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={[styles.formLabel, { color: colors.text }]}>Specialties</Text>
                  <TextInput
                    style={[styles.formInput, { 
                      backgroundColor: colors.background,
                      color: colors.text,
                      borderColor: colors.border
                    }]}
                    value={editForm.specialties}
                    onChangeText={(text) => setEditForm({...editForm, specialties: text})}
                    placeholder="e.g., Lechon, Crispy Pata, Dinuguan"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>
              </>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={handleCancelEdit}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleSaveEdit}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 20,
      paddingTop: 40,
      backgroundColor: colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      marginRight: 15,
      padding: 5,
    },
    logoutButton: {
      marginLeft: 15,
      padding: 5,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
      flex: 1,
    },
    categoriesContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: colors.cardBackground,
      minWidth: '100%',
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
      minWidth: '100%',
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
    itemImage: {
      width: '100%',
      height: 150,
      borderRadius: 8,
      marginBottom: 10,
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
      minWidth: '100%',
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
      backgroundColor: colors.accent,
    },
    deleteButton: {
      backgroundColor: colors.error,
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
      minWidth: '100%',
      ...(Platform.OS === 'web' && {
        minHeight: '100%',
      }),
    },
    scrollView: {
      flex: 1,
      ...(Platform.OS === 'web' && {
        overflow: 'auto',
        height: '100vh',
        maxHeight: '100vh',
      }),
    },
    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      width: '100%',
      maxWidth: 500,
      maxHeight: '80%',
      borderRadius: 15,
      padding: 20,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    modalBody: {
      flex: 1,
    },
    modalFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
      paddingTop: 15,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    formGroup: {
      marginBottom: 15,
    },
    formLabel: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 5,
    },
    formInput: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
    },
    formTextArea: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      minHeight: 80,
      textAlignVertical: 'top',
    },
    modalButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginHorizontal: 5,
    },
    cancelButton: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    saveButton: {
      backgroundColor: colors.primary,
    },
    cancelButtonText: {
      color: colors.text,
      fontWeight: '600',
    },
    saveButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Content</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => directLogout(navigation)}
        >
          <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
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
          showsVerticalScrollIndicator={true}
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={styles.scrollViewContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          bounces={true}
          alwaysBounceVertical={false}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          testID="scroll-view"
        >
          {filteredContent.map((item) => (
            <View key={item.id} style={styles.contentItem}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{item.name}</Text>
              </View>
              
              {item.image && (
                <Image 
                  source={{ uri: item.image }} 
                  style={styles.itemImage}
                  resizeMode="cover"
                />
              )}
              
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

      {renderEditModal()}
    </View>
  );
};

export default ManageContentScreen; 