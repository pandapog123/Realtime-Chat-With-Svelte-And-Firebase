import {
  CollectionReference,
  Timestamp,
  collection,
  doc,
  getDoc,
  getFirestore,
  initializeFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { firebaseApp } from ".";
import type { User } from "firebase/auth";
import { get, writable } from "svelte/store";
import type { FirestoreUser } from "../types/firestore_user";
import { v4 } from "uuid";
import type { message } from "../types/message";

export const firestore = getFirestore(firebaseApp);

export const currentFirestoreUser = writable<FirestoreUser | null>(null);

const userCollection = collection(
  firestore,
  "user"
) as CollectionReference<FirestoreUser>;

export async function userChanges(user: User | null) {
  if (user == null) {
    currentFirestoreUser.set(null);

    return;
  }

  const userDocRef = doc(userCollection, user.uid);

  const userSnapshot = await getDoc(userDocRef);

  if (userSnapshot.exists()) {
    const userData = userSnapshot.data();

    currentFirestoreUser.set(userData);

    return;
  }

  const userData: FirestoreUser = {
    name: user.displayName || "User " + v4(),
    uid: user.uid,
    display_image_url: user.photoURL,
  };

  await setDoc<FirestoreUser>(userDocRef, {
    name: user.displayName || "User " + v4(),
    uid: user.uid,
    display_image_url: user.photoURL,
  });

  currentFirestoreUser.set(userData);
}

const messagesCollection = collection(
  firestore,
  "messages"
) as CollectionReference<message>;

export async function sendMessage(content: string) {
  let userid = get(currentFirestoreUser)?.uid;

  if (userid == null) {
    return;
  }

  const docId = v4();

  // const firestoreMessage: message = {
  //   content,
  //   date: new Date(Date.now()),
  //   uid: docId,
  //   userid: userid,
  // };

  const docRef = doc(firestore, "messages", docId);

  await setDoc(docRef, {
    content,
    date: Timestamp.now(),
    uid: docId,
    userid,
  });
}

export const messagesState = writable<message[]>([], (setState) => {
  const messagesQuery = query(
    messagesCollection,
    orderBy("date", "desc"),
    limit(30)
  );

  const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
    setState(
      snapshot.docs.map((docSnapshot) => {
        return docSnapshot.data();
      })
    );
  });

  return unsubscribe;
});

export async function getUserData(userid: string) {
  const userDoc = doc(userCollection, userid);

  return (await getDoc(userDoc)).data();
}
