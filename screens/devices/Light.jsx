import {useEffect, useState} from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable} from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ColorPicker, fromHsv } from 'react-native-color-picker'
import { useAuth } from '../../contexts/AuthContext';

const Light = ({navigation, route: {params: {device}}}) => {

  const {setUserDeviceData} = useAuth();
  
  const componentToHex = (c) => {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  
  const rgbToHex = (r, g, b) => {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  const convertHexToRGB = (hex) => {  
    if(hex.length === 7) {
      hex = hex.substring(1);
    }

    // Then, convert the hex values to decimal values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
  
    // Return an object with the RGB values
    return [ r, g, b ];
  };

  const [color, setColor] = useState(device.rgb ? rgbToHex(device.rgb[0], device.rgb[1], device.rgb[2])  : 'black');
  const [lightMode, setLightMode] = useState(device.light_mode);
  const [state, setState] = useState(device.state);

  useEffect(() => {
    const handleMqttMessage = async() => {
      setUserDeviceData((prev) => {
        const index = prev.findIndex((d) => d.id === device.id);
        const newDevices = [...prev];

        newDevices[index] = {
          ...newDevices[index],
          state : state,
          rgb: convertHexToRGB(color),
          light_mode: lightMode,
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
            rgb: convertHexToRGB(color),
            light_mode: lightMode,
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
        // console.log('mqtt message sent ', data);

      }
      catch (err) {
        console.error(err);
      }
      
    }
    handleMqttMessage();
  }, [lightMode, color])


  return (
    <SafeAreaView style={styles.container}>
        <View style= {styles.titleView}>
          <Icon name="arrow-back" size={32} color="black" onPress = {()=> navigation.navigate('Dashboard')} />
          <Text style = {styles.title}>Your {device.location} Light</Text>
          <Icon name="lightbulb-outline" size={32} color = "black" />
        </View>
              
        <View>
          <ColorPicker onColorChange={color => setColor(fromHsv(color))} color = {color} sliderComponent={Slider} hideSliders = {true} hideControls = {true} style = {styles.colorPicker}/>
        </View>

        <View style = {{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', width: '100%'}}>
          <Text style = {{fontSize: 18, fontWeight: 'semibold', color: 'black'}}>Light Modes:</Text>
          <View style = {{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center'}}>
            <Pressable 
              style={{
                borderRadius: '50%',
                borderWidth: 2, 
                paddingLeft: 12,
                paddingRight: 12,
                paddingTop: 6,
                paddingBottom: 6,
                borderColor: lightMode === 1 ? '#2a9df1' : 'transparent',  
              }}

              onPress={() => setLightMode(1)}
            >
              <Text style = {{fontSize: 18, fontWeight: 'semibold', color: 'black'}}>Solid</Text>
            </Pressable>
            <Pressable 
              style={{
                borderRadius: '50%',
                borderWidth: 2, 
                paddingLeft: 12,
                paddingRight: 12,
                paddingTop: 6,
                paddingBottom: 6,
                borderColor: lightMode === 2 ? '#2a9df1' : 'transparent',  
              }}
              onPress={() => setLightMode(2)}
            >
              <Text style = {{fontSize: 18, fontWeight: 'semibold', color: 'black'}}>Line</Text>
            </Pressable>
            <Pressable style={{
                borderRadius: '50%',
                borderWidth: 2, 
                paddingLeft: 12,
                paddingRight: 12,
                paddingTop: 6,
                paddingBottom: 6,
                borderColor: lightMode === 3 ? '#2a9df1' : 'transparent',  
              }}

              onPress={() => setLightMode(3)}
              >
              <Text style = {{fontSize: 18, fontWeight: 'semibold', color: 'black'}}>Party</Text>
            </Pressable>
          </View>
        </View>

        {
          state === "on" ? (
            <Pressable style = {{marginTop: 24,backgroundColor: 'red', padding: 16, borderRadius: 8}} onPress={() => {
              setColor('#000000')
              setState('off')
            }}>
              <Text style = {{fontSize: 18, color: 'white'}}>Turn Off</Text>
            </Pressable>
          )
          : (
            <Pressable style = {{marginTop: 24,backgroundColor: 'green', padding: 16, borderRadius: 8}} onPress={() => {
              setColor('#2a9df1')
              setState('on')
            }}>
              <Text style = {{fontSize: 18, color: 'white'}}>Turn On</Text>
            </Pressable>
          )
        }
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
  },
  text: {
    fontSize: 16,
    margin: 8,
    textAlign: 'center',
    color: 'grey',
  },
  colorPicker: { 
    width: 350, 
    height: 350, 
    borderRadius: 10, 
    margin: 20,
    marginBottom: 20, 
}, 
});

export default Light;
