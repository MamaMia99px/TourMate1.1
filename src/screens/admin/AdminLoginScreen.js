import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../utils/theme';
import AdminAuthService from '../../services/auth/AdminAuthService';

const { width, height } = Dimensions.get('window');

const AdminLoginScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    
    try {
      const result = await AdminAuthService.loginAsAdmin(email.trim(), password);
      
      if (result.success && result.isAdmin) {
        // Navigate to admin dashboard
        navigation.replace('AdminDashboard');
      } else {
        const errorMessage = result.error?.message || 'Invalid credentials or insufficient privileges';
        Alert.alert('Access Denied', errorMessage);
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      minHeight: height,
      minWidth: '100%',
    },
    content: {
      paddingHorizontal: 32,
      paddingVertical: 40,
      minWidth: '100%',
    },
    headerSection: {
      alignItems: 'center',
      marginBottom: 48,
    },
    logoContainer: {
      width: 80,
      height: 80,
      borderRadius: 20,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
    logoText: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 8,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 16,
      color: colors.secondaryText,
      textAlign: 'center',
      lineHeight: 24,
      maxWidth: 280,
    },
    formSection: {
      marginBottom: 32,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
      letterSpacing: 0.5,
    },
    input: {
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 16,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border || '#E0E0E0',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    inputFocused: {
      borderColor: colors.primary,
      shadowColor: colors.primary,
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    loginButton: {
      borderRadius: 12,
      paddingVertical: 18,
      alignItems: 'center',
      marginTop: 8,
      marginBottom: 24,
      backgroundColor: colors.accent,
      shadowColor: colors.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    loginButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      letterSpacing: 0.5,
    },
    disabledButton: {
      opacity: 0.6,
    },
    backButton: {
      alignItems: 'center',
      paddingVertical: 16,
    },
    backButtonText: {
      color: colors.accent,
      fontSize: 15,
      fontWeight: '500',
      letterSpacing: 0.3,
    },
    infoCard: {
      backgroundColor: colors.cardBackground,
      padding: 20,
      borderRadius: 16,
      marginBottom: 32,
      borderLeftWidth: 4,
      borderLeftColor: colors.accent,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    infoTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.accent,
      marginBottom: 8,
      letterSpacing: 0.3,
    },
    infoText: {
      fontSize: 14,
      color: colors.secondaryText,
      lineHeight: 20,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border || '#E0E0E0',
      marginVertical: 24,
      opacity: 0.5,
    }
  });

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
        bounces={true}
        alwaysBounceVertical={false}
        nestedScrollEnabled={true}
      >
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>A</Text>
            </View>
            <Text style={styles.title}>Admin Access</Text>
            <Text style={styles.subtitle}>
              Cebu Tourist App Management Portal
            </Text>
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Administrator Access Required</Text>
            <Text style={styles.infoText}>
              This portal is restricted to authorized administrators only. 
              Please use your official admin credentials to access the content management system.
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>ADMIN EMAIL</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your admin email"
                placeholderTextColor={colors.secondaryText}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>PASSWORD</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={colors.secondaryText}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password"
              />
            </View>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={loading}
            >
              <LinearGradient
                colors={[colors.primary, colors.secondary || colors.primary]}
                style={[styles.loginButton, { backgroundColor: 'transparent' }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.loginButtonText}>ACCESS ADMIN PANEL</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Back Button - Only show on mobile platforms */}
          {Platform.OS !== 'web' && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>Back to Application</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AdminLoginScreen; 