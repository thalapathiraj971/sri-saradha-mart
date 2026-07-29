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

let cartCount = 0;
let total = 0;

// Cart Function
window.addToCart = function(name, price){

    cartCount++;
    total += price;

    document.getElementById("cart-count").innerText = cartCount;
    document.getElementById("total").innerText = total;

    alert(name + " Cart-ல் சேர்க்கப்பட்டது!");
};

// WhatsApp Order
window.orderProduct = function(name, price){

    const message =
    `வணக்கம்!\n\n` +
    `📦 Product : ${name}\n` +
    `💰 Price : ₹${price}`;

    window.open(
      `https://wa.me/916369135650?text=${encodeURIComponent(message)}`,
      "_blank"
    );
};

// Load Products
async function loadProducts(){

    const snapshot = await getDocs(collection(db, "products"));

    const container = document.getElementById("products");

    container.innerHTML = "";

    snapshot.forEach((doc)=>{

        const p = doc.data();

        container.innerHTML += `
        <div class="product">
            <img src="${p.image}" width="150">
            <h3>${p.name}</h3>
            <p>₹${p.price}</p>
            <p>${p.stock}</p>

            <button onclick="addToCart('${p.name}',${p.price})">
                🛒 Add to Cart
            </button>

            <button onclick="orderProduct('${p.name}',${p.price})">
                WhatsApp Order
            </button>
        </div>
        `;
    });
}

loadProducts();
