
// import {
//   initializeApp, getApps, getApp
// } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

// import {
//   getAuth, onAuthStateChanged
// } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// import {
//   getFirestore, doc, getDoc, setDoc,
//   collection, query, where, getDocs,
//   addDoc, orderBy, onSnapshot, serverTimestamp
// } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// const firebaseConfig = {
//   apiKey: "AIzaSyDpdRnhuWp57slwtpIdRwS9W3pqpITr66s",
//   authDomain: "arshu-9919.firebaseapp.com",
//   projectId: "arshu-9919",
//   storageBucket: "arshu-9919.firebasestorage.app",
//   messagingSenderId: "629782428750",
//   appId: "1:629782428750:web:4db3c0d9d68f89c75f971f",
//   measurementId: "G-29KEM972QS"
// };
// import {
//   getDatabase,
//   ref,
//   onValue,
//   set,
//   onDisconnect,
//   serverTimestamp as rtdbServerTimestamp

// } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
// const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// const $ = id => document.getElementById(id);

// let me = null;
// let activeChat = null;
// let activeOther = null;

// let stopMessages = null;
// let stopSettings = null;
// let stopHidden = null;

// let allMessages = [];
// let hiddenIds = new Set();
// let clearedAt = null;

// let selecting = false;
// let selectedIds = new Set();

// let pressTimer = null;
// let pressedMessageId = null;

// const search = $("search");
// const find = $("find");
// const result = $("result");
// const messagesBox = $("messages");
// const messageInput = $("messageInput");
// const send = $("send");
// const photoBtn = $("photoBtn");
// const photoInput = $("photoInput");

// // MESSAGE MENU
// const menu = document.createElement("div");
// menu.id = "messageMenu";
// menu.style.cssText = `
//   display:none;
//   position:fixed;
//   z-index:99999;
//   background:#202c33;
//   color:white;
//   border:1px solid #40515b;
//   border-radius:10px;
//   padding:6px;
//   min-width:150px;
//   box-shadow:0 5px 25px #0009;
// `;
// document.body.appendChild(menu);

// function menuButton(label, action, danger = false) {
//   const button = document.createElement("button");

//   button.textContent = label;
//   button.type = "button";
//   button.style.cssText = `
//     display:block;
//     width:100%;
//     padding:12px;
//     border:0;
//     border-radius:7px;
//     text-align:left;
//     background:transparent;
//     color:${danger ? "#ff7777" : "white"};
//     cursor:pointer;
//     font-size:14px;
//   `;

//   button.onclick = action;
//   menu.appendChild(button);
// }

// function setStatus(message) {
//   if ($("status")) $("status").textContent = message || "";
// }

// // SHOW USER DP
// function showAvatar(container, user) {
//   if (!container) return;

//   container.innerHTML = "";

//   const name = user.displayName || user.username || "?";
//   const initial = name.charAt(0).toUpperCase();

//   if (!user.photoBase64) {
//     container.textContent = initial;
//     return;
//   }

//   const img = document.createElement("img");

//   img.alt = "User DP";
//   img.style.cssText = `
//     width:100%;
//     height:100%;
//     object-fit:cover;
//     border-radius:50%;
//     display:block;
//   `;

//   img.onerror = () => {
//     container.innerHTML = "";
//     container.textContent = initial;
//   };

//   img.src = user.photoBase64;
//   container.appendChild(img);
// }

// // STOP LISTENERS
// function stopListeners() {
//   if (stopMessages) stopMessages();
//   if (stopSettings) stopSettings();
//   if (stopHidden) stopHidden();

//   stopMessages = null;
//   stopSettings = null;
//   stopHidden = null;
// }

// // CLOSE MENU
// function closeMenu() {
//   clearTimeout(pressTimer);
//   menu.style.display = "none";
//   menu.innerHTML = "";
//   pressedMessageId = null;
// }

