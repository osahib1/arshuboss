
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDpdRnhuWp57slwtpIdRwS9W3pqpITr66s",
  authDomain: "arshu-9919.firebaseapp.com",
  projectId: "arshu-9919",
  storageBucket: "arshu-9919.firebasestorage.app",
  messagingSenderId: "629782428750",
  appId: "1:629782428750:web:4db3c0d9d68f89c75f971f",
  measurementId: "G-29KEM972QS"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const senderName = payload.data?.senderName || "New message";

  self.registration.showNotification(senderName, {
    body: "New message",
    icon: "./favicon.ico"
  });
});
