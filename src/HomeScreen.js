import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Platform,
} from 'react-native';

export default function HomeScreen({ navigation }) {
useEffect(() => {
  requestAllPermissions();
}, []);


const requestAllPermissions = async () => {
  if (Platform.OS !== 'android') return;

  try {
    let permissions = [];

    if (Platform.Version >= 33) {
      // Android 13+
      permissions = [
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
      ];
    } else {
      // Android 12 and below
      permissions = [
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
      ];
    }

    const granted = await PermissionsAndroid.requestMultiple(permissions);

    console.log("Permission Result:", granted);

  } catch (err) {
    console.warn(err);
  }
};

  return (
    <View style={{ flex: 1, backgroundColor: '#fff9e5' }}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* 🔶 Banner */}
        <ImageBackground
          source={require('./assets/banner.webp')}
          style={styles.banner}
        >
        </ImageBackground>

        {/* 🔷 Cards */}
        <View style={styles.container}>

          {/* Row 1 */}
          <View style={styles.row}>


            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('SmsTemplate')}>
              <Image source={require('./assets/template.png')} style={styles.iconImg} />
              <Text style={styles.cardText}>SMS Template</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('WhatsappSms')}>
              <Image source={require('./assets/wa.png')} style={styles.iconImg} />
              <Text style={styles.cardText}>Whatsapp Template</Text>
            </TouchableOpacity>

          </View>

          {/* Row 2 */}


          <View style={styles.row}>
            {/*<TouchableOpacity style={styles.card} onPress={() => navigation.navigate('SmsScreen')}>
              <Image source={require('./assets/sms.png')} style={styles.iconImg} />
              <Text style={styles.cardText}>SMS</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('SettingScreen')}>
              <Image source={require('./assets/setting.png')} style={styles.iconImg} />
              <Text style={styles.cardText}>Setting</Text>
            </TouchableOpacity>
*/}
          </View>

          <View style={styles.row}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ProfileScreen')}
          >
            <Image source={require('./assets/user.png')} style={styles.iconImg} />
            <Text style={styles.cardText}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('HelpScreen')}
          >
            <Image source={require('./assets/helpline.png')} style={styles.iconImg} />
            <Text style={styles.cardText}>Helpline</Text>
          </TouchableOpacity>

          </View>

        </View>

      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({

  banner: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
  },

  bannerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10
  },

  container: {
    padding: 15
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },


  card: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    height: 110,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5
  },


  iconImg: {
    width: 80,
    height: 80,
    resizeMode: 'contain'
  },

  cardText: {
    color: '#000',
    marginTop: 1,
    fontWeight: 'bold'
  }

});