// // Click outside menu to close it
// document.addEventListener("click", e => {
//   if (menu.style.display === "block" && !menu.contains(e.target)) {
//     closeMenu();
//   }
// });

// // MESSAGE VISIBILITY
// function messageIsVisible(message, id) {
//   if (hiddenIds.has(id)) return false;

//   if (clearedAt && message.createdAt) {
//     if (message.createdAt.toMillis() <= clearedAt.toMillis()) {
//       return false;
//     }
//   }

//   return true;
// }

// // LOGIN
// onAuthStateChanged(auth, user => {
//   if (!user) {
//     location.href = "index.html";
//     return;
//   }

//   me = user;
// });

// // SEARCH USER
// find.onclick = async () => {
//   if (!me) {
//     result.textContent = "Login loading...";
//     return;
//   }

//   const username = search.value.trim().toLowerCase();

//   if (!username) {
//     result.textContent = "Username enter karo";
//     return;
//   }

//   result.textContent = "Searching...";

//   try {
//     const q = query(
//       collection(db, "profiles"),
//       where("username", "==", username)
//     );

//     const snap = await getDocs(q);
//     result.innerHTML = "";

//     if (snap.empty) {
//       result.textContent = "User nahi mila";
//       return;
//     }

//     snap.forEach(d => {
//       const p = d.data();

//       if (p.uid === me.uid) return;

//       const btn = document.createElement("button");
//       btn.type = "button";

//       btn.style.cssText = `
//         display:flex;
//         align-items:center;
//         gap:10px;
//         padding:8px 12px;
//         margin:5px 0;
//         cursor:pointer;
//       `;

//       const avatar = document.createElement("div");

//       avatar.style.cssText = `
//         width:42px;
//         height:42px;
//         min-width:42px;
//         border-radius:50%;
//         overflow:hidden;
//         background:#40515b;
//         color:white;
//         display:flex;
//         align-items:center;
//         justify-content:center;
//       `;

//       showAvatar(avatar, p);

//       const name = document.createElement("span");

//       name.textContent =
//         (p.displayName || p.username || "User") +
//         " (@" + (p.username || "") + ")";

//       btn.appendChild(avatar);
//       btn.appendChild(name);

//       btn.onclick = () => openChat(p);

//       result.appendChild(btn);
//     });

//     if (!result.children.length) {
//       result.textContent = "Apna username search mat karo";
//     }

//   } catch (e) {
//     result.textContent = "Search error: " + e.message;
//   }
// };

// // OPEN CHAT
// async function openChat(other) {
//   if (!me || !other.uid || other.uid === me.uid) return;

//   const participants = [me.uid, other.uid].sort();
//   const chatId = participants.join("_");

//   try {
//     stopListeners();
//     closeMenu();

//     activeChat = chatId;
//     activeOther = other;

//     allMessages = [];
//     hiddenIds = new Set();
//     clearedAt = null;

//     selectedIds.clear();
//     selecting = false;

//     $("chatTitle").textContent =
//       (other.displayName || other.username || "User") +
//       " (@" + (other.username || "") + ")";

//     showAvatar($("chatAvatar"), other);

//     messagesBox.innerHTML = "";
//     updateSelectionBar();

//     document.body.classList.add("chat-open");

//     const chatRef = doc(db, "chats", chatId);
//     const chatSnap = await getDoc(chatRef);

//     if (!chatSnap.exists()) {
//       await setDoc(chatRef, {
//         participants,
//         createdAt: serverTimestamp(),
//         lastMessage: "",
//         updatedAt: serverTimestamp()
//       });
//     }

//     // USER'S PRIVATE SETTINGS
//     const settingsRef = doc(
//       db, "chats", chatId, "userSettings", me.uid
//     );

//     stopSettings = onSnapshot(settingsRef, snap => {
//       clearedAt = snap.exists()
//         ? snap.data().clearedAt || null
//         : null;

//       renderMessages();
//     }, e => setStatus("Settings error: " + e.message));

