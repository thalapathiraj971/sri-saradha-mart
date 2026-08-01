import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBQehMWwcThf8NLMGeJIG-omcywEEiJpHs",
  authDomain: "raj-mini-mart.firebaseapp.com",
  projectId: "raj-mini-mart",
  storageBucket: "raj-mini-mart.firebasestorage.app",
  messagingSenderId: "490305070206",
  appId: "1:490305070206:web:ff8214149720a7b8a1e42f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.markDelivered = async function(id){
    await updateDoc(doc(db,"orders",id),{
        status:"Delivered"
    });

    alert("✅ Order Delivered");
    loadOrders();
}

window.deleteOrder = async function(id){

    if(confirm("Delete this order?")){

        await deleteDoc(doc(db,"orders",id));

        alert("🗑️ Order Deleted");

        loadOrders();

    }

}

async function loadOrders(){

    const list = document.getElementById("ordersList");

    list.innerHTML="";

    const snapshot=await getDocs(collection(db,"orders"));

    snapshot.forEach((docSnap)=>{

        const order=docSnap.data();

        list.innerHTML+=`

<div style="background:#fff;padding:15px;margin:10px;border-radius:10px;box-shadow:0 2px 5px #ccc;">

<h3>👤 ${order.name}</h3>

<p>📞 ${order.phone}</p>

<p>📍 ${order.address}</p>

<p>💰 ₹${order.total}</p>

<p>📦 <b style="color:${order.status=="Pending"?"orange":"green"};">${order.status}</b></p>

${order.status=="Pending"?`

<button onclick="markDelivered('${docSnap.id}')">
✅ Delivered
</button>

`:``}

<button onclick="window.open('https://wa.me/91${order.phone}','_blank')">
💬 WhatsApp
</button>

<button onclick="window.location.href='tel:${order.phone}'">
📞 Call
</button>

<button onclick="deleteOrder('${docSnap.id}')">
🗑 Delete
</button>

</div>

`;

    });

}

loadOrders();
