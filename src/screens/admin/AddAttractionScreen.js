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
import { logoutWithConfirmation } from '../../utils/logoutUtils';

const AddAttractionScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    address: '',
    openHours: '',
    entranceFee: '',
    latitude: '',
    longitude: '',
    category: '',
    highlights: '',
    tips: ''
  });
  
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const required = ['name', 'location', 'description', 'address'];
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
      const attractionData = {
        ...formData,
        coordinates: formData.latitude && formData.longitude ? {
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude)
        } : null,
        highlights: formData.highlights ? formData.highlights.split(',').map(h => h.trim()) : [],
        rating: 0, // Default rating
        reviewCount: 0,
        isFeatured: false
      };
      
      const result = await AdminDataService.addAttraction(attractionData);
      
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
                  location: '',
                  description: '',
                  address: '',
                  openHours: '',
                  entranceFee: '',
                  latitude: '',
                  longitude: '',
                  category: '',
                  highlights: '',
                  tips: ''
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
        Alert.alert('Error', result.error || 'Failed to add attraction');
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
      paddingBottom: 80, // Add padding at the bottom for the button
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
        <Text style={styles.title}>Add New Attraction</Text>
        
        <View style={styles.formGroup}>
          <Text style={[styles.label, styles.requiredLabel]}>Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            placeholder="e.g., Magellan's Cross"
            placeholderTextColor={colors.secondaryText}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, styles.requiredLabel]}>Location *</Text>
          <TextInput
            style={styles.input}
            value={formData.location}
            onChangeText={(value) => handleInputChange('location', value)}
            placeholder="e.g., Cebu City"
            placeholderTextColor={colors.secondaryText}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, styles.requiredLabel]}>Description *</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={formData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            placeholder="Describe the attraction, its history, and what makes it special..."
            placeholderTextColor={colors.secondaryText}
            multiline
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, styles.requiredLabel]}>Address *</Text>
          <TextInput
            style={styles.input}
            value={formData.address}
            onChangeText={(value) => handleInputChange('address', value)}
            placeholder="Full address with street, city, postal code"
            placeholderTextColor={colors.secondaryText}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Category</Text>
          <TextInput
            style={styles.input}
            value={formData.category}
            onChangeText={(value) => handleInputChange('category', value)}
            placeholder="e.g., Historical Site, Religious Site, Museum"
            placeholderTextColor={colors.secondaryText}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Open Hours</Text>
          <TextInput
            style={styles.input}
            value={formData.openHours}
            onChangeText={(value) => handleInputChange('openHours', value)}
            placeholder="e.g., 8:00 AM - 6:00 PM"
            placeholderTextColor={colors.secondaryText}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Entrance Fee</Text>
          <TextInput
            style={styles.input}
            value={formData.entranceFee}
            onChangeText={(value) => handleInputChange('entranceFee', value)}
            placeholder="e.g., Free, ₱50, ₱100-200"
            placeholderTextColor={colors.secondaryText}
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
          <Text style={styles.label}>Highlights</Text>
          <Text style={styles.helper}>Enter key features separated by commas</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={formData.highlights}
            onChangeText={(value) => handleInputChange('highlights', value)}
            placeholder="Historical significance, Beautiful architecture, Photo opportunities"
            placeholderTextColor={colors.secondaryText}
            multiline
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Visitor Tips</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={formData.tips}
            onChangeText={(value) => handleInputChange('tips', value)}
            placeholder="Best time to visit, what to bring, parking information, etc."
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
            <Text style={styles.submitButtonText}>Add Attraction</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddAttractionScreen; 