//     // USER'S HIDDEN MESSAGES
//     const hiddenRef = collection(
//       db, "chats", chatId,
//       "userSettings", me.uid, "hiddenMessages"
//     );

//     stopHidden = onSnapshot(hiddenRef, snap => {
//       hiddenIds = new Set(snap.docs.map(d => d.id));
//       renderMessages();
//     }, e => setStatus("Hidden messages error: " + e.message));

//     // CHAT MESSAGES
//     const q = query(
//       collection(db, "chats", chatId, "messages"),
//       orderBy("createdAt", "asc")
//     );

//     stopMessages = onSnapshot(q, snap => {
//       allMessages = snap.docs.map(d => ({
//         id: d.id,
//         ...d.data()
//       }));

//       renderMessages();
//     }, e => setStatus("Messages error: " + e.message));

//   } catch (e) {
//     setStatus("Chat error: " + e.message);
//   }
// }

// // SELECTION BAR
// function updateSelectionBar() {
//   let bar = $("selectionBar");

//   if (!bar) {
//     bar = document.createElement("div");
//     bar.id = "selectionBar";

//     bar.style.cssText = `
//       display:none;
//       align-items:center;
//       gap:8px;
//       padding:10px;
//       background:#172229;
//       color:white;
//     `;

//     messagesBox.insertAdjacentElement("beforebegin", bar);
//   }

//   bar.innerHTML = "";

//   if (!selecting) {
//     bar.style.display = "none";
//     return;
//   }

//   bar.style.display = "flex";

//   const count = document.createElement("span");
//   count.textContent = "Selected: " + selectedIds.size;
//   count.style.marginRight = "auto";

//   bar.appendChild(count);

//   const del = document.createElement("button");
//   del.textContent = "Delete";
//   del.type = "button";

//   del.style.cssText = `
//     padding:9px 14px;
//     border:0;
//     border-radius:7px;
//     background:#a83232;
//     color:white;
//   `;

//   del.onclick = deleteSelectedMessages;
//   bar.appendChild(del);

//   const cancel = document.createElement("button");
//   cancel.textContent = "Cancel";
//   cancel.type = "button";

//   cancel.style.cssText = `
//     padding:9px 14px;
//     border:0;
//     border-radius:7px;
//     background:#2a3942;
//     color:white;
//   `;

//   cancel.onclick = cancelSelection;
//   bar.appendChild(cancel);
// }

// // LONG PRESS: 2 SECONDS
// function startLongPress(messageId, x, y) {
//   if (selecting) return;

//   clearTimeout(pressTimer);

//   pressTimer = setTimeout(() => {
//     pressedMessageId = messageId;
//     showMessageMenu(messageId, x, y);
//   }, 2000);
// }

// function stopLongPress() {
//   clearTimeout(pressTimer);
// }

// // MESSAGE MENU
// function showMessageMenu(messageId, x, y) {
//   closeMenu();
//   pressedMessageId = messageId;

//   menuButton("Select", () => {
//     selecting = true;
//     selectedIds.clear();
//     selectedIds.add(messageId);

//     closeMenu();
//     updateSelectionBar();
//     renderMessages();
//   });

//   menuButton("Delete", async () => {
//     closeMenu();

//     if (!confirm("Ye message sirf tumhari side se delete karna hai?")) {
//       return;
//     }

//     await hideMessages([messageId]);
//   }, true);

//   menuButton("Clear All", async () => {
//     closeMenu();
//     await clearAllForMe();
//   }, true);

//   menu.style.display = "block";

//   const menuWidth = 170;
//   const menuHeight = 170;

//   const left = Math.max(
//     8,
//     Math.min(x, window.innerWidth - menuWidth - 8)
//   );

//   const top = Math.max(
//     8,
//     Math.min(y, window.innerHeight - menuHeight - 8)
//   );

//   menu.style.left = left + "px";
//   menu.style.top = top + "px";
// }

