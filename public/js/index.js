
const header = document.querySelector("#header")
const login_btn = document.querySelector(".login_btn")
const user_profile = document.querySelector(".user-profile")
const search = document.querySelector(".search")
const searchKey = /Math|Mathematics|ganit|maths|mathematics|Ganit|logic|Logic|logical|Logical|Ankganit|rd|rd sharma|Rd|Rd sharam/;
search.addEventListener("keypress", async function (event) {
 console.log(  search.value.match(searchKey));
 console.log(searchKey.test( search.value));
   if (event.key === "Enter" && search.value.length >2) {
      window.location.href = `/singleProducts?cat=${search.value}`
   } else {
      return
   }
})
const createUserStatus = (outhStatus, removeLogin, removeProfile) => {
   const [value] = outhStatus.classList
   if (value === "loged") {
      removeLogin.remove()
   }
   else {
      removeProfile.remove()
   }
}
createUserStatus(header, login_btn, user_profile)
const addToCartEvent = () => {
   const add_to_cart = document.querySelectorAll(".add-to-cart")
   Array.from(add_to_cart).forEach((event) => {
      event.addEventListener("click", async (btn) => {
         console.log(document.cookie.toString());
         try {
            btn.preventDefault()
            const id = btn.target.id
            console.log(id);
            const data = await fetch(`/user/operations/onCart/addToCart&&${id}`, {
               method: "PATCH",
            });
            const { updateUserRes } = await data.json()
            const { modifiedCount } = updateUserRes
            console.log(modifiedCount);
            if (modifiedCount === 1 || modifiedCount === 0) {
               const cartItems = document.querySelector(".cartItems")
               console.log( cartItems.innerHTML.length);
               if (modifiedCount === 1 && parseInt(cartItems.innerHTML)>=0) {
                   cartItems.innerHTML =parseInt(cartItems.innerHTML)+modifiedCount;
                  console.log(cartItems.innerHTML);
               }
               window.location.href = btn.target.href
            }
         } catch (error) {
            console.log(error);
         }
      })
   })
}