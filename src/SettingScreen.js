import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingScreen() {
  const [sim, setSim] = useState('SIM1');
  const [whatsapp, setWhatsapp] = useState('WHATSAPP');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const s = await AsyncStorage.getItem('sim');
      const w = await AsyncStorage.getItem('waType');

      if (s) setSim(s);
      if (w) setWhatsapp(w);

    } catch (e) {
      console.log("LOAD ERROR:", e);
    }
  };

  const save = async () => {
    try {
      await AsyncStorage.setItem('sim', sim);
      await AsyncStorage.setItem('waType', whatsapp);

      Alert.alert('✅ Saved', 'Settings saved successfully');

    } catch (e) {
      console.log("SAVE ERROR:", e);
    }
  };

  const Option = ({ title, value, selected, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.optionCard,
        selected && styles.selectedCard
      ]}
    >
      <Text style={[
        styles.optionText,
        selected && styles.selectedText
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      {/* SIM SECTION */}
      <Text style={styles.heading}>📶 Select SIM</Text>

      <View style={styles.row}>
        <Option
          title="SIM 1"
          value="SIM1"
          selected={sim === 'SIM1'}
          onPress={() => setSim('SIM1')}
        />

        <Option
          title="SIM 2"
          value="SIM2"
          selected={sim === 'SIM2'}
          onPress={() => setSim('SIM2')}
        />
      </View>

      {/* WHATSAPP SECTION */}
      <Text style={styles.heading}>💬 WhatsApp Type</Text>

      <View style={styles.row}>
        <Option
          title="WhatsApp"
          value="WHATSAPP"
          selected={whatsapp === 'WHATSAPP'}
          onPress={() => setWhatsapp('WHATSAPP')}
        />

        <Option
          title="Business"
          value="BUSINESS"
          selected={whatsapp === 'BUSINESS'}
          onPress={() => setWhatsapp('BUSINESS')}
        />
      </View>

      {/* SAVE BUTTON */}
      <TouchableOpacity style={styles.btn} onPress={save}>
        <Text style={styles.btnText}>Save Settings</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
    padding: 20
  },

  heading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333'
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25
  },

  optionCard: {
    flex: 1,
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    elevation: 3
  },

  selectedCard: {
    backgroundColor: '#007bff'
  },

  optionText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600'
  },

  selectedText: {
    color: '#fff'
  },

  btn: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20
  },

  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700'
  }
});
