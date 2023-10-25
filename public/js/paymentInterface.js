

const publicKey = "pk_test_51NNH3OSCI5qRRjQx1cj3ewMSMaJOryP8xrDqDuecVvC6ezgj57TOTo3vlthLjmv2ddv9pVjEZ7yC448HUkZrJF3i00NomjSQq4"
let discount = 0;
let userData;
async function confirmRequirements() {
    const { user } = await getUser(userId)
    userData = user;
    console.log(user)
    const mob_requirement = document.querySelector('div[data-action="mobileNumber"]');
    const address_requirement = document.querySelector('div[data-action="deliveryAddress"]')
    const order_requirement = document.querySelector('div[data-action="orderSummary"]')
    const price_requirement = document.querySelector('div[data-action="priceDetails"]')
    const payment_requirement = document.querySelector('div[data-action="paymentOptions"]')
    const requirement_cards = document.querySelectorAll(".requirement_card")

    for (requirement_card of requirement_cards) {
        requirement_card.classList.remove("notValid")
    }
    if (!user.email) {
        setRequirements(null, "", mob_requirement)
        return
    }
    setRequirements(user.email, "mobileNumber", mob_requirement)
    if (user.addresses.length === 0) {
        setRequirements(null, "", address_requirement)
        return
    }
    setRequirements(user.addresses, "deliveryAddress", address_requirement)
    const productInfo = JSON.parse(localStorage.getItem("productInfo"))
    console.log(productInfo);
    if (productInfo.type === "singleProduct") {
        fetch(`/bookStore/operations/${productInfo.productId}`, { method: 'GET' }).then(function (response) {
            return response.json()
        }).then(function (data) {
            console.log(data);
            const { product } = data
            if (!product) {
                setRequirements(null, " ", order_requirement)
                return
            }

            setRequirements([product], "orderSummary", order_requirement)
            setEvents('div[data-action="orderSummary"]', "click", quantityController)
            setRequirements([product], "priceDetails", price_requirement)
            discount = parseInt(document.querySelector(".discount").textContent.split("-")[1])
        })
    }
    if (productInfo.type === "cart") {
        if (user.cart.length === 0) {
            return
        }
        const url = `/account/onCart/${user._id}`
        console.log(user._id);
        const data = await fetch(url, {
            method: "GET",
        }).then(function (response) {
            return response.json()
        }).then(function (data) {
            return data
        }).catch(function (error) {
            return { message: "Item not found", status: false }
        })
        const { cartProducts, cartQuantities } = data
        const Products = cartQuantities.reduce((products, { productID, quantity }) => {
            console.log(quantity);
            const matchProduct = products.find((product) => product._id === productID);
            if (matchProduct) {
                Object.assign(matchProduct, { quantity: quantity })
            }
            return cartProducts
        }, cartProducts)
        console.log("cart", Products);
        setRequirements(Products, "orderSummary", order_requirement)
        setEvents('div[data-action="orderSummary"]', "click", quantityController)
        setRequirements(Products, "priceDetails", price_requirement)
        discount = parseInt(document.querySelector(".discount").textContent.split("-")[1])
    }
    var stripe = Stripe(publicKey)
    if (stripe) {
        setRequirements(null, "paymentOptons", payment_requirement)
        let element = stripe.elements()
        const card = element.create("card", { hidePostalCode: true })
        card.mount(".card_payment_wrapper")
        paymentController(card, user, stripe)
    }

}
function setRequirements(data, action, container) {
    let inner_content = ""
    const edit_inner = action !== "priceDetails" ? `
        <div class="edit_requirement">
                <button class="edit_requirement_btn">CHANGE</button>
            </div>
        `: inner_content
    switch (action) {
        case "mobileNumber":
            inner_content = `
            <div class="requirement_data">
                    ${userData.mobilenumber}
                </div>
            `
            break;
        case "deliveryAddress":
            inner_content = `
            <div class="requirement_data">
                  ${userData.username}:-${data[0].street},${data[0].locality},${data[0].city},${data[0].state}-${data[0].zip}
                </div>
            `
            break;
        case "orderSummary":
            console.log("orderSummary");
            data.map(function (product) {
                inner_content += ` <div class="book-card" id=${product._id}>
                <div class="product_quantity">
                    <div class="b-img">
                        <img src="/products_img/${product.images[0]}" alt="">
                    </div>
                    <div class="quantity">
                        <div>
                            <i class="quantityDcr">-</i>
                            <span class="quantityShow">${product.quantity > 1 ? [product].reduce((sum, cartProduct) => sum + cartProduct.quantity, 0) : 1}</span>
                            <i class="quantityInc">+</i>
                        </div>
                    </div>
                </div>
                <div class="b-content">
                    <h3 class="productName">${product.name}</h3>
                    <div class="itemPrice">$${product.price}</div>
                    <div class="card-btn">
                        <a href="" class="custom-btn remove-form-cart-btn">Remove</a>
                    </div>
                    <div class="totalItemsPrice"> <label for="">Total Price <span class="items-price">${(product.cart ? product.cart.reduce((sum, cartProduct) => sum + cartProduct.quantity, 0) : 1) * product.price}</span></label></div>
                </div>
            </div> `
            })
            break;
        case "priceDetails":
            inner_content = `
            <table style="width: 280px; display: flex; justify-content: space-between; margin: 1rem 0 0 5rem;">
                        <thead>
                            <tr style="display: flex;flex-direction: column; align-items: flex-start;">
                                <th>Price(${data.length.toLocaleString()} item)</th>
                                <th>Discount</th>
                                <th>Delivery Charges</th>
                                <th>Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="display: flex;flex-direction: column;align-items: flex-start;">
                                <td class="price">${data.reduce((sum, product) => sum + product.price, 0).toLocaleString()}</td>
                                <td class="discount">-${data.reduce((sum, { discounts, price }) => (price * discounts.find((discount) => discount.discountType === "percentage").amount / 100) + sum, 0).toLocaleString()}</td>
                                <td class= "deliveryChar">${data.reduce((sum, { shipping }) => shipping.cost ? shipping.cost + sum : "Free Delivery", 0)}</td>
                                <td class="totalAmount">${(data.reduce((sum, product) => sum + product.price, 0) - data.reduce((sum, { discounts, price }) => (price * discounts.find((discount) => discount.discountType === "percentage").amount / 100) + sum, 0) + data.reduce((sum, { shipping }) => shipping.cost ? shipping.cost + sum : sum, 0)).toLocaleString()}</td>
                            </tr>
                        </tbody>

                    </table>
            `
            break
        case "paymentOptons":
            inner_content = `
            <form id="billingFrom" style="margin:1.5rem;" >
            <div class="billings_fields">
                <div class="pincode_input _input_wrapper">
                    <input type="text" name="zip" class="_input_field" required
                        tabindex="3" value="226002" maxlength="6">
                    <label for="pincode" class="_input_label">Pincode</label>
                </div>
                <div class="locality_input _input_wrapper">
                    <input type="text" name="locality" class="_input_field" required tabindex="4"
                        value="Gandhi nagar">
                    <label for="locality" class="_input_label">Locality</label>
                </div>

                <div class="address_input _input_wrapper">
                    <textarea name="street"
                     id="address" cols="10" rows="4" required tabindex="5"
                         value="Gandhi nagar" class="_input_field"></textarea>
                    <label for="address" class="_input_label">Address (Area and Street)</label>
                </div>
                <div class="city_input _input_wrapper">
                    <input type="text" name="city" class="_input_field" required tabindex="6"
                        value="Gandhi nagar">
                    <label for="city" class="_input_label">City/District/Town</label>
                </div>
                <div class="state_input _input_wrapper">
                    <input type="text" name="state" class="_input_field"  required tabindex="7"
                        value="Gandhi nagar">
                    <label for="state" class="_input_label">State</label>
                </div>
               
            </div>
        </form>
        <div class="card_payment_wrapper _input_wrapper">
        
        </div>
        <div class="custom_btn_wrapper_1">
                    <button type="submit" class="btn btn-primary" id="pay" >BUY</button>
                    <span class="loading_effect"></span>
                </div>
            
            `
            break
    }
    let a = []


    if (inner_content) {
        container.innerHTML += inner_content
        container.parentElement.classList.remove("notValid")
        container.parentElement.classList.add("isValid")
        container.parentElement.innerHTML += edit_inner
    } else {
        container.parentElement.classList.add("notValid")
        container.parentElement.innerHTML += edit_inner
    }
    setEvents(".edit_requirement_btn", "click", openRequirementEditor)
}
function openRequirementEditor(event) {
    const target = event.target
    const action = target.parentElement.previousElementSibling.getAttribute("data-action")
    let inner_content = ""
    switch (action) {
        case "mobileNumber":
            inner_content = `
            <div class="requirement_data">
                    ${data}
                </div>
            `
            break;
        case "deliveryAddress":
            inner_content = `
            <div class="requirement_name">
            <span>1</span>DELIVERY ADDRESS <i class="fa-solid fa-check"></i>
        </div>
        <form id="updateInfo" >
            <div class="destination_fields">

                <div class="type_input _input_wrapper">
                    <input type="text" name="type" class="_input_field"  required tabindex="1"
                        value="Home">
                    <label for="name" class="_input_label">Type (Home or Work)</label>
                </div>
                <div class="phone_input _input_wrapper">
                    <input type="text" name="moblileNumber" class="_input_field"  maxlength="10" required
                        tabindex="2" value="7007703489">
                    <label for="phone" class="_input_label">10-digit mobile number</label>
                </div>


                <div class="pincode_input _input_wrapper">
                    <input type="text" name="zip" class="_input_field" required
                        tabindex="3" value="226002" maxlength="6">
                    <label for="pincode" class="_input_label">Pincode</label>
                </div>
                <div class="locality_input _input_wrapper">
                    <input type="text" name="locality" class="_input_field" required tabindex="4"
                        value="Gandhi nagar">
                    <label for="locality" class="_input_label">Locality</label>
                </div>


                <div class="address_input _input_wrapper">
                    <textarea name="street"
                     id="address" cols="10" rows="4" required tabindex="5"
                         value="Gandhi nagar" class="_input_field"></textarea>
                    <label for="address" class="_input_label">Address (Area and Street)</label>
                </div>
                <div class="city_input _input_wrapper">
                    <input type="text" name="city" class="_input_field" required tabindex="6"
                        value="Gandhi nagar">
                    <label for="city" class="_input_label">City/District/Town</label>
                </div>
                <div class="state_input _input_wrapper">
                    <input type="text" name="state" class="_input_field"  required tabindex="7"
                        value="Gandhi nagar">
                    <label for="state" class="_input_label">State</label>
                </div>
                <div class="destination_save custom_btn_wrapper_1">
                    <button type="submit" class="custom_btn_1 destination_save_btn updateAddress">SAVE HERE</button>
                    <span class="loading_effect"></span>
                </div>
            </div>

        </form>
            `
            const parentElement = event.target.parentElement.parentElement
            const payment_requirements = document.querySelector(".payment_requirements")
            const newParent = document.createElement("div")
            newParent.classList.add("destination_edit_wrapper")
            newParent.innerHTML = inner_content
            payment_requirements.replaceChild(newParent, parentElement)
            break;

    }
    if (inner_content) {
        setEvents("#updateInfo", "submit", updateInfo)
    }
}
confirmRequirements();
async function updateInfo(event) {
    event.preventDefault()
    const target = event.target
    const formData = new FormData(target)
    const body = {}
    for (let i = 0; i < [...formData.entries()].length; i++) {
        const [key, value] = [...formData.entries()][i]
        body[key] = value
    }
    const method = "PATCH"
    const action = "address";
    const res = await updateUser(action, userData._id, body, method)
    if (res.isUpdated) {
        location.reload()
    }

}


