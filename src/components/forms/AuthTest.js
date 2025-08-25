import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ScrollView 
} from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase/firebaseConfig';

export default function AuthTest() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const testSignUp = async () => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Success!', `Account created for ${email}`);
      console.log('Signup success:', result.user);
    } catch (error) {
      Alert.alert('Signup Error', error.message);
      console.log('Signup error:', error);
    }
  };

  const testSignIn = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Success!', `Logged in as ${email}`);
      console.log('Login success:', result.user);
    } catch (error) {
      Alert.alert('Login Error', error.message);
      console.log('Login error:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Firebase Auth Test</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={testSignUp}>
        <Text style={styles.buttonText}>Test Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={testSignIn}>
        <Text style={styles.buttonText}>Test Sign In</Text>
      </TouchableOpacity>

      <Text style={styles.note}>
        1. First click "Test Sign Up" to create account{'\n'}
        2. Then you can use "Test Sign In" with same credentials
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#A855F7',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  note: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontStyle: 'italic',
  },
}); 