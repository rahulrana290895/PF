import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  NativeModules
} from 'react-native';
import { PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { SmsModule } = NativeModules; // ✅ Native bridge

export default function SmsTemplate() {

  const [incoming, setIncoming] = useState('');
  const [outgoing, setOutgoing] = useState('');
  const [missed, setMissed] = useState('');

  useEffect(() => {
    loadData();
    requestPermission();
  }, []);

  const loadData = async () => {
    try {
      const inc = await AsyncStorage.getItem('sms_incoming');
      const out = await AsyncStorage.getItem('sms_outgoing');
      const mis = await AsyncStorage.getItem('sms_missed');

      if (inc) setIncoming(inc);
      if (out) setOutgoing(out);
      if (mis) setMissed(mis);

    } catch (e) {
      console.log("LOAD ERROR:", e);
    }
  };
  const save = async () => {
    try {

      // AsyncStorage (UI ke liye)
      await AsyncStorage.setItem('sms_incoming', incoming);
      await AsyncStorage.setItem('sms_outgoing', outgoing);
      await AsyncStorage.setItem('sms_missed', missed);

      // ✅ Native (SharedPreferences ke liye)
      if (SmsModule) {
        SmsModule.saveTemplates(incoming, outgoing, missed);
        setTimeout(() => {
          SmsModule.startCallService();
        }, 500);

      } else {
        console.log("SmsModule not found");
      }
        console.log(SmsModule);
      Alert.alert('Success', 'Saved in Async + Native');

    } catch (e) {
      console.log("SAVE ERROR:", e);
    }
  };
  const requestPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("✅ Permission Granted");
    } else {
      console.log("❌ Permission Denied");
    }
  } catch (err) {
    console.warn(err);
  }
};
  return (
    <ScrollView style={styles.container}>

      {/* Incoming */}
      <View style={styles.card}>
        <Text style={styles.label}>Incoming Call SMS</Text>
        <TextInput
          multiline
          placeholder="Message for incoming call..."
          style={styles.input}
          value={incoming}
          onChangeText={setIncoming}
        />
      </View>

      {/* Outgoing */}
      <View style={styles.card}>
        <Text style={styles.label}>Outgoing Call SMS</Text>
        <TextInput
          multiline
          placeholder="Message for outgoing call..."
          style={styles.input}
          value={outgoing}
          onChangeText={setOutgoing}
        />
      </View>

      {/* Missed */}
      <View style={styles.card}>
        <Text style={styles.label}>Missed Call SMS</Text>
        <TextInput
          multiline
          placeholder="Message for missed call..."
          style={styles.input}
          value={missed}
          onChangeText={setMissed}
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.btn} onPress={save}>
        <Text style={styles.btnText}>Save All Templates</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff9e5',
    padding: 15
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
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

  btn: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20
  },

  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});