import {
  initializeApp, getApps, getApp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
  getAuth, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
  getFirestore, doc, getDoc, setDoc, collection,
  query, where, getDocs, orderBy, onSnapshot,
  serverTimestamp, increment
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import {
  getDatabase, ref, onValue, set, onDisconnect,
  serverTimestamp as rtdbServerTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

import {
  getMessaging,
  getToken,
  isSupported
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyDpdRnhuWp57slwtpIdRwS9W3pqpITr66s",
  authDomain: "arshu-9919.firebaseapp.com",
  projectId: "arshu-9919",
  storageBucket: "arshu-9919.firebasestorage.app",
  messagingSenderId: "629782428750",
  appId: "1:629782428750:web:4db3c0d9d68f89c75f971f",
  measurementId: "G-29KEM972QS"
};


const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app, "https://arshu-9919-default-rtdb.firebaseio.com");

const VAPID_KEY = "BJlUfYA55zWObgrGZSBeim10WVhrlL9_r3XsqXYxOpTk8JEUqa5ZxNd6VFtZ3BM7PPkptg3ZdzyinECymj_rXq0";

const notificationButton = document.createElement("button");
notificationButton.textContent = "Enable Notifications";

notificationButton.style.cssText = `
  position:fixed;
  bottom:20px;
  right:15px;
  z-index:99999;
  padding:12px 18px;
  border:0;
  border-radius:25px;
  background:#075e54;
  color:white;
  font-size:14px;
  cursor:pointer;
`;

document.body.appendChild(notificationButton);

notificationButton.addEventListener("click", async () => {
  try {
    if (!("Notification" in window)) {
      alert("Is browser mein notifications supported nahi hain.");
      return;
    }

    if (!await isSupported()) {
      alert("Is browser mein Firebase notifications supported nahi hain.");
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      alert("Notification permission allow nahi hui.");
      return;
    }

    // const registration = await navigator.serviceWorker.register(
    //   "./firebase-messaging-sw.js"
    // );

    // const messaging = getMessaging(app);

    // const token = await getToken(messaging, {
    //   vapidKey: VAPID_KEY,
    //   serviceWorkerRegistration: registration
    // });
   const registration = await navigator.serviceWorker.register(
  "/arshuboss/firebase-messaging-sw.js",
  { scope: "/arshuboss/" }
);

await navigator.serviceWorker.ready;

const messaging = getMessaging(app);

const token = await getToken(messaging, {
  vapidKey: VAPID_KEY,
  serviceWorkerRegistration: registration
});
    if (!token) {
      alert("Notification token generate nahi hua.");
      return;
    }

    if (!me) {
  alert("Pehle login karo.");
  return;
}

await setDoc(
  doc(db, "users", me.uid, "fcmTokens", token),
  {
    token: token,
    createdAt: serverTimestamp()
  },
  { merge: true }
);

console.log("FCM token saved successfully");
    notificationButton.textContent = "Notifications Enabled";

    alert("Notifications permission aur device token ready hai!");

  } catch (error) {
    console.error("Notification Error:", error);
    alert("Error: " + error.message);
  }
});


const $ = id => document.getElementById(id);

let me = null;
let activeChat = null;
let activeOther = null;

let stopMessages = null;
let stopSettings = null;
let stopHidden = null;
let stopMyConnection = null;
let stopOtherPresence = null;
let stopOtherRead = null;
let stopOtherTyping = null;
let stopRecent = null;

let typingTimer = null;
let typingActive = false;

let otherLastReadAt = null;
let replyToMessage = null;

let allMessages = [];
let hiddenIds = new Set();
let clearedAt = null;

let selecting = false;
let selectedIds = new Set();
let pressTimer = null;

let recentChatData = [];
let recentSettings = new Map();
let recentProfiles = new Map();
let recentSettingsStops = new Map();
let profilePromises = new Map();
let renderVersion = 0;

const search = $("search");
const find = $("find");
const result = $("result");
const messagesBox = $("messages");
const messageInput = $("messageInput");
const send = $("send");
const photoBtn = $("photoBtn");
const photoInput = $("photoInput");

function setStatus(message) {
  if ($("status")) $("status").textContent = message || "";
}

// USER AVATAR
function showAvatar(container, user) {
  if (!container) return;

  container.innerHTML = "";

  const name = user.displayName || user.username || "?";
  const initial = name.charAt(0).toUpperCase();

  if (!user.photoBase64) {
    container.textContent = initial;
    return;
  }

  const img = document.createElement("img");
  img.alt = "User DP";
  img.src = user.photoBase64;

  img.style.cssText = `
    width:100%;height:100%;object-fit:cover;
    border-radius:50%;display:block;
  `;

  img.onerror = () => {
    container.innerHTML = "";
    container.textContent = initial;
  };

  container.appendChild(img);
}

// MESSAGE MENU
const menu = document.createElement("div");
menu.id = "messageMenu";

menu.style.cssText = `
  display:none;position:fixed;z-index:99999;
  background:#202c33;color:white;
  border:1px solid #40515b;border-radius:10px;
  padding:6px;min-width:150px;
  box-shadow:0 5px 25px #0009;
`;

document.body.appendChild(menu);

function closeMenu() {
  clearTimeout(pressTimer);
  menu.style.display = "none";
  menu.innerHTML = "";
}

function menuButton(label, action, danger = false) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;

  button.style.cssText = `
    display:block;width:100%;padding:12px;
    border:0;border-radius:7px;text-align:left;
    background:transparent;color:${danger ? "#ff7777" : "white"};
    cursor:pointer;font-size:14px;
  `;

  button.onclick = action;
  menu.appendChild(button);
}

