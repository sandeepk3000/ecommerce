const socket = io("/detialsProvide")
const step_one = document.querySelector(".step-one")
const step_two = document.querySelector(".step-two")
const step_three = document.querySelector(".step-three")
const step_fourth = document.querySelector(".step-fourth")
async function getDetails() {
    const {orderId }=  JSON.parse(localStorage.getItem("orderInfo"))
    // "order_Id_1695267281547-aa1e683b-7952-4884-b7bd-da97bb1110a6"
    // localStorage.removeItem("orderInfo")
    const delivery = await detailsProvider(orderId)
    updateProgress(delivery)
    // const orderId = window.location.search.split("=")[1]
    socket.emit("detailsUpdate", orderId)
    socket.on("currentDetails", async (orderId) => {
        const delivery = await detailsProvider(orderId)
        console.log("currentDetails", delivery.deliveryStatus.shepped.currentProgress);
        updateProgress(delivery)
    })

}
getDetails()
async function detailsProvider(orderId) {
    const action = "getDelivery"
    const deliveryData = await fetch(`/bookStore/operations/delivery-controller?action=${action}&&orderID=${orderId}`, { method: "GET" })
    return deliveryData.json();
}
function updateProgress(delivery) {
    step_one.style.setProperty("--pointColor", "rgb(0, 47, 255)")
    step_one.style.setProperty("--height", `${delivery.deliveryStatus.confirmed.currentProgress}px`)
    if (delivery.deliveryStatus.confirmed.currentProgress !== "100") return;
    step_two.style.setProperty("--pointColor", "rgb(0, 47, 255)")
    step_two.style.setProperty("--height", `${delivery.deliveryStatus.shepped.currentProgress}px`)
    if (delivery.deliveryStatus.shepped.currentProgress !== "100") return;
    step_three.style.setProperty("--pointColor", "rgb(0, 47, 255)")
    step_three.style.setProperty("--height", `${delivery.deliveryStatus.outForDelivery.currentProgress}px`)
    if (delivery.deliveryStatus.outForDelivery.currentProgress !== "100") return;
    step_fourth.style.setProperty("--pointColor", "rgb(0, 47, 255)")
    step_fourth.style.setProperty("--height", `${delivery.deliveryStatus.delivered.currentProgress}px`)
    if (delivery.deliveryStatus.delivered.currentProgress !== "100") return;

}
