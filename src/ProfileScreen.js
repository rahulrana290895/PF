import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './config/config';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');

      const res = await fetch(`${BASE_URL}get_profile.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });

      const result = await res.json();

      if (result.status === 'success') {
        setUser(result.data);
      }
    } catch (err) {
      Alert.alert('Error', 'Server error');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('LoginScreen');
  };

  if (!user) {
    return <Text style={{ textAlign: 'center', marginTop: 50 }}>Loading...</Text>;
  }

  return (
    <View style={styles.container}>

      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={require('./assets/user.png')}
          style={styles.profileImg}
        />
        <Text style={styles.name}>{user.customer_name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* Info Card */}
      <View style={styles.card}>
        <Text style={styles.label}>📱 Mobile</Text>
        <Text style={styles.value}>{user.contact_no}</Text>

        <Text style={styles.label}>📦 Plan</Text>
        <Text style={styles.value}>{user.plan_name}</Text>

        <Text style={styles.label}>🔑 License Key</Text>
        <Text style={styles.value}>{user.licensekey}</Text>

        <Text style={styles.label}>⏳ Expiry Date</Text>
        <Text style={[styles.value, { color: 'red' }]}>
          {user.end_date}
        </Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },

  header: {
    backgroundColor: 'teal',
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  profileImg: {
    width: 90,
    height: 90,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 10,
  },

  name: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  email: {
    color: '#e0f2f1',
    fontSize: 14,
  },

  card: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 5,
  },

  label: {
    fontSize: 13,
    color: 'gray',
    marginTop: 10,
  },

  value: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },

  logoutBtn: {
    backgroundColor: 'red',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});