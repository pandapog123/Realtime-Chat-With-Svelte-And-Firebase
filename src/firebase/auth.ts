import {
  GoogleAuthProvider,
  type User,
  signInWithPopup,
  signInWithRedirect,
  getAuth,
} from "firebase/auth";
import { firebaseApp } from ".";
import { writable } from "svelte/store";
import { userChanges } from "./firestore";

export const auth = getAuth(firebaseApp);

export const authState = writable<User | null>(null);

auth.onAuthStateChanged((user) => {
  authState.set(user);

  userChanges(user);
});

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  const authResult = await signInWithPopup(auth, provider);

  return authResult;
}
