
const cartItemsBuy = document.querySelector(".cartItemsBuy")
const quantityShow = document.querySelector(".quantityShow")
const products = document.querySelector("#products")
setEvents("#placeOrder", "click", orderPlace)
setEvents(".search", "keypress", inputSearch)
let userId;
const getCartData = async () => {
    // userId = user._id
    const { isLogged, isTokenExpired, user } = await isUserLogged(token)
    userId=user._id
    const url = `/account/onCart/${userId}`
    // console.log(user._id);
    const res = await fetch(url, {
        method: "GET",
    }).then(function (response) {
        return response.json()
    }).then(function (data) {
        return data
    }).catch(function (error) {
        return { message: "Item not found", status: false }
    })
    // if (user.cart.length === 0) {
    //     return
    // }
    setCartData(res)
}

getCartData()
const serverCallForCart = async (action, productId) => {
    console.log(action, productId);

    return await fetch(`/account/onCart/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ action: action, productId: productId }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (response) {
        return response.json()
    }).then(function (data) {
        return data
    }).catch(function (error) {
        return { message: "Item not found", }
    })
}

let price = 35;

async function quantityController(event) {
    console.log(event.target);
    console.log(isButtonDisabled);
    let target = event.target
    let productId = target.closest(".book-card").getAttribute("id");
    let itemPriceDiv = target.closest(".book-card").querySelector(".itemPrice")
    let unitPrice = parseInt(itemPriceDiv.textContent.split("$")[1])
    if (target.classList.contains("quantityInc") && !isButtonDisabled) {
        isButtonDisabled = true
        const { message, status } = await serverCallForCart("quantityInc", productId)
        isButtonDisabled = status ? false : true
        const quantitySpan = target.parentElement.querySelector(".quantityShow")
        let currentQuantity = parseInt(quantitySpan.textContent)
        quantitySpan.textContent = ++currentQuantity
        priceController(target, unitPrice, currentQuantity)
    }
    if (target.classList.contains("quantityDcr") && !isButtonDisabled) {
        isButtonDisabled = true
        const quantitySpan = target.parentElement.querySelector(".quantityShow")
        let currentQuantity = parseInt(quantitySpan.textContent)
        if (currentQuantity > 1) {
            const { message, status } = await serverCallForCart("quantityDcr", productId)
            isButtonDisabled = status ? false : true
            quantitySpan.textContent = --currentQuantity
            priceController(target, unitPrice, currentQuantity)
        }
    }
    if (target.classList.contains("remove-form-cart-btn") && !isButtonDisabled) {
        isButtonDisabled = true
        const action = "removeFromCart"
        const { message, status } = await serverCallForCart(action, productId)
        isButtonDisabled = status ? false : true
        cartQuantity("remove", userId)
        target.closest(".book-card").remove()
    } else {
        isButtonDisabled = false
    }

}
function priceController(target, unitPrice, quantity) {
    if (!(unitPrice && quantity && target)) {
        return
    }
    let totalPrice = 0;
    let singleTotalSpan = target.closest(".book-card").querySelector(".items-price")
    singleTotalSpan.textContent = (unitPrice * quantity).toLocaleString()
    const singleTotalSpans = document.querySelectorAll(".items-price")
    totalPrice = Array.from(singleTotalSpans).reduce(function (sum, element) {
        return sum + parseInt(element.textContent.replace(/,/g, ""))
    }, 0)
    const priceTd = document.querySelector(".total_price")
    console.log(totalPrice);
    priceTd.textContent = totalPrice.toLocaleString()
    // document.querySelector(".discount").textContent = `-${quantity * discount}`
}



const setCartData = async function (data) {
    let totalAmount = 0;
    const { cartProducts, cartQuantities } = data
    cartQuantities.reduce((products, { productID, quantity }) => {
        console.log(quantity);
        const matchProduct = products.find((product) => product._id === productID);
        if (matchProduct) {
            Object.assign(matchProduct, { quantity: quantity })
        }
        return cartProducts
    }, cartProducts).map((cartProduct) => {
        totalAmount += (cartProduct.quantity * price)
        let product = ` <div class="book-card" id=${cartProduct._id}>
        <div class="product_quantity">
            <div class="b-img">
                <img src="/products_img/${cartProduct.images[0]}" alt="">
            </div>
            <div class="quantity">
                <div>
                    <i class="quantityDcr">-</i>
                    <span class="quantityShow">${cartProduct.quantity}</span>
                    <i class="quantityInc">+</i>
                </div>
            </div>
        </div>
        <div class="b-content">
            <h3>${cartProduct.name}</h3>
            <div class="itemPrice">${cartProduct.price.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR"
        })}</div>
            <div class="card-btn">
                <a href="" class="custom-btn buy-btn">Buy</a>
                <a href="" class="custom-btn remove-form-cart-btn">Remove</a>
            </div>
            <div class="totalItemsPrice"> <label for="">Total Price <span class="items-price">${(cartProduct.quantity * price).toLocaleString()}</span></label></div>
        </div>
    </div> `
        products.innerHTML += product
    })
    const priceTd = document.querySelector(".total_price")
    priceTd.textContent = totalAmount.toLocaleString()
    setEvents("#products", "click", quantityController)
}
function orderPlace(event) {
    localStorage.setItem("productInfo", JSON.stringify({ productId: "allCartId", type: "cart" }))
    location.href = "/paymentInterface?type=cart"
}