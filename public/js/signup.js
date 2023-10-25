
const signupForm = document.getElementById("signupForm")
const signupBtn = document.querySelector("#signupBtn")
const redirectString = new URLSearchParams(window.location.search)
signupForm.addEventListener("submit", async function dosignup(event) {
    event.preventDefault()
    addBtnSpinner(signupBtn)
    const formData = new FormData(event.target)
    const body = {}
    for (let i = 0; i < [...formData.entries()].length; i++) {
        const [key, value] = [...formData.entries()][i]
        body[key] = value
    }
    await fetch("/account/signup", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (respsoe) {
        return respsoe.json()
    }).then(function ({user}) {
        if (user._id) {
            const redirectUrl = redirectString.get("origin")
            console.log("jwt", user._id);
            localStorage.setItem("userId", encodeURIComponent(user._id))
            removeBtnSpinner(signupBtn,"Sign In")
            window.location.replace(`${redirectUrl}`);
        }
    }).catch(function (erro) {
        console.log(erro);
    })
})