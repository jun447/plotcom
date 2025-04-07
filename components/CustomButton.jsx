import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import theme from './theme';

export default function CustomButton({ title, onPress, disabled, style, textStyle }) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress} disabled={disabled}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing(1.5),
    borderRadius: theme.borderRadius,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});