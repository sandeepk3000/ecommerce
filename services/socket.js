const initializeSocket = (server) => {
    const io = require("socket.io")(server);
    const namespace1 = io.of("/detialsProvide")
    const namespace2 = io.of("/cartQuantity")
    namespace1.on("connection", (socket) => {
        socket.on("detailsUpdate", (orderID) => {
            socket.join(orderID)
        })
        socket.on("detailsUpdater", (orderID) => {
            namespace1.to(orderID).emit("currentDetails", orderID)
        })
        socket.on("leaveToProgress", (orderID) => {
            socket.leave(orderID)
            console.log("leaveToProgress");
        })
    })
    namespace2.on("connection", (socket) => {
        socket.on("quantityRoom", (userId) => {
            socket.join(userId)
        })
        socket.on("updateQuantity", ({ updatedquantity, userId }) => {
            console.log(updatedquantity, userId);
            namespace2.to(userId).emit("currentQuantity", updatedquantity)
        })
    })
}
module.exports = initializeSocket
