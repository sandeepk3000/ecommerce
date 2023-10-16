const connectToDB = require("../config/db");
const app = require("./app")
const port = process.env.PORT || 3000;
const startMainActivity = async () => {
    try {
        await connectToDB();
        app.listen(port, (eror) => {
            console.log(`server is strat ON PORT ${port} .......`);
        })
    } catch (error) {
        console.log("he coder some error like this " + error);
    }
}
startMainActivity();



// <i class="fa-solid fa-cart-shopping"
// <i class="fa-regular fa-bars"></i>></i>
// <i class="fa-solid fa-xmark"></i>
// <i class="fa-regular fa-chevron-left"></i>
// <i class="fa-solid fa-magnifying-glass"></i><i class="fa-solid fa-magnifying-glass"></i>