import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './config/config';

export default function UpdateLicenseScreen({ setIsLicenseValid }) {
  const [license, setLicense] = useState('');

  const saveLicense = async () => {
    if (!license) {
      Alert.alert("Error", "Enter license key");
      return;
    }

    try {
      const userId = await AsyncStorage.getItem('userId');

      const res = await fetch(`${BASE_URL}check_license.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          license_key: license,
          uid: userId
        }),
      });

      const result = await res.json();

      if (result.status === 'success') {
        await AsyncStorage.setItem('licenseKey', license);
        setIsLicenseValid(true);
      } else {
        Alert.alert("Invalid", "License key not valid");
      }
    } catch (e) {
      Alert.alert("Error", "Server error");
    }
  };

  return (
    <View style={styles.container}>

      {/* TOP IMAGE */}
      <Image
        source={require('./assets/licensekey.png')}
        style={styles.image}
      />

      {/* CARD */}
      <View style={styles.card}>
        <Text style={styles.title}>Activate Your License</Text>
        <Text style={styles.subtitle}>
          Enter your license key to continue
        </Text>

        <TextInput
          placeholder="XXXXXXXXXXXX"
          placeholderTextColor="#aaa"
          value={license}
          onChangeText={setLicense}
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={saveLicense}>
          <Text style={styles.buttonText}>Verify & Continue</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
  },

  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 25,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 5,
  },

  input: {
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    marginBottom: 18,
    backgroundColor: '#fafafa',
  },

  button: {
    backgroundColor: 'teal',
    padding: 15,
    borderRadius: 12,
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 15,
  },
});