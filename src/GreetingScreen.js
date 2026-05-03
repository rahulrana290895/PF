import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from './config/config';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';


export default function GreetingScreen() {

  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageRatio, setImageRatio] = useState({});

  useEffect(() => {

    const loadData = async () => {
      try {
        const USER_ID = await AsyncStorage.getItem('userId');

        if (!USER_ID) {
          console.log("User ID not found");
          setLoading(false);
          return;
        }

        const res = await fetch(`${BASE_URL}/get_posters.php?user_id=${USER_ID}`);
        const data = await res.json();

        setPosters(data);

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();

  }, []);

  // ✅ SHARE FUNCTION
const shareImage = async (imageUrl) => {
  try {
    const fileName = 'poster.jpg';
    const downloadDest = `${RNFS.CachesDirectoryPath}/${fileName}`;

    // ✅ Download image locally
    const res = await RNFS.downloadFile({
      fromUrl: imageUrl,
      toFile: downloadDest
    }).promise;

    if (res.statusCode === 200) {

      const shareOptions = {
        url: 'file://' + downloadDest,
        type: 'image/jpeg'
      };

      await Share.open(shareOptions);
    } else {
      console.log('Download failed');
    }

  } catch (error) {
    console.log(error);
  }
};

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="small" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posters}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>

            <Image
              source={{
                uri: item.image,
                cache: 'reload'
              }}
              style={{
                width: '100%',
                height: undefined,
                aspectRatio: imageRatio[item.id] || 1
              }}
              resizeMode="contain"
              onLoad={(e) => {
                const { width, height } = e.nativeEvent.source;
                setImageRatio(prev => ({
                  ...prev,
                  [item.id]: width / height
                }));
              }}
            />

            {/* ✅ SHARE BUTTON */}
            <TouchableOpacity
              style={styles.shareBtn}
              onPress={() => shareImage(item.image)}
            >
              <Text style={styles.shareText}>Share</Text>
            </TouchableOpacity>

          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5'
  },

  // ✅ SHARE BUTTON STYLE
  shareBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#000',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5
  },
  shareText: {
    color: '#fff',
    fontSize: 12
  }
});