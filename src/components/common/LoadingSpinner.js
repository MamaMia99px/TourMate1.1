import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../utils/theme';

export const LoadingSpinner = ({ 
  size = 'large', 
  message = 'Loading...', 
  overlay = false,
  style = {} 
}) => {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  const containerStyle = overlay ? 
    [styles.overlayContainer, { backgroundColor: colors.overlay }] : 
    [styles.container, style];

  return (
    <View style={containerStyle}>
      <ActivityIndicator 
        size={size} 
        color={colors.primary} 
        style={styles.spinner}
      />
      {message && (
        <Text style={[styles.message, { color: colors.text }]}>
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  spinner: {
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
}); 