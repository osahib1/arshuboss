
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {getAuth,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import {getFirestore,doc,getDoc,setDoc,serverTimestamp} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const firebaseConfig={
apiKey:"AIzaSyDpdRnhuWp57slwtpIdRwS9W3pqpITr66s",
authDomain:"arshu-9919.firebaseapp.com",
projectId:"arshu-9919",
messagingSenderId:"629782428750",
appId:"1:629782428750:web:4db3c0d9d68f89c75f971f"
};

const app=initializeApp(firebaseConfig);
const auth=getAuth(app);
const db=getFirestore(app);

const dp=document.getElementById("dp");
const uid=document.getElementById("uid");
const username=document.getElementById("username");
const displayName=document.getElementById("displayName");
const photo=document.getElementById("photo");
const save=document.getElementById("save");
const status=document.getElementById("status");

let currentUser=null;
let oldPhoto="";

// Image compress and convert to Base64
function compressPhoto(file){
return new Promise((resolve,reject)=>{
const reader=new FileReader();

reader.onload=()=>{
const img=new Image();

img.onload=()=>{
const canvas=document.createElement("canvas");
const max=300;

let width=img.width;
let height=img.height;

if(width>height){
if(width>max){
height=height*max/width;
width=max;
}
}else{
if(height>max){
width=width*max/height;
height=max;
}
}

canvas.width=width;
canvas.height=height;

const ctx=canvas.getContext("2d");
ctx.drawImage(img,0,0,width,height);

resolve(canvas.toDataURL("image/jpeg",0.6));
};

img.onerror=reject;
img.src=reader.result;
};

reader.onerror=reject;
reader.readAsDataURL(file);
});
}

onAuthStateChanged(auth,async user=>{
if(!user){
location.href="index.html";
return;
}

currentUser=user;
uid.textContent="UID: "+user.uid;

try{
const snap=await getDoc(doc(db,"profiles",user.uid));

if(snap.exists()){
const p=snap.data();

username.value=p.username||"";
displayName.value=p.displayName||"";
oldPhoto=p.photoBase64||"";

if(oldPhoto){
dp.src=oldPhoto;
}
}
}catch(e){
status.textContent=e.message;
}
});

photo.addEventListener("change",async()=>{
const file=photo.files[0];
if(!file)return;

if(!file.type.startsWith("image/")){
status.textContent="Sirf image select karo";
return;
}

try{
const base64=await compressPhoto(file);
dp.src=base64;
}catch(e){
status.textContent="Photo load nahi hui";
}
});

save.onclick=async()=>{
if(!currentUser)return;

try{
save.disabled=true;
status.textContent="Saving...";

const usernameValue=username.value.trim().toLowerCase();
const displayValue=displayName.value.trim();

if(!usernameValue){
status.textContent="Username bharo";
save.disabled=false;
return;
}

if(!/^[a-z0-9_]{3,20}$/.test(usernameValue)){
status.textContent="Username 3-20 characters ka hona chahiye";
save.disabled=false;
return;
}

let photoBase64=oldPhoto;

const file=photo.files[0];

if(file){
photoBase64=await compressPhoto(file);
}

// Keep photo small for Firestore
if(photoBase64.length>200000){
status.textContent="Photo bahut badi hai. Dusri photo select karo.";
save.disabled=false;
return;
}

await setDoc(doc(db,"profiles",currentUser.uid),{
uid:currentUser.uid,
username:usernameValue,
displayName:displayValue,
photoBase64:photoBase64,
updatedAt:serverTimestamp()
},{merge:true});

oldPhoto=photoBase64;
status.textContent="Profile saved successfully!";

}catch(e){
console.error(e);
status.textContent=e.message;
}

save.disabled=false;
};



document.getElementById("removeDP").onclick = async () => {
  if (!currentUser) return;

  const confirmDelete = confirm("DP remove karna chahte ho?");
  if (!confirmDelete) return;

  try {
    await setDoc(doc(db, "profiles", currentUser.uid), {
      photoBase64: "",
      updatedAt: serverTimestamp()
    }, { merge: true });

    oldPhoto = "";
    dp.src = "https://placehold.co/100x100/222/fff?text=DP";
    photo.value = "";

    status.textContent = "DP removed successfully!";
  } catch (e) {
    status.textContent = e.message;
  }
};



const addDP = document.getElementById("addDP");
const changeDP = document.getElementById("changeDP");
const removeDP = document.getElementById("removeDP");

addDP.onclick = () => photo.click();

changeDP.onclick = () => photo.click();

removeDP.onclick = async () => {
    if (!currentUser) return;

    if (!confirm("DP remove karna chahte ho?")) return;

    try {
        await setDoc(doc(db, "profiles", currentUser.uid), {
            photoBase64: "",
            updatedAt: serverTimestamp()
        }, { merge: true });

        oldPhoto = "";
        dp.src = "https://placehold.co/100x100/222/fff?text=DP";
        photo.value = "";

        status.textContent = "DP removed successfully!";
    } catch (e) {
        status.textContent = e.message;
    }
};

