
import {
  initializeApp, getApps, getApp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";


import {
  getAuth, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  orderBy,
  onSnapshot,
  serverTimestamp,
  runTransaction,
  increment
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import {
  getDatabase, ref, onValue, set,
  onDisconnect,
  serverTimestamp as rtdbServerTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

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

const rtdb = getDatabase(
  app,
  "https://arshu-9919-default-rtdb.firebaseio.com"
);

const $ = id => document.getElementById(id);

let me = null;
let activeChat = null;
let activeOther = null;

let stopMessages = null;
let stopSettings = null;
let stopHidden = null;
let stopMyConnection = null;
let stopOtherPresence = null;
let stopRecent = null;

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


// =====================================
// STATUS MESSAGE
// =====================================

function setStatus(message) {
  if ($("status")) $("status").textContent = message || "";
}


// =====================================
// USER DP
// =====================================

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
    width:100%;
    height:100%;
    object-fit:cover;
    border-radius:50%;
    display:block;
  `;

  img.onerror = () => {
    container.innerHTML = "";
    container.textContent = initial;
  };

  container.appendChild(img);
}


// =====================================
// MESSAGE MENU
// =====================================

const menu = document.createElement("div");

menu.id = "messageMenu";

menu.style.cssText = `
  display:none;
  position:fixed;
  z-index:99999;
  background:#202c33;
  color:white;
  border:1px solid #40515b;
  border-radius:10px;
  padding:6px;
  min-width:150px;
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
    display:block;
    width:100%;
    padding:12px;
    border:0;
    border-radius:7px;
    text-align:left;
    background:transparent;
    color:${danger ? "#ff7777" : "white"};
    cursor:pointer;
    font-size:14px;
  `;

  button.onclick = action;
  menu.appendChild(button);
}

document.addEventListener("click", e => {
  if (menu.style.display === "block" && !menu.contains(e.target)) {
    closeMenu();
  }
});


// =====================================
// ONLINE / OFFLINE / LAST SEEN
// =====================================

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
  if (stopOtherPresence) {
    stopOtherPresence();
    stopOtherPresence = null;
  }

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
        return;
      }

      if (data && data.lastChanged) {
        statusElement.textContent =
          "Last seen " +
          new Date(data.lastChanged).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          });

        statusElement.style.color = "#999";
        return;
      }

      statusElement.textContent = "Offline";
      statusElement.style.color = "#999";
    },
    error => {
      statusElement.textContent = "Status unavailable";
      console.error(error);
    }
  );
}


// =====================================
// RECENT CHATS
// =====================================

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

async function getRecentProfile(uid) {
  if (recentProfiles.has(uid)) {
    return recentProfiles.get(uid);
  }

  if (profilePromises.has(uid)) {
    return profilePromises.get(uid);
  }

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

function listenToRecentSettings(chatId) {
  if (recentSettingsStops.has(chatId)) return;

  const settingsRef = doc(
    db, "chats", chatId,
    "userSettings", me.uid
  );

  const unsubscribe = onSnapshot(
    settingsRef,
    snap => {
      recentSettings.set(
        chatId,
        snap.exists() ? snap.data() : {}
      );

      renderRecentChats();
    },
    error => {
      console.error("Recent settings error:", error);
    }
  );

  recentSettingsStops.set(chatId, unsubscribe);
}

function startRecentChats() {
  if (stopRecent) stopRecent();

  const recentBox = $("recentChats");
  if (!recentBox) return;

  recentBox.innerHTML =
    '<div id="recentEmpty">Loading recent chats...</div>';

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

      const currentIds = new Set(
        recentChatData.map(chat => chat.id)
      );

      // Stop listeners for chats no longer in the list
      for (const [chatId, unsubscribe] of recentSettingsStops) {
        if (!currentIds.has(chatId)) {
          unsubscribe();
          recentSettingsStops.delete(chatId);
          recentSettings.delete(chatId);
        }
      }

      // Listen to this user's unread count in every chat
      recentChatData.forEach(chat => {
        listenToRecentSettings(chat.id);
      });

      renderRecentChats();

    },
    error => {
      console.error("Recent chats error:", error);
      recentBox.innerHTML =
        '<div id="recentEmpty">Recent chats error: ' +
        error.message +
        '</div>';
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
    recentBox.innerHTML =
      '<div id="recentEmpty">No recent chats yet</div>';
    return;
  }

  const prepared = await Promise.all(
    chats.map(async chat => {
      const otherUid = (chat.participants || [])
        .find(uid => uid !== me.uid);

      if (!otherUid) return null;

      const profile = await getRecentProfile(otherUid);

      return { chat, profile, otherUid };
    })
  );

  if (version !== renderVersion) return;

  recentBox.innerHTML = "";

  prepared.filter(Boolean).forEach(item => {
    const { chat, profile } = item;

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
    name.textContent =
      profile.displayName ||
      profile.username ||
      "User";

    const preview = document.createElement("div");
    preview.className = "recent-preview";

    let lastMessage = chat.lastMessage || "Tap to start chatting";

    if (chat.lastSenderUid === me.uid && chat.lastMessage) {
      lastMessage = "You: " + lastMessage;
    }

    preview.textContent = lastMessage;

    info.appendChild(name);
    info.appendChild(preview);

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

    button.appendChild(avatar);
    button.appendChild(info);
    button.appendChild(right);

    button.onclick = () => openChat(profile);

    recentBox.appendChild(button);
  });
}


// =====================================
// STOP ACTIVE CHAT LISTENERS
// =====================================

function stopListeners() {
  if (stopMessages) stopMessages();
  if (stopSettings) stopSettings();
  if (stopHidden) stopHidden();

  stopMessages = null;
  stopSettings = null;
  stopHidden = null;
}


// =====================================
// MARK CHAT AS READ
// =====================================

async function markChatRead(chatId) {
  if (!me || !chatId) return;

  try {
    await setDoc(
      doc(db, "chats", chatId, "userSettings", me.uid),
      {
        unreadCount: 0,
        lastReadAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Mark read error:", error);
    setStatus("Read status error: " + error.message);
  }
}


// =====================================
// MESSAGE VISIBILITY
// =====================================

function messageIsVisible(message, id) {
  if (hiddenIds.has(id)) return false;

  if (clearedAt && message.createdAt) {
    if (message.createdAt.toMillis() <= clearedAt.toMillis()) {
      return false;
    }
  }

  return true;
}


// =====================================
// LOGIN
// =====================================

onAuthStateChanged(auth, user => {
  if (!user) {
    if (stopMyConnection) stopMyConnection();
    if (stopRecent) stopRecent();

    location.href = "index.html";
    return;
  }

  me = user;

  startMyPresence(user.uid);
  startRecentChats();
});


// =====================================
// SEARCH USER
// =====================================

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

      btn.appendChild(avatar);
      btn.appendChild(name);

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


// =====================================
// OPEN CHAT
// =====================================

async function openChat(other) {
  if (!me || !other.uid || other.uid === me.uid) return;

  const participants = [me.uid, other.uid].sort();
  const chatId = participants.join("_");

  try {
    stopListeners();
    closeMenu();

    activeChat = chatId;
    activeOther = other;

    allMessages = [];
    hiddenIds = new Set();
    clearedAt = null;

    selectedIds.clear();
    selecting = false;

    $("chatTitle").textContent =
      (other.displayName || other.username || "User") +
      " (@" + (other.username || "") + ")";

    showAvatar($("chatAvatar"), other);
    watchOtherPresence(other.uid);

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
    }

    // Reset unread count when this user opens the chat
    await markChatRead(chatId);

    // Own settings
    const settingsRef = doc(
      db, "chats", chatId,
      "userSettings", me.uid
    );

    stopSettings = onSnapshot(
      settingsRef,
      snap => {
        clearedAt = snap.exists()
          ? snap.data().clearedAt || null
          : null;

        renderMessages();
      },
      error => setStatus("Settings error: " + error.message)
    );

    // Hidden messages
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

    // Messages
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

        // If chat is open, incoming messages are immediately read
        if (activeChat === chatId) {
          const hasIncoming = snap.docs.some(
            d => d.data().senderUid !== me.uid
          );

          if (hasIncoming) markChatRead(chatId);
        }
      },
      error => setStatus("Messages error: " + error.message)
    );

  } catch (error) {
    setStatus("Chat error: " + error.message);
  }
}


// =====================================
// SELECTION BAR
// =====================================

function updateSelectionBar() {
  let bar = $("selectionBar");

  if (!bar) {
    bar = document.createElement("div");
    bar.id = "selectionBar";

    bar.style.cssText = `
      display:none;
      align-items:center;
      gap:8px;
      padding:10px;
      background:#172229;
      color:white;
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
  del.style.cssText =
    "padding:9px 14px;border:0;border-radius:7px;background:#a83232;color:white;";

  del.onclick = deleteSelectedMessages;
  bar.appendChild(del);

  const cancel = document.createElement("button");
  cancel.textContent = "Cancel";
  cancel.type = "button";
  cancel.style.cssText =
    "padding:9px 14px;border:0;border-radius:7px;background:#2a3942;color:white;";

  cancel.onclick = cancelSelection;
  bar.appendChild(cancel);
}


// =====================================
// LONG PRESS AND MESSAGE MENU
// =====================================

function startLongPress(messageId, x, y) {
  if (selecting) return;

  clearTimeout(pressTimer);

  pressTimer = setTimeout(() => {
    showMessageMenu(messageId, x, y);
  }, 2000);
}

function stopLongPress() {
  clearTimeout(pressTimer);
}

function showMessageMenu(messageId, x, y) {
  closeMenu();

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

    if (!confirm("Ye message sirf tumhari side se delete karna hai?")) {
      return;
    }

    await hideMessages([messageId]);
  }, true);

  menuButton("Clear All", async () => {
    closeMenu();
    await clearAllForMe();
  }, true);

  menu.style.display = "block";

  const left = Math.max(
    8,
    Math.min(x, window.innerWidth - 178)
  );

  const top = Math.max(
    8,
    Math.min(y, window.innerHeight - 180)
  );

  menu.style.left = left + "px";
  menu.style.top = top + "px";
}