function quantityController(event) {
    // console.log(event.target.closest(".book-card").querySelector(".itemPrice"));
    let target = event.target
    // let itemPriceDiv = target.closest(".book-card").querySelector(".itemPrice")
    // let unitPrice = parseInt(itemPriceDiv.textContent.split("$")[1])
    let unitPrice = 35
    if (target.classList.contains("quantityInc")) {
        const quantitySpan = target.parentElement.querySelector(".quantityShow")
        const currentQuantity = parseInt(quantitySpan.textContent)
        quantitySpan.textContent = currentQuantity + 1
        priceController(target, unitPrice, currentQuantity + 1)
    }
    if (target.classList.contains("quantityDcr")) {
        const quantitySpan = target.parentElement.querySelector(".quantityShow")
        console.log(target.closest(".book-card"));
        const currentQuantity = parseInt(quantitySpan.textContent)
        if (currentQuantity > 1) {
            quantitySpan.textContent = currentQuantity - 1
            priceController(target, unitPrice, currentQuantity - 1)
        }

    } else {
        return
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
        return sum + parseInt((element.textContent).replace(/,/g, ""))
    }, 0)
    const priceTd = document.querySelector(".price")
    priceTd.textContent = totalPrice.toLocaleString()
    console.log("to", totalPrice);
    document.querySelector(".discount").textContent = `-${(quantity * discount).toLocaleString()}`
    const deliveryChar = parseInt(document.querySelector(".deliveryChar").textContent.replace(/,/g, ""))
    document.querySelector(".totalAmount").textContent = ((totalPrice + deliveryChar) - (quantity * discount)).toLocaleString()
}


