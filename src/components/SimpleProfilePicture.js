import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  Alert, 
  ActivityIndicator, 
  StyleSheet 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase/firebaseConfig';
import SimpleImageService from '../services/image/SimpleImageService';

const SimpleProfilePicture = ({ userId, currentAvatar, onAvatarUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [avatar, setAvatar] = useState(currentAvatar);

  const showImageOptions = () => {
    Alert.alert(
      'Profile Picture',
      'Choose how you want to update your profile picture',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: pickFromGallery },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const takePhoto = async () => {
    const result = await SimpleImageService.takePhoto();
    if (result.success) {
      saveAsBase64(result.uri);
    } else if (!result.canceled) {
      Alert.alert('Error', result.error || 'Failed to take photo');
    }
  };

  const pickFromGallery = async () => {
    const result = await SimpleImageService.pickImage();
    if (result.success) {
      saveAsBase64(result.uri);
    } else if (!result.canceled) {
      Alert.alert('Error', result.error || 'Failed to pick image');
    }
  };

  const saveAsBase64 = async (imageUri) => {
    setUploading(true);
    
    try {
      console.log('Converting image to base64...');
      
      // Convert to base64 and save to Firestore
      const base64Result = await SimpleImageService.convertToBase64(imageUri);
      
      if (base64Result.success) {
        console.log('Base64 conversion successful');
        
        // Update Firestore user document
        await updateDoc(doc(db, 'users', userId), {
          avatar: base64Result.base64
        });
        
        // Update local state
        setAvatar(base64Result.base64);
        
        if (onAvatarUpdate) {
          onAvatarUpdate(base64Result.base64);
        }
        
        Alert.alert('Success!', 'Profile picture updated');
      } else {
        throw new Error(base64Result.error);
      }
      
    } catch (error) {
      console.error('Upload failed:', error);
      Alert.alert('Upload Failed', error.message || 'Please try again');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.avatarContainer} 
        onPress={showImageOptions} 
        disabled={uploading}
      >
        <View style={styles.avatarWrapper}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.placeholderAvatar}>
              <Ionicons name="person" size={50} color="#ccc" />
            </View>
          )}
          
          {uploading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="white" />
              <Text style={styles.loadingText}>Converting...</Text>
            </View>
          )}
          
          <View style={styles.cameraIcon}>
            <Ionicons name="camera" size={16} color="white" />
          </View>
        </View>
      </TouchableOpacity>
      
      <Text style={styles.instructionText}>
        Tap to change profile picture
      </Text>
      
      {uploading && (
        <Text style={styles.uploadingText}>
          Converting image...
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 20,
  },
  avatarContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    position: 'relative',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
    fontWeight: '500',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  instructionText: {
    marginTop: 15,
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  uploadingText: {
    marginTop: 8,
    color: '#007AFF',
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default SimpleProfilePicture; 