document.addEventListener("click", e => {
  if (menu.style.display === "block" && !menu.contains(e.target)) {
    closeMenu();
  }
});

// ONLINE / OFFLINE
function startMyPresence(uid) {
  if (stopMyConnection) stopMyConnection();

  const myPresenceRef = ref(rtdb, "status/" + uid);
  const connectedRef = ref(rtdb, ".info/connected");

  stopMyConnection = onValue(connectedRef, async snapshot => {
    if (snapshot.val() !== true) return;

    try {
      await onDisconnect(myPresenceRef).set({
        state: "offline",
        lastChanged: rtdbServerTimestamp()
      });

      await set(myPresenceRef, {
        state: "online",
        lastChanged: rtdbServerTimestamp()
      });
    } catch (error) {
      console.error("Presence error:", error);
    }
  });
}

function watchOtherPresence(uid) {
  if (stopOtherPresence) stopOtherPresence();

  const statusElement = $("chatStatus");
  if (!statusElement) return;

  statusElement.textContent = "Checking...";

  stopOtherPresence = onValue(
    ref(rtdb, "status/" + uid),
    snapshot => {
      const data = snapshot.val();

      if (data && data.state === "online") {
        statusElement.textContent = "● Online";
        statusElement.style.color = "#25d366";
      } else if (data && data.lastChanged) {
        statusElement.textContent =
          "Last seen " +
          new Date(data.lastChanged).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          });

        statusElement.style.color = "#999";
      } else {
        statusElement.textContent = "Offline";
        statusElement.style.color = "#999";
      }
    },
    error => {
      statusElement.textContent = "Status unavailable";
      console.error(error);
    }
  );
}

// RECENT CHAT TIME
function formatRecentTime(timestamp) {
  if (!timestamp) return "";

  const date = timestamp.toDate
    ? timestamp.toDate()
    : new Date(timestamp);

  if (isNaN(date.getTime())) return "";

  const today = new Date();

  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  return date.toLocaleDateString([], {
    day: "2-digit",
    month: "short"
  });
}

// GET PROFILE
async function getRecentProfile(uid) {
  if (recentProfiles.has(uid)) return recentProfiles.get(uid);
  if (profilePromises.has(uid)) return profilePromises.get(uid);

  const promise = (async () => {
    try {
      const snap = await getDoc(doc(db, "profiles", uid));

      const profile = snap.exists()
        ? { ...snap.data(), uid }
        : { uid, username: "User" };

      recentProfiles.set(uid, profile);
      return profile;
    } catch (error) {
      console.error("Profile error:", error);
      return { uid, username: "User" };
    }
  })();

  profilePromises.set(uid, promise);
  const profile = await promise;
  profilePromises.delete(uid);

  return profile;
}

// RECENT CHAT SETTINGS
function listenToRecentSettings(chatId) {
  if (recentSettingsStops.has(chatId)) return;

  const settingsRef = doc(
    db, "chats", chatId, "userSettings", me.uid
  );

  const unsubscribe = onSnapshot(
    settingsRef,
    snap => {
      recentSettings.set(chatId, snap.exists() ? snap.data() : {});
      renderRecentChats();
    },
    error => console.error("Recent settings error:", error)
  );

  recentSettingsStops.set(chatId, unsubscribe);
}

