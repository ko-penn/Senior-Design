import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

const Spinner = ({ children }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <View style={styles.textContainer}>
        <Text>{children}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginTop: 20, // Adjust spacing as needed
  },
});

export default Spinner;