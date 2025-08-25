import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../services/firebase/firebaseConfig';

export default function FirebaseTest() {
    const testSignUp = async () => {
        try {
            const result = await createUserWithEmailAndPassword(
                auth,
                "test@example.com",
                "SuperSecretPassword!"
            );
            Alert.alert("Success", "Test user created successfully!");
            console.log("Test signup result:", result);
        } catch (error) {
            Alert.alert("Error", error.message);
            console.log("Test signup error:", error);
        }
    };

    const testSignIn = async () => {
        try {
            const result = await signInWithEmailAndPassword(
                auth,
                "test@example.com",
                "SuperSecretPassword!"
            );
            Alert.alert("Success", "Test user signed in successfully!");
            console.log("Test signin result:", result);
        } catch (error) {
            Alert.alert("Error", error.message);
            console.log("Test signin error:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Firebase Integration Test</Text>

            <TouchableOpacity style={styles.button_container} onPress={testSignUp}>
                <Text style={styles.button_text}>Test SignUp</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button_container} onPress={testSignIn}>
                <Text style={styles.button_text}>Test SignIn</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        marginTop: 48,
        padding: 20,
    },
    text: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 24,
        marginBottom: 20,
        color: "#fff",
    },
    button_text: {
        textAlign: "center",
        fontSize: 18,
        color: "#1976d2",
        fontWeight: "bold",
    },
    button_container: {
        borderRadius: 15,
        margin: 16,
        padding: 24,
        justifyContent: "center",
        backgroundColor: "#e6e6e6",
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
}); 