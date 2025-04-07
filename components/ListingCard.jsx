import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CachedImage from "react-native-expo-cached-image";

const ListingCard = ({ item, onPress, onEdit, onDelete }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <CachedImage source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.details}>
          Area: {item.areaSize} | Rooms: {item.rooms}
        </Text>
        <Text style={styles.details}>Price: ${item.price}/month</Text>
        {(onEdit || onDelete) && (
          <View style={styles.actions}>
            {onEdit && (
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={onEdit}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={onDelete}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 6,
    overflow: "hidden",
  },
  image: { width: 100, height: 100 },
  info: { flex: 1, padding: 8, justifyContent: "center" },
  title: { fontSize: 16, fontWeight: "500" },
  details: { fontSize: 14, color: "#555" },card: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12, // Rounded corners for a modern look
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    height: 160, // Slightly taller card for better spacing
  },
  image: { 
    width: 130, // Slightly larger image
    height: "100%", 
    borderTopLeftRadius: 12, // Match card's rounded corners
    borderBottomLeftRadius: 12, 
  },
  info: { 
    flex: 1, 
    padding: 16, 
    justifyContent: "space-between", 
    backgroundColor: "#f9f9f9", // Subtle background for text area
  },
  title: { 
    fontSize: 20, 
    fontWeight: "700", 
    color: "#34495e", // Darker text for better readability
    marginBottom: 6, 
  },
  description: { 
    fontSize: 14, 
    color: "#7f8c8d", 
    marginBottom: 8, 
  },
  details: { 
    fontSize: 14, 
    color: "#2c3e50", 
    marginBottom: 4, 
  },
  actions: { flexDirection: "row", marginTop: 8 },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
  },
  editButton: { backgroundColor: "#4CAF50" },
  deleteButton: { backgroundColor: "#F44336" },
  buttonText: { color: "#fff", fontSize: 14 },
});

export default ListingCard;