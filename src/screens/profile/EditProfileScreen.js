import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../../services/firebase/firebaseConfig';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../utils/theme';

const EditProfileScreen = ({ navigation, route }) => {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const styles = getStyles(colors, isDarkMode);
  
  const userData = route.params?.userData || {};
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: userData.fullName || userData.displayName || userData.name || 'Guest User',
    email: userData.email || 'guest@example.com',
    phone: userData.phone || '',
    location: userData.location || 'Cebu City, Philippines',
    avatar: userData.avatar || ''
  });

  const handleSave = async () => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'You must be logged in to update your profile.');
      return;
    }

    setIsLoading(true);
    
    try {
      const user = auth.currentUser;
      
      // Update Firebase Auth profile (display name only, avatar stored in Firestore)
      await updateProfile(user, {
        displayName: profileData.name
        // Note: photoURL removed because base64 images are too long for Firebase Auth
      });

      // Update Firestore user document
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        fullName: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        location: profileData.location,
        avatar: profileData.avatar,
        updatedAt: new Date().toISOString(),
        uid: user.uid
      }, { merge: true }); // merge: true means update existing fields, don't overwrite the whole document

      Alert.alert(
        'Profile Updated',
        'Your profile has been successfully updated!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate back and trigger a refresh of the profile screen
              navigation.navigate('Profile', { 
                refresh: true,
                userData: {
                  ...userData,
                  fullName: profileData.name,
                  email: profileData.email,
                  phone: profileData.phone,
                  location: profileData.location,
                  avatar: profileData.avatar
                }
              });
            }
          }
        ]
      );
    } catch (error) {
      console.error('Profile save error:', error);
      Alert.alert(
        'Error', 
        'Failed to update profile. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const convertImageToBase64 = async (uri) => {
    try {
      console.log('Converting image to base64 for user:', auth.currentUser.uid);
      
      // Import the simple image service
      const SimpleImageService = require('../../services/image/SimpleImageService').default;
      
      // Convert to base64 using our simple service
      const result = await SimpleImageService.convertToBase64(uri);
      
      if (result.success) {
        console.log('Base64 conversion successful');
        return result.base64;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Base64 conversion error:', error);
      throw new Error(`Image processing failed: ${error.message}`);
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access gallery is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5, // Reduced quality to avoid size issues
        base64: false,
        exif: false,
      });

      if (!result.canceled && result.assets[0]) {
        setIsLoading(true);
        try {
          const base64Avatar = await convertImageToBase64(result.assets[0].uri);
          setProfileData({...profileData, avatar: base64Avatar});
          Alert.alert('Success', 'Profile picture updated!');
        } catch (error) {
          Alert.alert('Error', 'Failed to process image. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error('Gallery error:', error);
      Alert.alert('Error', 'Failed to open gallery.');
    }
  };

  const pickImageFromCamera = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera is required!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5, // Reduced quality to avoid size issues
        base64: false,
        exif: false,
      });

      if (!result.canceled && result.assets[0]) {
        setIsLoading(true);
        try {
          const base64Avatar = await convertImageToBase64(result.assets[0].uri);
          setProfileData({...profileData, avatar: base64Avatar});
          Alert.alert('Success', 'Profile picture updated!');
        } catch (error) {
          Alert.alert('Error', 'Failed to process image. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to open camera.');
    }
  };

  const handleChangeAvatar = () => {
    Alert.alert(
      'Change Profile Picture',
      'Choose an option',
      [
        { text: 'Camera', onPress: pickImageFromCamera },
        { text: 'Gallery', onPress: pickImageFromGallery },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: '#fff' }]}> 
      <View accessible={true} accessibilityLabel="Edit Profile Screen">
        <View style={styles.profileImageSection}>
          <TouchableOpacity onPress={handleChangeAvatar} style={styles.avatarContainer}>
            <Image
              source={{ uri: profileData.avatar }}
              style={styles.avatar}
              accessible={true}
              accessibilityRole="image"
              accessibilityLabel={`Current profile picture of ${profileData.name}`}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleChangeAvatar}>
            <Text style={styles.uploadPhotoText}>Upload Photo</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.formFlat}>
          <Text style={styles.labelFlat}>Name</Text>
          <TextInput
            style={styles.inputFlat}
            value={profileData.name}
            onChangeText={(text) => setProfileData({...profileData, name: text})}
            placeholder="Enter your full name"
          />
          <View style={styles.row2col}>
            <View style={styles.col2}>
              <Text style={styles.labelFlat}>Birth Date</Text>
              <TextInput
                style={styles.inputFlat}
                value={profileData.birthDate || ''}
                onChangeText={(text) => setProfileData({...profileData, birthDate: text})}
                placeholder="MM/DD/YYYY"
              />
            </View>
            <View style={styles.col2}>
              <Text style={styles.labelFlat}>Gender</Text>
              <TextInput
                style={styles.inputFlat}
                value={profileData.gender || ''}
                onChangeText={(text) => setProfileData({...profileData, gender: text})}
                placeholder="Gender"
              />
            </View>
          </View>
          <Text style={styles.labelFlat}>Email</Text>
          <TextInput
            style={styles.inputFlat}
            value={profileData.email}
            onChangeText={(text) => setProfileData({...profileData, email: text})}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Text style={styles.labelFlat}>Mobile</Text>
          <TextInput
            style={styles.inputFlat}
            value={profileData.phone}
            onChangeText={(text) => setProfileData({...profileData, phone: text})}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />
          <View style={styles.row2col}>
            <View style={styles.col2}>
              <Text style={styles.labelFlat}>Country</Text>
              <TextInput
                style={styles.inputFlat}
                value={profileData.country || ''}
                onChangeText={(text) => setProfileData({...profileData, country: text})}
                placeholder="Country"
              />
            </View>
            <View style={styles.col2}>
              <Text style={styles.labelFlat}>Zip Code</Text>
              <TextInput
                style={styles.inputFlat}
                value={profileData.zipCode || ''}
                onChangeText={(text) => setProfileData({...profileData, zipCode: text})}
                placeholder="Zip Code"
                keyboardType="numeric"
              />
            </View>
          </View>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={isLoading}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Save Changes"
            accessibilityHint="Save your profile changes"
            accessibilityState={{ disabled: isLoading }}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const getStyles = (colors, isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  topBarSaveOnly: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 40,
    paddingHorizontal: 18,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  saveButtonTop: {
    padding: 4,
  },
  saveButtonTopText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#377DFF',
  },
  profileImageSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: '#eee',
  },
  uploadPhotoText: {
    color: '#377DFF',
    fontWeight: '600',
    fontSize: 16,
    marginTop: 10,
  },
  formFlat: {
    paddingHorizontal: 18,
    paddingBottom: 30,
  },
  labelFlat: {
    fontSize: 15,
    color: '#888',
    marginBottom: 2,
    marginTop: 18,
    fontWeight: '500',
  },
  inputFlat: {
    fontSize: 18,
    color: '#222',
    fontWeight: '700',
    backgroundColor: '#fff',
    borderWidth: 0,
    borderBottomWidth: 1.5,
    borderColor: '#eee',
    borderRadius: 0,
    paddingVertical: 8,
    marginBottom: 2,
  },
  row2col: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  col2: {
    flex: 1,
    marginRight: 10,
  },
  saveButton: {
    padding: 16,
    backgroundColor: '#377DFF',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default EditProfileScreen; 