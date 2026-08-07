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
// CART
// ===============================

let cartItems =
  JSON.parse(localStorage.getItem("cartItems")) || [];


// Make sure every item uses quantity
cartItems = cartItems.map(item => ({
  name: item.name,
  price: Number(item.price),
  quantity: Number(item.quantity) || Number(item.qty) || 1
}));


// ===============================
// CART TOTAL
// ===============================

function getCartTotal() {

  return cartItems.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity),
    0
  );

}


// ===============================
// SAVE CART
// ===============================

function saveCart() {

  localStorage.setItem(
    "cartItems",
    JSON.stringify(cartItems)
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
      (sum, item) =>
        sum + Number(item.quantity),
      0
    );

  const total = getCartTotal();


  if (cartCountElement) {

    cartCountElement.innerText =
      cartCount;

  }


  if (totalElement) {

    totalElement.innerText =
      total;

  }


  saveCart();

  updateProgress();

}


// ===============================
// ADD TO CART
// ===============================

window.addToCart = function(name, price) {

  const existingItem =
    cartItems.find(
      item => item.name === name
    );


  if (existingItem) {

    existingItem.quantity += 1;

  } else {

    cartItems.push({
      name: name,
      price: Number(price),
      quantity: 1
    });

  }


  updateCartUI();

  alert(
    `🛒 ${name}\nCart-ல் சேர்க்கப்பட்டது!`
  );

};


// ===============================
// VIEW CART
// ===============================

window.viewCart = function() {

  const cartModal =
    document.getElementById("cartModal");

  const cartList =
    document.getElementById("cartList");

  const cartTotal =
    document.getElementById("cartTotal");


  if (!cartModal || !cartList) {

    console.log("Cart elements not found");

    return;

  }


  cartList.innerHTML = "";


  if (cartItems.length === 0) {

    cartList.innerHTML = `
      <p style="
        text-align:center;
        padding:20px;
        color:#777;
        font-weight:bold;
      ">
        🛒 Cart காலியாக உள்ளது
      </p>
    `;

  } else {


    cartItems.forEach((item, index) => {

      const itemTotal =
        Number(item.price) *
        Number(item.quantity);


      cartList.innerHTML += `

        <div class="cart-item"
          style="
            padding:12px 0;
            border-bottom:1px solid #ddd;
          ">

          <b>${item.name}</b>

          <br>

          ₹${item.price} × ${item.quantity}

          <br><br>

          <button
            onclick="changeQty(${index}, -1)"
            style="
              background:#ff9800;
              color:white;
              border:none;
              padding:6px 12px;
              border-radius:6px;
              font-size:18px;
            ">
            −
          </button>

          <strong style="
            margin:0 10px;
            font-size:17px;
          ">
            ${item.quantity}
          </strong>

          <button
            onclick="changeQty(${index}, 1)"
            style="
              background:#0b7a3b;
              color:white;
              border:none;
              padding:6px 12px;
              border-radius:6px;
              font-size:18px;
            ">
            +
          </button>

          <button
            onclick="removeItem(${index})"
            style="
              background:#e53935;
              color:white;
              border:none;
              padding:6px 10px;
              border-radius:6px;
              margin-left:8px;
            ">
            ❌
          </button>

          <br><br>

          <strong>
            Sub Total: ₹${itemTotal}
          </strong>

        </div>

      `;

    });

  }


  if (cartTotal) {

    cartTotal.innerText =
      getCartTotal();

  }


  cartModal.classList.add("show");

};


// ===============================
// CHANGE QUANTITY
// ===============================

