const accountSettings = document.querySelector(".accountSettings")
const submitForm = document.getElementById("submitForm")
const body = {}
let isButtonOff = false
const saveChange = document.querySelector("#saveChange")
submitForm.addEventListener("submit", getUpdateInfo)
async function getUpdateInfo(event) {
    event.preventDefault()
    if (!isButtonOff && navigator.onLine) {
        isButtonOff = true
        addBtnSpinner(saveChange)
        const formData = new FormData(event.target)
        for (let i = 0; i < [...formData.entries()].length; i++) {
            const [key, value] = [...formData.entries()][i]
            body[key] = value
        }
        generateOTP("651ad4be945a5bf1c96b5322", "+917007703489").then(({ isOtpGenerate }) => {
            if (!isOtpGenerate) {
                isButtonOff = false
                return
            }
            createOptcard(accountSettings, "651ad4be945a5bf1c96b5322", onVerified)
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
function onVerified() {
    stopTimer()
    showAlert("#submitOTP", "Otp is successfully verified", "fa-check", "success")
    fetch(`/account/changeUserInfo?action=${body.type}&&userId=651ad4be945a5bf1c96b5322`, {
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
            open("/account/page?action=changeList&&target=651ad4be945a5bf1c96b5322&&infoChange=true", "_self").close()
        })
        .catch(function (error) {
            console.log(error);
        })
}

function resendOTP(event) {
    if (!isButtonOff) {
        isButtonOff = true
        generateOTP("651ad4be945a5bf1c96b5322", "+917007703489").then(({ isOtpGenerate }) => {
            if (!isOtpGenerate) {
                isButtonOff = false
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