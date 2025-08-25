import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../utils/theme';

export const NetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [showOfflineBar, setShowOfflineBar] = useState(false);
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      
      if (!state.isConnected) {
        setShowOfflineBar(true);
      } else {
        // Hide offline bar after a delay when back online
        setTimeout(() => setShowOfflineBar(false), 2000);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!showOfflineBar) {
    return null;
  }

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: isConnected ? colors.success : colors.error 
      }
    ]}>
      <Text style={[styles.text, { color: 'white' }]}>
        {isConnected ? 'Back Online' : 'No Internet Connection'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 8,
    paddingHorizontal: 16,
    zIndex: 1000,
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 