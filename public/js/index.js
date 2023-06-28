
const header = document.querySelector("#header")
const login_btn = document.querySelector(".login_btn")
const user_profile = document.querySelector(".user-profile")
console.log(header.classList);
const createUserStatus = (outhStatus,removeLogin,removeProfile) => {
    const [value]=outhStatus.classList
    if (value==="loged") {
       removeLogin.remove()
    }
    else {
       removeProfile.remove()
    }
}
createUserStatus(header,login_btn,user_profile)
