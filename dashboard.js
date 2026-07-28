import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
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

window.addProduct = async function () {

  const name = document.getElementById("name").value;
  const price = Number(document.getElementById("price").value);
  const image = document.getElementById("image").value;

  const stock = document.getElementById("stock").value;
  if (!name || !price || !image) {
    alert("அனைத்து தகவல்களையும் நிரப்புங்கள்");
    return;
  }

  await addDoc(collection(db, "products"), {
    name: name,
    price: price,
    image: image
  });

  alert("✅ Product Successfully Added");

  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("image").value = "";
};
// Edit Product Price

window.editProduct = async function () {

    const id = document.getElementById("productId").value;

    const newPrice = prompt("Enter New Price:");

    if (!id || !newPrice) {
        alert("Enter Product ID & Price");
        return;
    }

    await updateDoc(
        doc(db, "products", id),
        {
            price: Number(newPrice)
        }
    );

    alert("✅ Price Updated");
};

// Delete Product

window.deleteProduct = async function () {

    const id = document.getElementById("productId").value;

    if (!id) {
        alert("Enter Product ID");
        return;
    }

    await deleteDoc(doc(db, "products", id));

    alert("🗑️ Product Deleted");
};
await addDoc(collection(db, "products"), {
    name: name,
    price: price,
    image: image,
    stock: stock
});
