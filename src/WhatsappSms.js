import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  Linking,
  NativeModules
} from 'react-native';

const { AccessibilityModule } = NativeModules;

export default function WhatsappSms() {

  const [message, setMessage] = useState('');
  const [numbers, setNumbers] = useState('');

  const getNumberArray = () => {
    return numbers
      .split(/[\n,]+/)
      .map(num => num.trim())
      .filter(num => num.length > 0);
  };

  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  const startAutoSend = async () => {

    const nums = getNumberArray();

    if (nums.length === 0) {
      Alert.alert('Error', 'No numbers found');
      return;
    }

    if (!message) {
      Alert.alert('Error', 'Message empty hai');
      return;
    }

    // 🔥 START BULK
    if (AccessibilityModule) {
      AccessibilityModule.startBulk();
    }
    for (let i = 0; i < nums.length; i++) {

      let num = nums[i].replace(/\D/g, '');

      const url = `https://wa.me/${num}?text=${encodeURIComponent(message)}`;

      try {

        console.log("Opening:", num);

        await Linking.openURL(url);

        await delay(12000);

      } catch (err) {

        console.log("Error:", err);

      }

    }

    // 🔥 STOP BULK
    AccessibilityModule.stopBulk();

    Alert.alert('Done', 'Bulk sending completed');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Bulk WhatsApp Sender</Text>

        <Text style={styles.label}>Message</Text>
        <TextInput
          multiline
          placeholder="Type your message..."
          style={styles.input}
          value={message}
          onChangeText={setMessage}
        />

        <Text style={styles.label}>Bulk Numbers</Text>
        <TextInput
          multiline
          placeholder="Enter numbers"
          style={styles.input}
          value={numbers}
          onChangeText={setNumbers}
        />

        <TouchableOpacity
          style={styles.sendBtn}
          onPress={startAutoSend}
        >
          <Text style={styles.sendText}>Start Bulk Send</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#e5ddd5',
    padding: 15
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    elevation: 4
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#075E54',
    marginBottom: 10
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    height: 120,
    padding: 10,
    textAlignVertical: 'top',
    backgroundColor: '#fafafa'
  },

  sendBtn: {
    backgroundColor: '#25D366',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20
  },

  sendText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});