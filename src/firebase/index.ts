import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBBTG01w7yZetPDJh-IeLM4F0vqvdPnMsw",
  authDomain: "realtime-chat-with-svelte.firebaseapp.com",
  projectId: "realtime-chat-with-svelte",
  storageBucket: "realtime-chat-with-svelte.appspot.com",
  messagingSenderId: "673423218059",
  appId: "1:673423218059:web:cb0741ecd4bbdc68fd8b8e",
};

export const firebaseApp = initializeApp(firebaseConfig);
