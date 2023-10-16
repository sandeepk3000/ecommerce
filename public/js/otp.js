// function createOptcard(container, userId, isOtpVerify) {
//     const card = document.createElement("div")
//     card.classList.add("card")
//     const cardBody = document.createElement("div")
//     card.classList.add("card-body")
//     const cardTitle = document.createElement("h5")
//     cardTitle.classList.add("card-title")
//     cardTitle.textContent = "Verify email address"
//     const cardText = document.createElement("p")
//     card.classList.add("card-text")
//     card.textContent = "With supporting text below as a natural lead-in to additional"
//     const form = document.createElement("form")
//     form.classList.add("row", "g-3", "needs-validation")
//     form.setAttribute("id", "submitOTP")
//     const colDiv1 = document.createElement("div")
//     colDiv1.classList.add("col-md-12")
//     const label = document.createElement("label")
//     label.classList.add("form-label")
//     label.setAttribute("for", "inputText")
//     label.textContent = "Enter OTP"
//     const formInput = document.createElement("input")
//     formInput.classList.add("form-control")
//     formInput.setAttribute("type", "text")
//     formInput.setAttribute("minlength", "5")
//     formInput.setAttribute("maxlength", "6")
//     formInput.setAttribute("name", "userEnteredOTP")
//     const formBtn = document.createElement("button")
//     formBtn.setAttribute("type", "submit")
//     formBtn.classList.add("btn", "btn-primary", "w-100")
//     formBtn.textContent = "Continue"
//     const colDiv2 = document.createElement("div")
//     colDiv2.classList.add("col-12")
//     const cardLinkDiv = document.createElement("div")
//     cardLinkDiv.classList.add("text-center", "mt-3")
//     const cardLink = document.createElement("a")
//     cardLink.setAttribute("href", "#")
//     cardLink.setAttribute("id", "resendOTP")
//     cardLink.classList.add("card-link")
//     cardLink.textContent = "Resend OTP"
//     colDiv1.appendChild(label)
//     colDiv1.appendChild(formInput)
//     colDiv2.appendChild(formBtn)
//     form.appendChild(colDiv1)
//     form.appendChild(colDiv2)
//     cardLinkDiv.appendChild(cardLink)
//     cardBody.appendChild(cardTitle)
//     cardBody.appendChild(cardText)
//     cardBody.appendChild(form)
//     cardBody.appendChild(cardLinkDiv)
//     card.appendChild(cardBody)
//     container.innerHTML = ""
//     container.appendChild(card)
//     const submitOTP = document.getElementById("submitOTP")
//     submitOTP.addEventListener("submit", (event) => {
//         const { userEnteredOTP } = getOTP(event)
//         verifyOTP(userId, userEnteredOTP, isOtpVerify)
//     })
// }

// async function generateOTP(userId, mobnumber) {
//     const generateRes = await fetch("/bookStore/operations/generate-otp", {
//         method: "POST",
//         body: JSON.stringify({ userId: userId, mobnumber: mobnumber }),
//         headers: {
//             "Content-Type": "application/json"
//         }
//     })
//     return generateRes.json()
// }
// function getOTP(event) {
//     event.preventDefault()
//     const otp = {}
//     const formData = new FormData(event.target)
//     for (let i = 0; i < [...formData.entries()].length; i++) {
//         const [key, value] = [...formData.entries()][i]
//         otp[key] = value
//     }
//     return otp
// }
// async function verifyOTP(userId, userEnteredOTP, callBack) {
//     const verifyRes = await fetch("/bookStore/operations/verify-otp", {
//         method: "POST",
//         body: JSON.stringify({ userId: userId, userEnteredOTP: userEnteredOTP }),
//         headers: {
//             "Content-Type": "application/json"
//         }
//     })
//     const { message, isOtpVerify } = await verifyRes.json()
//     if (!isOtpVerify) {
//         return
//     }
//     callBack()
// }

