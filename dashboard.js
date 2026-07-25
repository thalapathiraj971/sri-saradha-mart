function addProduct(){

const name=document.getElementById("productName").value;
const price=document.getElementById("productPrice").value;

if(name==="" || price===""){
    alert("அனைத்து தகவல்களையும் நிரப்புங்கள்");
    return;
}

const list=document.getElementById("list");

list.innerHTML += `
<div class="product">
<h3>${name}</h3>
<p>₹${price}</p>
</div>
`;

document.getElementById("productName").value="";
document.getElementById("productPrice").value="";
}
