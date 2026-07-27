import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc
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
