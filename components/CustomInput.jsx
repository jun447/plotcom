import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default function CustomInput({ style, ...props }) {
  return (
    <TextInput style={[styles.input, style]} {...props} />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
});