// // RENDER MESSAGES
// function renderMessages() {
//   if (!messagesBox || !me) return;

//   messagesBox.innerHTML = "";

//   const visible = allMessages.filter(m =>
//     messageIsVisible(m, m.id)
//   );

//   visible.forEach(m => {
//     const row = document.createElement("div");

//     row.className = "msg-row " +
//       (m.senderUid === me.uid ? "mine" : "theirs");

//     row.dataset.messageId = m.id;

//     if (selecting) {
//       const checkbox = document.createElement("input");

//       checkbox.type = "checkbox";
//       checkbox.className = "msg-select";
//       checkbox.checked = selectedIds.has(m.id);

//       checkbox.onchange = () => {
//         if (checkbox.checked) {
//           selectedIds.add(m.id);
//         } else {
//           selectedIds.delete(m.id);
//         }

//         updateSelectionBar();
//       };

//       row.appendChild(checkbox);
//     }

//     const bubble = document.createElement("div");

//     bubble.className = m.senderUid === me.uid
//       ? "msg my-msg"
//       : "msg other-msg";

//     if (m.type === "photo" && m.photo) {
//       const img = document.createElement("img");

//       img.src = m.photo;
//       img.alt = "Chat photo";
//       img.className = "chat-photo";

//       img.onclick = () => {
//         if (selecting) return;

//         const w = window.open();

//         if (w) {
//           const image = w.document.createElement("img");

//           image.src = m.photo;
//           image.style.maxWidth = "100%";

//           w.document.body.appendChild(image);
//         }
//       };

//       bubble.appendChild(img);

//     } else {
//       bubble.textContent = m.text || "";
//     }

//     // SELECT MESSAGE BY TAPPING
//     row.onclick = e => {
//       if (!selecting) return;
//       if (e.target.tagName === "INPUT") return;

//       if (selectedIds.has(m.id)) {
//         selectedIds.delete(m.id);
//       } else {
//         selectedIds.add(m.id);
//       }

//       renderMessages();
//       updateSelectionBar();
//     };

//     // LONG PRESS ON MOBILE AND DESKTOP
//     row.style.touchAction = "pan-y";

// let touchMoved = false;

// row.addEventListener("pointerdown", e => {
//   if (selecting) return;

//   touchMoved = false;

//   startLongPress(
//     m.id,
//     e.clientX,
//     e.clientY
//   );
// });

// row.addEventListener("pointermove", e => {
//   if (Math.abs(e.movementX) > 10 ||
//       Math.abs(e.movementY) > 10) {
//     touchMoved = true;
//     stopLongPress();
//   }
// });

// row.addEventListener("pointerup", stopLongPress);
// row.addEventListener("pointerleave", stopLongPress);
// row.addEventListener("pointercancel", stopLongPress);

//     // DESKTOP RIGHT CLICK
//     row.addEventListener("contextmenu", e => {
//       e.preventDefault();

//       if (selecting) return;

//       showMessageMenu(m.id, e.clientX, e.clientY);
//     });

//     row.appendChild(bubble);
//     messagesBox.appendChild(row);
//   });

//   const myCount = visible.filter(
//     m => m.senderUid === me.uid
//   ).length;

//   const otherCount = visible.filter(
//     m => m.senderUid !== me.uid
//   ).length;

//   if ($("messageCount")) {
//     $("messageCount").textContent =
//       `You: ${myCount} | ${activeOther?.username || "Other"}: ${otherCount}`;
//   }

//   messagesBox.scrollTop = messagesBox.scrollHeight;
// }

// // CANCEL SELECTION
// function cancelSelection() {
//   selecting = false;
//   selectedIds.clear();

//   closeMenu();
//   updateSelectionBar();
//   renderMessages();
// }

// // HIDE MESSAGES FOR THIS USER ONLY
// async function hideMessages(ids) {
//   if (!activeChat || !me || !ids.length) return;

