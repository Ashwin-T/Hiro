import 'react-native-gesture-handler'; // Should be on top. Must include this in order to use react navigation

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { StatusBar } from 'react-native';

import Dashboard from './screens/Dashboard';
import Login from './screens/Login';
import Register from './screens/Register';
import Settings from './screens/Settings';
import Light from './screens/devices/Light';
import PhotoFrame from './screens/devices/PhotoFrame';
import Loading from './screens/Loading';

const App = () => {

  const { user, isRegistering, loading, authLoading } = useAuth();
  const Stack = createStackNavigator();

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <NavigationContainer>
          <Stack.Navigator>
            {
              (loading || authLoading) ? (
                <Stack.Screen name="Loading" component={Loading} options={{ headerShown: false }} />
              ) :
              (
                <>
                  {user ? (
                    <>
                      <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
                      <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
                      <Stack.Screen name="Light" component={Light} options={{ headerShown: false }} />
                      <Stack.Screen name="PhotoFrame" component={PhotoFrame} options={{ headerShown: false }} />
                    </>
                  ) : (
                    <>
                      {isRegistering ? (
                        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
                      ) : (
                        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                      )}
                    </>
                  )}
                </>
              )
            }
          </Stack.Navigator>
        </NavigationContainer>
    </>
  );
};

const AppWrapper = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppWrapper;