// START RECENT CHATS
function startRecentChats() {
  if (stopRecent) stopRecent();

  const recentBox = $("recentChats");
  if (!recentBox) return;

  recentBox.textContent = "Loading recent chats...";

  const q = query(
    collection(db, "chats"),
    where("participants", "array-contains", me.uid)
  );

  stopRecent = onSnapshot(
    q,
    snapshot => {
      recentChatData = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));

      const currentIds = new Set(recentChatData.map(c => c.id));

      for (const [chatId, unsubscribe] of recentSettingsStops) {
        if (!currentIds.has(chatId)) {
          unsubscribe();
          recentSettingsStops.delete(chatId);
          recentSettings.delete(chatId);
        }
      }

      recentChatData.forEach(chat => listenToRecentSettings(chat.id));
      renderRecentChats();
    },
    error => {
      console.error("Recent chats error:", error);
      recentBox.textContent = "Recent chats error: " + error.message;
    }
  );
}

async function renderRecentChats() {
  const recentBox = $("recentChats");
  if (!recentBox || !me) return;

  const version = ++renderVersion;

  const chats = [...recentChatData].sort((a, b) => {
    const aTime = a.updatedAt?.toMillis?.() || 0;
    const bTime = b.updatedAt?.toMillis?.() || 0;
    return bTime - aTime;
  });

  if (!chats.length) {
    recentBox.textContent = "No recent chats yet";
    return;
  }

  const prepared = await Promise.all(chats.map(async chat => {
    const otherUid = (chat.participants || []).find(uid => uid !== me.uid);
    if (!otherUid) return null;

    const profile = await getRecentProfile(otherUid);
    return { chat, profile };
  }));

  if (version !== renderVersion) return;

  recentBox.innerHTML = "";

  prepared.filter(Boolean).forEach(({ chat, profile }) => {
    const settings = recentSettings.get(chat.id) || {};
    const unread = Number(settings.unreadCount || 0);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "recent-item";

    const avatar = document.createElement("div");
    avatar.className = "recent-avatar";
    showAvatar(avatar, profile);

    const info = document.createElement("div");
    info.className = "recent-info";

    const name = document.createElement("div");
    name.className = "recent-name";
    name.textContent = profile.displayName || profile.username || "User";

    const preview = document.createElement("div");
    preview.className = "recent-preview";

    let lastMessage = chat.lastMessage || "Tap to start chatting";

    if (chat.lastSenderUid === me.uid && chat.lastMessage) {
      lastMessage = "You: " + lastMessage;
    }

    preview.textContent = lastMessage;
    info.append(name, preview);

    const right = document.createElement("div");
    right.className = "recent-right";

    const time = document.createElement("div");
    time.className = "recent-time";
    time.textContent = formatRecentTime(chat.updatedAt);
    right.appendChild(time);

    if (unread > 0) {
      const badge = document.createElement("div");
      badge.className = "unread-badge";
      badge.textContent = unread > 99 ? "99+" : String(unread);
      right.appendChild(badge);
    }

    button.append(avatar, info, right);
    button.onclick = () => openChat(profile);
    recentBox.appendChild(button);
  });
}

// TYPING STATUS
function stopTyping() {
  clearTimeout(typingTimer);
  typingActive = false;

  if (me && activeChat) {
    set(ref(rtdb, `typing/${activeChat}/${me.uid}`), {
      isTyping: false
    }).catch(console.error);
  }
}

function handleTyping() {
  if (!me || !activeChat) return;

  const typingRef = ref(
    rtdb,
    `typing/${activeChat}/${me.uid}`
  );

  if (messageInput.value.trim()) {
    if (!typingActive) {
      typingActive = true;

      set(typingRef, {
        isTyping: true
      }).catch(console.error);

      onDisconnect(typingRef).set({
        isTyping: false
      }).catch(console.error);
    }

    clearTimeout(typingTimer);

    typingTimer = setTimeout(() => {
      stopTyping();
    }, 2000);
  } else {
    stopTyping();
  }
}

if (messageInput) {
  messageInput.addEventListener("input", handleTyping);
}

// WATCH OTHER USER TYPING
function watchOtherTyping(uid, chatId) {
  if (stopOtherTyping) stopOtherTyping();

  const typingElement = $("typingIndicator");
  if (!typingElement) return;

  typingElement.style.display = "none";

  stopOtherTyping = onValue(
    ref(rtdb, `typing/${chatId}/${uid}`),
    snapshot => {
      const data = snapshot.val();

      if (data && data.isTyping === true) {
        typingElement.textContent = "Typing...";
        typingElement.style.display = "block";
      } else {
        typingElement.style.display = "none";
      }
    },
    error => console.error("Typing error:", error)
  );
}

