import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  setDoc
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


/* =========================
   ADD PRODUCT
========================= */

window.addProduct = async function () {

    const name =
        document.getElementById("name").value.trim();

    const mrp =
        Number(document.getElementById("mrp").value);

    const price =
        Number(document.getElementById("price").value);

    const image =
        document.getElementById("image").value.trim();

    const stock =
        document.getElementById("stock").value.trim();


    if (!name || !price) {
        alert("⚠️ Product Name மற்றும் Offer Price கொடுக்கவும்");
        return;
    }


    try {

        await addDoc(
            collection(db, "products"),
            {
                name: name,
                mrp: mrp,
                price: price,
                image: image,
                stock: stock
            }
        );


        alert("✅ Product Added Successfully!");


        document.getElementById("name").value = "";
        document.getElementById("mrp").value = "";
        document.getElementById("price").value = "";
        document.getElementById("image").value = "";
        document.getElementById("stock").value = "";


        loadProductList();


    } catch (error) {

        alert("❌ Error: " + error.message);

    }

};


/* =========================
   EDIT PRODUCT
========================= */

window.editProduct = async function (
    id,
    name,
    mrp,
    price,
    image,
    stock
) {

    const newName =
        prompt("Product Name", name);

    if (newName === null) return;


    const newMrp =
        prompt("MRP", mrp);

    if (newMrp === null) return;


    const newPrice =
        prompt("Offer Price", price);

    if (newPrice === null) return;


    const newImage =
        prompt("Image URL", image);

    if (newImage === null) return;


    const newStock =
        prompt("Stock", stock);

    if (newStock === null) return;


    try {

        await updateDoc(
            doc(db, "products", id),
            {
                name: newName,
                mrp: Number(newMrp),
                price: Number(newPrice),
                image: newImage,
                stock: newStock
            }
        );


        alert("✅ Product Updated Successfully!");


        loadProductList();


    } catch (error) {

        alert("❌ " + error.message);

    }

};


/* =========================
   DELETE PRODUCT
========================= */

window.deleteProduct = async function (id) {

    if (
        !confirm(
            "இந்த Product-ஐ Delete செய்யவா?"
        )
    ) {
        return;
    }


    try {

        await deleteDoc(
            doc(db, "products", id)
        );


        alert("🗑️ Product Deleted");


        loadProductList();


    } catch (error) {

        alert("❌ " + error.message);

    }

};


/* =========================
   LOAD PRODUCT LIST
========================= */

