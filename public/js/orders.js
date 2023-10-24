
const ordersContainer = document.querySelector(".ordersContainer")
async function getOrders() {
    const {isLogged,user } = await getUser(userId)
    if (!user) {
        return
    }
    const action = "getOrders"
    const ordersData = await fetch(`/bookStore/operations/order-controller?action=${action}&&customerID=${user._id}`, { method: "GET" })
    const { orderproducts, orders } = await ordersData.json();
    console.log(orderproducts, orders);
    let updatedOrders = []
    orders.reduce((orderproducts, { orderItems, ...order }) => {
        orderItems.forEach(({ productID, ...orderItems }) => {
            const matchProduct = orderproducts.find((orderproduct) => orderproduct._id === productID)
            if (matchProduct) {
                order["orderItems"] = { ...matchProduct, ...orderItems }
                updatedOrders.push(order)
            }
        });
        return orderproducts
    }, orderproducts)
    console.log(updatedOrders);
    setOrders(updatedOrders)
}
getOrders()
function setOrders(orders) {
    // console.log(orders);
    orders.map(function (order) {
        let orderInner =
            `<div class="card order mb-3" style="height: 140px;" id="${order.orderID}" >
            <a href=""  class="card-link  h-100">
                <div class="row p-2 h-100">
                    <div class="col-4 col-sm-3 col-lg-3 col-xl-2 h-100 d-flex">
                        <img src="/products_img/${order.orderItems.images[0]}" class="img-fluid rounded-start h-100 m-auto"
                            alt="...">
                    </div>
                    <div class="col-8 col-sm-9 col-lg-9  col-xl-10 h-100">
                        <div class="row h-100">
                            <div class="col-8 h-100 ">
                                <div class="card-body p-1 h-100">
                                    <h5 class="card-title">${order.orderStatus}</h5>
                                    <p class="card-text text-nowrap overflow-hidden"
                                        style="text-overflow: ellipsis;">${order.orderItems.name}</p>
                                    <p class="card-text text-nowrap overflow-hidden" style="text-overflow: ellipsis;"><small class="text-muted " >Delivery expected by ${order.orderDate}</small>
                                    </p>
                                </div>
                            </div>
                            <div class="col-4 h-100" style="display: grid;place-items: center;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    class="bi bi-chevron-right" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd"
                                        d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </div>`
        // console.log(order);
        ordersContainer.innerHTML += orderInner
        setEvents(".order", "click", moves)
    })
}
function moves(event) {
    event.preventDefault()
    const target = event.target
    const orderId = target.closest(".order").id;
    console.log(orderId);
    localStorage.setItem("orderInfo", JSON.stringify({ orderId: orderId, status: target.getAttribute("status") }))
    window.location.href = `/orderDetails?orderID=?${orderId}`
}