// WATCH OTHER USER READ RECEIPT - BLUE TICK
function watchOtherReadStatus(chatId, otherUid) {
  if (stopOtherRead) stopOtherRead();

  const receiptRef = doc(
    db,
    "chats",
    chatId,
    "readReceipts",
    otherUid
  );

  stopOtherRead = onSnapshot(
    receiptRef,
    snap => {
      otherLastReadAt = snap.exists()
        ? snap.data().lastReadAt || null
        : null;

      renderMessages();
    },
    error => {
      console.error("Seen status error:", error);
      setStatus("Seen status error: " + error.message);
    }
  );
}

// STOP CHAT LISTENERS
function stopListeners() {
  if (stopMessages) stopMessages();
  if (stopSettings) stopSettings();
  if (stopHidden) stopHidden();
  if (stopOtherRead) stopOtherRead();
  if (stopOtherTyping) stopOtherTyping();

  stopMessages = null;
  stopSettings = null;
  stopHidden = null;
  stopOtherRead = null;
  stopOtherTyping = null;

  stopTyping();

  otherLastReadAt = null;

  if ($("typingIndicator")) {
    $("typingIndicator").style.display = "none";
  }
}

// MARK AS READ
async function markChatRead(chatId) {
  if (!me || !chatId) return;

  try {
    await setDoc(
      doc(db, "chats", chatId, "userSettings", me.uid),
      {
        unreadCount: 0,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );

    await setDoc(
      doc(db, "chats", chatId, "readReceipts", me.uid),
      {
        lastReadAt: serverTimestamp()
      },
      { merge: true }
    );

  } catch (error) {
    console.error("Mark read error:", error);
    setStatus("Read status error: " + error.message);
  }
}

// MESSAGE VISIBILITY
function messageIsVisible(message, id) {
  if (hiddenIds.has(id)) return false;

  if (clearedAt && message.createdAt) {
    if (message.createdAt.toMillis() <= clearedAt.toMillis()) {
      return false;
    }
  }

  return true;
}


// LOGIN
onAuthStateChanged(auth, user => {
  if (!user) {
    if (stopMyConnection) stopMyConnection();
    if (stopRecent) stopRecent();

    for (const unsubscribe of recentSettingsStops.values()) {
      unsubscribe();
    }

    recentSettingsStops.clear();
    location.href = "index.html";
    return;
  }

  me = user;

  startMyPresence(user.uid);
  startRecentChats();

  // Notification par click karne se wahi chat open hogi
  openChatFromNotification();
});

// SEARCH USER
if (find) {
  find.onclick = async () => {
    if (!me) {
      result.textContent = "Login loading...";
      return;
    }

    const username = search.value.trim().toLowerCase();

    if (!username) {
      result.textContent = "Username enter karo";
      return;
    }

    result.textContent = "Searching...";

    try {
      const q = query(
        collection(db, "profiles"),
        where("username", "==", username)
      );

      const snap = await getDocs(q);
      result.innerHTML = "";

      if (snap.empty) {
        result.textContent = "User nahi mila";
        return;
      }

      snap.forEach(d => {
        const p = { ...d.data(), uid: d.id };
        if (p.uid === me.uid) return;

        const btn = document.createElement("button");
        btn.type = "button";

        const avatar = document.createElement("div");
        avatar.className = "search-avatar";
        showAvatar(avatar, p);

        const name = document.createElement("span");
        name.textContent =
          (p.displayName || p.username || "User") +
          " (@" + (p.username || "") + ")";

        btn.append(avatar, name);
        btn.onclick = () => openChat(p);
        result.appendChild(btn);
      });

      if (!result.children.length) {
        result.textContent = "Apna username search mat karo";
      }
    } catch (error) {
      result.textContent = "Search error: " + error.message;
    }
  };
}

// OPEN CHAT
async function openChat(other) {
  if (!me || !other.uid || other.uid === me.uid) return;

  const participants = [me.uid, other.uid].sort();
  const chatId = participants.join("_");

  try {
    stopListeners();

    if (stopOtherPresence) {
      stopOtherPresence();
      stopOtherPresence = null;
    }

    closeMenu();

    activeChat = chatId;
    activeOther = other;

    allMessages = [];
    hiddenIds = new Set();
    clearedAt = null;
    otherLastReadAt = null;
    selectedIds.clear();
    selecting = false;
    cancelReply();

    if ($("chatTitle")) {
      $("chatTitle").textContent =
        (other.displayName || other.username || "User") +
        " (@" + (other.username || "") + ")";
    }

    showAvatar($("chatAvatar"), other);
    watchOtherPresence(other.uid);
    watchOtherTyping(other.uid, chatId);

    messagesBox.innerHTML = "";
    updateSelectionBar();
    document.body.classList.add("chat-open");

    const chatRef = doc(db, "chats", chatId);
    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) {
      await setDoc(chatRef, {
        participants,
        createdAt: serverTimestamp(),
        lastMessage: "",
        lastSenderUid: "",
        updatedAt: serverTimestamp()
      });
    } else {
      const existing = chatSnap.data();

      if (
        !Array.isArray(existing.participants) ||
        existing.participants.length !== 2 ||
        !participants.every(uid => existing.participants.includes(uid))
      ) {
        throw new Error("Chat participants match nahi kar rahe.");
      }
    }

    if (activeChat !== chatId) return;

    watchOtherReadStatus(chatId, other.uid);

    await markChatRead(chatId);

    const settingsRef = doc(
      db, "chats", chatId, "userSettings", me.uid
    );

    stopSettings = onSnapshot(
      settingsRef,
      snap => {
        clearedAt = snap.exists() ? snap.data().clearedAt || null : null;
        renderMessages();
      },
      error => setStatus("Settings error: " + error.message)
    );

    const hiddenRef = collection(
      db, "chats", chatId,
      "userSettings", me.uid, "hiddenMessages"
    );

    stopHidden = onSnapshot(
      hiddenRef,
      snap => {
        hiddenIds = new Set(snap.docs.map(d => d.id));
        renderMessages();
      },
      error => setStatus("Hidden messages error: " + error.message)
    );

    const messagesQuery = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    stopMessages = onSnapshot(
      messagesQuery,
      snap => {
        allMessages = snap.docs.map(d => ({
          id: d.id,
          ...d.data()
        }));

        renderMessages();

        if (
          activeChat === chatId &&
          snap.docs.some(d => d.data().senderUid !== me.uid)
        ) {
          markChatRead(chatId);
        }
      },
      error => setStatus("Messages error: " + error.message)
    );

  } catch (error) {
    setStatus("Chat error: " + error.message);
    console.error(error);
  }
}



