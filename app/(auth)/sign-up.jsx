// app/(auth)/sign-up.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

export default function SignUpScreen() {
  const { signUp, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSignUp = async () => {
    if (localLoading) return;
    const trimmedEmail = email.trim();
    const trimmedPassword = password;
    const trimmedConfirm = confirm;

    if (!trimmedEmail || !trimmedPassword || !trimmedConfirm || !role) {
      Alert.alert("Validation Error", "Please fill in all fields and select a role.");
      return;
    }
    if (!validateEmail(trimmedEmail)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }
    if (!validatePassword(trimmedPassword)) {
      Alert.alert("Password Too Short", "Password must be at least 6 characters long.");
      return;
    }
    if (trimmedPassword !== trimmedConfirm) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }
    try {
      setLocalLoading(true);
      await signUp(trimmedEmail, trimmedPassword, role);
    } catch (err) {
      console.error("Sign Up Error:", err);
      Alert.alert('Sign Up Failed', err.message || "An unexpected error occurred.");
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <CustomInput 
        placeholder="Email" 
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <CustomInput 
        placeholder="Password" 
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <CustomInput 
        placeholder="Confirm Password" 
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
      />
      <View style={styles.roleContainer}>
        <CustomButton 
          title={`Customer ${role === 'customer' ? '✔' : ''}`}
          onPress={() => setRole('customer')}
          style={{ backgroundColor: role === 'customer' ? '#16a085' : '#1abc9c' }}
        />
        <CustomButton 
          title={`Realtor ${role === 'realtor' ? '✔' : ''}`}
          onPress={() => setRole('realtor')}
          style={{ backgroundColor: role === 'realtor' ? '#c0392b' : '#1abc9c' }}
        />
      </View>
      <CustomButton 
        title={loading ? 'Registering...' : 'Sign Up'} 
        onPress={handleSignUp}
      />
      <Text style={styles.switchText}>
        Already have an account? <Link href="/sign-in">Sign In</Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, marginBottom: 12 },
  roleContainer: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
  switchText: { marginTop: 10, textAlign: 'center' }
});
