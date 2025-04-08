// app/(app)/realtor/index.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, Alert, StyleSheet } from "react-native";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, storage } from "../../../firebaseConfig";
import { useAuth } from "../../../context/AuthContext";
import CachedImage from "react-native-expo-cached-image";
import { useRouter } from "expo-router";
import { ref, deleteObject } from "firebase/storage";
import { TouchableOpacity } from "react-native";
import ListingCard from "../../../components/ListingCard";
import Header from "../../../components/Header";
import CustomButton from "../../../components/CustomButton";
import {useListing} from "../../../hooks/useListing";
export default function RealtorHomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { listings: myListings, loading } = useListing({
    filterField: "ownerId",
    filterValue: user?.uid,
    orderByField: "createdAt"
  });

  const handleDelete = async (listingId, imageUrl) => {
    try {
      // Delete listing document
      await deleteDoc(doc(db, "listings", listingId));
      const imageRef = ref(storage, `listings/${listingId}`);
      await deleteObject(imageRef);
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  const renderItem = ({ item }) => (

    <ListingCard
      item={item}
      onPress={() => router.push(`/listing/${item.id}`)}
      onEdit={() => router.push(`/realtor/edit/${item.id}`)}
      onDelete={() => handleDelete(item.id, item.imageUrl)}
    />
  );

  return (
    <View style={styles.container}>
      {/* button to go for profile screen */}
      <Header title="My Listings" router={router} />
      {myListings.length === 0 ? (
        <Text style={styles.empty}>You have no listings. Add one!</Text>
      ) : (
        <FlatList
          data={myListings}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
      <CustomButton
        title="Add New Listing"
        onPress={() => router.push("/realtor/new-listing")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f0f8ff" }, 
  header: { 
    fontSize: 28, 
    fontWeight: "bold", 
    marginBottom: 16, 
    textAlign: "center", 
    color: "#2c3e50", 
    textTransform: "uppercase", 
  },
  empty: { 
    marginVertical: 20, 
    fontStyle: "italic", 
    textAlign: "center", 
    color: "#7f8c8d", 
    fontSize: 16, 
  },
  
});