//   try {
//     const base = collection(
//       db, "chats", activeChat,
//       "userSettings", me.uid, "hiddenMessages"
//     );

//     await Promise.all(ids.map(id =>
//       setDoc(doc(base, id), {
//         hiddenAt: serverTimestamp()
//       })
//     ));

//     cancelSelection();
//     setStatus("Messages tumhari side se hide ho gaye.");

//   } catch (e) {
//     alert("Delete error: " + e.message);
//   }
// }

// // DELETE SELECTED MESSAGES
// async function deleteSelectedMessages() {
//   const ids = [...selectedIds];

//   if (!ids.length) {
//     alert("Pehle messages select karo.");
//     return;
//   }

//   if (!confirm(
//     `${ids.length} selected messages tumhari side se delete karne hain?`
//   )) {
//     return;
//   }

//   await hideMessages(ids);
// }

// // CLEAR ALL FOR THIS USER ONLY
// async function clearAllForMe() {
//   if (!activeChat || !me) {
//     alert("Pehle chat open karo.");
//     return;
//   }

//   if (!confirm(
//     "Tumhari side se poori chat clear karni hai? Doosre user ki chat par koi effect nahi hoga."
//   )) {
//     return;
//   }

//   try {
//     await setDoc(
//       doc(db, "chats", activeChat, "userSettings", me.uid),
//       {
//         clearedAt: serverTimestamp(),
//         updatedAt: serverTimestamp()
//       },
//       { merge: true }
//     );

//     cancelSelection();
//     setStatus("Tumhari side se chat clear ho gayi.");

//   } catch (e) {
//     alert("Clear chat error: " + e.message);
//   }
// }

// // SEND TEXT
// send.onclick = sendText;

// messageInput.addEventListener("keydown", e => {
//   if (e.key === "Enter") {
//     e.preventDefault();
//     sendText();
//   }
// });

// async function sendText() {
//   const text = messageInput.value.trim();

//   if (!text || !activeChat || !me) return;

//   try {
//     await addDoc(
//       collection(db, "chats", activeChat, "messages"),
//       {
//         senderUid: me.uid,
//         type: "text",
//         text,
//         createdAt: serverTimestamp()
//       }
//     );

//     await setDoc(
//       doc(db, "chats", activeChat),
//       {
//         lastMessage: text,
//         updatedAt: serverTimestamp()
//       },
//       { merge: true }
//     );

//     messageInput.value = "";

//   } catch (e) {
//     alert("Message error: " + e.message);
//   }
// }

// // OPEN PHOTO GALLERY
// photoBtn.onclick = () => {
//   if (!activeChat) {
//     alert("Pehle user select karo");
//     return;
//   }

//   photoInput.click();
// };

// // SEND PHOTO
// photoInput.onchange = async () => {
//   const file = photoInput.files[0];

//   if (!file || !activeChat || !me) return;

//   if (!file.type.startsWith("image/")) {
//     alert("Image select karo");
//     photoInput.value = "";
//     return;
//   }

//   try {
//     const img = new Image();
//     const url = URL.createObjectURL(file);

//     img.src = url;

//     await new Promise((resolve, reject) => {
//       img.onload = resolve;
//       img.onerror = reject;
//     });

//     const canvas = document.createElement("canvas");

//     const max = 700;
//     let w = img.width;
//     let h = img.height;

//     if (w > h && w > max) {
//       h = h * max / w;
//       w = max;
//     } else if (h > max) {
//       w = w * max / h;
//       h = max;
//     }

//     canvas.width = w;
//     canvas.height = h;

//     canvas.getContext("2d").drawImage(img, 0, 0, w, h);

//     URL.revokeObjectURL(url);

//     const photo = canvas.toDataURL("image/jpeg", 0.5);

//     if (photo.length > 900000) {
//       alert("Photo bahut badi hai. Dusri photo select karo.");
//       photoInput.value = "";
//       return;
//     }