// OPEN CHAT FROM NOTIFICATION
async function openChatFromNotification() {
  const params = new URLSearchParams(window.location.search);
  const chatId = params.get("chatId");

  if (!chatId || !me) return;

  try {
    const chatSnap = await getDoc(doc(db, "chats", chatId));

    if (!chatSnap.exists()) {
      console.error("Notification chat not found");
      return;
    }

    const participants = chatSnap.data().participants || [];
    const otherUid = participants.find(uid => uid !== me.uid);

    if (!otherUid || !participants.includes(me.uid)) {
      console.error("Invalid chat participants");
      return;
    }

    const otherProfile = await getRecentProfile(otherUid);

    await openChat(otherProfile);

    // URL se chatId hata do, chat khuli rahegi
    window.history.replaceState(
      {},
      document.title,
      window.location.pathname
    );

  } catch (error) {
    console.error("Notification chat open error:", error);
  }
}


// SELECTION BAR
function updateSelectionBar() {
  let bar = $("selectionBar");

  if (!bar) {
    bar = document.createElement("div");
    bar.id = "selectionBar";

    bar.style.cssText = `
      display:none;align-items:center;gap:8px;
      padding:10px;background:#172229;color:white;
    `;

    messagesBox.insertAdjacentElement("beforebegin", bar);
  }

  bar.innerHTML = "";

  if (!selecting) {
    bar.style.display = "none";
    return;
  }

  bar.style.display = "flex";

  const count = document.createElement("span");
  count.textContent = "Selected: " + selectedIds.size;
  count.style.marginRight = "auto";
  bar.appendChild(count);

  const del = document.createElement("button");
  del.textContent = "Delete";
  del.type = "button";
  del.onclick = deleteSelectedMessages;
  bar.appendChild(del);

  const cancel = document.createElement("button");
  cancel.textContent = "Cancel";
  cancel.type = "button";
  cancel.onclick = cancelSelection;
  bar.appendChild(cancel);
}

// LONG PRESS
function startLongPress(messageId, x, y) {
  if (selecting) return;

  clearTimeout(pressTimer);
  pressTimer = setTimeout(() => showMessageMenu(messageId, x, y), 2000);
}

function stopLongPress() {
  clearTimeout(pressTimer);
}

// REPLY MENU
function showMessageMenu(messageId, x, y) {
  closeMenu();

  const message = allMessages.find(m => m.id === messageId);

  if (message) {
    menuButton("↩ Reply", () => {
      closeMenu();
      startReply(message);
    });
  }

  menuButton("Select", () => {
    selecting = true;
    selectedIds.clear();
    selectedIds.add(messageId);
    closeMenu();
    updateSelectionBar();
    renderMessages();
  });

  menuButton("Delete", async () => {
    closeMenu();

    if (confirm("Ye message sirf tumhari side se delete karna hai?")) {
      await hideMessages([messageId]);
    }
  }, true);

  menuButton("Clear All", async () => {
    closeMenu();
    await clearAllForMe();
  }, true);

  menu.style.display = "block";

  menu.style.left = Math.max(8, Math.min(x, window.innerWidth - 178)) + "px";
  menu.style.top = Math.max(8, Math.min(y, window.innerHeight - 220)) + "px";
}

