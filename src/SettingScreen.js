import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingScreen() {
  const [sim, setSim] = useState('SIM1');
  const [whatsapp, setWhatsapp] = useState('WHATSAPP');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const s = await AsyncStorage.getItem('sim');
    const w = await AsyncStorage.getItem('waType');
    if (s) setSim(s);
    if (w) setWhatsapp(w);
  };

  const save = async () => {
    await AsyncStorage.setItem('sim', sim);
    await AsyncStorage.setItem('waType', whatsapp);
    Alert.alert('Saved');
  };

  return (
    <View style={styles.container}>

      <Text>SIM Select</Text>
      <TouchableOpacity onPress={() => setSim('SIM1')}>
        <Text style={styles.option}>SIM 1</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setSim('SIM2')}>
        <Text style={styles.option}>SIM 2</Text>
      </TouchableOpacity>

      <Text>WhatsApp Type</Text>
      <TouchableOpacity onPress={() => setWhatsapp('WHATSAPP')}>
        <Text style={styles.option}>WhatsApp</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setWhatsapp('BUSINESS')}>
        <Text style={styles.option}>Business</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={save}>
        <Text style={{ color: '#fff' }}>Save</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  option: { padding: 10, borderBottomWidth: 1 },
  btn: { backgroundColor: 'teal', padding: 15, marginTop: 20 }
});