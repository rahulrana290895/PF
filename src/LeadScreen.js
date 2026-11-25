import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  Switch,
  StyleSheet,
  NativeModules,
  TouchableOpacity,
  FlatList,
} from 'react-native';

const {OverlayModule} = NativeModules;

export default function LeadScreen() {

  const [enabled, setEnabled] =
    useState(false);

  const [leads, setLeads] =
    useState([]);

  // AUTO REFRESH LEADS
  useEffect(() => {

    const interval = setInterval(() => {
      fetchLeads();
    }, 2000);

    return () => clearInterval(interval);

  }, []);

  // FETCH LEADS
  const fetchLeads = async () => {

    try {

      const data =
        await OverlayModule.getLeads();

      setLeads(data);

      console.log('LEADS => ', data);

    } catch (e) {

      console.log(e);
    }
  };

  // START / STOP OVERLAY
  const toggleSwitch = value => {

    setEnabled(value);

    if (value) {

      OverlayModule.startOverlay()
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });

    } else {

      OverlayModule.stopOverlay()
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  // CLEAR LEADS
  const clearLeads = async () => {

    try {

      await OverlayModule.clearLeads();

      setLeads([]);

    } catch (e) {

      console.log(e);
    }
  };

  // RENDER ITEM
  const renderItem = ({item, index}) => {

    return (

      <View style={styles.card}>

        <Text style={styles.index}>
          #{index + 1}
        </Text>

        <Text style={styles.name}>
          {item.name || 'No Name'}
        </Text>

        <Text style={styles.phone}>
          {item.phone || 'No Phone'}
        </Text>

        <Text style={styles.address}>
          {item.address || 'No Address'}
        </Text>

      </View>
    );
  };

  return (

    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>

        <Text style={styles.title}>
          Enable/Disable
        </Text>

        <Switch
          value={enabled}
          onValueChange={toggleSwitch}
        />

      </View>

      {/* TOTAL */}

      {/* CLEAR BUTTON */}
      <TouchableOpacity
        style={styles.clearBtn}
        onPress={clearLeads}>

        <Text style={styles.clearText}>
          CLEAR LEADS
        </Text>

      </TouchableOpacity>

            <Text style={styles.total}>
              Total Leads : {leads.length}
            </Text>


      {/* LEADS LIST */}
      <FlatList
        data={leads}
        keyExtractor={(item, index) =>
          index.toString()
        }
        renderItem={renderItem}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
  },

  total: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    paddingHorizontal: 15,
  },

  clearBtn: {
    backgroundColor: 'red',
    marginHorizontal: 15,
    marginTop: 25,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  clearText: {
    color: '#fff',
    fontWeight: '700',
  },

  card: {
    backgroundColor: '#f5f5f5',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 12,
    padding: 15,
  },

  index: {
    fontWeight: '700',
    marginBottom: 5,
  },

  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000',
  },

  phone: {
    marginTop: 8,
    fontSize: 15,
    color: 'green',
  },

  address: {
    marginTop: 8,
    fontSize: 14,
    color: '#444',
  },
});