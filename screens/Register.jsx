import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, Pressable} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';

const RegisterScreen = ({ navigation }) => {
  const { handleRegister, setIsRegistering } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const register = () => {
    handleRegister(email, password, setError);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style = {styles.titleView}>
        <Text style={styles.title}>Welcome to Hiro</Text>
        <Text style={styles.text}>A home assistant manager. Lets get started!</Text>  
      </View>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style = {{width: '85%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
        <Text style = {{marginBottom: 8, marginRight: 8, color: 'grey'}}></Text>
      </View>

      {
        error ? <Text style={{ color: 'red', margin: 8}}>{error}</Text> : null
      }

      <Button buttonStyle = {{backgroundColor: 'red'}} title="Register Now" onPress={register} />
      <Text style={styles.text}>Already have an account? <Text style = {{color: "#2a9df1", marginLeft: 8}} onPress = {() => setIsRegistering(false)}>Login</Text></Text>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white',
  },
  titleView: {
    width: '100%',
    alignItems: 'flex-start',
    padding: 16,
  },
  title: {
    fontSize: 38,
    margin: 8,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  input: {
    width: '85%',
    borderWidth: 1,
    borderColor: 'grey',
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 8,
    padding: 16,
  },
  text: {
    fontSize: 16,
    margin: 8,
    textAlign: 'center',
    color: 'grey',
  },

});

export default RegisterScreen;
