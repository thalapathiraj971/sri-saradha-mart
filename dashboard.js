console.log("Dashboard JS Loaded");

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

// Add Product
window.addProduct = async function () {

    alert("Add Product Clicked!");

    const name = document.getElementById("name").value;
    const price = Number(document.getElementById("price").value);
    const image = document.getElementById("image").value;
    const stock = document.getElementById("stock").value;

    await addDoc(collection(db, "products"), {
        name,
        price,
        image,
        stock
    });

    alert("✅ Product Added Successfully!");
};

// Edit Product
window.editProduct = async function () {

    const id = document.getElementById("productId").value;
    const newPrice = prompt("Enter New Price");

    await updateDoc(doc(db, "products", id), {
        price: Number(newPrice)
    });

    alert("✏️ Product Updated!");
};

// Delete Product
window.deleteProduct = async function () {

    const id = document.getElementById("productId").value;

    await deleteDoc(doc(db, "products", id));

    alert("🗑️ Product Deleted!");
};
