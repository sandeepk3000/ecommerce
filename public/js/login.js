
const loginButton = document.getElementById("loginButton")

loginButton.addEventListener("submit", async function doLogin(event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    const body = {}
    for (let i = 0; i < [...formData.entries()].length; i++) {
        const [key, value] = [...formData.entries()][i]
        body[key] = value
    }
    await fetch("/account/login", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (respsoe) {
        return respsoe.json()
    }).then(function (data) {
        if (data.token) {
            
            const item = {
                jwtToken: data.token,
                expiry: new Date().getTime() + (60 * 60 * 1000) // 1 hour in milliseconds
            }
            console.log("jwt",item);
            localStorage.setItem("token", JSON.stringify(item))
        }
    }).catch(function (erro) {
        console.log(erro);
    })
})