// START REPLY
function startReply(message) {
  replyToMessage = {
    messageId: message.id,
    senderUid: message.senderUid,
    text: message.type === "photo"
      ? "Photo"
      : (message.text || "")
  };

  if ($("replyName")) {
    $("replyName").textContent =
      message.senderUid === me.uid
        ? "You"
        : (activeOther?.username || "User");
  }

  if ($("replyText")) {
    $("replyText").textContent = replyToMessage.text;
  }

  if ($("replyPreview")) {
    $("replyPreview").hidden = false;
  }

  if (messageInput) messageInput.focus();
}

// CANCEL REPLY
function cancelReply() {
  replyToMessage = null;

  if ($("replyPreview")) {
    $("replyPreview").hidden = true;
  }

  if ($("replyText")) {
    $("replyText").textContent = "";
  }
}

if ($("cancelReply")) {
  $("cancelReply").onclick = cancelReply;
}

// RENDER MESSAGES
function renderMessages() {
  if (!messagesBox || !me) return;

  messagesBox.innerHTML = "";

  const visible = allMessages.filter(m =>
    messageIsVisible(m, m.id)
  );

  visible.forEach(m => {
    const isMine = m.senderUid === me.uid;

    const row = document.createElement("div");
    row.className = "msg-row " + (isMine ? "mine" : "theirs");
    row.dataset.messageId = m.id;

    if (selecting) {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "msg-select";
      checkbox.checked = selectedIds.has(m.id);

      checkbox.onchange = () => {
        if (checkbox.checked) selectedIds.add(m.id);
        else selectedIds.delete(m.id);

        updateSelectionBar();
      };

      row.appendChild(checkbox);
    }

    const bubble = document.createElement("div");
    bubble.className = isMine ? "msg my-msg" : "msg other-msg";

    // REPLY QUOTE
    if (m.replyTo) {
      const quote = document.createElement("div");
      quote.className = "reply-quote";

      const quoteName = document.createElement("strong");
      quoteName.textContent =
        m.replyTo.senderUid === me.uid
          ? "You"
          : (activeOther?.username || "User");

      const quoteText = document.createElement("span");
      quoteText.textContent = m.replyTo.text || "Message";

      quote.append(quoteName, quoteText);
      bubble.appendChild(quote);
    }

    // MESSAGE CONTENT
    if (m.type === "photo" && m.photo) {
      const img = document.createElement("img");
      img.src = m.photo;
      img.alt = "Chat photo";
      img.className = "chat-photo";

      img.onclick = () => {
        if (selecting) return;

        const w = window.open();
        if (w) {
          const image = w.document.createElement("img");
          image.src = m.photo;
          image.style.maxWidth = "100%";
          w.document.body.appendChild(image);
        }
      };

      bubble.appendChild(img);

      if (m.text && m.text !== "Photo") {
        const caption = document.createElement("div");
        caption.className = "message-content";
        caption.textContent = m.text;
        bubble.appendChild(caption);
      }
    } else {
      const textNode = document.createElement("div");
      textNode.className = "message-content";
      textNode.textContent = m.text || "";
      bubble.appendChild(textNode);
    }

    // BOTTOM TIME + TICKS
    const footer = document.createElement("div");
    footer.className = "message-footer";

    if (m.createdAt) {
      const time = document.createElement("span");

      const date = m.createdAt.toDate
        ? m.createdAt.toDate()
        : new Date(m.createdAt);

      time.className = "message-time";
      time.textContent = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });

      footer.appendChild(time);
    }

    // SENT / SEEN TICKS
    if (isMine) {
      let isSeen = false;

      if (otherLastReadAt && m.createdAt) {
        const readTime = otherLastReadAt.toMillis
          ? otherLastReadAt.toMillis()
          : new Date(otherLastReadAt).getTime();

        const messageTime = m.createdAt.toMillis
          ? m.createdAt.toMillis()
          : new Date(m.createdAt).getTime();

        isSeen = readTime >= messageTime;
      }

      const ticks = document.createElement("span");
      ticks.className = "message-ticks" + (isSeen ? " seen" : "");
      ticks.textContent = isSeen ? "✓✓" : "✓";

      footer.appendChild(ticks);
    }

    if (footer.children.length > 0) {
      bubble.appendChild(footer);
    }

    // MESSAGE SELECTION
    row.onclick = e => {
      if (!selecting || e.target.tagName === "INPUT") return;

      if (selectedIds.has(m.id)) selectedIds.delete(m.id);
      else selectedIds.add(m.id);

      renderMessages();
      updateSelectionBar();
    };

    // LONG PRESS AND REPLY MENU
    row.style.touchAction = "pan-y";

    row.addEventListener("pointerdown", e => {
      if (!selecting) startLongPress(m.id, e.clientX, e.clientY);
    });

    row.addEventListener("pointermove", e => {
      if (Math.abs(e.movementX) > 10 || Math.abs(e.movementY) > 10) {
        stopLongPress();
      }
    });

    row.addEventListener("pointerup", stopLongPress);
    row.addEventListener("pointerleave", stopLongPress);
    row.addEventListener("pointercancel", stopLongPress);

    row.addEventListener("contextmenu", e => {
      e.preventDefault();
      if (!selecting) showMessageMenu(m.id, e.clientX, e.clientY);
    });

    row.appendChild(bubble);
    messagesBox.appendChild(row);
  });

  if ($("messageCount")) {
    const myCount = visible.filter(m => m.senderUid === me.uid).length;
    const otherCount = visible.filter(m => m.senderUid !== me.uid).length;

    $("messageCount").textContent =
      `You: ${myCount} | ${activeOther?.username || "Other"}: ${otherCount}`;
  }