//     await addDoc(
//       collection(db, "chats", activeChat, "messages"),
//       {
//         senderUid: me.uid,
//         type: "photo",
//         photo,
//         text: "Photo",
//         createdAt: serverTimestamp()
//       }
//     );

//     await setDoc(
//       doc(db, "chats", activeChat),
//       {
//         lastMessage: "Photo",
//         updatedAt: serverTimestamp()
//       },
//       { merge: true }
//     );

//     setStatus("Photo sent!");

//   } catch (e) {
//     alert("Photo send nahi hui: " + e.message);
//   }

//   photoInput.value = "";
// };

// // MOBILE BACK
// if ($("mobileBack")) {
//   $("mobileBack").onclick = () => {
//     document.body.classList.remove("chat-open");

//     stopListeners();
//     closeMenu();

//     activeChat = null;
//     activeOther = null;

//     allMessages = [];
//     hiddenIds = new Set();
//     clearedAt = null;

//     selecting = false;
//     selectedIds.clear();

//     messagesBox.innerHTML = "";
//     updateSelectionBar();
//   };
// }



import {
  initializeApp, getApps, getApp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
  getAuth, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
  getFirestore, doc, getDoc, setDoc,
  collection, query, where, getDocs,
  addDoc, orderBy, onSnapshot, serverTimestamp
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

let allMessages = [];
let hiddenIds = new Set();
let clearedAt = null;

let selecting = false;
let selectedIds = new Set();

let pressTimer = null;
let pressedMessageId = null;

const search = $("search");
const find = $("find");
const result = $("result");
const messagesBox = $("messages");
const messageInput = $("messageInput");
const send = $("send");
const photoBtn = $("photoBtn");
const photoInput = $("photoInput");


// ================================
// MESSAGE MENU
// ================================

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


function menuButton(label, action, danger = false) {
  const button = document.createElement("button");

  button.textContent = label;
  button.type = "button";

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


function setStatus(message) {
  if ($("status")) {
    $("status").textContent = message || "";
  }
}


// ================================
// USER DP
// ================================

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

  img.src = user.photoBase64;
  container.appendChild(img);
}


// ================================
// REAL TIME ONLINE / OFFLINE
// ================================

// Apna online status Firebase mein save karna

function startMyPresence(uid) {
  if (stopMyConnection) {
    stopMyConnection();
    stopMyConnection = null;
  }

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


// Chat ke andar status dikhana

function createChatStatus() {
  let status = $("chatStatus");

  if (!status && $("chatTitle")) {
    status = document.createElement("div");
    status.id = "chatStatus";

    status.style.cssText = `
      font-size:12px;
      margin-top:3px;
      color:#999;
    `;

    $("chatTitle").insertAdjacentElement("afterend", status);
  }

  return status;
}


// Doosre user ka status dekhna

function watchOtherPresence(uid) {
  if (stopOtherPresence) {
    stopOtherPresence();
    stopOtherPresence = null;
  }

  const statusElement = createChatStatus();

  if (!statusElement) return;

  statusElement.textContent = "Checking...";

  const userStatusRef = ref(rtdb, "status/" + uid);

  stopOtherPresence = onValue(
    userStatusRef,
    snapshot => {
      const data = snapshot.val();

      if (data && data.state === "online") {
        statusElement.textContent = "● Online";
        statusElement.style.color = "#25d366";
        return;
      }

      if (data && data.lastChanged) {
        const date = new Date(data.lastChanged);

        statusElement.textContent =
          "Last seen " +
          date.toLocaleTimeString([], {
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
      console.error("Status read error:", error);
    }
  );
}


// ================================
// STOP LISTENERS
// ================================

function stopListeners() {
  if (stopMessages) stopMessages();
  if (stopSettings) stopSettings();
  if (stopHidden) stopHidden();

  stopMessages = null;
  stopSettings = null;
  stopHidden = null;
}


function closeMenu() {
  clearTimeout(pressTimer);
  menu.style.display = "none";
  menu.innerHTML = "";
  pressedMessageId = null;
}


document.addEventListener("click", e => {
  if (
    menu.style.display === "block" &&
    !menu.contains(e.target)
  ) {
    closeMenu();
  }
});


// ================================
// MESSAGE VISIBILITY
// ================================

function messageIsVisible(message, id) {
  if (hiddenIds.has(id)) return false;

  if (clearedAt && message.createdAt) {
    if (
      message.createdAt.toMillis() <=
      clearedAt.toMillis()
    ) {
      return false;
    }
  }

  return true;
}


// ================================
// LOGIN
// ================================

onAuthStateChanged(auth, user => {
  if (!user) {
    if (stopMyConnection) {
      stopMyConnection();
      stopMyConnection = null;
    }

    location.href = "index.html";
    return;
  }

  me = user;

  startMyPresence(user.uid);
});


// ================================
// SEARCH USER
// ================================

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
      const p = d.data();

      if (p.uid === me.uid) return;

      const btn = document.createElement("button");
      btn.type = "button";

      btn.style.cssText = `
        display:flex;
        align-items:center;
        gap:10px;
        padding:8px 12px;
        margin:5px 0;
        cursor:pointer;
      `;

      const avatar = document.createElement("div");

      avatar.style.cssText = `
        width:42px;
        height:42px;
        min-width:42px;
        border-radius:50%;
        overflow:hidden;
        background:#40515b;
        color:white;
        display:flex;
        align-items:center;
        justify-content:center;
      `;

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

  } catch (e) {
    result.textContent = "Search error: " + e.message;
  }
};


// ================================
// OPEN CHAT
// ================================

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

    // Doosre user ka online / last seen
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
        updatedAt: serverTimestamp()
      });
    }

    // USER'S PRIVATE SETTINGS
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
      e => setStatus("Settings error: " + e.message)
    );

    // USER'S HIDDEN MESSAGES
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
      e => setStatus("Hidden messages error: " + e.message)
    );

    // CHAT MESSAGES
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    stopMessages = onSnapshot(
      q,
      snap => {
        allMessages = snap.docs.map(d => ({
          id: d.id,
          ...d.data()
        }));

        renderMessages();
      },
      e => setStatus("Messages error: " + e.message)
    );

  } catch (e) {
    setStatus("Chat error: " + e.message);
  }
}


