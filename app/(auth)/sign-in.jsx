import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

export default function SignInScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  const handleSignIn = async () => {
    if (isLoading) return;

    const trimmedEmail = email.trim();
    const trimmedPassword = password;
    
    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert("Validation Error", "Please enter both email and password.");
      return;
    }
    if (!validateEmail(trimmedEmail)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }
    
    try {
      setIsLoading(true);
      await signIn(trimmedEmail, trimmedPassword);
      console.log('Sign-in initiated');
    } catch (err) {
      console.error("Sign In Error:", err);
      Alert.alert('Sign In Failed', err.message || "An unexpected error occurred.");
      setIsLoading(false); 
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to PlotCom</Text>
      <CustomInput 
        placeholder="Email" 
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        editable={!isLoading}
      />
      <CustomInput 
        placeholder="Password" 
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!isLoading}
      />
      <CustomButton 
        title={isLoading ? 'Signing In...' : 'Sign In'} 
        onPress={handleSignIn}
        disabled={isLoading}
      />
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#1abc9c" />
          <Text style={styles.loadingText}>Signing in...</Text>
        </View>
      )}
      <Text style={styles.switchText}>
        No account? <Link href="/sign-up">Sign Up</Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20,
    position: 'relative'
  },
  title: { 
    fontSize: 24, 
    fontWeight: '600', 
    marginBottom: 16, 
    textAlign: 'center' 
  },
  switchText: { 
    marginTop: 10, 
    textAlign: 'center' 
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333'
  }
});