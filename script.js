const search = document.getElementById("search");

search.addEventListener("keyup", function () {

    const value = search.value.toLowerCase();

    const products = document.querySelectorAll(".product");

    products.forEach((product) => {

        const text = product.innerText.toLowerCase();

        if(text.includes(value)){
            product.style.display="block";
        }else{
            product.style.display="none";
        }

    });

});
let cartCount = 0;
let total = 0;

const buttons = document.querySelectorAll(".product button");

buttons.forEach((btn)=>{
    btn.addEventListener("click",()=>{

        cartCount++;
        document.getElementById("cart-count").innerText = cartCount;

        const price = Number(
            btn.parentElement.querySelector("p").innerText.replace("₹","")
        );

        total += price;

        document.getElementById("total").innerText = total;

        alert("✅ பொருள் Cart-ல் சேர்க்கப்பட்டது");
    });
});
