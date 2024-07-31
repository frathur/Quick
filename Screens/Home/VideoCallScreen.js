import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

const VideoCallScreen = ({ navigation }) => {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={toggleCameraFacing}>
            <Icon name="camera-retro" size={32} color="#fff" />
            <Text style={styles.buttonText}>Flip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="microphone-slash" size={32} color="#fff" />
            <Text style={styles.buttonText}>Mute</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.actionButton, styles.endCallButton]}>
            <Icon name="phone" size={32} color="#fff" />
            <Text style={styles.buttonText}>Hang Up</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#075E54',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 32,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 11,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginHorizontal: 5,
    width:'30%',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  endCallButton: {
    backgroundColor: '#DC3545',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  text: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#075E54',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
});

export default VideoCallScreen;
