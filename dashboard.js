import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Firebase Configuration
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

// Add Product
window.addProduct = async function () {

    const name = document.getElementById("name").value;
    const price = Number(document.getElementById("price").value);
    const image = document.getElementById("image").value;
    const stock = document.getElementById("stock").value;

    try {
        await addDoc(collection(db, "products"), {
            name,
            price,
            image,
            stock
        });

        alert("✅ Product Added Successfully!");
    } catch (error) {
        alert("❌ Error: " + error.message);
    }
};

// Edit Product
window.editProduct = async function(id, name, price, image, stock){

    const newPrice = prompt("New Price", price);
    if(newPrice == null) return;

    const newStock = prompt("Stock", stock);
    if(newStock == null) return;

    try{

        await updateDoc(doc(db,"products",id),{
            price:Number(newPrice),
            stock:newStock
        });

        alert("✅ Product Updated");

        loadProductList();

    }catch(error){
        alert(error.message);
    }

}

window.deleteProduct = async function(id){

    if(!confirm("இந்த Product-ஐ Delete செய்யவா?")) return;

    try{

        await deleteDoc(doc(db,"products",id));

        alert("🗑️ Product Deleted");

        loadProductList();

    }catch(error){
        alert(error.message);
    }

}
// Load Products
async function loadProductList() {

    const list = document.getElementById("productList");
    list.innerHTML = "";
    let lowStock = 0;
    const snapshot = await getDocs(collection(db, "products"));

    snapshot.forEach((docSnap) => {

        const product = docSnap.data();
        if (Number(product.stock) <= 5) {
    lowStock++;
        }
        list.innerHTML += `
<div style="background:#fff;padding:10px;margin:10px 0;border-radius:10px;box-shadow:0 2px 5px #ccc;">

<img src="${product.image}"
style="width:80px;height:80px;object-fit:cover;border-radius:8px;">

<h3>${product.name}</h3>

<p>₹${product.price}</p>

<p>${product.stock}</p>

<button onclick="editProduct('${docSnap.id}','${product.name}',${product.price},'${product.image}','${product.stock}')">
✏️ Edit
</button>

<button onclick="deleteProduct('${docSnap.id}')">
🗑️ Delete
</button>

</div>
`;

    });

}

loadProductList();
async function loadDashboard(){

    const snapshot = await getDocs(collection(db,"orders"));

    let orders = 0;
    let sales = 0;
    let pending = 0;
    let todaySales = 0;
    snapshot.forEach(docSnap=>{

        const order = docSnap.data();

        orders++;

sales += Number(order.total);

const today = new Date().toISOString().slice(0,10);

if(order.createdAt && order.createdAt.startsWith(today)){
    todaySales += Number(order.total);
}

if(order.status === "Pending"){
    pending++;
}
    });

    document.getElementById("totalOrders").innerText = orders;

document.getElementById("totalSales").innerText = "₹" + sales;

document.getElementById("pendingOrders").innerText = pending;

document.getElementById("todaySales").innerText = "₹" + todaySales;
}
if (pending > 0) {
    document.title = "🔔 New Order (" + pending + ")";
} else {
    document.title = "ஸ்ரீ சாரதா மார்ட் - Dashboard";
}
if (pending > 0 && Notification.permission === "granted") {

    new Notification("🛒 புதிய Order வந்துள்ளது!", {
        body: pending + " Pending Order(s)",
        icon: "logo.png"
    });

}
loadDashboard();
setInterval(loadDashboard, 5000);
window.searchProduct = function () {

    const input = document
        .getElementById("search")
        .value
        .toLowerCase();

    const products = document.querySelectorAll("#productList div");

    products.forEach(product => {

        if (product.innerText.toLowerCase().includes(input)) {
            product.style.display = "";
        } else {
            product.style.display = "none";
        }

    });

}
