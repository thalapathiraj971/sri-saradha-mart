import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "raj-mini-mart.firebaseapp.com",
  projectId: "raj-mini-mart",
  storageBucket: "raj-mini-mart.firebasestorage.app",
  messagingSenderId: "490305070206",
  appId: "1:490305070206:web:ff8214149720a7b8a1e42f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadProducts() {
  const snapshot = await getDocs(collection(db, "products"));

  const productsDiv = document.getElementById("products");
  productsDiv.innerHTML = "";

  snapshot.forEach((doc) => {
    const p = doc.data();

    productsDiv.innerHTML += `
      <div class="product">
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <a href="https://wa.me/91 6369135650" class="btn">Order on WhatsApp</a>
      </div>
    `;
  });
}

loadProducts();
