// app/(app)/listing/[id].jsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import CachedImage from 'react-native-expo-cached-image';
import { useAuth } from '../../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

export default function ListingDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);

  useEffect(() => {
    const loadListing = async () => {
      if (!id) return;

      try {
        const storedListing = await AsyncStorage.getItem(`listing_${id}`);
        if (storedListing) {
          setListing(JSON.parse(storedListing));
          return;
        }
      } catch (error) {
        console.error('Error reading listing from AsyncStorage:', error);
      }

      const docSnap = await getDoc(doc(db, 'listings', id));
      if (docSnap.exists()) {
        const listingData = { id: docSnap.id, ...docSnap.data() };
        setListing(listingData);
        try {
          await AsyncStorage.setItem(`listing_${id}`, JSON.stringify(listingData));
        } catch (error) {
          console.error('Error storing listing to AsyncStorage:', error);
        }
      } else {
        setListing(null);
      }
    };
    loadListing();
  }, [id]);

  if (!listing) {
    return (
      <>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading listing...</Text>
      </>
      
    );
  }

  const isOwner = user && listing.ownerId === user.uid;

  return (
    <LinearGradient colors={['#141E30', '#243B55']} style={styles.gradientContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <CachedImage source={{ uri: listing.imageUrl }} style={styles.image} />
        <Text style={styles.description}>{listing.description}</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.info}>Area Size: {listing.areaSize}</Text>
          <Text style={styles.info}>Rooms: {listing.rooms}</Text>
          <Text style={styles.info}>Price per Month: ${listing.price}</Text>
        </View>
        {isOwner && (
          <View style={styles.ownerActions}>
            <View style={styles.buttonWrapper}>
              <Button title="Edit Listing" color="#4CAF50" onPress={() => router.push(`/realtor/edit/${listing.id}`)} />
            </View>
            <View style={styles.buttonWrapper}>
              <Button title="Delete Listing" color="#F44336" onPress={() => Alert.alert('Delete', 'Delete functionality not implemented here')} />
            </View>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#141E30',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingText: {
    marginTop: 15,
    color: '#fff',
    fontSize: 18
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10
  },
  description: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoContainer: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    color: '#eee',
    textAlign: 'center',
    marginVertical: 5,
  },
  ownerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  }
});
