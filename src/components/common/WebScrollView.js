import React from 'react';
import { ScrollView, Platform } from 'react-native';

/**
 * WebScrollView - A ScrollView wrapper that ensures proper scrolling on web platforms
 * This component applies web-specific styles and behaviors to fix common scrolling issues
 */
const WebScrollView = ({ 
  children, 
  style, 
  contentContainerStyle, 
  testID = "scroll-view",
  ...props 
}) => {
  const webStyle = Platform.OS === 'web' ? {
    overflow: 'auto',
    height: '100vh',
    maxHeight: '100vh',
    ...style,
  } : style;

  const webContentStyle = Platform.OS === 'web' ? {
    minHeight: '100%',
    ...contentContainerStyle,
  } : contentContainerStyle;

  return (
    <ScrollView
      style={webStyle}
      contentContainerStyle={webContentStyle}
      testID={testID}
      showsVerticalScrollIndicator={true}
      showsHorizontalScrollIndicator={true}
      bounces={true}
      alwaysBounceVertical={false}
      nestedScrollEnabled={true}
      keyboardShouldPersistTaps="handled"
      {...props}
    >
      {children}
    </ScrollView>
  );
};

export default WebScrollView;
