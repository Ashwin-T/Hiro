
import { SafeAreaView, View, Text, StyleSheet, Pressable } from "react-native"
import { useAuth } from "../contexts/AuthContext"
import SettingsChooser from "../components/SettingsChooser";
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconSignOut from 'react-native-vector-icons/Octicons';

const SettingsScreen = ({navigation}) => {

  const { handleSignOut } = useAuth();

  return (
    <SafeAreaView style = {styles.container}>

      <View style= {styles.titleView}>
        <Icon name="arrow-back" size={32} color="black" onPress = {()=> navigation.navigate('Dashboard')} />
        <Text style = {styles.title}>Settings</Text>
      </View>

      <Text style = {styles.heading}>Account</Text>
      <SettingsChooser title="Change Password" icon = 'lock' />
      <Text style = {styles.heading}>Advanced</Text>
      <SettingsChooser title="Delete Account" iconColor = 'red' icon = 'delete-outline'/>

      <Pressable style = {{display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection : 'row', marginTop: 16}} onPress = {handleSignOut}>
        <IconSignOut name="sign-out" size={32} color="orange" />
        <Text style = {{color: 'orange', fontSize: 18, margin: 8}}>Sign Out</Text>
      </Pressable>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'flex-start',
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
  heading : {
    fontSize: 18,
    margin: 8,
    color: 'grey',
    textAlign: 'left',
  }
})

export default SettingsScreen;