messagesBox.scrollTop = messagesBox.scrollHeight;
  ;
};


// HIDE MESSAGES FOR MYSELF
function cancelSelection() {
  selecting = false;
  selectedIds.clear();
  closeMenu();
  updateSelectionBar();
  renderMessages();
}

async function hideMessages(ids) {
  if (!activeChat || !me || !ids.length) return;

  try {
    const base = collection(
      db, "chats", activeChat,
      "userSettings", me.uid, "hiddenMessages"
    );

    await Promise.all(ids.map(id =>
      setDoc(doc(base, id), { hiddenAt: serverTimestamp() })
    ));

    cancelSelection();
    setStatus("Messages tumhari side se hide ho gaye.");
  } catch (error) {
    alert("Delete error: " + error.message);
  }
}

async function deleteSelectedMessages() {
  const ids = [...selectedIds];

  if (!ids.length) {
    alert("Pehle messages select karo.");
    return;
  }

  if (!confirm(`${ids.length} selected messages tumhari side se delete karne hain?`)) {
    return;
  }

  await hideMessages(ids);
}

async function clearAllForMe() {
  if (!activeChat || !me) {
    alert("Pehle chat open karo.");
    return;
  }

  if (!confirm("Tumhari side se poori chat clear karni hai? Doosre user ki chat par koi effect nahi hoga.")) {
    return;
  }

  try {
    await setDoc(
      doc(db, "chats", activeChat, "userSettings", me.uid),
      {
        clearedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );

    cancelSelection();
    setStatus("Tumhari side se chat clear ho gayi.");
  } catch (error) {
    alert("Clear chat error: " + error.message);
  }
}

// SEND MESSAGE



async function sendChatPushNotification(chatId, recipientUid) {
  try {
    if (!me || !chatId || !recipientUid) return;

    const idToken = await me.getIdToken();

    const response = await fetch(
      "https://arshu-chat-notifications.kasimlalau772.workers.dev/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({
          chatId: chatId,
          recipientUid: recipientUid
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Push notification error:", result);
      return;
    }

    console.log("Push notification result:", result);

  } catch (error) {
    // Notification fail hone par bhi message send rahega
    console.error("Push notification failed:", error);
  }
}

 

async function sendChatMessage(messageData, previewText) {
  if (!activeChat || !activeOther || !me) {
    throw new Error("Pehle user select karo.");
  }

  // Current chat aur users ki details save
  const chatId = activeChat;
  const senderUid = me.uid;
  const recipientUid = activeOther.uid;

  if (senderUid === recipientUid) {
    throw new Error("Khud ko message nahi bhej sakte.");
  }

  const chatRef = doc(db, "chats", chatId);

  const recipientSettingsRef = doc(
    db,
    "chats",
    chatId,
    "userSettings",
    recipientUid
  );

  let stage = "Chat document read";

  try {
    // 1. Chat document check
    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) {
      throw new Error("Chat document nahi mila.");
    }

    const participants = chatSnap.data().participants || [];

    if (
      participants.length !== 2 ||
      !participants.includes(senderUid) ||
      !participants.includes(recipientUid)
    ) {
      throw new Error("Chat participants match nahi kar rahe.");
    }

    // 2. Message save
    stage = "Message save";

    const messageRef = doc(
      collection(db, "chats", chatId, "messages")
    );

    await setDoc(messageRef, {
      ...messageData,
      senderUid,
      createdAt: serverTimestamp()
    });

    // 3. Latest message update
    stage = "Latest message update";

    await setDoc(
      chatRef,
      {
        lastMessage: previewText,
        lastSenderUid: senderUid,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );

    // 4. Receiver unread count update
    stage = "Receiver unread count update";

    await setDoc(
      recipientSettingsRef,
      {
        unreadCount: increment(1),
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );

    // 5. Push notification send
    // Notification fail hone par message delete nahi hoga
    await sendChatPushNotification(chatId, recipientUid);

    return true;

  } catch (error) {
    console.error("FAILED STAGE:", stage, error);

    throw new Error(
      stage + " failed: " + error.message
    );
  }
}


// SEND TEXT - MOBILE KEYBOARD FIX
if (send) {
  send.onclick = sendText;

  // Mouse click par input focus preserve karo
  send.addEventListener("pointerdown", e => {
    if (e.pointerType === "mouse") {
      e.preventDefault();
    }
  });
}

if (messageInput) {
  messageInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendText();
    }
  });
}

