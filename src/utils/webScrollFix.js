import { Platform } from 'react-native';

/**
 * Fixes web scrolling issues by applying proper CSS properties
 * This function should be called when the app initializes on web
 */
export const fixWebScrolling = () => {
  if (Platform.OS === 'web') {
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.body.style.margin = '0';
    document.body.style.padding = '0';

    // Ensure root element has proper dimensions
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.style.height = '100vh';
      rootElement.style.overflow = 'hidden';
    }

    // Add event listeners to prevent default scroll behavior on body
    document.addEventListener('wheel', (e) => {
      // Allow scrolling only within ScrollView components
      const target = e.target;
      const scrollView = target.closest('[data-testid="scroll-view"]');
      if (!scrollView) {
        e.preventDefault();
      }
    }, { passive: false });

    // Fix for touch devices
    document.addEventListener('touchmove', (e) => {
      const target = e.target;
      const scrollView = target.closest('[data-testid="scroll-view"]');
      if (!scrollView) {
        e.preventDefault();
      }
    }, { passive: false });
  }
};

/**
 * Ensures ScrollView components have proper web styling
 * @param {Object} scrollViewRef - Reference to the ScrollView component
 */
export const ensureScrollViewWorks = (scrollViewRef) => {
  if (Platform.OS === 'web' && scrollViewRef) {
    // Add a small delay to ensure the component is rendered
    setTimeout(() => {
      if (scrollViewRef.current) {
        const element = scrollViewRef.current;
        element.style.overflow = 'auto';
        element.style.height = '100vh';
        element.style.maxHeight = '100vh';
      }
    }, 100);
  }
};

/**
 * Applies web-specific styles to a ScrollView
 * @param {Object} styles - The styles object to modify
 * @returns {Object} - Modified styles with web-specific properties
 */
export const getWebScrollViewStyles = (styles) => {
  if (Platform.OS === 'web') {
    return {
      ...styles,
      overflow: 'auto',
      height: '100vh',
      maxHeight: '100vh',
    };
  }
  return styles;
};
