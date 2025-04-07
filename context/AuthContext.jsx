import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { router } from 'expo-router';

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleNavigation = (authenticated, userRole) => {
    if (!authenticated) {
      // Not logged in, go to sign-in
      router.replace('/sign-in');
    } else {
      if (userRole === 'realtor') {
        router.replace('/realtor');
      } else if (userRole === 'customer') {
        router.replace('/regular');
      } else {
        // Role not set or unknown role - handle this case
        console.warn('User authenticated but has no valid role:', userRole);
        router.replace('/sign-in');
      }
    }
  };

   // Listen to Firebase Auth state changes
   useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          console.log('User authenticated:', firebaseUser.uid);
          
          // Fetch the user's profile document from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            const userRole = data.role || null;
            console.log('User role from firestore:', userRole);
            setRole(userRole);
            
            // Navigate based on authentication state and role
            handleNavigation(true, userRole);
          } else {
            console.warn('User document does not exist in Firestore');
            setRole(null);
            // User is authenticated but has no role/profile
            router.replace('/sign-in');
          }
        } else {
          // User is not authenticated
          console.log('No authenticated user');
          setUser(null);
          setRole(null);
          handleNavigation(false, null);
        }
      } catch (error) {
        console.error('Error in auth state change handler:', error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    });
    
    return () => unsubscribe();
  }, []);

  // Sign up a new user and create their profile in Firestore
  const signUp = async (email, password, roleChoice) => {
    setLoading(true);
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', cred.user.uid), {
      role: roleChoice,
      email: email
    });
    // onAuthStateChanged will update the state after sign-up.
  };

  // Sign in an existing user
  const signIn = async (email, password) => {
    setLoading(true);
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will update the state after sign-in.
  };

  // Sign out the current user
  const signOutUser = async () => {
    setLoading(true);
    await signOut(auth);
    // onAuthStateChanged will clear user and role.
  };

  const contextValue = {
    user,
    role,
    loading,
    signUp,
    signIn,
    signOut: signOutUser
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
