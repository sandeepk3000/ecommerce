const socket = io("/detialsProvide")
function updateDelivery() {
    const orderID = "order_Id_1695725933879-d92026c3-2424-48df-91c5-5ae378683450"
    const updateInfo = {
        status: true,
        startingTime: `${Date.now()}`,
        currentProgress: "10",
        progressName: "confirmed"
    }
    const action = "updateDelivery"
    socket.emit("detailsUpdate", orderID)
    fetch(`/bookStore/operations/delivery-controller?action=${action}&&orderID=${orderID}`, {
        method: "PATCH",
        body: JSON.stringify(updateInfo),
        headers: {
            "Content-Type": "application/json"
        }
    })
    socket.emit("detailsUpdater", orderID)
}
console.log("seller");
updateDelivery()