import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import CachedImage from "react-native-expo-cached-image";

const ListingCard = ({ item, onPress, onEdit, onDelete }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <CachedImage source={{ uri: item.imageUrl }} style={styles.image} />
      </View>
      <View style={styles.info}>
        <View>
          <Text style={styles.title} numberOfLines={2}>
            {item.description}
          </Text>
          <Text style={styles.details}>
            Area: {item.areaSize} | Rooms: {item.rooms}
          </Text>
          <Text style={styles.details}>Price: ${item.price}/month</Text>
        </View>
        
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

const { width } = Dimensions.get("window");
const isSmallScreen = width < 360;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    minHeight: 120,
  },
  imageContainer: {
    width: isSmallScreen ? 100 : 130,
  },
  image: { 
    flex: 1,
    width: "100%",
    height: "100%",
  },
  info: { 
    flex: 1, 
    padding: 12,
    justifyContent: "space-between", 
    backgroundColor: "#f9f9f9",
  },
  title: { 
    fontSize: isSmallScreen ? 16 : 18, 
    fontWeight: "700", 
    color: "#34495e",
    marginBottom: 4, 
  },
  details: { 
    fontSize: 14, 
    color: "#2c3e50", 
    marginBottom: 4, 
  },
  actions: {
    flexDirection: isSmallScreen ? "column" : "row", 
    marginTop: 8,
    alignItems: "flex-start"
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: isSmallScreen ? 0 : 8,
    marginBottom: isSmallScreen ? 4 : 0,
    minWidth: 70,
    alignItems: "center"
  },
  editButton: { backgroundColor: "#4CAF50" },
  deleteButton: { backgroundColor: "#F44336" },
  buttonText: { color: "#fff", fontSize: 14 },
});

export default ListingCard;