async function loadProductList() {

    const list =
        document.getElementById("productList");

    if (!list) return;


    list.innerHTML = "";

    let lowStock = 0;


    try {

        const snapshot =
            await getDocs(
                collection(db, "products")
            );


        snapshot.forEach((docSnap) => {

            const product =
                docSnap.data();


            const name =
                product.name || "Product";


            const mrp =
                Number(product.mrp) || 0;


            const price =
                Number(product.price) || 0;


            const image =
                product.image || "";


            const stock =
                product.stock || "";


            if (
                stock !== "" &&
                Number(stock) <= 5
            ) {
                lowStock++;
            }


            let priceHTML = "";


            if (mrp > price && mrp > 0) {

                const discount =
                    Math.round(
                        ((mrp - price) / mrp) * 100
                    );


                priceHTML = `
                    <p>
                        <span style="
                            color:#777;
                            text-decoration:line-through;
                            margin-right:8px;
                        ">
                            ₹${mrp}
                        </span>

                        <strong style="
                            color:#0097A7;
                            font-size:18px;
                        ">
                            ₹${price}
                        </strong>

                        <span style="
                            color:#00a650;
                            font-weight:bold;
                            margin-left:6px;
                        ">
                            ${discount}% OFF
                        </span>
                    </p>
                `;

            } else {

                priceHTML = `
                    <p>
                        <strong>
                            ₹${price}
                        </strong>
                    </p>
                `;

            }


            const safeName =
                name.replace(/'/g, "\\'");

            const safeImage =
                image.replace(/'/g, "\\'");

            const safeStock =
                String(stock).replace(/'/g, "\\'");


            list.innerHTML += `

                <div style="
                    background:#fff;
                    padding:12px;
                    margin:10px 0;
                    border-radius:10px;
                    box-shadow:0 2px 5px #ccc;
                ">

                    <img
                        src="${image}"
                        style="
                            width:80px;
                            height:80px;
                            object-fit:contain;
                            border-radius:8px;
                        "
                    >

                    <h3>
                        ${name}
                    </h3>

                    ${priceHTML}

                    <p>
                        📦 Stock:
                        ${stock}
                    </p>


                    <button
                        onclick="
                            editProduct(
                                '${docSnap.id}',
                                '${safeName}',
                                ${mrp},
                                ${price},
                                '${safeImage}',
                                '${safeStock}'
                            )
                        "
                    >
                        ✏️ Edit / Update
                    </button>


                    <button
                        onclick="
                            deleteProduct(
                                '${docSnap.id}'
                            )
                        "
                        style="
                            background:#F44336;
                        "
                    >
                        🗑️ Delete
                    </button>

                </div>

            `;

        });


        document.getElementById(
            "lowStock"
        ).innerText = lowStock;


    } catch (error) {

        console.error(error);

        list.innerHTML = `
            <p style="color:red;">
                ❌ Products load ஆகவில்லை
            </p>
        `;

    }

}


/* =========================
   DASHBOARD
========================= */

async function loadDashboard() {

    const snapshot =
        await getDocs(
            collection(db, "orders")
        );


    let orders = 0;
    let sales = 0;
    let pending = 0;
    let todaySales = 0;


    const today =
        new Date()
            .toISOString()
            .slice(0, 10);


    snapshot.forEach((docSnap) => {

        const order =
            docSnap.data();


        orders++;


        sales +=
            Number(order.total) || 0;


        if (
            order.createdAt &&
            order.createdAt.startsWith(today)
        ) {

            todaySales +=
                Number(order.total) || 0;

        }


        if (
            order.status === "Pending"
        ) {

            pending++;

        }

    });


    document.getElementById(
        "totalOrders"
    ).innerText = orders;


    document.getElementById(
        "totalSales"
    ).innerText = "₹" + sales;


    document.getElementById(
        "pendingOrders"
    ).innerText = pending;


    document.getElementById(
        "todaySales"
    ).innerText = "₹" + todaySales;


    if (pending > 0) {

        document.getElementById(
            "orderAlert"
        ).style.display = "block";


        document.getElementById(
            "pendingCount"
        ).innerText = pending;


        document.title =
            "🔔 New Order (" +
            pending +
            ")";

    } else {

        document.getElementById(
            "orderAlert"
        ).style.display = "none";


        document.title =
            "ஸ்ரீ சாரதா மார்ட் - Dashboard";

    }

}


/* =========================
   SEARCH PRODUCT
========================= */

window.searchProduct = function () {

    const input =
        document
            .getElementById("search")
            .value
            .toLowerCase();


    const products =
        document.querySelectorAll(
            "#productList > div"
        );


    products.forEach(product => {

        if (
            product.innerText
                .toLowerCase()
                .includes(input)
        ) {

            product.style.display = "";

        } else {

            product.style.display = "none";

        }

    });

};


/* =========================
   SAVE OFFER
========================= */

window.saveOffer = async function () {

    const offer =
        document
            .getElementById("offerText")
            .value;


    try {

        await setDoc(
            doc(db, "settings", "offer"),
            {
                text: offer
            }
        );


        alert("✅ Offer Saved");

    } catch (error) {

        alert("❌ " + error.message);

    }

};


/* =========================
   LOAD OFFER
========================= */

async function loadOffer() {

    const snap =
        await getDoc(
            doc(db, "settings", "offer")
        );


    if (snap.exists()) {

        document.getElementById(
            "offerText"
        ).value =
            snap.data().text || "";

    }

}


/* =========================
   START
========================= */

loadProductList();

loadDashboard();

loadOffer();


setInterval(
    loadDashboard,
    5000
);
