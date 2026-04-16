import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // <-- import hook
import { BASE_URL } from './config/config';

const LoginScreen = (props) => {
  const navigation = useNavigation(); // <-- use navigation hook

  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        navigation.replace('HomeScreen'); // agar already login hai to redirect
      }
    };
    checkLogin();
  }, []);

  const handleLogin = async () => {
  if (!mobile || !password) {
    Alert.alert('Error', 'Please enter mobile number and password');
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(`${BASE_URL}login.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mobile: mobile,
        password: password,
      }),
    });

    const result = await response.json();

    if (result.status === 'success') {
      await AsyncStorage.setItem('userId', result.user.id);

      // ✅ Important: call setIsLoggedIn from props
      if (props.setIsLoggedIn) {
        props.setIsLoggedIn(true);  // ← triggers App.js to render HomeScreen
      }
    } else {
      Alert.alert('Login Failed', result.message || 'Invalid credentials');
    }
  } catch (error) {
    Alert.alert('Error', 'Server not responding');
  }

  setLoading(false);
};

  return (
    <View style={styles.container}>
      {/* LOGO */}
      <Image
        source={require('./assets/logo.png')}
        style={styles.logo}
      />


      {/* FORM */}
      <TextInput
        placeholder="Mobile Number"
        placeholderTextColor="teal"
        keyboardType="number-pad"
        maxLength={10}
        style={styles.input}
        value={mobile}
        onChangeText={setMobile}
      />

<View style={styles.passwordContainer}>
  <TextInput
    placeholder="Password"
    placeholderTextColor="teal"
    secureTextEntry={!showPassword}
    style={styles.passwordInput}
    value={password}
    onChangeText={setPassword}
  />

  <TouchableOpacity
    style={styles.eyeButton}
    onPress={() => setShowPassword(!showPassword)}
  >
    <Text style={{ color: 'teal', fontSize: 16 }}>
      {showPassword ? 'Hide' : 'Show'}
    </Text>
  </TouchableOpacity>
</View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>
          {loading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>

      <Text style={{ textAlign: 'center', marginTop: 15 }}>
        Don't have an account?{' '}
        <Text
          style={{ color: 'teal', fontWeight: 'bold' }}
          onPress={() => navigation.navigate('RegisterScreen')}
        >
          Register
        </Text>
      </Text>

    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
    backgroundColor:'white',
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 10,
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: 'teal',
  },
  input: {
    borderWidth: 2,
    borderColor: 'teal',
    borderRadius: 8,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
    color:'teal',
  },
  button: {
    backgroundColor: 'teal',
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'teal',
    borderRadius: 8,
    marginBottom: 15,
  },

  passwordInput: {
    flex: 1,
    padding: 14,
    fontSize: 16,
    color: 'teal',
  },

  eyeButton: {
    paddingHorizontal: 12,
  },
});
