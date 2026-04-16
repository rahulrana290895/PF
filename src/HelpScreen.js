import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';

export default function HelpScreen() {

  const callNumber = () => {
    Linking.openURL('tel:8529171609');
  };

  const openWhatsapp = () => {
    Linking.openURL('https://wa.me/918529171609');
  };

  const sendEmail = () => {
    Linking.openURL('mailto:info@parfectsolution.com');
  };

  return (
    <View style={styles.container}>

      <Text style={styles.heading}>Help & Support</Text>

      {/* Contact Number */}
      <TouchableOpacity style={styles.card} onPress={callNumber}>
        <Text style={styles.title}>📞 Contact Number</Text>
        <Text style={styles.value}>8529171609</Text>
      </TouchableOpacity>

      {/* Whatsapp */}
      <TouchableOpacity style={styles.card} onPress={openWhatsapp}>
        <Text style={styles.title}>💬 Whatsapp</Text>
        <Text style={styles.value}>8529171609</Text>
      </TouchableOpacity>

      {/* Email */}
      <TouchableOpacity style={styles.card} onPress={sendEmail}>
        <Text style={styles.title}>📧 Email</Text>
        <Text style={styles.value}>info@parfectsolution.com</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },

  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'teal',
    textAlign: 'center',
    marginBottom: 20
  },

  card: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000'
  },

  value: {
    fontSize: 14,
    marginTop: 5,
    color: 'gray'
  }
});