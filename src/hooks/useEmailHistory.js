// useEmailHistory.js - Custom hook for email history with Firebase (SRP + DIP)
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import FirebaseEmailHistoryService from '../services/storage/FirebaseEmailHistoryService';
import EmailHistoryService from '../services/storage/EmailHistoryService';
import { auth } from '../services/firebase/firebaseConfig';

const useEmailHistory = (currentValue) => {
  const [emailHistory, setEmailHistory] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [authStateReady, setAuthStateReady] = useState(false);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
      setAuthStateReady(true);
      // Reload email history when auth state changes
      loadEmailHistory();
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    // Only load history after auth state is determined
    if (authStateReady) {
      loadEmailHistory();
    }
  }, [authStateReady]);

  useEffect(() => {
    filterEmails(currentValue);
  }, [currentValue, emailHistory]);

  const loadEmailHistory = async () => {
    try {
      let history = [];
      
      // Try Firebase first if user is authenticated
      if (auth.currentUser) {
        try {
          history = await FirebaseEmailHistoryService.getEmailHistory();
          console.log('Email history loaded from Firebase:', history.length, 'emails');
        } catch (firebaseError) {
          console.warn('Firebase email history failed, falling back to AsyncStorage:', firebaseError.message);
          // Fallback to AsyncStorage if Firebase fails
          history = await EmailHistoryService.getEmailHistory();
          console.log('Email history loaded from AsyncStorage (Firebase fallback):', history.length, 'emails');
        }
      } else {
        // Use AsyncStorage if user is not authenticated
        console.log('User not authenticated, using AsyncStorage for email history');
        history = await EmailHistoryService.getEmailHistory();
        console.log('Email history loaded from AsyncStorage:', history.length, 'emails');
      }
      
      setEmailHistory(history || []);
    } catch (error) {
      console.error('Error loading email history:', error);
      setEmailHistory([]);
    }
  };

  const filterEmails = (value) => {
    if (value && value.length > 0) {
      const filtered = emailHistory.filter(email =>
        email.toLowerCase().includes(value.toLowerCase()) && 
        email.toLowerCase() !== value.toLowerCase()
      );
      setFilteredEmails(filtered);
    } else {
      setFilteredEmails(emailHistory);
    }
  };

  const removeEmail = async (email) => {
    try {
      // Try Firebase first if user is authenticated
      if (auth.currentUser) {
        try {
          await FirebaseEmailHistoryService.removeEmail(email);
          console.log('Email removed from Firebase');
        } catch (firebaseError) {
          console.warn('Firebase remove failed, falling back to AsyncStorage:', firebaseError.message);
          await EmailHistoryService.removeEmail(email);
          console.log('Email removed from AsyncStorage');
        }
      } else {
        // Use AsyncStorage if user is not authenticated
        await EmailHistoryService.removeEmail(email);
        console.log('Email removed from AsyncStorage');
      }
      
      await loadEmailHistory();
    } catch (error) {
      console.error('Error removing email:', error);
    }
  };

  return {
    filteredEmails,
    removeEmail,
    refreshHistory: loadEmailHistory,
    authStateReady
  };
};

export default useEmailHistory; 