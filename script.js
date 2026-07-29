import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBQehMWwcThf8NLMGeJIG-omcywEEiJpHs",
  authDomain: "raj-mini-mart.firebaseapp.com",
  projectId: "raj-mini-mart",
  storageBucket: "raj-mini-mart.firebasestorage.app",
  messagingSenderId: "490305070206",
  appId: "1:490305070206:web:ff8214149720a7b8a1e42f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Load Products
async function loadProducts() {

  const productsDiv = document.getElementById("products");
  productsDiv.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "products"));

  querySnapshot.forEach((doc) => {

    const product = doc.data();
    
    console.log(doc.data());

    productsDiv.innerHTML += `
      <div class="product">
        <img src="${product.image}" alt="${product.name}">

        <h3>${product.name}</h3>

        <p>₹${product.price}</p>

        <p>${product.stock}</p>

        <button onclick="addToCart('${product.name}', ${product.price})">
          🛒 Add to Cart
        </button>

        <button onclick="orderProduct('${product.name}', ${product.price})">
          WhatsApp Order
        </button>
      </div>
    `;
  });
}

// Cart
let cartCount = 0;
let total = 0;

window.addToCart = function(name, price) {

  cartCount++;
  total += price;

  document.getElementById("cart-count").innerText = cartCount;
  document.getElementById("total").innerText = total;

  alert(name + " Cart-ல் சேர்க்கப்பட்டது!");
};

// WhatsApp Order
window.orderProduct = function(name, price) {

  const message =
    `வணக்கம்!\n\nபொருள்: ${name}\nவிலை: ₹${price}`;

  window.open(
    `https://wa.me/916369135650?text=${encodeURIComponent(message)}`,
    "_blank"
  );
};

// Search
document.getElementById("search").addEventListener("keyup", function () {

  const value = this.value.toLowerCase();

  document.querySelectorAll(".product").forEach((product) => {

    const text = product.innerText.toLowerCase();

    product.style.display =
      text.includes(value) ? "block" : "none";
  });
});

// Start
console.log("SCRIPT WORKING");
loadProducts();
