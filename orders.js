import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs
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

async function loadOrders() {

    const list = document.getElementById("ordersList");
    list.innerHTML = "";

    const snapshot = await getDocs(collection(db, "orders"));

    snapshot.forEach((docSnap) => {

        const order = docSnap.data();

        list.innerHTML += `
        <div style="background:#fff;padding:15px;margin:10px;border-radius:10px;box-shadow:0 2px 5px #ccc;">

        <h3>👤 ${order.name}</h3>

        <p>📞 ${order.phone}</p>

        <p>📍 ${order.address}</p>

        <p>💰 ₹${order.total}</p>

        <p>📦 ${order.status}</p>

        </div>
        `;
    });

}

loadOrders();
