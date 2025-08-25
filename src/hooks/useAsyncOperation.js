import { useState, useCallback } from 'react';
import { ErrorHandler } from '../utils/ErrorHandler';

export const useAsyncOperation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (asyncFunction, options = {}) => {
    const {
      showError = true,
      loadingMessage = 'Loading...',
      successMessage = null,
      context = 'AsyncOperation'
    } = options;

    try {
      setLoading(true);
      setError(null);
      
      const result = await asyncFunction();
      
      if (successMessage) {
        // Could add toast notification here
        console.log(successMessage);
      }
      
      return { success: true, data: result };
    } catch (err) {
      setError(err);
      ErrorHandler.logError(err, context);
      
      if (showError) {
        ErrorHandler.showUserFriendlyError(err, context);
      }
      
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const retry = useCallback((asyncFunction, options = {}) => {
    return execute(asyncFunction, options);
  }, [execute]);

  return {
    loading,
    error,
    execute,
    retry,
    clearError: () => setError(null)
  };
}; 