window.changeQty = function(index, change) {

  if (!cartItems[index]) return;


  cartItems[index].quantity =
    Number(cartItems[index].quantity) +
    Number(change);


  if (cartItems[index].quantity <= 0) {

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
    confirm(
      "🗑️ Cart முழுவதையும் Clear செய்யவா?"
    );


  if (!confirmClear) return;


  cartItems = [];

  localStorage.removeItem(
    "cartItems"
  );

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
    <p style="
      text-align:center;
      padding:20px;
    ">
      ⏳ Products loading...
    </p>
  `;


  try {

    const querySnapshot =
      await getDocs(
        collection(db, "products")
      );


    productsDiv.innerHTML = "";


    if (querySnapshot.empty) {

      productsDiv.innerHTML = `
        <p style="
          text-align:center;
          color:#777;
        ">
          🛒 Products இல்லை
        </p>
      `;

      return;

    }


    querySnapshot.forEach((document) => {

      const product =
        document.data();


      console.log(
        "Product:",
        product
      );


      const name =
        product.name || "Product";


      const price =
        Number(product.price) || 0;


      const image =
        product.image || "";


      const stock =
        product.stock || "In Stock";


      const safeName =
        name.replace(/'/g, "\\'");


      productsDiv.innerHTML += `

        <div class="product">

          <img
            src="${image}"
            alt="${name}"
            onerror="
              this.src='https://via.placeholder.com/300x200?text=No+Image'
            "
          >

          <h3>
            ${name}
          </h3>

          <p>
            ₹${price}
          </p>

          <p class="stock">
            ${stock}
          </p>


          <button
            onclick="
              addToCart(
                '${safeName}',
                ${price}
              )
            "
          >
            🛒 Add to Cart
          </button>


          <button
            onclick="
              orderProduct(
                '${safeName}',
                ${price}
              )
            "
          >
            📲 WhatsApp Order
          </button>

        </div>

      `;

    });


  } catch (error) {

    console.error(
      "Products Error:",
      error
    );


    productsDiv.innerHTML = `
      <p style="
        color:red;
        text-align:center;
        padding:20px;
      ">
        ❌ Products load ஆகவில்லை
      </p>
    `;

  }

}


// ===============================
// WHATSAPP SINGLE PRODUCT
// ===============================

window.orderProduct =
function(name, price) {

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

window.checkout =
async function() {

  if (cartItems.length === 0) {

    alert(
      "🛒 Cart காலியாக உள்ளது!"
    );

    return;

  }


  const total =
    getCartTotal();


  if (total < 300) {

    alert(
      `⚠️ Minimum Order ₹300

இன்னும் ₹${300 - total} வாங்க வேண்டும்.`
    );

    return;

  }


  // CUSTOMER NAME

  let customerName =
    localStorage.getItem(
      "customerName"
    );


  if (!customerName) {

    customerName =
      prompt(
        "👤 உங்கள் பெயர்:"
      );


    if (!customerName) return;


    localStorage.setItem(
      "customerName",
      customerName
    );

  }


  // CUSTOMER PHONE

  let customerPhone =
    localStorage.getItem(
      "customerPhone"
    );


  if (!customerPhone) {

    customerPhone =
      prompt(
        "📞 உங்கள் மொபைல் எண்:"
      );


    if (!customerPhone) return;


    localStorage.setItem(
      "customerPhone",
      customerPhone
    );

  }


  // CUSTOMER ADDRESS

  let customerAddress =
    localStorage.getItem(
      "customerAddress"
    );


  if (!customerAddress) {

    customerAddress =
      prompt(
        "📍 உங்கள் முகவரி:"
      );


    if (!customerAddress) return;


    localStorage.setItem(
      "customerAddress",
      customerAddress
    );

  }


  // ORDER LIST

  let orderList = "";


  cartItems.forEach(
    (item) => {

      orderList +=
        `• ${item.name} × ${item.quantity} = ₹${item.price * item.quantity}\n`;

    }
  );


  // SAVE ORDER TO FIREBASE

  try {

    await addDoc(
      collection(
        db,
        "orders"
      ),
      {

        name:
          customerName,

        phone:
          customerPhone,

        address:
          customerAddress,

        items:
          cartItems,

        total:
          total,

        status:
          "Pending",

        createdAt:
          new Date().toISOString()

      }
    );


    console.log(
      "✅ Order saved to Firebase"
    );


  } catch (error) {

    console.error(
      "Firebase order error:",
      error
    );

  }


  // WHATSAPP MESSAGE

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
  document.getElementById(
    "search"
  );


if (searchBox) {

  searchBox.addEventListener(
    "keyup",
    function() {

      const value =
        this.value
          .toLowerCase()
          .trim();


      document
        .querySelectorAll(
          ".product"
        )
        .forEach(
          (product) => {

            const text =
              product.innerText
                .toLowerCase();


            product.style.display =
              text.includes(value)
                ? "block"
                : "none";

          }
        );

    }
  );

}


// ===============================
// CATEGORY FILTER
// ===============================

window.filterProducts =
function(category) {

  category =
    category
      .toLowerCase()
      .trim();


  document
    .querySelectorAll(
      ".product"
    )
    .forEach(
      (product) => {

        const text =
          product.innerText
            .toLowerCase();


        if (
          category === "all"
        ) {

          product.style.display =
            "block";

        } else {

          product.style.display =
            text.includes(category)
              ? "block"
              : "none";

        }

      }
    );

};


// ===============================
// OFFER
// ===============================

async function loadOffer() {

  try {

    const snap =
      await getDoc(
        doc(
          db,
          "settings",
          "offer"
        )
      );


    const offerBanner =
      document.getElementById(
        "offerBanner"
      );


    if (!offerBanner) return;


    if (snap.exists()) {

      offerBanner.innerHTML =
        "🎁 " +
        (snap.data().text || "");

      offerBanner.style.display =
        "block";

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

  const statusDiv =
    document.getElementById(
      "shop-status"
    );


  if (!statusDiv) return;


  const now =
    new Date();


  const hour =
    now.getHours();


  if (
    hour >= 7 &&
    hour < 22
  ) {

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
    document.getElementById(
      "progressFill"
    );


  const text =
    document.getElementById(
      "progressText"
    );


  if (fill) {

    fill.style.width =
      percent + "%";


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


  const checkoutBtn =
    document.getElementById(
      "checkoutBtn"
    );


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

let deferredPrompt =
  null;


window.addEventListener(
  "beforeinstallprompt",
  (e) => {

    e.preventDefault();

    deferredPrompt = e;


    const installBtn =
      document.getElementById(
        "installBtn"
      );


    if (installBtn) {

      installBtn.style.display =
        "block";

    }

  }
);


const installBtn =
  document.getElementById(
    "installBtn"
  );


if (installBtn) {

  installBtn.addEventListener(
    "click",
    async () => {

      if (!deferredPrompt)
        return;


      deferredPrompt.prompt();


      const { outcome } =
        await deferredPrompt
          .userChoice;


      console.log(
        "Install response:",
        outcome
      );


      deferredPrompt =
        null;

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

    
