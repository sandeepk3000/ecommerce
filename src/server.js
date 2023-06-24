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


