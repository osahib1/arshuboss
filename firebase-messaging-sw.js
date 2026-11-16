
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
  const chatId = payload.data?.chatId || "";

  const targetUrl = new URL(
    "/arshuboss/chat.html?chatId=" + encodeURIComponent(chatId),
    self.location.origin
  ).href;

  self.registration.showNotification(senderName, {
    body: "New message",
    icon: "/arshuboss/favicon.ico",
    data: {
      url: targetUrl
    },
    tag: chatId ? "chat-" + chatId : "new-message"
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url ||
    new URL("/arshuboss/chat.html", self.location.origin).href;

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then(async (windowClients) => {
      for (const client of windowClients) {
        if ("navigate" in client) {
          await client.navigate(targetUrl);
          return client.focus();
        }
      }

      return clients.openWindow(targetUrl);
    })
  );
});