// ================================
// SELECTION BAR
// ================================

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

  del.style.cssText = `
    padding:9px 14px;
    border:0;
    border-radius:7px;
    background:#a83232;
    color:white;
  `;

  del.onclick = deleteSelectedMessages;
  bar.appendChild(del);

  const cancel = document.createElement("button");
  cancel.textContent = "Cancel";
  cancel.type = "button";

  cancel.style.cssText = `
    padding:9px 14px;
    border:0;
    border-radius:7px;
    background:#2a3942;
    color:white;
  `;

  cancel.onclick = cancelSelection;
  bar.appendChild(cancel);
}


// ================================
// LONG PRESS: 2 SECONDS
// ================================

function startLongPress(messageId, x, y) {
  if (selecting) return;

  clearTimeout(pressTimer);

  pressTimer = setTimeout(() => {
    pressedMessageId = messageId;
    showMessageMenu(messageId, x, y);
  }, 2000);
}


function stopLongPress() {
  clearTimeout(pressTimer);
}


// ================================
// MESSAGE MENU
// ================================

function showMessageMenu(messageId, x, y) {
  closeMenu();
  pressedMessageId = messageId;

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

  const menuWidth = 170;
  const menuHeight = 170;

  const left = Math.max(
    8,
    Math.min(x, window.innerWidth - menuWidth - 8)
  );

  const top = Math.max(
    8,
    Math.min(y, window.innerHeight - menuHeight - 8)
  );

  menu.style.left = left + "px";
  menu.style.top = top + "px";
}


