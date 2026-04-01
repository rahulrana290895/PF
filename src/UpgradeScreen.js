import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function UpgradeScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/upgrade.png')}
        style={styles.image}
      />

      <Text style={styles.title}>Plan Expired 😔</Text>

      <Text style={styles.subtitle}>
        Your subscription has expired. Please upgrade to continue.
      </Text>

        <Text style={styles.title2}>Upgrade Now For Continue Service</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff'
  },

  title: {
    fontSize: 25,
    fontWeight: '700',
    color: '#e53935',
    marginBottom: 10
  },
  title2: {
    fontSize: 20,
    fontWeight: '700',
    color: 'teal',
  },

  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20
  },

  button: {
    backgroundColor: 'teal',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700'
  },
    image: {
      width: 350,
      height: 270,
      alignSelf: 'center',
      marginBottom: 10,
      resizeMode: 'contain',
    },

});