// =====================================
// RENDER MESSAGES
// =====================================

function renderMessages() {
  if (!messagesBox || !me) return;

  messagesBox.innerHTML = "";

  const visible = allMessages.filter(m =>
    messageIsVisible(m, m.id)
  );

  visible.forEach(m => {
    const row = document.createElement("div");

    row.className = "msg-row " +
      (m.senderUid === me.uid ? "mine" : "theirs");

    row.dataset.messageId = m.id;

    if (selecting) {
      const checkbox = document.createElement("input");

      checkbox.type = "checkbox";
      checkbox.className = "msg-select";
      checkbox.checked = selectedIds.has(m.id);

      checkbox.onchange = () => {
        if (checkbox.checked) {
          selectedIds.add(m.id);
        } else {
          selectedIds.delete(m.id);
        }

        updateSelectionBar();
      };

      row.appendChild(checkbox);
    }

    const bubble = document.createElement("div");

    bubble.className = m.senderUid === me.uid
      ? "msg my-msg"
      : "msg other-msg";

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
    } else {
      bubble.textContent = m.text || "";
    }

    row.onclick = e => {
      if (!selecting || e.target.tagName === "INPUT") return;

      if (selectedIds.has(m.id)) {
        selectedIds.delete(m.id);
      } else {
        selectedIds.add(m.id);
      }

      renderMessages();
      updateSelectionBar();
    };

    row.style.touchAction = "pan-y";

    row.addEventListener("pointerdown", e => {
      if (selecting) return;
      startLongPress(m.id, e.clientX, e.clientY);
    });

    row.addEventListener("pointermove", e => {
      if (
        Math.abs(e.movementX) > 10 ||
        Math.abs(e.movementY) > 10
      ) {
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
}


// =====================================
// HIDE / DELETE FOR MYSELF
// =====================================

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
      setDoc(doc(base, id), {
        hiddenAt: serverTimestamp()
      })
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

  if (!confirm(
    `${ids.length} selected messages tumhari side se delete karne hain?`
  )) return;

  await hideMessages(ids);
}

async function clearAllForMe() {
  if (!activeChat || !me) {
    alert("Pehle chat open karo.");
    return;
  }

  if (!confirm(
    "Tumhari side se poori chat clear karni hai? Doosre user ki chat par koi effect nahi hoga."
  )) return;

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


// =====================================
// SEND MESSAGE + INCREMENT RECEIVER UNREAD
// =====================================

async function sendChatMessage(messageData, previewText) {
  if (!activeChat || !activeOther || !me) {
    throw new Error("Pehle user select karo.");
  }

  const chatId = activeChat;
  const recipientUid = activeOther.uid;

  const chatRef = doc(db, "chats", chatId);
  const recipientSettingsRef = doc(
    db, "chats", chatId,
    "userSettings", recipientUid
  );

  const messageRef = doc(
    collection(db, "chats", chatId, "messages")
  );

  await runTransaction(db, async transaction => {
    // Read first, then write
    const chatSnap = await transaction.get(chatRef);
    const recipientSettingsSnap =
      await transaction.get(recipientSettingsRef);

    if (!chatSnap.exists()) {
      throw new Error("Chat document nahi mila. Chat dobara open karo.");
    }

    const oldUnread = recipientSettingsSnap.exists()
      ? Number(recipientSettingsSnap.data().unreadCount || 0)
      : 0;

    const newUnread = oldUnread + 1;

    transaction.set(messageRef, {
      ...messageData,
      senderUid: me.uid,
      createdAt: serverTimestamp()
    });

    transaction.update(chatRef, {
      lastMessage: previewText,
      lastSenderUid: me.uid,
      updatedAt: serverTimestamp()
    });

    transaction.set(
      recipientSettingsRef,
      {
        unreadCount: newUnread,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
  });
}


// =====================================
// SEND TEXT
// =====================================

send.onclick = sendText;

messageInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendText();
  }
});

async function sendText() {
  const text = messageInput.value.trim();

  if (!text || !activeChat || !me) return;

  send.disabled = true;

  try {
    await sendChatMessage(
      {
        type: "text",
        text
      },
      text
    );

    messageInput.value = "";
    setStatus("Message sent!");

  } catch (error) {
    alert("Message error: " + error.message);
  } finally {
    send.disabled = false;
  }
}


// =====================================
// SEND PHOTO
// =====================================

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

  try {
    const img = new Image();
    const url = URL.createObjectURL(file);

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

    URL.revokeObjectURL(url);

    const photo = canvas.toDataURL("image/jpeg", 0.5);

    if (photo.length > 900000) {
      alert("Photo bahut badi hai. Dusri photo select karo.");
      photoInput.value = "";
      return;
    }

    await sendChatMessage(
      {
        type: "photo",
        photo,
        text: "Photo"
      },
      "Photo"
    );

    setStatus("Photo sent!");

  } catch (error) {
    alert("Photo send nahi hui: " + error.message);
  }

  photoInput.value = "";
};


// =====================================
// MOBILE BACK
// =====================================

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

    messagesBox.innerHTML = "";
    updateSelectionBar();
  };
}


// =====================================
// CLEANUP
// =====================================

window.addEventListener("beforeunload", () => {
  if (stopRecent) stopRecent();

  for (const unsubscribe of recentSettingsStops.values()) {
    unsubscribe();
  }

  if (stopMyConnection) stopMyConnection();
  if (stopOtherPresence) stopOtherPresence();
});
