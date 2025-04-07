import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  Alert, 
  Text, 
  Image 
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { db, storage } from '../../../firebaseConfig';
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../../components/CustomButton';

export default function NewListingScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [description, setDescription] = useState('');
  const [areaSize, setAreaSize] = useState('');
  const [rooms, setRooms] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Function to launch image picker
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });
      if (!result.canceled) {
        console.log("Image selected:", result.assets[0].uri);
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Image Picker Error", error.message);
    }
  };

  // Function to compress image (reducing file size)
  const compressImage = async (uri) => {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      console.log("Image compressed to:", manipResult.uri);
      return manipResult.uri;
    } catch (error) {
      console.error("Error compressing image:", error);
      return uri; 
    }
  };
  



  const handleCreateListing = async () => {
    if (!user) {
      Alert.alert("Error", "User not logged in.");
      return;
    }
    if (!description || !areaSize || !rooms || !price || !imageUri) {
      Alert.alert('Missing Info', 'Please fill all fields and select an image.');
      return;
    }
    setUploading(true);
    try {
      const compressedUri = await compressImage(imageUri);
      console.log("Compressed image URI:", compressedUri);
      
      // Fetch the image as a blob
      console.log("Attempting to fetch URI...");
      const response = await fetch(compressedUri);
      console.log("Fetch response status:", response.status); // Log status
      console.log("Attempting to create blob...");

      const blob = await response.blob();
      console.log("Blob created, size:", blob.size, "type:", blob.type); // Log blob info

      // Create a new Firestore document reference
      console.log("Creating new document reference...");
      
      const listingRef = doc(collection(db, 'listings'));
      const listingId = listingRef.id;
      console.log("New listing ID:", listingId);
      
      // Upload the image to Firebase Storage at a path based on the listingId
      const imageRef = ref(storage, `listings/${listingId}`);
      console.log("Uploading image to storage at:", imageRef.fullPath);
      await uploadBytes(imageRef, blob);
      console.log("Image upload complete");
      
      // Get the download URL for the uploaded image
      const downloadUrl = await getDownloadURL(imageRef);
      console.log("Download URL received:", downloadUrl);
      
      // Save the listing data to Firestore with all required fields
      await setDoc(listingRef, {
        description,
        areaSize,
        rooms: parseInt(rooms, 10),
        price: parseFloat(price),
        imageUrl: downloadUrl,
        ownerId: user.uid,
        createdAt: Timestamp.now()
      });
      // cached lsting to async Storage
      try {
        const cachedData = await AsyncStorage.getItem('listings');
        const listings = cachedData ? JSON.parse(cachedData) : [];
        listings.push({
          id: listingId,
          description,
          areaSize,
          rooms: parseInt(rooms, 10),
          price: parseFloat(price),
          imageUrl: downloadUrl,
          ownerId: user.uid,
          createdAt: new Date().toISOString(),
        });
        await AsyncStorage.setItem('listings', JSON.stringify(listings));
      } catch (error) {
        console.error('Error caching listing:', error);
      }

      console.log('Success', 'Listing created!');
      //caching this document to async

      router.back(); 
    } catch (err) {
      console.error("Error during listing creation:", err);
      Alert.alert('Upload Error', err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>New Listing</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Description" 
        value={description} 
        onChangeText={setDescription} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Area Size (e.g., 1000 sqft)" 
        value={areaSize} 
        onChangeText={setAreaSize} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Number of Rooms" 
        keyboardType="numeric"
        value={rooms} 
        onChangeText={setRooms} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Price per Month" 
        keyboardType="numeric"
        value={price} 
        onChangeText={setPrice} 
      />
      <View style={styles.imagePicker}>
        {imageUri ? <Image source={{ uri: imageUri }} style={styles.imagePreview} /> : null}
        <CustomButton title="Choose Image" onPress={pickImage} />
      </View>
      <CustomButton 
        title={uploading ? "Uploading..." : "Create Listing"} 
        onPress={handleCreateListing} 
        disabled={uploading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#fff' 
  },
  header: { 
    fontSize: 18, 
    fontWeight: '600', 
    marginBottom: 12 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 4, 
    padding: 8, 
    marginBottom: 10 
  },
  imagePicker: { 
    marginBottom: 12, 
    alignItems: 'center' 
  },
  imagePreview: { 
    width: 100, 
    height: 100, 
    marginBottom: 8, 
    borderRadius: 4 
  }
});
