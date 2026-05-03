import React, { useEffect, useState } from 'react';
import { AppState ,PermissionsAndroid, Platform, Alert,ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { enableScreens } from 'react-native-screens';

import LoginScreen from './src/LoginScreen';
import RegisterScreen from './src/RegisterScreen';
import HomeScreen from './src/HomeScreen';
import UpdateLicenseScreen from './src/UpdateLicenseScreen';
import UpgradeScreen from './src/UpgradeScreen';

import WhatsappSms from './src/WhatsappSms';
import SettingScreen from './src/SettingScreen';
import SmsTemplate from './src/SmsTemplate';
import ProfileScreen from './src/ProfileScreen';
import HelpScreen from './src/HelpScreen';
import SmsScreen from './src/SmsScreen';
import GreetingScreen from './src/GreetingScreen';

import { BASE_URL } from './src/config/config';

const Stack = createStackNavigator();

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLicenseValid, setIsLicenseValid] = useState(false);
    const [planStatus, setPlanStatus] = useState('');
    const [loading, setLoading] = useState(true);

useEffect(() => {
  const checkAll = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const licenseKey = await AsyncStorage.getItem('licenseKey');

      if (!userId) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      setIsLoggedIn(true);

      if (!licenseKey) {
        setIsLicenseValid(false);
        setLoading(false);
        return;
      }

      const res = await fetch(`${BASE_URL}check_license.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ license_key: licenseKey, uid: userId }),
      });

      const result = await res.json();

      if (result.status === 'success') {
        setIsLicenseValid(true);
        setPlanStatus(result.plan);
      } else {
        setIsLicenseValid(false);
      }

    } catch (error) {
      Alert.alert('Error', 'Server not responding');
    } finally {
      setLoading(false); // 🔥 important
    }
  };

  checkAll();
}, []);

if (loading) {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff'
    }}>
      <ActivityIndicator size="large" color="teal" />
    </View>
  );
}
    return (
    <NavigationContainer>
        <Stack.Navigator>
          {!isLoggedIn ? (
          <>
              <Stack.Screen name="LoginScreen" options={{ headerShown: false }}>
                {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
              </Stack.Screen>
              <Stack.Screen name="RegisterScreen" component={RegisterScreen}
                options={({ navigation }) => ({
                  headerTitle: 'Register ',
                  headerStyle: { backgroundColor: 'teal' },
                  headerTintColor: '#fff',
                })}

              />
          </>
          ) : !isLicenseValid ? (
            <Stack.Screen
                name="Update License Key"
                    options={({ navigation }) => ({
                      headerTitle: 'License Key',
                      headerStyle: { backgroundColor: 'teal' },
                      headerTintColor: '#fff',
                    })}
                >
              {(props) => (
                <UpdateLicenseScreen {...props} setIsLicenseValid={setIsLicenseValid} />
              )}
            </Stack.Screen>
          ) : planStatus === 'expired' ? (
            <Stack.Screen name="Upgrade" component={UpgradeScreen} options={{ headerShown: false }}/>
          ) : (
          <>
              <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={({ navigation }) => ({
                  headerTitle: 'Perfect Solution',
                  headerStyle: { backgroundColor: 'teal' },
                  headerTintColor: '#fff',
                })}
              />
        <Stack.Screen name="WhatsappSms" component={WhatsappSms}   options={{
                                                                     headerTitle: 'Whatsapp SMS',
                                                                     headerStyle: { backgroundColor: 'teal' },
                                                                     headerTintColor: '#fff',
                                                                   }}/>
        <Stack.Screen name="SettingScreen" component={SettingScreen}   options={{
                                                                         headerTitle: 'Setting',
                                                                         headerStyle: { backgroundColor: 'teal' },
                                                                         headerTintColor: '#fff',
                                                                       }}/>
        <Stack.Screen name="SmsTemplate" component={SmsTemplate}   options={{
                                                                     headerTitle: 'SMS Template',
                                                                     headerStyle: { backgroundColor: 'teal' },
                                                                     headerTintColor: '#fff',
                                                                   }}/>
        <Stack.Screen name="ProfileScreen" component={ProfileScreen}   options={{
                                                                         headerTitle: 'Profile',
                                                                         headerStyle: { backgroundColor: 'teal' },
                                                                         headerTintColor: '#fff',
                                                                       }}/>
        <Stack.Screen name="SmsScreen" component={SmsScreen}   options={{
                                                                   headerTitle: 'Bulk SMS',
                                                                   headerStyle: { backgroundColor: 'teal' },
                                                                   headerTintColor: '#fff',
                                                                 }}/>

        <Stack.Screen name="GreetingScreen" component={GreetingScreen}   options={{
                                                                   headerTitle: 'Greetings',
                                                                   headerStyle: { backgroundColor: 'teal' },
                                                                   headerTintColor: '#fff',
                                                                 }}/>
        <Stack.Screen name="HelpScreen" component={HelpScreen}   options={{
                                                                   headerTitle: 'Help Line',
                                                                   headerStyle: { backgroundColor: 'teal' },
                                                                   headerTintColor: '#fff',
                                                                 }}/>

          </>
          )}
        </Stack.Navigator>
    </NavigationContainer>

  );
}