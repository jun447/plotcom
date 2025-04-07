// app/(app)/realtor/edit/[id].jsx
import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Image, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { db, storage } from '../../../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function EditListingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [description, setDescription] = useState('');
  const [areaSize, setAreaSize] = useState('');
  const [rooms, setRooms] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const docSnap = await getDoc(doc(db, 'listings', id));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setDescription(data.description || '');
        setAreaSize(data.areaSize || '');
        setRooms(data.rooms ? String(data.rooms) : '');
        setPrice(data.price ? String(data.price) : '');
        setCurrentImageUrl(data.imageUrl || '');
      }
    };
    fetchData();
  }, [id]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!id) return;
    if (!description || !areaSize || !rooms || !price) {
      Alert.alert('Missing Info', 'Please fill all fields.');
      return;
    }
    try {
      setSaving(true);
      let newImageUrl = currentImageUrl;
      if (imageUri) {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const imageRef = ref(storage, `listings/${id}`);
        await uploadBytes(imageRef, blob);
        newImageUrl = await getDownloadURL(imageRef);
      }
      await updateDoc(doc(db, 'listings', id), {
        description,
        areaSize,
        rooms: parseInt(rooms, 10),
        price: parseFloat(price),
        ...(imageUri ? { imageUrl: newImageUrl } : {})
      });
      Alert.alert('Saved', 'Listing updated.');
      router.back();
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Listing</Text>
      <TextInput 
        style={styles.input} placeholder="Description" 
        value={description} onChangeText={setDescription}
      />
      <TextInput 
        style={styles.input} placeholder="Area Size (e.g., 1000 sqft)" 
        value={areaSize} onChangeText={setAreaSize}
      />
      <TextInput 
        style={styles.input} placeholder="Number of Rooms" 
        keyboardType="numeric"
        value={rooms} onChangeText={setRooms}
      />
      <TextInput 
        style={styles.input} placeholder="Price per Month" 
        keyboardType="numeric"
        value={price} onChangeText={setPrice}
      />
      <View style={styles.imageSection}>
        {(imageUri || currentImageUrl) ? (
          <Image source={{ uri: imageUri || currentImageUrl }} style={styles.imagePreview} />
        ) : null}
        <Button title="Change Image" onPress={pickImage} />
      </View>
      <Button title={saving ? "Saving..." : "Save Changes"} onPress={handleSave} disabled={saving} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, marginBottom: 10 },
  imageSection: { alignItems: 'center', marginBottom: 12 },
  imagePreview: { width: 100, height: 100, marginBottom: 8, borderRadius: 4 }
});
