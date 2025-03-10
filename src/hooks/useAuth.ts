import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { setUser, setLoading, setError } from '../store/slices/authSlice';
import { User } from '../types';

export const useAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData: User = {
          id: user.uid,
          email: user.email!,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };
        dispatch(setUser(userData));
      } else {
        dispatch(setUser(null));
      }
      dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, [dispatch]);

  const signUp = async (email: string, password: string) => {
    try {
      dispatch(setLoading(true));
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      const userData: User = {
        id: user.uid,
        email: user.email!,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
      dispatch(setUser(userData));
    } catch (error: any) {
      dispatch(setError(error.message));
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      dispatch(setLoading(true));
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const userData: User = {
        id: user.uid,
        email: user.email!,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
      dispatch(setUser(userData));
    } catch (error: any) {
      dispatch(setError(error.message));
    }
  };

  const signInWithGoogle = async () => {
    try {
      dispatch(setLoading(true));
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      const userData: User = {
        id: user.uid,
        email: user.email!,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
      dispatch(setUser(userData));
    } catch (error: any) {
      dispatch(setError(error.message));
    }
  };

  const logOut = async () => {
    try {
      dispatch(setLoading(true));
      await signOut(auth);
      dispatch(setUser(null));
    } catch (error: any) {
      dispatch(setError(error.message));
    }
  };

  return {
    signUp,
    signIn,
    signInWithGoogle,
    logOut,
  };
};

export default useAuth; 