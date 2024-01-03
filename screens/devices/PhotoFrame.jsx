import {SafeAreaView, View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Iconz from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../components/Button';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";

const PhotoFrame = ({navigation, route: {params: {device}}}) => {
  
  const [pause, setPause] = useState(device.pause);
  const [lock, setLock] = useState(device.lock);
  const [state, setState] = useState(device.state);
  const [photoUploadProgress, setPhotoUploadProgress] = useState(-1);

  const {setUserDeviceData} = useAuth();

  useEffect(() => {     
    const handleMqttMessage = async() => {

      setUserDeviceData((prev) => {
        const index = prev.findIndex((d) => d.id === device.id);
        const newDevices = [...prev];

        newDevices[index] = {
          ...newDevices[index],
          state : state,
          lock: lock,
          pause: pause,
        }
        return newDevices;
      })

      try {
        const packet = {
          uid: device.uid,
          topic: `${device.uid}/${device.id}/control`,
          data: {
            ...device,
            state : state,
            lock: lock,
            pause: pause,
          }
        }

        const res = await fetch('https://hiro-backend.onrender.com/api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(packet),
        });

        const data = await res.json();
        
      }
      catch (err) {
        console.error(err);
      }
      
    }
    handleMqttMessage();
   
  }, [pause, lock, state])

  const handleLock = () => {
    if(lock) {
      setLock(false);
    }
    else {
      setLock(true);
      setPause(true);
    }
  }

  const handlePause = () => {
    if(pause) {
      setPause(false);
    }
    else {
      setPause(true);
    }
  }

  const handleState = () => {
    if(state === "on") {
      setState("off");
      setPause(true);
      setLock(true);
    }
    else {
      setState("on");
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    }, 
    );
  
    if (!result.canceled) {
      const storage = getStorage();
      const storageRef = ref(storage, `${device.uid}/${result.fileName}`);
      const img = await fetch(result.assets[0].uri);
      const blob = await img.blob();

      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setPhotoUploadProgress(Math.round(progress));
        
      }
      
    );

    }
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style= {styles.titleView}>
          <Icon name="arrow-back" size={32} color="black" onPress = {()=> navigation.navigate('Dashboard')} />
          <Text style = {styles.title}>Your Smart Frame</Text>
          <Icon name="photo" size={32} color = "black" />
        </View>

        <View style = {{display: 'flex', marginTop: 96, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
          <View style = {{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            {
              lock ? <Iconz name="lock-outline" size={128} onPress = {handleLock} style = {styles.icon}/> : <Iconz name="lock-open" size={128} color="pink" onPress = {handleLock} style = {styles.icon}/>
            }
            <Text style = {{fontSize: 18, fontWeight: 'semibold', color: 'black'}}> 
              {lock ? 'Locked' : 'Unlocked'}
            </Text>
          </View>
          
          <View style = {{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          {
            pause ? <Iconz name="play-speed" size={128} onPress = {handlePause} style = {styles.icon}/> : <Iconz name="motion-pause" size={128} onPress = {handlePause} style = {styles.icon}/>
          }
          <Text style = {{fontSize: 18, fontWeight: 'semibold', color: 'black'}}> 
            {pause ? 'Paused' : 'Playing'}
          </Text>
          </View>
        </View>
        <View style = {{marginTop: 24}}>
          {
            state === "on" ? (
              <Button title = "Turn Off" moreStyles = {{backgroundColor: 'red'}} onPress = {handleState} />
            )
            : (
              <Button title = "Turn On"  moreStyles = {{backgroundColor: 'green'}} onPress = {handleState} />
            )
          }
        </View>
        <View style = {{marginTop: 8}}>
          <Text>
            {
              photoUploadProgress >= 0 ? `Photo is ${photoUploadProgress}% uploaded` : <></>
            }
          </Text>
        </View>
        <Pressable onPress = {pickImage} style = {{position: 'absolute', bottom: 32, right: 18}} >
          <Icon name='add-circle' color = 'green' size={72} style = {{position: 'relative'}}/>
        </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white',
  },
  titleView: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 16,
    marginTop: 16,
  },
  title: {
    fontSize: 32,
    margin: 8,
    color: 'black',
    textAlign: 'left',
    borderColor: 'black',
  },
  textm: {
    fontSize: 18,
    margin: 8,
    textAlign: 'center',
    fontWeight: 'semibold',
    color: 'black',
    borderWidth: 2,
    borderColor: 'black',
  },
  icon: {
    margin: 16,
    padding: 8,
    color: 'green',
  }
  });

export default PhotoFrame;