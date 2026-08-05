import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc
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
window.checkout = async function () {

  if (cartItems.length === 0) {
    alert("🛒 Cart காலியாக உள்ளது!");
    return;
  }
let customerName = localStorage.getItem("customerName");

if (!customerName) {
    customerName = prompt("👤 உங்கள் பெயர்:");
    if (!customerName) return;
    localStorage.setItem("customerName", customerName);
}

let customerPhone = localStorage.getItem("customerPhone");

if (!customerPhone) {
    customerPhone = prompt("📞 உங்கள் மொபைல் எண்:");
    if (!customerPhone) return;
    localStorage.setItem("customerPhone", customerPhone);
}

let customerAddress = localStorage.getItem("customerAddress");

if (!customerAddress) {
    customerAddress = prompt("📍 உங்கள் முகவரி:");
    if (!customerAddress) return;
    localStorage.setItem("customerAddress", customerAddress);
}
  
await addDoc(collection(db, "orders"), {
    name: customerName,
    phone: customerPhone,
    address: customerAddress,
    total: total,
    status: "Pending",
    createdAt: new Date().toISOString()
});
  let orderList = "";

  cartItems.forEach((item) => {
    orderList += `• ${item.name} - ₹${item.price}\n`;
  });

  const message =
`🛒 ஸ்ரீ சாரதா மார்ட்

👤 பெயர்: ${customerName}
📞 மொபைல்: ${customerPhone}
📍 முகவரி: ${customerAddress}

📦 ஆர்டர்:
${orderList}

💰 மொத்தம்: ₹${total}

நன்றி 🙏`;

  window.open(
    `https://wa.me/918760534354?text=${encodeURIComponent(message)}`,
    "_blank"
  );

};
// Cart Variables
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
let cartCount = cartItems.length;
let total = cartItems.reduce((sum, item) => sum + item.price, 0);

// Load Products
async function loadProducts() {

  const productsDiv = document.getElementById("products");
  productsDiv.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "products"));

  querySnapshot.forEach((document) => {

    const product = document.data();
console.log(product);
console.log(product.image);
    productsDiv.innerHTML += `
      <div class="product">

<img
  src="${product.image}"
  alt="${product.name}"
  style="width:100%;height:200px;object-fit:cover;">
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
}

// Add To Cart
window.addToCart = function(name, price) {

  total += price;
  cartItems.push({
  name: name,
  price: price
});
  cartCount = cartItems.length;
localStorage.setItem("cartItems", JSON.stringify(cartItems));

document.getElementById("cart-count").innerText = cartCount;
document.getElementById("total").innerText = total;

updateProgress();
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
document.getElementById("total").innerText = total;
  document.getElementById("cart-count").innerText = cartCount;
  document.getElementById("total").innerText = total;
  updateProgress();
  alert(name + " Cart-ல் சேர்க்கப்பட்டது!");
};

// WhatsApp Order
window.orderProduct = function(name, price) {

  const message =
    `வணக்கம்!\n\n` +
    `பொருள்: ${name}\n` +
    `விலை: ₹${price}`;

  window.open(
    `https://wa.me/918760534354?text=${encodeURIComponent(message)}`,
    "_blank"
  );
};
window.viewCart = function () {

    if (cartItems.length === 0) {
        alert("🛒 Cart காலியாக உள்ளது!");
        return;
    }

    let items = "";

    cartItems.forEach((item, index) => {
        items += `${index + 1}. ${item.name} - ₹${item.price}\n`;
    });

    alert(
        "🛒 உங்கள் Cart\n\n" +
        items +
        "\n----------------------\n" +
        "Total : ₹" + total
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
window.filterProducts = function(category) {

  document.querySelectorAll(".product").forEach((product) => {

    const text = product.innerText.toLowerCase();

    if (text.includes(category)) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }

  });

};
// Start
console.log("SCRIPT WORKING");
loadProducts();
document.getElementById("cart-count").innerText = cartCount;
document.getElementById("total").innerText = total;

updateProgress();
async function loadOffer() {

    const snap = await getDoc(doc(db, "settings", "offer"));

    if (snap.exists()) {
        document.getElementById("offerBanner").innerHTML =
            "🎁 " + snap.data().text;
    } else {
        document.getElementById("offerBanner").style.display = "none";
    }

}

loadOffer();
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    document.getElementById("installBtn").style.display = "block";
});

document.getElementById("installBtn").addEventListener("click", async () => {

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    console.log(`User response: ${outcome}`);
});
function updateShopStatus() {

    const now = new Date();

    const hour = now.getHours();

    const statusDiv = document.getElementById("shop-status");

    // காலை 7 மணி முதல் இரவு 10 மணி வரை
    if (hour >= 7 && hour < 22) {

        statusDiv.innerHTML =
        "🟢 Shop Open<br><small>7:00 AM - 10:00 PM</small>";

        statusDiv.style.color = "green";

    } else {

        statusDiv.innerHTML =
        "🔴 Shop Closed<br><small>Opens at 7:00 AM</small>";

        statusDiv.style.color = "red";
    }
}

function updateProgress() {

    let percent = (total / 300) * 100;

    if (percent > 100) percent = 100;
    if (percent < 0) percent = 0;

    const fill = document.getElementById("progressFill");
    const text = document.getElementById("progressText");

    fill.style.width = percent + "%";

    if (total < 300) {
        text.innerHTML = `₹${total} / ₹300 <br>⚠️ இன்னும் ₹${300-total} வாங்கினால் Checkout செய்யலாம்`;
    } else {
        text.innerHTML = `🎉 Minimum Order Completed (₹${total})`;
    }

    if (total < 200) {
        fill.style.background = "#ff3b30";
    } else if (total < 300) {
        fill.style.background = "#ff9800";
    } else {
        fill.style.background = "#4CAF50";
    }
  const checkoutBtn = document.getElementById("checkoutBtn");

if (total >= 300) {
    checkoutBtn.disabled = false;
    checkoutBtn.style.opacity = "1";
} else {
    checkoutBtn.disabled = true;
    checkoutBtn.style.opacity = "0.5";
}
}

updateShopStatus();
updateProgress();
