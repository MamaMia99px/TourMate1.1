import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../utils/theme';

const ImageTestScreen = () => {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const [selectedImage, setSelectedImage] = useState(null);

  const testImagePicker = async () => {
    try {
      console.log('=== Testing Image Picker ===');
      
      // Check if ImagePicker is available
      console.log('ImagePicker available:', !!ImagePicker);
      
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Permission status:', status);
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera roll permission is required');
        return;
      }

      // Launch picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      console.log('Picker result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        console.log('Image selected successfully:', result.assets[0]);
        setSelectedImage(result.assets[0]);
        Alert.alert('Success', 'Image selected successfully!');
      } else {
        console.log('No image selected');
        Alert.alert('Info', 'No image was selected');
      }
    } catch (error) {
      console.error('Error in image picker:', error);
      Alert.alert('Error', `Image picker failed: ${error.message}`);
    }
  };

  const testCamera = async () => {
    try {
      console.log('=== Testing Camera ===');
      
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      console.log('Camera permission status:', status);
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera permission is required');
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      console.log('Camera result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        console.log('Photo taken successfully:', result.assets[0]);
        setSelectedImage(result.assets[0]);
        Alert.alert('Success', 'Photo taken successfully!');
      } else {
        console.log('No photo taken');
        Alert.alert('Info', 'No photo was taken');
      }
    } catch (error) {
      console.error('Error in camera:', error);
      Alert.alert('Error', `Camera failed: ${error.message}`);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 30,
      textAlign: 'center',
    },
    button: {
      backgroundColor: colors.primary,
      padding: 15,
      borderRadius: 8,
      marginBottom: 15,
      alignItems: 'center',
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    imageContainer: {
      marginTop: 20,
      alignItems: 'center',
    },
    selectedImage: {
      width: 300,
      height: 200,
      borderRadius: 8,
      marginTop: 10,
    },
    infoText: {
      color: colors.text,
      fontSize: 16,
      marginBottom: 20,
      textAlign: 'center',
    },
    statusText: {
      color: colors.textSecondary,
      fontSize: 14,
      marginTop: 10,
      textAlign: 'center',
    },
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Image Upload Test</Text>
      
      <Text style={styles.infoText}>
        This screen helps test if the image upload functionality is working properly.
        Check the console logs for detailed information.
      </Text>

      <TouchableOpacity style={styles.button} onPress={testImagePicker}>
        <Text style={styles.buttonText}>Test Gallery Picker</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={testCamera}>
        <Text style={styles.buttonText}>Test Camera</Text>
      </TouchableOpacity>

      {selectedImage && (
        <View style={styles.imageContainer}>
          <Text style={styles.statusText}>Selected Image:</Text>
          <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
          <Text style={styles.statusText}>
            URI: {selectedImage.uri.substring(0, 50)}...
          </Text>
        </View>
      )}

      <Text style={styles.statusText}>
        Check the console/terminal for detailed logs
      </Text>
    </ScrollView>
  );
};

export default ImageTestScreen;
