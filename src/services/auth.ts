import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export interface UserData {
  name: string;
  email: string;
  phone: string;
  location: string;
  role: 'client' | 'professional';
}

export const signUp = async (userData: UserData, password: string) => {
  try {
    // Criar usuário no Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      password
    );

    // Atualizar o perfil do usuário
    await updateProfile(userCredential.user, {
      displayName: userData.name
    });

    // Salvar dados adicionais no Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      ...userData,
      createdAt: new Date().toISOString()
    });

    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
}; 