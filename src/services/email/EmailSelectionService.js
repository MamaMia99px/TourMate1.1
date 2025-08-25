// EmailSelectionService.js - Handles email selection logic with Firebase (SRP)
import FirebaseEmailHistoryService from '../storage/FirebaseEmailHistoryService';
import EmailHistoryService from '../storage/EmailHistoryService';

class EmailSelectionService {
  constructor(onEmailSelect, onBlur) {
    this.onEmailSelect = onEmailSelect;
    this.onBlur = onBlur;
    this.isSelecting = false;
  }

  async selectEmail(email, inputRef) {
    console.log('Selecting email:', email);
    
    this.isSelecting = true;
    
    // Save to Firebase for future use with fallback to AsyncStorage
    try {
      await FirebaseEmailHistoryService.addEmail(email);
      console.log('Email saved to Firebase');
    } catch (firebaseError) {
      console.warn('Could not save email to Firebase, trying AsyncStorage:', firebaseError.message);
      try {
        await EmailHistoryService.saveEmail(email);
        console.log('Email saved to AsyncStorage as fallback');
      } catch (asyncStorageError) {
        console.error('Failed to save email to both Firebase and AsyncStorage:', asyncStorageError);
      }
    }
    
    this.onEmailSelect(email);
    
    if (inputRef?.current) {
      inputRef.current.blur();
    }
    
    // Reset flag after selection
    setTimeout(() => {
      this.isSelecting = false;
    }, 100);
  }

  handleBlur(value) {
    setTimeout(() => {
      if (!this.isSelecting && this.onBlur) {
        const syntheticEvent = {
          target: { name: 'email', value },
          currentTarget: { name: 'email', value }
        };
        this.onBlur(syntheticEvent);
      }
    }, 200);
  }

  canProcessBlur() {
    return !this.isSelecting;
  }
}

export default EmailSelectionService; 