  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ===============================
// FIREBASE CONFIG
// ===============================

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


// ===============================
// CART VARIABLES
// ===============================

let cartItems =
  JSON.parse(localStorage.getItem("cartItems")) || [];


// Convert old cart format to quantity format
cartItems = cartItems.map(item => ({
  name: item.name,
  price: Number(item.price),
  quantity: Number(item.quantity) || 1
}));


// ===============================
// CART TOTAL
// ===============================

function getCartTotal() {

  return cartItems.reduce(
    (sum, item) =>
      sum + (Number(item.price) * Number(item.quantity)),
    0
  );
}


// ===============================
// UPDATE CART UI
// ===============================

function updateCartUI() {

  const cartCountElement =
    document.getElementById("cart-count");

  const totalElement =
    document.getElementById("total");

  const cartCount =
    cartItems.reduce(
      (sum, item) => sum + Number(item.quantity),
      0
    );

  const total = getCartTotal();

  if (cartCountElement) {
    cartCountElement.innerText = cartCount;
  }

  if (totalElement) {
    totalElement.innerText = total;
  }

  localStorage.setItem(
    "cartItems",
    JSON.stringify(cartItems)
  );

  updateProgress();
}


// ===============================
// ADD TO CART
// ===============================

function saveCart() {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

function calculateTotal() {
    return cartItems.reduce(
        (sum, item) => sum + (item.price * item.qty),
        0
    );
}

function updateCartUI() {

    total = calculateTotal();
    cartCount = cartItems.reduce(
        (sum, item) => sum + item.qty,
        0
    );

    document.getElementById("cart-count").innerText = cartCount;
    document.getElementById("total").innerText = total;

    updateProgress();
}

window.changeQty = function(index, change) {

    cartItems[index].qty += change;

    if (cartItems[index].qty <= 0) {
        cartItems.splice(index, 1);
    }

    saveCart();
    updateCartUI();
    viewCart();
};


// ===============================
// VIEW CART
// ===============================

window.viewCart = function () {

    const cartList = document.getElementById("cartList");

    cartList.innerHTML = "";

    cartItems.forEach((item, index) => {

        const itemTotal = item.price * item.qty;

        cartList.innerHTML += `
            <div class="cart-item">

                <div>
                    <b>${item.name}</b>
                    <br>
                    ₹${item.price} × ${item.qty}
                    <br>
                    <strong>₹${itemTotal}</strong>
                </div>

                <div class="qty-control">

                    <button onclick="changeQty(${index}, -1)">
                        −
                    </button>

                    <span>${item.qty}</span>

                    <button onclick="changeQty(${index}, 1)">
                        +
                    </button>

                </div>

            </div>
        `;

    });

    document.getElementById("cartTotal").innerText = calculateTotal();

    document.getElementById("cartModal").classList.add("show");
};


// ===============================
// INCREASE QUANTITY
// ===============================

window.increaseQuantity = function(index) {

  if (!cartItems[index]) return;

  cartItems[index].quantity += 1;

  updateCartUI();

  viewCart();
};


// ===============================
// DECREASE QUANTITY
// ===============================

window.decreaseQuantity = function(index) {

  if (!cartItems[index]) return;

  if (cartItems[index].quantity > 1) {

    cartItems[index].quantity -= 1;

  } else {

    cartItems.splice(index, 1);

  }

  updateCartUI();

  viewCart();
};


// ===============================
// REMOVE ITEM
// ===============================

window.removeItem = function(index) {

  if (!cartItems[index]) return;

  cartItems.splice(index, 1);

  updateCartUI();

  viewCart();
};


// ===============================
// CLEAR CART
// ===============================

window.clearCart = function() {

  if (cartItems.length === 0) {
    return;
  }

  const confirmClear =
    confirm("🗑️ Cart முழுவதையும் Clear செய்யவா?");

  if (!confirmClear) return;

  cartItems = [];

  localStorage.removeItem("cartItems");

  updateCartUI();

  closeCart();
};


// ===============================
// CLOSE CART
// ===============================

window.closeCart = function() {

  const cartModal =
    document.getElementById("cartModal");

  if (cartModal) {
    cartModal.classList.remove("show");
  }

};


// ===============================
// LOAD PRODUCTS
// ===============================

async function loadProducts() {

  const productsDiv =
    document.getElementById("products");

  if (!productsDiv) return;

  productsDiv.innerHTML = `
    <p style="text-align:center;">
      ⏳ Products loading...
    </p>
  `;

  try {

    const querySnapshot =
      await getDocs(collection(db, "products"));

    productsDiv.innerHTML = "";

    querySnapshot.forEach((document) => {

      const product = document.data();

      console.log("Product:", product);
      console.log("Image:", product.image);

      productsDiv.innerHTML += `

        <div class="product">

          <img
            src="${product.image}"
            alt="${product.name}"
            onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'"
          >

          <h3>
            ${product.name}
          </h3>

          <p>
            ₹${product.price}
          </p>

          <p class="stock">
            ${product.stock || "In Stock"}
          </p>

          <button
            onclick="addToCart(
              '${product.name.replace(/'/g, "\\'")}',
              ${Number(product.price)}
            )">

            🛒 Add to Cart

          </button>

          <button
            onclick="orderProduct(
              '${product.name.replace(/'/g, "\\'")}',
              ${Number(product.price)}
            )">

            📲 WhatsApp Order

          </button>

        </div>

      `;

    });

  } catch (error) {

    console.error(error);

    productsDiv.innerHTML = `
      <p style="color:red;text-align:center;">
        ❌ Products load ஆகவில்லை
      </p>
    `;

  }

}


// ===============================
// WHATSAPP SINGLE PRODUCT ORDER
// ===============================

window.orderProduct = function(name, price) {

  const message =
`வணக்கம் ஸ்ரீ சாரதா மார்ட் 🙏

🛒 பொருள்: ${name}
💰 விலை: ₹${price}

இந்த பொருள் எனக்கு வேண்டும்.`;

  window.open(
    `https://wa.me/918760534354?text=${encodeURIComponent(message)}`,
    "_blank"
  );

};


// ===============================
// CHECKOUT
// ===============================

window.checkout = async function() {

  if (cartItems.length === 0) {

    alert("🛒 Cart காலியாக உள்ளது!");

    return;
  }

  const total = getCartTotal();

  if (total < 300) {

    alert(
      `⚠️ Minimum Order ₹300\n\nஇன்னும் ₹${300 - total} வாங்க வேண்டும்.`
    );

    return;
  }


  // Customer Name

  let customerName =
    localStorage.getItem("customerName");

  if (!customerName) {

    customerName =
      prompt("👤 உங்கள் பெயர்:");

    if (!customerName) return;

    localStorage.setItem(
      "customerName",
      customerName
    );

  }


  // Customer Phone

  let customerPhone =
    localStorage.getItem("customerPhone");

  if (!customerPhone) {

    customerPhone =
      prompt("📞 உங்கள் மொபைல் எண்:");

    if (!customerPhone) return;

    localStorage.setItem(
      "customerPhone",
      customerPhone
    );

  }


  // Customer Address

  let customerAddress =
    localStorage.getItem("customerAddress");

  if (!customerAddress) {

    customerAddress =
      prompt("📍 உங்கள் முகவரி:");

    if (!customerAddress) return;

    localStorage.setItem(
      "customerAddress",
      customerAddress
    );

  }


  // ===============================
  // ORDER LIST
  // ===============================

  let orderList = "";

  cartItems.forEach((item) => {

    orderList +=
      `• ${item.name} × ${item.quantity} = ₹${item.price * item.quantity}\n`;

  });


  // ===============================
  // FIREBASE ORDER
  // ===============================

  try {

    await addDoc(
      collection(db, "orders"),
      {

        name: customerName,

        phone: customerPhone,

        address: customerAddress,

        items: cartItems,

        total: total,

        status: "Pending",

        createdAt:
          new Date().toISOString()

      }
    );

    console.log("Order saved to Firebase");

  } catch (error) {

    console.error(
      "Firebase order error:",
      error
    );

  }


  // ===============================
  // WHATSAPP MESSAGE
  // ===============================

  const message =
`🛒 ஸ்ரீ சாரதா மார்ட்

👤 பெயர்: ${customerName}

📞 மொபைல்: ${customerPhone}

📍 முகவரி:
${customerAddress}

📦 ஆர்டர்:

${orderList}

💰 மொத்தம்: ₹${total}

நன்றி 🙏`;

  window.open(
    `https://wa.me/918760534354?text=${encodeURIComponent(message)}`,
    "_blank"
  );

};


// ===============================
// SEARCH
// ===============================

const searchBox =
  document.getElementById("search");

if (searchBox) {

  searchBox.addEventListener(
    "keyup",
    function() {

      const value =
        this.value.toLowerCase();

      document
        .querySelectorAll(".product")
        .forEach((product) => {

          const text =
            product.innerText.toLowerCase();

          product.style.display =
            text.includes(value)
              ? "block"
              : "none";

        });

    }
  );

}


// ===============================
// CATEGORY FILTER
// ===============================

window.filterProducts = function(category) {

  category =
    category.toLowerCase();

  document
    .querySelectorAll(".product")
    .forEach((product) => {

      const text =
        product.innerText.toLowerCase();

      if (category === "all") {

        product.style.display = "block";

      } else {

        product.style.display =
          text.includes(category)
            ? "block"
            : "none";

      }

    });

};


// ===============================
// OFFER
// ===============================

async function loadOffer() {

  try {

    const snap =
      await getDoc(
        doc(db, "settings", "offer")
      );

    const offerBanner =
      document.getElementById("offerBanner");

    if (!offerBanner) return;

    if (snap.exists()) {

      offerBanner.innerHTML =
        "🎁 " + snap.data().text;

    } else {

      offerBanner.style.display =
        "none";

    }

  } catch (error) {

    console.error(
      "Offer error:",
      error
    );

  }

}


// ===============================
// SHOP STATUS
// ===============================

function updateShopStatus() {

  const now = new Date();

  const hour =
    now.getHours();

  const statusDiv =
    document.getElementById("shop-status");

  if (!statusDiv) return;


  // 7 AM - 10 PM

  if (hour >= 7 && hour < 22) {

    statusDiv.innerHTML =
      "🟢 Shop Open<br><small>7:00 AM - 10:00 PM</small>";

    statusDiv.style.color =
      "green";

  } else {

    statusDiv.innerHTML =
      "🔴 Shop Closed<br><small>Opens at 7:00 AM</small>";

    statusDiv.style.color =
      "red";

  }

}


// ===============================
// MINIMUM ORDER PROGRESS
// ===============================

function updateProgress() {

  const total =
    getCartTotal();

  let percent =
    (total / 300) * 100;

  if (percent > 100)
    percent = 100;

  if (percent < 0)
    percent = 0;


  const fill =
    document.getElementById("progressFill");

  const text =
    document.getElementById("progressText");


  if (fill) {

    fill.style.width =
      percent + "%";

  }


  if (text) {

    if (total < 300) {

      text.innerHTML =
        `₹${total} / ₹300<br>
         ⚠️ இன்னும் ₹${300 - total}
         வாங்கினால் Checkout செய்யலாம்`;

    } else {

      text.innerHTML =
        `🎉 Minimum Order Completed (₹${total})`;

    }

  }


  if (fill) {

    if (total < 200) {

      fill.style.background =
        "#ff3b30";

    } else if (total < 300) {

      fill.style.background =
        "#ff9800";

    } else {

      fill.style.background =
        "#4CAF50";

    }

  }


  const checkoutBtn =
    document.getElementById("checkoutBtn");

  if (checkoutBtn) {

    if (total >= 300) {

      checkoutBtn.disabled =
        false;

      checkoutBtn.style.opacity =
        "1";

    } else {

      checkoutBtn.disabled =
        true;

      checkoutBtn.style.opacity =
        "0.5";

    }

  }

}


// ===============================
// PWA INSTALL
// ===============================

let deferredPrompt = null;

window.addEventListener(
  "beforeinstallprompt",
  (e) => {

    e.preventDefault();

    deferredPrompt = e;

    const installBtn =
      document.getElementById("installBtn");

    if (installBtn) {

      installBtn.style.display =
        "block";

    }

  }
);


const installBtn =
  document.getElementById("installBtn");

if (installBtn) {

  installBtn.addEventListener(
    "click",
    async () => {

      if (!deferredPrompt) return;

      deferredPrompt.prompt();

      const { outcome } =
        await deferredPrompt.userChoice;

      console.log(
        "Install response:",
        outcome
      );

      deferredPrompt = null;

    }
  );

}


// ===============================
// START
// ===============================

console.log(
  "✅ SRI SARADHA MART SCRIPT WORKING"
);

loadProducts();

loadOffer();

updateCartUI();

updateShopStatus();

updateProgress();    
