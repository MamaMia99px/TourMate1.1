import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../utils/theme';
import AdminDataService from '../../services/admin/AdminDataService';

const AddRestaurantScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cuisine: '',
    location: '',
    municipality: '',
    address: '',
    openHours: '',
    priceRange: '',
    latitude: '',
    longitude: '',
    specialties: '',
    contactNumber: '',
    features: ''
  });
  
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const required = ['name', 'description', 'cuisine', 'location', 'address'];
    const missing = required.filter(field => !formData[field].trim());
    
    if (missing.length > 0) {
      Alert.alert('Validation Error', `Please fill in: ${missing.join(', ')}`);
      return false;
    }
    
    if (formData.latitude && isNaN(parseFloat(formData.latitude))) {
      Alert.alert('Validation Error', 'Please enter a valid latitude');
      return false;
    }
    
    if (formData.longitude && isNaN(parseFloat(formData.longitude))) {
      Alert.alert('Validation Error', 'Please enter a valid longitude');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const restaurantData = {
        ...formData,
        coordinates: formData.latitude && formData.longitude ? {
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude)
        } : null,
        specialties: formData.specialties ? formData.specialties.split(',').map(s => s.trim()) : [],
        features: formData.features ? formData.features.split(',').map(f => f.trim()) : [],
        rating: 0, // Default rating
        reviewCount: 0,
        isFeatured: false
      };
      
      const result = await AdminDataService.addRestaurant(restaurantData);
      
      if (result.success) {
        Alert.alert(
          'Success!',
          result.message,
          [
            {
              text: 'Add Another',
              onPress: () => {
                setFormData({
                  name: '',
                  description: '',
                  cuisine: '',
                  location: '',
                  municipality: '',
                  address: '',
                  openHours: '',
                  priceRange: '',
                  latitude: '',
                  longitude: '',
                  specialties: '',
                  contactNumber: '',
                  features: ''
                });
              }
            },
            {
              text: 'Go Back',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to add restaurant');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
      padding: 20,
      paddingBottom: 80, // Add padding at the bottom for better spacing
      minWidth: '100%',
      ...(Platform.OS === 'web' && {
        minHeight: '100%',
      }),
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 20,
      textAlign: 'center',
    },
    formGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    requiredLabel: {
      color: colors.accent,
    },
    input: {
      backgroundColor: colors.cardBackground,
      borderRadius: 10,
      padding: 15,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border || '#E0E0E0',
    },
    multilineInput: {
      height: 100,
      textAlignVertical: 'top',
    },
    coordinatesContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      minWidth: '100%',
    },
    coordinateInput: {
      flex: 1,
      marginHorizontal: 5,
    },
    submitButton: {
      backgroundColor: colors.accent,
      padding: 18,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 30,
      marginBottom: 40,
    },
    submitButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    disabledButton: {
      opacity: 0.6,
    },
    helper: {
      fontSize: 12,
      color: colors.secondaryText,
      marginTop: 5,
      fontStyle: 'italic',
    }
  });

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        bounces={true}
        alwaysBounceVertical={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        <Text style={styles.title}>Add New Restaurant</Text>
        
        <View style={styles.formGroup}>
          <Text style={[styles.label, styles.requiredLabel]}>Restaurant Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            placeholder="e.g., Zubuchon"
            placeholderTextColor={colors.secondaryText}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, styles.requiredLabel]}>Description *</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={formData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            placeholder="Describe the restaurant, ambiance, and what makes it special..."
            placeholderTextColor={colors.secondaryText}
            multiline
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, styles.requiredLabel]}>Cuisine Type *</Text>
          <TextInput
            style={styles.input}
            value={formData.cuisine}
            onChangeText={(value) => handleInputChange('cuisine', value)}
            placeholder="e.g., Filipino, International, Fast Food, Seafood"
            placeholderTextColor={colors.secondaryText}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, styles.requiredLabel]}>Location *</Text>
          <TextInput
            style={styles.input}
            value={formData.location}
            onChangeText={(value) => handleInputChange('location', value)}
            placeholder="e.g., IT Park, Ayala Center"
            placeholderTextColor={colors.secondaryText}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Municipality</Text>
          <TextInput
            style={styles.input}
            value={formData.municipality}
            onChangeText={(value) => handleInputChange('municipality', value)}
            placeholder="e.g., Cebu City, Moalboal, Oslob"
            placeholderTextColor={colors.secondaryText}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, styles.requiredLabel]}>Address *</Text>
          <TextInput
            style={styles.input}
            value={formData.address}
            onChangeText={(value) => handleInputChange('address', value)}
            placeholder="Full address with street, building, floor details"
            placeholderTextColor={colors.secondaryText}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Operating Hours</Text>
          <TextInput
            style={styles.input}
            value={formData.openHours}
            onChangeText={(value) => handleInputChange('openHours', value)}
            placeholder="e.g., 11:00 AM - 10:00 PM, 24 Hours"
            placeholderTextColor={colors.secondaryText}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Price Range</Text>
          <TextInput
            style={styles.input}
            value={formData.priceRange}
            onChangeText={(value) => handleInputChange('priceRange', value)}
            placeholder="e.g., ₱100-250, ₱300-600"
            placeholderTextColor={colors.secondaryText}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Contact Number</Text>
          <TextInput
            style={styles.input}
            value={formData.contactNumber}
            onChangeText={(value) => handleInputChange('contactNumber', value)}
            placeholder="e.g., +63 32 123 4567"
            placeholderTextColor={colors.secondaryText}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Coordinates (Optional)</Text>
          <Text style={styles.helper}>Enter GPS coordinates for map integration</Text>
          <View style={styles.coordinatesContainer}>
            <TextInput
              style={[styles.input, styles.coordinateInput]}
              value={formData.latitude}
              onChangeText={(value) => handleInputChange('latitude', value)}
              placeholder="Latitude"
              placeholderTextColor={colors.secondaryText}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.coordinateInput]}
              value={formData.longitude}
              onChangeText={(value) => handleInputChange('longitude', value)}
              placeholder="Longitude"
              placeholderTextColor={colors.secondaryText}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Specialties</Text>
          <Text style={styles.helper}>Enter signature dishes separated by commas</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={formData.specialties}
            onChangeText={(value) => handleInputChange('specialties', value)}
            placeholder="Lechon Cebu, Crispy Pata, Dinuguan, Chicharon"
            placeholderTextColor={colors.secondaryText}
            multiline
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Features</Text>
          <Text style={styles.helper}>Enter restaurant features separated by commas</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={formData.features}
            onChangeText={(value) => handleInputChange('features', value)}
            placeholder="Air Conditioning, Free WiFi, Parking Available, Drive-Thru, Outdoor Seating"
            placeholderTextColor={colors.secondaryText}
            multiline
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Add Restaurant</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddRestaurantScreen; 