// SimpleEmailInputWithHistory.js - Simple Firebase email input (Alternative)
import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db, auth } from '../../services/firebase/firebaseConfig';

const SimpleEmailInputWithHistory = ({ value, onChangeText, style, colors, ...props }) => {
  const [emails, setEmails] = useState([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        // Check if user is authenticated before fetching from Firebase
        if (!auth.currentUser) {
          console.warn('User not authenticated, cannot fetch email history');
          setEmails([]);
          return;
        }

        const q = query(collection(db, 'recentEmails'), orderBy('timestamp', 'desc'), limit(5));
        const snapshot = await getDocs(q);
        const fetchedEmails = snapshot.docs.map(doc => doc.data().email);
        setEmails(fetchedEmails);
      } catch (error) {
        console.error('Error fetching emails:', error);
        
        if (error.code === 'permission-denied') {
          console.error('Permission denied: Firestore security rules may not allow access to recentEmails collection');
        }
        
        setEmails([]);
      }
    };

    fetchEmails();
  }, []);

  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <TextInput
        {...props}
        style={[styles.input, style]}
        value={value}
        onChangeText={(text) => {
          onChangeText(text);
          setShowList(true);
        }}
        onFocus={() => setShowList(true)}
        onBlur={() => setTimeout(() => setShowList(false), 200)}
      />
      {showList && emails.length > 0 && (
        <View style={styles.dropdown}>
          <FlatList
            data={emails.filter(e => e.toLowerCase().includes(value?.toLowerCase() || ''))}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.emailItem}
                onPress={() => {
                  onChangeText(item);
                  setShowList(false);
                }}
              >
                <Text style={[styles.emailText, { color: colors?.text || '#000' }]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            style={styles.list}
          />
        </View>
      )}
    </View>
  );
};

const getStyles = (colors) => StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  input: {
    borderWidth: 1,
    borderColor: colors?.border || '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: colors?.inputBackground || '#fff',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors?.cardBackground || '#fff',
    borderWidth: 1,
    borderColor: colors?.border || '#ccc',
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    maxHeight: 200,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  list: {
    maxHeight: 200,
  },
  emailItem: {
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors?.border || '#eee',
  },
  emailText: {
    fontSize: 14,
  },
});

export default SimpleEmailInputWithHistory; 