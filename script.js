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

// Cart Variables
let cartCount = 0;
let total = 0;

// Load Products
async function loadProducts() {

  const productsDiv = document.getElementById("products");
  productsDiv.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "products"));

  querySnapshot.forEach((document) => {

  const product = document.data();

  productsDiv.innerHTML += `
    ...
  `;
});

} // loadProducts() முடிவு
    

      <img
        src="${product.image}"
        alt="${product.name}"
        style="width:100%;height:200px;object-fit:cover;"
        onerror="this.src='https://via.placeholder.com/300x200.png?text=No+Image'">

      <h3>${product.name}</h3>

      <p>₹${product.price}</p>

      <p class="stock">${product.stock}</p>

      <button onclick="addToCart('${product.name}', ${product.price})">
        🛒 Add to Cart
      </button>

      <button onclick="orderProduct('${product.name}', ${product.price})">
        📲 WhatsApp Order
      </button>

    </div>
  `;
});
