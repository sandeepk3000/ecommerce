

const cartItemsBuy = document.querySelector(".cartItemsBuy")
const quantityShow = document.querySelector(".quantityShow")
const products = document.querySelector(".products")
const getCartData = async () => {
    try {
        const res = await fetch(`/user/operations/onCart`, { method: "GET" })
        setCartData(res)
    } catch (error) {

    }

}
const serverCallForCart = async (action, productId) => {
    console.log(action, productId);
    let jsonRes;
    try {
        res = await fetch(`/user/operations/onCart/${action}&&${productId}`, { method: "PATCH" })
        jsonRes = await res.json()
    } catch (error) {
        jsonRes = {
            error
        }
    }
    return jsonRes
}

let price = 35;
const intialization = () => {
    const quantityInc = document.querySelectorAll(".quantityInc")
    const quantityDcr = document.querySelectorAll(".quantityDcr")
    const quantityShow = document.querySelectorAll(".quantityShow")
    let items_price = document.querySelectorAll(".items-price")
    const itemPrice = document.querySelectorAll(".itemPrice")
    const remove_form_cart = document.querySelectorAll(".remove-form-cart")
    const removeOf = document.querySelectorAll(".book-card")
    console.log(itemPrice);
    console.log(items_price);
    setEventsOn({ quantityDcr, quantityInc, itemPrice, remove_form_cart, removeOf })
}
const inProductQuantity = async (removeOf, action, event, elements, itemPrice) => {
    // console.log(removeOf, action, event,elements,items_price,itemPrice);
    let items_price = document.querySelectorAll(".items-price")
    let targetIndex = Array.prototype.indexOf.call(elements, event.target);
    const productId = removeOf[targetIndex].getAttribute("id")
    try {
        let quantity = parseInt(event.target.parentElement.children[1].innerHTML)
        const { updateUserRes } = await serverCallForCart(action, productId)
        if (updateUserRes.modifiedCount === 1 && action === "quantityInc") {
            quantity = ++quantity;
            event.target.parentElement.children[1].innerHTML = quantity

        }
        if (updateUserRes.modifiedCount === 1 && action === "quantityDcr") {
            quantity = --quantity;
            event.target.parentElement.children[1].innerHTML = quantity

        }
        if (updateUserRes.productAcctive === false) {
            removeOf[targetIndex].remove()
            totalCartPrice(document.querySelectorAll(".items-price"))
            return
        }
        totalSinglePrice(itemPrice, quantity, targetIndex, items_price)
        totalCartPrice(items_price)
    } catch (error) {
        console.log(error);
    }
    // console.log(quantity);
}
getCartData()

const setCartData = async function (data) {
    const { updateUserRes } = await data.json()
    const [{ cartProducts, quantity }] = updateUserRes
    quantity.reduce((products, { productId, ...data }) => {
        const modifyObj = products.find((obj) => obj._id === productId);
        if (modifyObj) {
            Object.assign(modifyObj, data)
        }
        return cartProducts
    }, cartProducts).map((cartProduct) => {
        console.log(cartProduct.imgUrl);
        let product = ` <div class="book-card" id=${cartProduct._id}>
        <div class="product_quantity">
            <div class="b-img">
                <img src="/products_img/${cartProduct.imgUrl}" alt="">
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
            <h3>Nutan book</h3>
            <div class="itemPrice">$${price}</div>
            <div class="card-btn">
                <a href="" class="custom-btn buy-btn">Buy</a>
                <a href="" class="custom-btn remove-form-cart">Remove</a>
            </div>
            <div class="totalItemsPrice"> <label for="">Total Price <span class="items-price">${cartProduct.quantity * price}</span></label></div>
        </div>
    </div> `
        products.innerHTML += product
    })
    intialization()
    totalCartPrice(document.querySelectorAll(".items-price"))
}

const totalSinglePrice = (itemPrice, quantity, targetIndex, items_price) => {
    const singlePrice = parseInt(itemPrice[targetIndex].innerHTML.split("$")[1])
    let totalPrice = singlePrice * quantity;
    items_price[targetIndex].innerHTML = totalPrice
}
const totalCartPrice = (itemPrice) => {
    let totalPrice = Array.from(itemPrice).reduce((currentValue, element) => {
        return parseFloat(element.innerHTML) + currentValue;
    }, 0)
    cartItemsBuy.innerHTML = totalPrice
    console.log(totalPrice);
}

const setEventsOn = ({ quantityDcr, quantityInc, itemPrice, remove_form_cart, removeOf }) => {
    quantityDcr.forEach((element) => {
        element.addEventListener("click", (event) => {
            const action = "quantityDcr"
            console.log(removeOf, action, event, quantityDcr, itemPrice);
            inProductQuantity(removeOf, action, event, quantityDcr, itemPrice)
        })
    })
    quantityInc.forEach((element) => {
        element.addEventListener("click", (event) => {
            const action = "quantityInc"
            inProductQuantity(removeOf, action, event, quantityInc, itemPrice)
        })
    })
    remove_form_cart.forEach((element) => {
        element.addEventListener("click", async (event) => {
            try {
                event.preventDefault()
                const action = "removeFromCart";
                let index = Array.prototype.indexOf.call(remove_form_cart, event.target)
                const productId = removeOf[index].getAttribute("id")
                const { updateUserRes } = await serverCallForCart(action, productId)
                if (updateUserRes.productAcctive === false) {
                    removeOf[index].remove()
                    const inCartItems = document.querySelector(".cartItems")
                    if(parseInt(inCartItems.innerHTML)>=1){
                        inCartItems.innerHTML=parseInt(inCartItems.innerHTML)-1;
                    }
                    let items_price = document.querySelectorAll(".items-price")
                    console.log(items_price);
                    totalCartPrice(items_price)
                }
                intialization()
            } catch (error) {

            }
        })
    })
}
// console.log(document.querySelector(".cartItems").innerHTML);