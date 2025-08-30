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
  Platform,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
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
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to select an image.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera permissions to take a photo.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Add Image',
      'Choose how you want to add an image',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: pickImage },
      ]
    );
  };

  const removeImage = () => {
    setSelectedImage(null);
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
        image: selectedImage ? selectedImage.uri : null,
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
                setSelectedImage(null);
              }
            },
            {
              text: 'Go to Dashboard',
              onPress: () => navigation.navigate('AdminDashboard')
            }
          ]
        );
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      console.error('Error adding restaurant:', error);
      Alert.alert('Error', 'Failed to add restaurant. Please try again.');
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
    },
    content: {
      padding: 20,
      paddingBottom: 100, // Add extra padding at bottom for better scrolling
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
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.cardBackground,
    },
    textArea: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.cardBackground,
      minHeight: 100,
      textAlignVertical: 'top',
    },
    imageSection: {
      marginBottom: 20,
    },
    imageContainer: {
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: 'dashed',
      borderRadius: 12,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.cardBackground,
      minHeight: 200,
    },
    selectedImageContainer: {
      borderWidth: 2,
      borderColor: colors.primary,
      borderStyle: 'solid',
    },
    imagePlaceholder: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    imageIcon: {
      fontSize: 48,
      color: colors.textSecondary,
      marginBottom: 10,
    },
    imageText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    selectedImage: {
      width: '100%',
      height: 200,
      borderRadius: 8,
      marginBottom: 10,
    },
    imageActions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    },
    imageButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 6,
    },
    imageButtonText: {
      color: '#FFFFFF',
      marginLeft: 8,
      fontWeight: '600',
    },
    removeButton: {
      backgroundColor: colors.error,
    },
    submitButton: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 20, // Add bottom margin for better spacing
    },
    submitButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    submitButtonDisabled: {
      backgroundColor: colors.textSecondary,
    },
  });

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={false}
        bounces={true}
        alwaysBounceVertical={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        testID="scroll-view"
      >
        <Text style={styles.title}>Add New Restaurant</Text>

        {/* Image Section */}
        <View style={styles.imageSection}>
          <Text style={styles.label}>Restaurant Image *</Text>
          <View style={[
            styles.imageContainer,
            selectedImage && styles.selectedImageContainer
          ]}>
            {selectedImage ? (
              <>
                <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
                <View style={styles.imageActions}>
                  <TouchableOpacity style={styles.imageButton} onPress={showImageOptions}>
                    <Ionicons name="camera" size={20} color="#FFFFFF" />
                    <Text style={styles.imageButtonText}>Change</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.imageButton, styles.removeButton]} onPress={removeImage}>
                    <Ionicons name="trash" size={20} color="#FFFFFF" />
                    <Text style={styles.imageButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <TouchableOpacity style={styles.imagePlaceholder} onPress={showImageOptions}>
                <Ionicons name="image-outline" size={48} color={colors.textSecondary} />
                <Text style={styles.imageText}>Tap to add image</Text>
                <Text style={[styles.imageText, { fontSize: 14, marginTop: 5 }]}>
                  Recommended: 16:9 aspect ratio
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Basic Information */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Restaurant Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => handleInputChange('name', text)}
            placeholder="Enter restaurant name"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={styles.textArea}
            value={formData.description}
            onChangeText={(text) => handleInputChange('description', text)}
            placeholder="Describe the restaurant, its atmosphere, and specialties..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Cuisine Type *</Text>
          <TextInput
            style={styles.input}
            value={formData.cuisine}
            onChangeText={(text) => handleInputChange('cuisine', text)}
            placeholder="e.g., Filipino, Chinese, Italian, Fast Food"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Location *</Text>
          <TextInput
            style={styles.input}
            value={formData.location}
            onChangeText={(text) => handleInputChange('location', text)}
            placeholder="e.g., Cebu City, Mandaue City"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Municipality</Text>
          <TextInput
            style={styles.input}
            value={formData.municipality}
            onChangeText={(text) => handleInputChange('municipality', text)}
            placeholder="Municipality or district"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Address *</Text>
          <TextInput
            style={styles.input}
            value={formData.address}
            onChangeText={(text) => handleInputChange('address', text)}
            placeholder="Full address"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {/* Additional Information */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Opening Hours</Text>
          <TextInput
            style={styles.input}
            value={formData.openHours}
            onChangeText={(text) => handleInputChange('openHours', text)}
            placeholder="e.g., 11:00 AM - 9:00 PM"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Price Range</Text>
          <TextInput
            style={styles.input}
            value={formData.priceRange}
            onChangeText={(text) => handleInputChange('priceRange', text)}
            placeholder="e.g., ₱100-250, ₱300-500"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Contact Number</Text>
          <TextInput
            style={styles.input}
            value={formData.contactNumber}
            onChangeText={(text) => handleInputChange('contactNumber', text)}
            placeholder="Phone number"
            placeholderTextColor={colors.textSecondary}
            keyboardType="phone-pad"
          />
        </View>

        {/* Coordinates */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Coordinates (Optional)</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={formData.latitude}
              onChangeText={(text) => handleInputChange('latitude', text)}
              placeholder="Latitude"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={formData.longitude}
              onChangeText={(text) => handleInputChange('longitude', text)}
              placeholder="Longitude"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Specialties</Text>
          <TextInput
            style={styles.input}
            value={formData.specialties}
            onChangeText={(text) => handleInputChange('specialties', text)}
            placeholder="e.g., Lechon, Crispy Pata, Dinuguan"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Features</Text>
          <TextInput
            style={styles.input}
            value={formData.features}
            onChangeText={(text) => handleInputChange('features', text)}
            placeholder="e.g., Parking, WiFi, Air Conditioning, Outdoor Seating"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            loading && styles.submitButtonDisabled
          ]}
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