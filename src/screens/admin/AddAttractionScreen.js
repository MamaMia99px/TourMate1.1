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
      console.log('Starting image picker...');
      
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Permission status:', status);
      
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to select an image.');
        return;
      }

      // Launch image picker with simpler options
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      console.log('Image picker result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        console.log('Image selected:', result.assets[0]);
        setSelectedImage(result.assets[0]);
      } else {
        console.log('Image selection cancelled or failed');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const takePhoto = async () => {
    try {
      console.log('Starting camera...');
      
      // Request permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      console.log('Camera permission status:', status);
      
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera permissions to take a photo.');
        return;
      }

      // Launch camera with simpler options
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      console.log('Camera result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        console.log('Photo taken:', result.assets[0]);
        setSelectedImage(result.assets[0]);
      } else {
        console.log('Photo cancelled or failed');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const showImageOptions = () => {
    console.log('Showing image options...');
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
        image: selectedImage ? selectedImage.uri : null,
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
      console.error('Error adding attraction:', error);
      Alert.alert('Error', 'Failed to add attraction. Please try again.');
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
        <Text style={styles.title}>Add New Attraction</Text>

        {/* Image Section */}
        <View style={styles.imageSection}>
          <Text style={styles.label}>Attraction Image *</Text>
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
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => handleInputChange('name', text)}
            placeholder="Enter attraction name"
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
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={styles.textArea}
            value={formData.description}
            onChangeText={(text) => handleInputChange('description', text)}
            placeholder="Describe the attraction..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
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
          <Text style={styles.label}>Category</Text>
          <TextInput
            style={styles.input}
            value={formData.category}
            onChangeText={(text) => handleInputChange('category', text)}
            placeholder="e.g., Historical, Cultural, Nature"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Opening Hours</Text>
          <TextInput
            style={styles.input}
            value={formData.openHours}
            onChangeText={(text) => handleInputChange('openHours', text)}
            placeholder="e.g., 9:00 AM - 6:00 PM"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Entrance Fee</Text>
          <TextInput
            style={styles.input}
            value={formData.entranceFee}
            onChangeText={(text) => handleInputChange('entranceFee', text)}
            placeholder="e.g., ₱100, Free"
            placeholderTextColor={colors.textSecondary}
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
          <Text style={styles.label}>Highlights</Text>
          <TextInput
            style={styles.input}
            value={formData.highlights}
            onChangeText={(text) => handleInputChange('highlights', text)}
            placeholder="e.g., Beautiful view, Historical significance, Photo opportunities"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Tips for Visitors</Text>
          <TextInput
            style={styles.textArea}
            value={formData.tips}
            onChangeText={(text) => handleInputChange('tips', text)}
            placeholder="Best time to visit, what to bring, etc."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={3}
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
            <Text style={styles.submitButtonText}>Add Attraction</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddAttractionScreen; 