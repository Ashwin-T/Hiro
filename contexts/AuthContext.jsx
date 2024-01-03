import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../config/Firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, createUserWithEmailAndPassword} from "firebase/auth";
import { doc, getDocs, collection, query, where } from "firebase/firestore";
import { setDoc } from "firebase/firestore";

const AuthContext = createContext();

const errorMap = {
  'Firebase: Error (auth/invalid-credential).': 'Email and password combination is not found',
  'Firebase: Error (auth/email-already-in-use).': 'Email is already in use',
}

const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [userDeviceData, setUserDeviceData] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {

    const getDeviceData = async () => {
      const q = query(collection(db, "devices"), where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const devicesTmp = [];
      querySnapshot.forEach((doc) => {
        devicesTmp.push(doc.data());
      });
      setUserDeviceData(devicesTmp);
    }

    if(user) {
      getDeviceData().then((data) => {
        setLoading(false);
      })
    }
    else {
      setLoading(false);
    }
    
  }, [user])
  const handleSignIn = async (email, password, setError) => {
    if (!email.trim() || !password.trim()) {
      setError('Email or password is empty');
      return;
    }
  
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
    } catch (error) {
      setError(errorMap[error.message] || error.message);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error during sign-out:', error);
    }
  };
  
  const handleRegister = async (email, password, setError) => {
    if (!email.trim() || !password.trim()) {
      setError('Email or password is empty');
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password.trim());
      
      // Signed in
      const user = userCredential.user;
  
      // Add user to database
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, {
        email: user.email,
        uid: user.uid,
      });
  
      setUser(user);
      setIsRegistering(false);
    } catch (error) {
      console.error('Error during registration:', error);
      setError(errorMap[error.message] || error.message);
    }
  };  

  const value = {
    user,
    handleSignIn,
    handleSignOut,
    handleRegister,
    isRegistering,
    setIsRegistering,
    loading,
    userDeviceData,
    setUserDeviceData,
    authLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
