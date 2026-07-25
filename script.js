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
