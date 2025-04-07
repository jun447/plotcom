import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import CustomButton from './CustomButton';
const Header = ({ title, router }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>{title}</Text>
            <CustomButton
                 title="Profile"
                 onPress={() => router.push("profile")}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    header: {
        fontSize: 20,
        fontWeight: "bold"
    }
});

export default Header;