// ================================
// RENDER MESSAGES
// ================================

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

    // SELECT MESSAGE BY TAPPING
    row.onclick = e => {
      if (!selecting) return;
      if (e.target.tagName === "INPUT") return;

      if (selectedIds.has(m.id)) {
        selectedIds.delete(m.id);
      } else {
        selectedIds.add(m.id);
      }

      renderMessages();
      updateSelectionBar();
    };

    // LONG PRESS ON MOBILE AND DESKTOP
    row.style.touchAction = "pan-y";

    row.addEventListener("pointerdown", e => {
      if (selecting) return;

      startLongPress(
        m.id,
        e.clientX,
        e.clientY
      );
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

    // DESKTOP RIGHT CLICK
    row.addEventListener("contextmenu", e => {
      e.preventDefault();

      if (selecting) return;

      showMessageMenu(m.id, e.clientX, e.clientY);
    });

    row.appendChild(bubble);
    messagesBox.appendChild(row);
  });

  const myCount = visible.filter(
    m => m.senderUid === me.uid
  ).length;

  const otherCount = visible.filter(
    m => m.senderUid !== me.uid
  ).length;

  if ($("messageCount")) {
    $("messageCount").textContent =
      `You: ${myCount} | ${activeOther?.username || "Other"}: ${otherCount}`;
  }

  messagesBox.scrollTop = messagesBox.scrollHeight;
}


// ================================
// CANCEL SELECTION
// ================================

function cancelSelection() {
  selecting = false;
  selectedIds.clear();

  closeMenu();
  updateSelectionBar();
  renderMessages();
}


// ================================
// HIDE MESSAGES FOR THIS USER
// ================================

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

  } catch (e) {
    alert("Delete error: " + e.message);
  }
}


// ================================
// DELETE SELECTED MESSAGES
// ================================

async function deleteSelectedMessages() {
  const ids = [...selectedIds];

  if (!ids.length) {
    alert("Pehle messages select karo.");
    return;
  }

  if (!confirm(
    `${ids.length} selected messages tumhari side se delete karne hain?`
  )) {
    return;
  }

  await hideMessages(ids);
}


// ================================
// CLEAR ALL FOR THIS USER
// ================================

async function clearAllForMe() {
  if (!activeChat || !me) {
    alert("Pehle chat open karo.");
    return;
  }

  if (!confirm(
    "Tumhari side se poori chat clear karni hai? Doosre user ki chat par koi effect nahi hoga."
  )) {
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

  } catch (e) {
    alert("Clear chat error: " + e.message);
  }
}


// ================================
// SEND TEXT
// ================================

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

  try {
    await addDoc(
      collection(db, "chats", activeChat, "messages"),
      {
        senderUid: me.uid,
        type: "text",
        text,
        createdAt: serverTimestamp()
      }
    );

    await setDoc(
      doc(db, "chats", activeChat),
      {
        lastMessage: text,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );

    messageInput.value = "";

  } catch (e) {
    alert("Message error: " + e.message);
  }
}


// ================================
// OPEN PHOTO GALLERY
// ================================

photoBtn.onclick = () => {
  if (!activeChat) {
    alert("Pehle user select karo");
    return;
  }

  photoInput.click();
};


// ================================
// SEND PHOTO
// ================================

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

    await addDoc(
      collection(db, "chats", activeChat, "messages"),
      {
        senderUid: me.uid,
        type: "photo",
        photo,
        text: "Photo",
        createdAt: serverTimestamp()
      }
    );

    await setDoc(
      doc(db, "chats", activeChat),
      {
        lastMessage: "Photo",
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );

    setStatus("Photo sent!");

  } catch (e) {
    alert("Photo send nahi hui: " + e.message);
  }

  photoInput.value = "";
};


// ================================
// MOBILE BACK
// ================================

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


