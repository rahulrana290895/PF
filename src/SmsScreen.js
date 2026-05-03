import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { SmsModule } = NativeModules;

export default function SmsScreen() {

  const [message, setMessage] = useState('');
  const [numbers, setNumbers] = useState('');
  const [loading, setLoading] = useState(false);

  const requestPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.SEND_SMS
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

const sendBulkSms = async () => {
  if (!message || !numbers) {
    Alert.alert("Error", "Please enter both message and numbers");
    return;
  }

  const hasPermission = await requestPermission();
  if (!hasPermission) {
    Alert.alert("Permission Denied");
    return;
  }

  const numberList = numbers
    .split('\n')
    .map(n => n.trim())
    .filter(n => n.length > 0);

  try {
    // ✅ selected SIM uthao
    const selectedSim = await AsyncStorage.getItem('sim');

    if (!selectedSim) {
      Alert.alert("Error", "Please select SIM in settings");
      return;
    }

    setLoading(true);

    // ✅ SIM pass karo yahan
    await SmsModule.sendBulkSMS(
      numberList,
      message,
      parseInt(selectedSim)
    );

    setLoading(false);

    Alert.alert("Success", "All SMS sent successfully ✅");

    setMessage('');
    setNumbers('');

  } catch (e) {
    setLoading(false);
    console.log(e);
    Alert.alert("Error", "Failed to send SMS");
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.title}>Bulk SMS Sender</Text>

      {/* Message Card */}
      <View style={styles.card}>
        <Text style={styles.label}>✉️ Message</Text>
        <TextInput
          placeholder="Type your message here..."
          style={[styles.input, { height: 120 }]}
          value={message}
          onChangeText={setMessage}
          multiline
        />
      </View>

      {/* Numbers Card */}
      <View style={styles.card}>
        <Text style={styles.label}>📱 Mobile Numbers</Text>
        <TextInput
            placeholder={`9876543210
9876543211
9876543212`}
          style={[styles.input, { height: 80 }]}
          value={numbers}
          onChangeText={setNumbers}
          multiline
        />
        <Text style={styles.hint}>
          Enter numbers separated by commas
        </Text>

        {/* Count */}
        {numbers.length > 0 && (
          <Text style={styles.count}>
            Total: {numbers.split('\n').filter(n => n.trim() !== '').length} numbers
          </Text>
        )}
      </View>

      {/* Button */}
      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={sendBulkSms}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>🚀 Send SMS</Text>
        )}
      </TouchableOpacity>

      {/* Loader Text */}
      {loading && (
        <Text style={styles.loadingText}>
          Sending SMS... Please wait ⏳
        </Text>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff9e5',
    flexGrow: 1
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#222'
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3
  },

  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
    fontWeight: '600'
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#fafafa'
  },

  hint: {
    fontSize: 12,
    color: '#888',
    marginTop: 5
  },

  count: {
    marginTop: 5,
    fontSize: 13,
    color: '#333',
    fontWeight: '600'
  },

  button: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },

  loadingText: {
    marginTop: 15,
    textAlign: 'center',
    color: '#555',
    fontSize: 14
  }
});