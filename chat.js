
// import {initializeApp} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
// import {getAuth,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
// import {
// getFirestore,doc,getDoc,setDoc,collection,query,where,
// getDocs,addDoc,orderBy,onSnapshot,serverTimestamp
// } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// const firebaseConfig={
// apiKey:"AIzaSyDpdRnhuWp57slwtpIdRwS9W3pqpITr66s",
// authDomain:"arshu-9919.firebaseapp.com",
// projectId:"arshu-9919",
// storageBucket:"arshu-9919.firebasestorage.app",
// messagingSenderId:"629782428750",
// appId:"1:629782428750:web:4db3c0d9d68f89c75f971f"
// };

// const app=initializeApp(firebaseConfig);
// const auth=getAuth(app);
// const db=getFirestore(app);

// let me=null,activeChat=null,stopMessages=null;

// onAuthStateChanged(auth,user=>{
// if(!user){location.href="index.html";return;}
// me=user;
// });

// document.getElementById("find").onclick=async()=>{
// const name=document.getElementById("search").value.trim().toLowerCase();
// const result=document.getElementById("result");
// result.textContent="Searching...";

// if(!name)return;

// try{
// const q=query(collection(db,"profiles"),where("username","==",name));
// const snap=await getDocs(q);
// result.innerHTML="";

// if(snap.empty){
// result.textContent="User nahi mila";
// return;
// }

// snap.forEach(d=>{
// const p=d.data();
// if(p.uid===me.uid){
// result.textContent="Apna username search mat karo";
// return;
// }

// const btn=document.createElement("button");
// btn.textContent=(p.displayName||p.username)+" (@"+p.username+")";
// btn.onclick=()=>openChat(p);
// result.appendChild(btn);
// });
// }catch(e){
// result.textContent=e.message;
// }
// };

// async function openChat(other){
// try{
// const ids=[me.uid,other.uid].sort();
// const chatId=ids.join("_");
// const chatRef=doc(db,"chats",chatId);
// const chatSnap=await getDoc(chatRef);

// if(!chatSnap.exists()){
// await setDoc(chatRef,{
// participants:ids,
// createdAt:serverTimestamp(),
// lastMessage:"",
// updatedAt:serverTimestamp()
// });
// }

// activeChat=chatId;
// document.getElementById("chatTitle").textContent=
// (other.displayName||other.username)+" (@"+other.username+")";

// document.getElementById("messages").innerHTML="";
// if(stopMessages)stopMessages();

// const q=query(
// collection(db,"chats",chatId,"messages"),
// orderBy("createdAt","asc")
// );

// stopMessages=onSnapshot(q,snap=>{
// const box=document.getElementById("messages");
// box.innerHTML="";

// snap.forEach(d=>{
// const m=d.data();
// const div=document.createElement("div");
// div.className="msg";

// const name=m.senderUid===me.uid?"You":other.username;
// div.textContent=name+": "+m.text;

// box.appendChild(div);
// });

// box.scrollTop=box.scrollHeight;
// },e=>{
// document.getElementById("status").textContent=e.message;
// });

// }catch(e){
// document.getElementById("status").textContent=e.message;
// }
// }

// document.getElementById("send").onclick=async()=>{
// const input=document.getElementById("message");
// const text=input.value.trim();

// if(!activeChat||!text||!me)return;

// try{
// await addDoc(collection(db,"chats",activeChat,"messages"),{
// senderUid:me.uid,
// text:text,
// createdAt:serverTimestamp()
// });

// await setDoc(doc(db,"chats",activeChat),{
// lastMessage:text,
// updatedAt:serverTimestamp()
// },{merge:true});

// input.value="";
// }catch(e){
// document.getElementById("status").textContent=e.message;
// }
// };

// const photoBtn = document.getElementById("photoBtn");
// const photoInput = document.getElementById("photoInput");

// photoBtn.addEventListener("click", () => {
//     photoInput.click();
// });



import {
    initializeApp,
    getApps,
    getApp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
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
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

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

let me = null;
let activeChat = null;
let stopMessages = null;

const search = document.getElementById("search");
const find = document.getElementById("find");
const result = document.getElementById("result");
const messages = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const send = document.getElementById("send");
const photoBtn = document.getElementById("photoBtn");
const photoInput = document.getElementById("photoInput");
const chatTitle = document.getElementById("chatTitle");

// LOGIN
onAuthStateChanged(auth, user => {
    if (!user) {
        location.href = "index.html";
        return;
    }
    me = user;
});

// SEARCH USER
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
            btn.textContent = (p.displayName || p.username) +
                " (@" + p.username + ")";

            btn.onclick = () => openChat(p);
            result.appendChild(btn);
        });

    } catch (e) {
        result.textContent = e.message;
    }
};

// OPEN CHAT
async function openChat(other) {
    const participants = [me.uid, other.uid].sort();
    const chatId = participants.join("_");

    try {
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

        activeChat = chatId;
        chatTitle.textContent = other.displayName || other.username;

        if (stopMessages) stopMessages();

        const q = query(
            collection(db, "chats", chatId, "messages"),
            orderBy("createdAt", "asc")
        );

        stopMessages = onSnapshot(q, snap => {
            messages.innerHTML = "";

            snap.forEach(d => {
                const m = d.data();
                const div = document.createElement("div");

                div.className = m.senderUid === me.uid
                    ? "msg my-msg"
                    : "msg other-msg";

                if (m.type === "photo" && m.photo) {
                    const img = document.createElement("img");
                    img.src = m.photo;
                    img.className = "chat-photo";

                    img.onclick = () => {
                        const w = window.open();
                        if (w) {
                            const image = w.document.createElement("img");
                            image.src = m.photo;
                            image.style.maxWidth = "100%";
                            w.document.body.appendChild(image);
                        }
                    };

                    div.appendChild(img);
                } else {
                    div.textContent = m.text || "";
                }

                messages.appendChild(div);
            });

            messages.scrollTop = messages.scrollHeight;
        });

    } catch (e) {
        alert("Chat error: " + e.message);
    }
}

// SEND TEXT
send.onclick = sendText;

messageInput.addEventListener("keydown", e => {
    if (e.key === "Enter") sendText();
});

async function sendText() {
    const text = messageInput.value.trim();

    if (!text || !activeChat || !me) return;

    try {
        await addDoc(collection(db, "chats", activeChat, "messages"), {
            senderUid: me.uid,
            type: "text",
            text,
            createdAt: serverTimestamp()
        });

        await setDoc(doc(db, "chats", activeChat), {
            lastMessage: text,
            updatedAt: serverTimestamp()
        }, { merge: true });

        messageInput.value = "";

    } catch (e) {
        alert("Message error: " + e.message);
    }
}

// OPEN PHOTO GALLERY
photoBtn.onclick = () => {
    if (!activeChat) {
        alert("Pehle user select karo");
        return;
    }

    photoInput.click();
};

// SEND PHOTO
photoInput.onchange = async () => {
    const file = photoInput.files[0];

    if (!file || !activeChat || !me) return;

    if (!file.type.startsWith("image/")) {
        alert("Image select karo");
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
            return;
        }

        await addDoc(collection(db, "chats", activeChat, "messages"), {
            senderUid: me.uid,
            type: "photo",
            photo,
            text: "",
            createdAt: serverTimestamp()
        });

        await setDoc(doc(db, "chats", activeChat), {
            lastMessage: "Photo",
            updatedAt: serverTimestamp()
        }, { merge: true });

        alert("Photo sent!");

    } catch (e) {
        alert("Photo send nahi hui: " + e.message);
    }

    photoInput.value = "";
};
