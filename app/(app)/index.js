import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { View } from 'react-native';

export default function AppIndex() {
  const { loading } = useAuth();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1abc9c" />
    </View>
  );
}
