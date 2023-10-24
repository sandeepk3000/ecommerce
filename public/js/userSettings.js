const accountSettings = document.querySelector(".accountSettings")
const submitForm = document.getElementById("submitForm")
const body = {}
let isButtonOff = false
const saveChange = document.querySelector("#saveChange")
submitForm.addEventListener("submit", getUpdateInfo)
async function getUpdateInfo(event) {
    const {user} = await getUser(userId)
    event.preventDefault()
    if (!isButtonOff && navigator.onLine&&user) {
        isButtonOff = true
        addBtnSpinner(saveChange)
        const formData = new FormData(event.target)
        for (let i = 0; i < [...formData.entries()].length; i++) {
            const [key, value] = [...formData.entries()][i]
            body[key] = value
        }
        generateOTP(user._id, "+917007703489").then(({ isOtpGenerate }) => {
            if (!isOtpGenerate) {
                isButtonOff = false
                return
            }
            createOptcard(accountSettings, user._id, onVerified)
            setEvents("#resendOTP", "click", resendOTP)
            startTimer(60, ".showTimer", "#resendOTP")
            isButtonOff = false
        }).catch((error) => {
            console.log(error);
            isButtonOff = false
            return
        })

    }

}
async function onVerified() {
    const {user} = await getUser(userId)
    stopTimer()
    showAlert("#submitOTP", "Otp is successfully verified", "fa-check", "success")
    fetch(`/account/changeUserInfo?action=${body.type}&&userId=${user._id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(function (response) {
            return response.json()
        })
        .then(function ({ isUpdated }) {
            if (!isUpdated) {
                return
            }
            isButtonOff = false
            removeBtnSpinner(saveChange,"SaveChange")
            window.location.replace(`/account/page?action=changeList&&target=${user._id}&&infoChange=true`)
        })
        .catch(function (error) {
            console.log(error);
        })
}

function resendOTP(event) {
    if (!isButtonOff) {
        isButtonOff = true
        generateOTP(user._id, "+917007703489").then(({ isOtpGenerate }) => {
            if (!isOtpGenerate) {
                isButtonOff =false
                return
            }
            showAlert(".accountSettings", "Otp is successfully sended", "fa-check", "success")
            startTimer(60, ".showTimer", "#resendOTP")
            isButtonOff = false
        }).catch((error) => {
            console.log(error);
            isButtonOff = false
            return
        })
    }

}