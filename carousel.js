const carousel = document.querySelector(".carousel");
let i = 0;
let removeIndex = undefined;
const set = (i) => {
    console.log(Array.from(carousel.children)[i]);
}
// while (i < Array.from(carousel.children).length) {
//     setInterval(() => {
//         set(i)
//         i++;
//     })
// }

setInterval(() => {
    if (i <=3) {
        add(i)
        i++;
    }else{
        i=0;
    }
}, 3000)


const add = (i) => {
    if (removeIndex == undefined) {
        Array.from(carousel.children)[i].setAttribute("id", "active")
    }
    if (removeIndex != undefined) {
        Array.from(carousel.children)[removeIndex].removeAttribute("id")
        Array.from(carousel.children)[i].setAttribute("id", "active")
    }
    removeIndex = i;
}
