import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';
import CustomButton from '../../components/CustomButton';

export default function ProfileScreen() {
  const { user, role, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Card style={styles.profileCard}>
        <Text style={styles.title}>Profile Information</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.info}>{user?.email}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Role:</Text>
          <Text style={styles.info}>{role}</Text>
        </View>
        <CustomButton 
          title="Sign Out" 
          onPress={() => signOut()} 
          style={styles.signOutButton}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16,
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  profileCard: {
    width: '90%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    width: 80,
  },
  info: { 
    fontSize: 16,
    flex: 1,
  },
  signOutButton: {
    marginTop: 20,
    backgroundColor: '#e74c3c',
  }
});