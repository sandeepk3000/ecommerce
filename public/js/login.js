
const loginForm = document.getElementById("loginForm")
const redirectString = new URLSearchParams(window.location.search)
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
    }).then(function ({ user }) {
        if (user._id) {
            const redirectUrl = redirectString.get("origin")
            console.log("jwt", user._id);
            localStorage.setItem("userId", encodeURIComponent(user._id))
            window.location.href = `${redirectUrl}`;
        }
    }).catch(function (erro) {
        console.log(erro);
    })
})