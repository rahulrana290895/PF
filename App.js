import React, { useEffect, useState } from 'react';
import { AppState ,PermissionsAndroid, Platform, Alert,ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { enableScreens } from 'react-native-screens';

import LoginScreen from './src/LoginScreen';
import HomeScreen from './src/HomeScreen';
import UpdateLicenseScreen from './src/UpdateLicenseScreen';
import UpgradeScreen from './src/UpgradeScreen';

import WhatsappTemplate from './src/WhatsappTemplate';
import SettingScreen from './src/SettingScreen';


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
              <Stack.Screen name="LoginScreen" options={{ headerShown: false }}>
                {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
              </Stack.Screen>
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
                  headerTitle: 'ParfectSolution',
                  headerStyle: { backgroundColor: 'teal' },
                  headerTintColor: '#fff',
                })}
              />
        <Stack.Screen name="WhatsappTemplate" component={WhatsappTemplate} />
        <Stack.Screen name="SettingScreen" component={SettingScreen} />

              </>



          )}


        </Stack.Navigator>
    </NavigationContainer>

  );
}