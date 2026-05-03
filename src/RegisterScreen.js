import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image
} from 'react-native';
import { BASE_URL } from './config/config';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !mobile || !email || !password) {
      Alert.alert('Error', 'All fields required');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, mobile, email, password }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        Alert.alert('Success', 'Registered Successfully');

        // login screen pe bhej do
        navigation.navigate('LoginScreen');
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (err) {
      Alert.alert('Error', 'Server error');
    }
  };

  return (
    <View style={styles.container}>
          <Image
            source={require('./assets/logo.png')}
            style={styles.logo}
          />
      <Text style={styles.heading}>Register</Text>

      <TextInput
        placeholder="Full Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Mobile"
        keyboardType="number-pad"
        style={styles.input}
        value={mobile}
        onChangeText={setMobile}
      />

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  logo: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 10,
    resizeMode: 'contain',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
    backgroundColor:'#FFF'
  },
  heading: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: 'teal',
  },
  input: {
    borderWidth: 2,
    borderColor: 'teal',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    color: 'teal',
  },
  button: {
    backgroundColor: 'teal',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});