async function sendText() {
  const text = messageInput.value.trim();

  if (!text || !activeChat || !me) return;

  send.disabled = true;

  try {
    await sendChatMessage({
      type: "text",
      text,
      ...(replyToMessage ? { replyTo: replyToMessage } : {})
    }, text);

    messageInput.value = "";
    cancelReply();
    stopTyping();

    setStatus("Message sent!");

  } catch (error) {
    alert("Message error: " + error.message);
    console.error(error);

  } finally {
    send.disabled = false;

    // Keyboard ke liye input focus wapas
    if (activeChat && messageInput) {
      messageInput.focus({ preventScroll: true });
    }
  }
}

// SEND PHOTO
if (photoBtn && photoInput) {
  photoBtn.onclick = () => {
    if (!activeChat) {
      alert("Pehle user select karo");
      return;
    }

    photoInput.click();
  };

  photoInput.onchange = async () => {
    const file = photoInput.files[0];

    if (!file || !activeChat || !me) return;

    if (!file.type.startsWith("image/")) {
      alert("Image select karo");
      photoInput.value = "";
      return;
    }

    let url = null;

    try {
      const img = new Image();
      url = URL.createObjectURL(file);
      img.src = url;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement("canvas");
      const max = 700;
      let w = img.width;
      let h = img.height;

      if (w > h && w > max) {
        h = h * max / w;
        w = max;
      } else if (h > max) {
        w = w * max / h;
        h = max;
      }

      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);

      const photo = canvas.toDataURL("image/jpeg", 0.5);

      if (photo.length > 900000) {
        alert("Photo bahut badi hai. Dusri photo select karo.");
        return;
      }

      await sendChatMessage(
        {
          type: "photo",
          photo,
          text: "Photo",
          ...(replyToMessage ? { replyTo: replyToMessage } : {})
        },
        "Photo"
      );

      cancelReply();
      stopTyping();

      setStatus("Photo sent!");

    } catch (error) {
      alert("Photo send nahi hui: " + error.message);
      console.error(error);

    } finally {
      if (url) URL.revokeObjectURL(url);
      photoInput.value = "";

      // Photo send ke baad keyboard focus
      if (activeChat && messageInput) {
        messageInput.focus({ preventScroll: true });
      }
    }
  };
}

// MOBILE BACK
if ($("mobileBack")) {
  $("mobileBack").onclick = () => {
    document.body.classList.remove("chat-open");

    stopListeners();
    closeMenu();

    if (stopOtherPresence) {
      stopOtherPresence();
      stopOtherPresence = null;
    }

    activeChat = null;
    activeOther = null;
    allMessages = [];
    hiddenIds = new Set();
    clearedAt = null;
    selecting = false;
    selectedIds.clear();
    cancelReply();

    messagesBox.innerHTML = "";
    updateSelectionBar();
  };
}

// CLEANUP
window.addEventListener("beforeunload", () => {
  if (stopRecent) stopRecent();

  for (const unsubscribe of recentSettingsStops.values()) {
    unsubscribe();
  }

  if (stopMyConnection) stopMyConnection();
  if (stopOtherPresence) stopOtherPresence();
  if (stopMessages) stopMessages();
  if (stopSettings) stopSettings();
  if (stopHidden) stopHidden();
  if (stopOtherRead) stopOtherRead();
  if (stopOtherTyping) stopOtherTyping();
});
