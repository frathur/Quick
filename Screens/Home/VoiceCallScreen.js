import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../../constants/Colors';
import { useRoute } from '@react-navigation/native';
import { Audio } from 'expo-av';

const VoiceCallScreen = ({ navigation }) => {
  const [duration, setDuration] = useState(0);
  const [isCallActive, setIsCallActive] = useState(true);
  const [sound, setSound] = useState();

  const route = useRoute();

  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/ringing.wav')
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.setIsLoopingAsync(true); // Set the sound to loop
    await sound.playAsync();
  }

  useEffect(() => {
    playSound();
  }, []);

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration((prevDuration) => prevDuration + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleEndCall = async () => {
    setIsCallActive(false);
    await sound.stopAsync(); // Stop the sound when the call ends
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: route.params.avatarUrl }} style={styles.profileImage} />
      <Text style={styles.name}>{route.params.username}</Text>
      <Text style={styles.status}>
        {isCallActive ? 'Ringing....' : 'Call Ended'}
      </Text>

      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="volume-up" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="microphone" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.endCallButton]} onPress={handleEndCall}>
          <Icon name="phone" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c', // Darker background color similar to Telegram's call screen
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  status: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 48,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
    borderRadius: 32,
    marginHorizontal: 8,
  },
  endCallButton: {
    backgroundColor: '#DC3545',
  },
});

export default VoiceCallScreen;
