import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  NativeModules
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingScreen() {
  const { SmsModule } = NativeModules;

  const [simList, setSimList] = useState([]);
  const [selectedSim, setSelectedSim] = useState(null);
  const [whatsapp, setWhatsapp] = useState('WHATSAPP');

  // ✅ NEW: WhatsApp installed state
  const [waApps, setWaApps] = useState({
    whatsapp: false,
    business: false
  });

  useEffect(() => {
    loadSims();
    load();
    loadWhatsApps(); // 🔥 NEW
  }, []);

  // ✅ Load SIMs
  const loadSims = async () => {
    try {
      const sims = await SmsModule.getAvailableSims();
      setSimList(sims);

      if (sims.length > 0) {
        setSelectedSim(sims[0].id);
      }
    } catch (e) {
      console.log("SIM ERROR:", e);
    }
  };

  // ✅ Load WhatsApp installed apps
  const loadWhatsApps = async () => {
    try {
      const res = await SmsModule.getInstalledWhatsApps();
      setWaApps(res);

      // ✅ auto select
      if (res.whatsapp) setWhatsapp('WHATSAPP');
      else if (res.business) setWhatsapp('BUSINESS');

    } catch (e) {
      console.log("WA ERROR:", e);
    }
  };

  // ✅ Load saved settings
  const load = async () => {
    try {
      const savedSim = await AsyncStorage.getItem('sim');
      const w = await AsyncStorage.getItem('waType');

      if (savedSim) setSelectedSim(parseInt(savedSim));
      if (w) setWhatsapp(w);

    } catch (e) {
      console.log("LOAD ERROR:", e);
    }
  };

  // ✅ Save settings
  const save = async () => {
    try {
      if (!selectedSim) {
        Alert.alert("Error", "Please select SIM");
        return;
      }

      const selectedSimObj = simList.find(s => s.id === selectedSim);

      if (selectedSimObj?.status !== "ACTIVE") {
        Alert.alert("Error", "Selected SIM is not active");
        return;
      }

      await AsyncStorage.setItem('sim', String(selectedSim));
      await AsyncStorage.setItem('waType', whatsapp);

      Alert.alert('✅ Saved', 'Settings saved successfully');

    } catch (e) {
      console.log("SAVE ERROR:", e);
    }
  };

  // ✅ SIM fallback
  useEffect(() => {
    if (simList.length > 0 && selectedSim) {
      const exists = simList.find(s => s.id === selectedSim);
      if (!exists) {
        setSelectedSim(simList[0].id);
      }
    }
  }, [simList]);

  // 🔥 SIM UI (UNCHANGED)
  const SimOption = ({ item, index }) => {
    const isActive = item.status === "ACTIVE";
    const isSelected = selectedSim === item.id;

    return (
      <TouchableOpacity
        disabled={!isActive}
        onPress={() => setSelectedSim(item.id)}
        style={[
          styles.simCard,
          isSelected && styles.selectedCard,
          !isActive && styles.inactiveCard
        ]}
      >
        <Text style={[
          styles.simName,
          isSelected && styles.selectedText
        ]}>
          {item.name} (SIM {index + 1})
        </Text>

        <Text style={[
          styles.simStatus,
          isActive ? styles.active : styles.inactive
        ]}>
          {isActive ? "✅ Active" : "❌ No Network"}
        </Text>
      </TouchableOpacity>
    );
  };

  // 🔥 COMMON OPTION
  const Option = ({ title, selected, onPress }) => (
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

      {/* 📶 SIM SECTION */}
      <Text style={styles.heading}>📶 Select SIM</Text>

      <View style={styles.row}>
        {simList.map((item, index) => (
          <SimOption key={item.id} item={item} index={index} />
        ))}
      </View>

      {/* 💬 WHATSAPP SECTION */}
      <Text style={styles.heading}>💬 WhatsApp Type</Text>

      <View style={styles.row}>

        {waApps.whatsapp && (
          <Option
            title="WhatsApp"
            selected={whatsapp === 'WHATSAPP'}
            onPress={() => setWhatsapp('WHATSAPP')}
          />
        )}

        {waApps.business && (
          <Option
            title="WA Business"
            selected={whatsapp === 'BUSINESS'}
            onPress={() => setWhatsapp('BUSINESS')}
          />
        )}

      </View>

      {/* ❌ No WhatsApp */}
      {!waApps.whatsapp && !waApps.business && (
        <Text style={{ textAlign: 'center', color: 'red', marginBottom: 20 }}>
          ❌ No WhatsApp installed
        </Text>
      )}

      {/* 💾 SAVE */}
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

  simCard: {
    flex: 1,
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 3
  },

  simName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333'
  },

  simStatus: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600'
  },

  active: {
    color: 'green'
  },

  inactive: {
    color: 'red'
  },

  inactiveCard: {
    opacity: 0.5
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