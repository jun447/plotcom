import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useRouter } from "expo-router";
import CustomInput from "../../../components/CustomInput";
import ListingCard from "../../../components/ListingCard";
import Header from "../../../components/Header";
import {useListing} from "../../../hooks/useListing"

export default function CustomerHomeScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("description");

  const { listings} = useListing({ orderByField: 'createdAt' });


  const filteredListings = listings.filter((item) => {
    const term = search.toLowerCase();
    if (selectedFilter === "description") {
      return item.description && item.description.toLowerCase().includes(term);
    } else if (selectedFilter === "rooms") {
      return item.rooms && item.rooms.toString().includes(term);
    } else if (selectedFilter === "price") {
      return item.price && item.price.toString().includes(term);
    } else if (selectedFilter === "area") {
      return item.area && item.area.toString().includes(term);
    }
    return false;
  });

  const renderListing = ({ item }) => (
    <ListingCard
      item={item}
      onPress={() => router.push(`/listing/${item.id}`)}
    />
  );

  const RadioButton = ({ label, value }) => (
    <TouchableOpacity
      style={styles.radioButton}
      onPress={() => setSelectedFilter(value)}
    >
      <View style={styles.radioCircle}>
        {selectedFilter === value && <View style={styles.selectedRb} />}
      </View>
      <Text style={styles.radioText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Browse Listings" router={router} />
      <CustomInput
        style={styles.searchBox}
        placeholder="Enter search term"
        value={search}
        onChangeText={setSearch}
      />
      <View style={styles.radioContainer}>
        <RadioButton label="Description" value="description" />
        <RadioButton label="Rooms" value="rooms" />
        <RadioButton label="Price" value="price" />
        <RadioButton label="Area" value="area" />
      </View>
      <FlatList
        data={filteredListings}
        keyExtractor={(item) => item.id}
        renderItem={renderListing}
        ListEmptyComponent={
          <Text style={styles.empty}>No listings found.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  searchBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginVertical: 12,
    padding: 8,
  },
  radioContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#777",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#777",
  },
  radioText: {
    fontSize: 14,
    color: "#000",
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#777",
  },
});
