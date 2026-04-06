import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Alert,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';

export default function WhatsappSms() {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [numbers, setNumbers] = useState(''); // ✅ NEW STATE

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const msg = await AsyncStorage.getItem('waTemplate');
    const img = await AsyncStorage.getItem('waImage');
    const nums = await AsyncStorage.getItem('waNumbers');

    if (msg) setMessage(msg);
    if (img) setImage(img);
    if (nums) setNumbers(nums);
  };

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, (res) => {
      if (res.assets && res.assets.length > 0) {
        setImage(res.assets[0].uri);
      }
    });
  };

  const save = async () => {
    await AsyncStorage.setItem('waTemplate', message);
    await AsyncStorage.setItem('waNumbers', numbers); // ✅ SAVE NUMBERS
    if (image) await AsyncStorage.setItem('waImage', image);

    Alert.alert('Success', 'WhatsApp Template Saved');
  };

  // ✅ Convert numbers into array
  const getNumberArray = () => {
    return numbers
      .split(/[\n,]+/) // comma ya new line se split
      .map(num => num.trim())
      .filter(num => num.length > 0);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Bulk WhatsApp</Text>

        {/* MESSAGE */}
        <Text style={styles.label}>Message</Text>
        <TextInput
          multiline
          placeholder="Type your WhatsApp message..."
          placeholderTextColor="#888"
          style={styles.input}
          value={message}
          onChangeText={setMessage}
        />

        {/* BULK NUMBERS */}
        <Text style={styles.label}>Bulk Numbers</Text>
        <TextInput
          multiline
          placeholder="Enter numbers (comma or new line)..[9185XXXXXX09,9189XXXXXX42]."
          placeholderTextColor="#888"
          style={[styles.input, { height: 120 }]}
          value={numbers}
          onChangeText={setNumbers}
        />

        {/* IMAGE PICKER */}
        <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
          <Text style={styles.imageBtnText}>
            {image ? 'Change Image' : 'Select Image'}
          </Text>
        </TouchableOpacity>

        {/* PREVIEW */}
        {image && (
          <View style={styles.previewBox}>
            <Image source={{ uri: image }} style={styles.previewImg} />
          </View>
        )}

        {/* SAVE */}
        <TouchableOpacity style={styles.saveBtn} onPress={save}>
          <Text style={styles.saveText}>Save Template</Text>
        </TouchableOpacity>

        {/* DEBUG BUTTON (optional) */}
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: '#333' }]}
          onPress={() => console.log(getNumberArray())}
        >
          <Text style={styles.saveText}>Check Numbers Console</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5ddd5', // WhatsApp bg feel
    padding: 15
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#075E54'
  },

  subtitle: {
    fontSize: 13,
    color: '#555',
    marginBottom: 15
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 6,
    color: '#333'
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    height: 140,
    padding: 10,
    textAlignVertical: 'top',
    backgroundColor: '#fafafa'
  },

  imageBtn: {
    backgroundColor: '#25D366',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12
  },

  imageBtnText: {
    color: '#fff',
    fontWeight: '600'
  },

  previewBox: {
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden'
  },

  previewImg: {
    width: '100%',
    height: 150,
    borderRadius: 10
  },

  saveBtn: {
    backgroundColor: '#075E54',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15
  },

  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});