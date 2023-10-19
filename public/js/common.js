
// const socketCommon = io("/cartQuantity")
const header = document.querySelector("#header")
const authentication_wrapper = document.querySelector(".authentication-wrapper")
// const user_profile = document.querySelector(".user-profile")
const search = document.querySelector(".search")
const token = localStorage.getItem("token")
let isButtonDisabled = false
// socketCommon.on("currentQuantity", (updatedquantity) => {

//     const cartItems = document.querySelector(".rounded-pill")
//     cartItems.textContent = updatedquantity

// })
async function isUserLogged(token) {
    if (token) {
        const data = await fetch("/varify", {
            method: "POST",
            body: JSON.stringify(JSON.parse(token)),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (res) {
            return res.json()
        }).then(function (data) {
            if (data.isTokenExpired) {
                localStorage.removeItem("token")
            }
            return data
        }).catch(function (error) {
            console.log(error);
        })
        return data
    } else {
        return { isLogged: false }
    }
}
function inputSearch(event) {
    if (event.key === "Enter" && search.value.length >= 2) {
        window.location.href = `/singleProducts?cat=${search.value.trim()}`
    } else {
        return
    }
}
const searchProducts = async (searchquery = "hc verama") => {
    console.log(await isUserLogged(token));
    try {
        const data = await fetch(`/bookStore/operations/singleProducts/${searchquery}`, {
            method: "GET",
        });
        return data.json()
    } catch (error) {
        console.log(error);
    }
}

// createUserStatus()
async function createUserStatus() {
    let userStatus = ""
    const navbarSupportedContent = document.querySelector("#navbarSupportedContent")
    const { isAuthenticated, user } = await isUserLogged(token)
    // socketCommon.emit("quantityRoom", user._id)
    if (isAuthenticated) {
        userStatus =
            `<div class="d-flex align-items-center">
                <!-- Icon -->
                <a class="text-reset me-3" href="#">
                    <i class="fas fa-shopping-cart"></i>
                    <span class="badge rounded-pill badge-notification bg-danger cartValue">0</span>
                </a>

                <!-- Notifications -->
                <div class="nav-item dropdown">
                    <a
                        class="text-reset me-3 dropdown-toggle hidden-arrow"
                        href="#"
                        id="navbarDropdownMenuLink"
                        role="button"
                        data-mdb-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <i class="fas fa-bell"></i>
                        <span class="badge rounded-pill badge-notification bg-danger">1</span>
                    </a>
                    <ul
                        class="dropdown-menu "
                        aria-labelledby="navbarDropdownMenuLink"
                    >
                        <li>
                            <a class="dropdown-item" href="#">Some news</a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="#">Another news</a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="#">Something else here</a>
                        </li>
                    </ul>
                </div>
                <!-- Avatar -->
                <div class="dropdown">
                    <a
                        class="dropdown-toggle d-flex align-items-center hidden-arrow"
                        href="#"
                        id="navbarDropdownMenuAvatar"
                        role="button"
                        data-mdb-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <img
                            src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
                            class="rounded-circle"
                            height="25"
                            alt="Black and White Portrait of a Man"
                            loading="lazy"
                        />
                    </a>
                    <ul
                        class="dropdown-menu dropdown-menu-end"
                        aria-labelledby="navbarDropdownMenuAvatar"
                    >
                        <li>
                            <a class="dropdown-item" href="#">My profile</a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="#">Settings</a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="#">Logout</a>
                        </li>
                    </ul>
                </div>
            </div>`
        navbarSupportedContent.insertAdjacentHTML("beforeend", userStatus)
        document.querySelector(".cartValue").textContent = user.cart.length


    }
    else {
        userStatus =
            `<div class="d-flex align-items-center">
                <button type="button" class="btn btn-link px-3 me-2">
                    Login
                </button>
                <button type="button" class="btn btn-primary me-3">
                    Sign up for free
                </button>
            </div>`
        navbarSupportedContent.insertAdjacentHTML("beforeend", userStatus)
    }
}
async function cartQuantity(action, userId) {
    // const carValue = document.querySelector(".rounded-pill")
    let currentQuantity = 9
    if (action === "add") {
        ++currentQuantity
    } else {
        if (currentQuantity > 0) {
            --currentQuantity
        }
    }
    // cartItems.textContent = currentQuantity
    const updatedInfo = {
        userId: userId,
        updatedquantity: currentQuantity
    }
    // socketCommon.emit("updateQuantity", updatedInfo)
    return
}

async function addToCart(userId, productId) {
    if (!isButtonDisabled) {
        isButtonDisabled = true
        try {
            const data = await fetch(`/account/onCart/${userId}`, {
                method: "PATCH",
                body: JSON.stringify({ action: "addToCart", productId: productId }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const { message, status } = await data.json()
            console.log(status, message);
            if (status || !status) {
                if (status) {
                    cartQuantity("add", userId)
                }
                isButtonDisabled = false
                return status;
            }
        } catch (error) {
            console.log(error);
        }
    }
}
function useState(intialValue) {
    let state = intialValue;
    const getState = () => state;
    const setState = (newState) => {
        if (state === newState) return;
        state = newState
    }
    return [getState, setState]
}

function setEvents(selectorName, eventName, handler) {
    console.log(selectorName);
    var elements = document.querySelectorAll(selectorName)
    elements.forEach(function (element) {
        element.addEventListener(eventName, handler)
    })
}

function setProductStarRating(rating, container) {
    const wrapper = document.querySelector(`${container} `)
    wrapper.innerHTML = ""
    const value = !Number.isInteger(rating) ? Math.floor(rating) + 1 : rating;
    for (let i = 1; i <= 5; i++) {
        console.log(i)
        const ratingstar = document.createElement("i")
        ratingstar.classList.add("fa-solid", "fa-star", "position-relative", "text-light")
        const star = document.createElement("i")
        if (rating > i - 1 && rating < i) {
            star.classList.add("fa-solid", "fa-star-half", "position-absolute", "top-0", "text-primary")
        }
        if (i > value) {
            star.classList.add("fa-solid", "fa-star-half", "position-absolute", "top-0")
        }
        else {
            star.classList.add("fa-solid", "fa-star", "position-absolute", "top-0", "text-primary")
        }
        star.style.left = "0"
        ratingstar.appendChild(star)
        wrapper.appendChild(ratingstar)
    }
}


function createOptcard(container, userId, onVerified) {
    const card = document.createElement("div")
    card.classList.add("card")
    const cardBody = document.createElement("div")
    card.classList.add("card-body")
    const cardTitle = document.createElement("h5")
    cardTitle.classList.add("card-title")
    cardTitle.textContent = "Verify email address"
    const cardText = document.createElement("p")
    card.classList.add("card-text")
    card.textContent = "With supporting text below as a natural lead-in to additional"
    const form = document.createElement("form")
    form.classList.add("row", "g-3", "needs-validation")
    form.setAttribute("id", "submitOTP")
    const colDiv1 = document.createElement("div")
    colDiv1.classList.add("col-md-12")
    const label = document.createElement("label")
    label.classList.add("form-label")
    label.setAttribute("for", "inputText")
    label.textContent = "Enter OTP"
    const formInput = document.createElement("input")
    formInput.classList.add("form-control")
    formInput.setAttribute("type", "text")
    formInput.setAttribute("minlength", "5")
    formInput.setAttribute("maxlength", "6")
    formInput.setAttribute("name", "userEnteredOTP")
    formInput.setAttribute("required", "true")
    const formBtn = document.createElement("button")
    formBtn.setAttribute("type", "submit")
    formBtn.classList.add("btn", "btn-primary", "w-100")
    formBtn.setAttribute("id", "submitBtn")
    formBtn.textContent = "Continue"
    const colDiv2 = document.createElement("div")
    colDiv2.classList.add("col-12")
    const timerDiv = document.createElement("div")
    timerDiv.classList.add("text-center", "mt-3")
    timerDiv.style.height = "24px"
    const showTimerSpan = document.createElement("span")
    showTimerSpan.classList.add("showTimer")
    const cardBtnDiv = document.createElement("div")
    cardBtnDiv.classList.add("text-center", "mt-3")
    const cardBtn = document.createElement("button")
    cardBtn.setAttribute("id", "resendOTP")
    cardBtn.classList.add("btn", "btn-primary")
    cardBtn.textContent = "Resend OTP"
    colDiv1.appendChild(label)
    colDiv1.appendChild(formInput)
    colDiv2.appendChild(formBtn)
    form.appendChild(colDiv1)
    form.appendChild(colDiv2)
    timerDiv.appendChild(showTimerSpan)
    cardBtnDiv.appendChild(cardBtn)
    cardBody.appendChild(cardTitle)
    cardBody.appendChild(cardText)
    cardBody.appendChild(form)
    cardBody.appendChild(timerDiv)
    cardBody.appendChild(cardBtnDiv)
    card.appendChild(cardBody)
    container.innerHTML = ""
    container.appendChild(card)
    showAlert(".accountSettings", "Otp is successfully sended", "fa-check", "success")
    const submitOTP = document.getElementById("submitOTP")
    const submitBtn = document.querySelector("#submitBtn")
    submitOTP.addEventListener("submit", (event) => {
        addBtnSpinner(submitBtn)
        getOTP(event, onVerified, userId)
    })
}

async function generateOTP(userId, mobnumber) {
    const generateRes = await fetch("/bookStore/operations/generate-otp", {
        method: "POST",
        body: JSON.stringify({ userId: userId, mobnumber: mobnumber }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    return generateRes.json()
}
function getOTP(event, onVerified, userId) {
    event.preventDefault()
    const otp = {}
    const formData = new FormData(event.target)
    for (let i = 0; i < [...formData.entries()].length; i++) {
        const [key, value] = [...formData.entries()][i]
        otp[key] = value
    }
    verifyOTP(userId, otp, onVerified)
}
async function verifyOTP(userId, userEnteredOTP, onVerified) {
    const verifyRes = await fetch("/bookStore/operations/verify-otp", {
        method: "POST",
        body: JSON.stringify({
            userId: userId, ...userEnteredOTP
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const { message, isOtpVerify } = await verifyRes.json()
    if (!isOtpVerify) {
        const submitBtn = document.querySelector("#submitBtn")
        removeBtnSpinner(submitBtn, "Continue")
        showAlert("#submitOTP", "Invalid OTP Please check your code and try again.", "fa-exclamation", "danger")
        return
    }

    onVerified()
}
function updateTimer(seconds, showerContainer) {
    showerContainer.textContent = `Please wait ${seconds} second(s) before requesting a new OTP`
}
let timer;
let isStartTimer = false;
function startTimer(seconds, container, onReStartSelector) {
    const generateBtn = document.querySelector(`${onReStartSelector} `)
    const showerContainer = document.querySelector(`${container} `)
    generateBtn.disabled = true;
    isStartTimer = true;
    timer = setInterval(() => {
        if (seconds === 0) {
            stopTimer()
            isStartTimer = false
            showerContainer.textContent = ""
            generateBtn.disabled = false;
        } else {
            updateTimer(seconds, showerContainer);
            seconds--;
        }
    }, 1000);
}
function stopTimer() {
    if (isStartTimer) {
        clearInterval(timer);
    } else {
        return;
    }
}
function showAlert(container, text, icon, type) {
    const showIn = document.querySelector(`${container} `)
    if (showIn.firstChild.classList?.contains("alert")) return;
    const alertDiv = document.createElement("div");
    alertDiv.classList.add("alert", `alert-${type}`, "d-flex", "align-items-center");
    alertDiv.setAttribute("id", "custom-alert");
    const alertIcon = document.createElement("i")
    alertIcon.classList.add("fa-solid", `${icon}`, "m-1")
    alertDiv.appendChild(alertIcon)
    alertDiv.style.transition = ".5s all ease"
    const alertTextDiv = document.createElement("div");
    alertTextDiv.textContent = text;
    alertDiv.appendChild(alertTextDiv);
    showIn.insertBefore(alertDiv, showIn.firstChild)
    const alert = new bootstrap.Alert(document.getElementById("custom-alert"))
    const timeOut = setTimeout(() => {
        alert.close()
        clearTimeout(timeOut)
    }, 3000);
}

function addBtnSpinner(btn) {
    btn.innerHTML = ""
    btn.disabled = true
    const spinnerSpan = document.createElement("span")
    spinnerSpan.classList.add("spinner-border", "spinner-border-sm")
    spinnerSpan.setAttribute("role", "status")
    spinnerSpan.setAttribute("aria-hidden", "true")
    // btn.classList.add("visually-hidden")
    btn.appendChild(spinnerSpan)
}
function removeBtnSpinner(btn, text) {
    btn.innerHTML = ""
    btn.disabled = false
    // btn.classList.add("visually-visible")
    btn.textContent = text
}