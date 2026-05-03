import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  NativeModules,
  Image,
  Linking,
  SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';

const { AccessibilityModule } = NativeModules;

export default function WhatsappSms() {

  const [message, setMessage] = useState('');
  const [numbers, setNumbers] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const stopRef = useRef(false);

  const getNumberArray = () => {
    return numbers
      .split(/[\n,]+/)
      .map(num => num.trim())
      .filter(num => num.length > 0);
  };

  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  // 📷 Image Picker
  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (res) => {
      if (!res.didCancel && res.assets?.length > 0) {
        setImageUri(res.assets[0].uri);
      }
    });
  };

const startAutoSend = async () => {
   const waType = await AsyncStorage.getItem('waType');
   const packageName =
     waType === 'BUSINESS'
       ? 'com.whatsapp.w4b'
       : 'com.whatsapp';

  stopRef.current = false; // reset

  const nums = getNumberArray();

  if (nums.length === 0) {
    Alert.alert('Error', 'No numbers found');
    return;
  }

  if (!message && !imageUri) {
    Alert.alert('Error', 'Message ya Image hona chahiye');
    return;
  }

  // 🔥 IMPORTANT: image flow pass karo
  if (AccessibilityModule) {
    AccessibilityModule.startBulk(!!imageUri);
  }

  for (let i = 0; i < nums.length; i++) {

      if (stopRef.current) {
        console.log("Stopped by user");
        break;
      }

    let num = nums[i].replace(/\D/g, '');

    try {

      // 🔥 IMAGE SAVE (agar image hai)
      if (imageUri) {
        console.log(imageUri);
        AccessibilityModule.saveImageToGallery(imageUri);
        await delay(2000);
      }

      // 🔥 CASE 1: MESSAGE + IMAGE
      if (message) {
        await AccessibilityModule.openWhatsApp(
          num,
          message || '',
          waType || 'WHATSAPP'
        );
      }

      // 🔥 CASE 2: ONLY IMAGE (VERY IMPORTANT FIX)
      else {
        const url = `https://wa.me/${num}`;
        await Linking.openURL(url);
      }

      // ⏱️ Delay (image flow me zyada)
      await delay(imageUri ? 15000 : 8000);

    } catch (err) {
      console.log("Error:", err);
    }
  }

  AccessibilityModule.stopBulk();

  Alert.alert('Done', 'Bulk sending completed');
};

const stopAutoSend = () => {
  stopRef.current = true;
  if (AccessibilityModule) {
    AccessibilityModule.stopBulk();
  }
  Alert.alert("Stopped", "Process stopped");
};

  return (
  <SafeAreaView style={{ flex: 1, backgroundColor: '#e5ddd5' }}>
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
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

        {/* 📷 Image Picker Button */}
        <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
          <Text style={styles.imageText}>Choose Image</Text>
        </TouchableOpacity>

        {/* 👀 Preview */}
        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.preview} />
        )}

        <TouchableOpacity
          style={styles.sendBtn}
          onPress={startAutoSend}
        >
          <Text style={styles.sendText}>Start Bulk Send</Text>
        </TouchableOpacity>


<TouchableOpacity style={[styles.sendBtn, { backgroundColor: 'red' }]} onPress={stopAutoSend} >
  <Text style={styles.sendText}>Stop</Text>
</TouchableOpacity>


      </View>
    </ScrollView>
    </SafeAreaView>
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

  imageBtn: {
    backgroundColor: '#128C7E',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10
  },

  imageText: {
    color: '#fff',
    fontWeight: '600'
  },

  preview: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 10
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