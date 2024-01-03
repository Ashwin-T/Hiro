import {View, Text, StyleSheet, SafeAreaView, Pressable} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
// import Iconz from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../contexts/AuthContext';
const Dashboard = ({navigation}) => {

  const {userDeviceData} = useAuth();

  const componentToHex = (c) => {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  
  const rgbToHex = (r, g, b) => {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }
  
  return (
    <SafeAreaView style = {styles.container}>

      <Icon name="settings" size={32} color = "grey" style = {{position: 'absolute', top: 48, right: 18, color: 'grey'}} onPress={() => navigation.navigate('Settings')} />
      <View style= {styles.titleView}>
        <Text style = {styles.title}>Welcome Home!</Text>
        <Text style = {styles.text}>{new Date().toLocaleString().split(",")[0]}</Text>
      </View>

      <View style = {styles.devicesView}>
        <Text style = {styles.devicesTitle}>Devices</Text>
        <View style = {styles.devicesContainer}>
          {userDeviceData.map((device, index) => {
            if (device.type === "Light") {

              const bgColor = device.rgb ? rgbToHex(device.rgb[0], device.rgb[1], device.rgb[2]) : 'black';

              return (
                <Pressable key = {device.id} style = {styles.lightContainer} onPress={() => navigation.navigate("Light", { device: device })}>
                  <Text style = {{fontSize: 20, fontWeight: 'semibold', color: 'white'}}>{device.location} Light</Text>
                  <Icon name="lightbulb-outline" size={64} color = "white" style = {{marginTop: 12}} />
                  <View style = {{backgroundColor : bgColor, borderRadius: '100%', width: 25, height: 25, position: 'absolute', right: 12, bottom: 12, borderWidth: 2, borderColor: 'white'}} />
                </Pressable>
              )
            }

            if (device.type === "Smart Frame") {
              return (
                <Pressable key = {device.id} style = {styles.lightContainer} onPress={() => navigation.navigate("PhotoFrame", { device: device })}>
                  <Text style = {{fontSize: 20, fontWeight: 'semibold', color: 'white'}}>Smart Frame</Text>
                  <Icon name="photo" size={64} color = "white" style = {{marginTop: 12}} />
                </Pressable>
              )
            }
          })}
          {/* <Pressable style = {styles.lightContainer} >
            <Text style = {{fontSize: 20, fontWeight: 'semibold', color: 'white'}}>Auto Coffee</Text>
            <Iconz name="coffee-maker-outline" size={64} color = "white" style = {{marginTop: 12}} />
          </Pressable> */}
          {
            userDeviceData.length === 0 && <Text style = {{fontSize: 16, margin: 8, textAlign: 'center', color: 'grey'}}>No devices found</Text>
          }
        </View>
      </View>
      
    </SafeAreaView>
  )
}

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
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
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
  devicesView: {
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 16,
    paddingTop: 0,
  },
  devicesTitle: {
    fontSize: 24,
    margin: 4,
    color: 'black',
    textAlign: 'left',
  },
  lightContainer: {
    width: 162,
    height: 162,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#2a9df1',
    margin: 8,
  },
  devicesContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  }

});

export default Dashboard