function getOrderItems() {
    const orderItems = []
    const productCards = document.querySelectorAll(".book-card")
    productCards.forEach((productCard) => {
        if (productCard.getAttribute("id")) {
            orderItems.push({
                productID: productCard.getAttribute("id"),
                productName: productCard.querySelector(".productName").textContent,
                quantity: parseInt(productCard.querySelector(".quantityShow").textContent),
                unitPrice: parseInt(productCard.querySelector(".itemPrice").textContent) || 50,
                subTotal: parseInt(productCard.querySelector(".quantityShow").textContent) * parseInt(productCard.querySelector(".itemPrice").textContent) || 100
            })
        } else {
            return null
        }
    })
    console.log("getOder ");
    console.log(orderItems);
    return orderItems
}
let buttonDisabled = false
function paymentController(card, user, stripe) {

    setEvents("#pay", "click", amountPay)
    async function amountPay(event) {
        const orderItems = getOrderItems()
        if (!orderItems || buttonDisabled) {
            return "order is not available"
        }
        addBtnSpinner(event.target)
        console.log("paymentcontr");
        buttonDisabled = true
        const shippingAddress = user.addresses.find((address) => address.type === "Home")
        console.log(shippingAddress);
        const method = "PATCH"
        const action = 'orderHistory'
        console.log(event.target);
        const formData = new FormData(document.querySelector("#billingFrom"))
        const billingAddress = {}
        for (let i = 0; i < [...formData.entries()].length; i++) {
            const [key, value] = [...formData.entries()][i]
            console.log(typeof key);
            billingAddress[key] = value
        }
        const garbegeDate = new Date()
        const date = String(garbegeDate.getDate()).padStart(2, "0")
        const month = String(garbegeDate.getMonth() + 1).padStart(2, "0")
        const year = String(garbegeDate.getFullYear()).padStart(2, "0")
        const orderTime = `${date}-${month}-${year}`
        const orderDetails = {
            orderDate: orderTime,
            orderTotal: orderItems.length,
            shippingAddress: shippingAddress,
            billingAddress: billingAddress,
            paymentMethod: "CD",
            orderItems: orderItems,
            orderStatus: "proccessing"
        }
        console.log(billingAddress);
        const { city, country, street, zip, state, locality } = billingAddress
        stripe.createPaymentMethod({
            type: "card",
            card: card,
            billing_details: {
                address: {
                    city: city,
                    country: "us",
                    line1: street,
                    postal_code: zip,
                    state: state,
                    line2: locality
                },
                email: user.email,
                name: user.username,
                phone: "7007703489"
            }
        }).then(function (result) {
            console.log(result);
            fetch("/bookStore/operations/create-payment", {
                method: "POST",
                body: JSON.stringify({
                    orderToken: result.paymentMethod.id,
                    amount: parseInt(document.querySelector(".totalAmount").textContent),
                    currency: "inr"
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response) {
                return response.json()
            }).then(async function (value) {
                const { city, country, zip, state, street, locality } = billingAddress
                console.log("clientSecret", value.clientSecret);
                return stripe.confirmCardPayment(value.clientSecret, {
                    payment_method: {
                        type: "card",
                        card: card,
                        billing_details: {
                            address: {
                                city: city,
                                country: "us",
                                line1: street,
                                postal_code: zip,
                                state: state,
                                line2: locality
                            },
                            email: user.email,
                            name: user.username,
                            phone: "7007703489"
                        }
                    }

                })
            }).then(async function ({ paymentIntent }) {
                console.log("kdfjskdf", paymentIntent);
                if (paymentIntent.status === "succeeded") {
                    console.log("2");
                    const body = orderDetails
                    const res = await updateUser(action, user._id, body, method)
                    await createOrder(user._id, { ...orderDetails, orderID: res.orderID }, event.target)
                    return;
                }
            })
        })
    }
}

function updateUser(action, userId, body, method) {
    return fetch(`/account/changeUserInfo?action=${action}&&userId=${userId}`, {
        method: method,
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            if (!data.isUpdated) {
                return
            }
            return data
        })
        .catch(function (error) {
            console.log(error);
        })
}

async function createOrder(customerID, orderDetails, btn) {
    const action = "createOrder"
    console.log(action);
    console.log(action, customerID)
    console.log(orderDetails)
    const orderRes = await fetch(`/bookStore/operations/order-controller?action=${action}&&customerID=${customerID}`, {
        method: "POST",
        body: JSON.stringify(orderDetails),
        headers: {
            "Content-Type": "application/json"
        }
    })
    console.log(orderRes);
    const order = await orderRes.json()
    await createDelivery(order, customerID, btn)
    return;
}



async function createDelivery(order, customerID, btn) {
    console.log("create", order);
    const geolocation = {
        longitude: -73.9924,
        latitude: 40.7193
    }//longitude, latitude
    const deliveryBoy = await findDeliveryBoy(geolocation)
    console.log(deliveryBoy);
    const deliveryDetails = {
        order_id: order.orderID,
        customer_name: "sandeep",
        customer_contact: "7007703489",
        delivery_address: order.shippingAddress,
        driverID: deliveryBoy.id,
        geolocation: geolocation,
        deliveryStatus: {
            confirmed: {
                status: true,
                startingTime: Date.now(),
            }
        }
    }
    const action = "createDelivery"
    console.log(action);
    const deliveryRes = await fetch(`/bookStore/operations/delivery-controller?action=${action}&&orderID=${order.orderID}`, {
        method: "POST",
        body: JSON.stringify(deliveryDetails),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await deliveryRes.json()
    if (data.delivery_id) {
        localStorage.setItem("orderInfo", JSON.stringify({ orderId: order.orderID, status: "process" }))
        buttonDisabled = false
        removeBtnSpinner(btn, "BUY")
        window.location.replace(`/orderDetails?orderID=${order.orderID}`)
        return;
    }
}
async function findDeliveryBoy(location) {
    // some logic
    const action = "getBoy"
    const deliveryBoy = await fetch(`/bookStore/operations/deliveryBoy-controller?action=${action}&&lng=${location.longitude}&&lat=${location.latitude}`, {
        method: "GET"
    })
    return deliveryBoy.json()
}