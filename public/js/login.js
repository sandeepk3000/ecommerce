
const loginForm = document.getElementById("loginForm")

loginForm.addEventListener("submit", async function doLogin(event) {
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
    }).then(function ({token}) {
        console.log(token);
        if (token) {

            const item = {
                jwtToken: token
            }
            console.log("jwt", item);
            localStorage.setItem("token", JSON.stringify(item))
        }
    }).catch(function (erro) {
        console.log(erro);
    })
})