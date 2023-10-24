
const carouselData = document.querySelectorAll(".carouselData")
const carouselThInner = document.querySelector(".carouselThInner")
const categories_wrapper3 = document.querySelector(".categories_wrapper-3");
const card_container = document.querySelector(".cards")
setEvents(".search", "keypress", inputSearch)
createUserStatus()
const getData = async () => {
    try {
        const data = await fetch("/bookStore/operations", {
            method: "GET",
        });
        setData(await data.json());
    } catch (error) {
        console.log(error);
    }
}
getData()

// const setHomeEventsOn = (event) => {
//     const target = event.target;
//     const card_container = document.querySelector(".card_container")
//     if (target.classList.contains("fa-chevron-left") ) {
//         card_container.scrollLeft -= 220
//     }
//     if (target.classList.contains("fa-chevron-right") ){
//         card_container.scrollLeft += 220
//     }

// }
function setProductStarRating(rating, dynamic_star) {
    const value = !Number.isInteger(rating) ? Math.floor(rating) + 1 : rating;
    for (let i = 1; i <= value; i++) {
        if (i > 5) break;
        if (i > rating) {
            Array.from(dynamic_star)[i - 1].style.width = `${(rating - Math.floor(rating)) * 100}%`
        } else {
            Array.from(dynamic_star)[i - 1].style.width = "100%"
        }
        Array.from(dynamic_star)[i - 1].style.color = "red"
    }
}


function setData(data) {
    const { books } = data

    createCard(books)
}

const cats = ["hcverama"]
function createCard(products) {
    const cardContainer = document.querySelector(".cardContainer")
    console.log(products);
    let addCount = 0;
    let a = "sdkfjs"
    console.log(a.length);
    cats.reduce((currentProducts, cat) => {
        console.log(currentProducts);
        const filteredProducts = currentProducts.filter((filterProduct) => "hc verama" === filterProduct.keywords[0])
        console.log(filteredProducts);
        if (filteredProducts.length >= 4) {
            for (let i = 1; i <= parseInt(filteredProducts.length / 4); i++) {
                let cardInner =
                    `<div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 p-0">
                    <div class="row  pt-2 pb-2 rounded" style="margin:6.5px;">
                        <div class="col-6">
                         <a href="/singleProducts?cat=hc verama" class="text-decoration-none text-dark">
                            <div class="card" style="width: 100%;">
                                <img src="/products_img/${filteredProducts[addCount].images[0]}" class="card-img-top" style="height:300px;" alt="...">
                                    <div class="card-body">
                                        <h5 class="card-title">${filteredProducts[addCount].name}</h5>
                                        <p class="card-text">${filteredProducts[addCount++].description}</p>
                                    </div>
                            </div>
                        </a>
                        </div>
                        <div class="col-6">
                         <a href="/singleProducts?cat=hc verama" class="text-decoration-none text-dark">
                            <div class="card" style="width: 100%;">
                                <img src="/products_img/${filteredProducts[addCount].images[0]}" class="card-img-top"  style="height:300px;" alt="...">
                                    <div class="card-body">
                                        <h5 class="card-title">${filteredProducts[addCount].name}</h5>
                                        <p class="card-text">${filteredProducts[addCount++].description}</p>
                                    </div>
                            </div>
                        </a>
                        </div>
                    </div>
                    <div class="row pt-2 pb-2 rounded" style="margin:6.5px;">
                        <div class="col-6">
                         <a href="/singleProducts?cat=hc verama" class="text-decoration-none text-dark">
                            <div class="card" style="width: 100%;">
                                <img src="/products_img/${filteredProducts[addCount].images[0]}" class="card-img-top"  style="height:300px;" alt="...">
                                    <div class="card-body">
                                        <h5 class="card-title">${filteredProducts[addCount].name}</h5>
                                        <p class="card-text">${filteredProducts[addCount++].description}</p>
                                    </div>
                            </div>
                        </a>
                        </div>
                        <div class="col-6">
                         <a href="/singleProducts?cat=hc verama" class="text-decoration-none text-dark">
                            <div class="card" style="width: 100%;">
                                <img src="/products_img/${filteredProducts[addCount].images[0]}" class="card-img-top"  style="height:300px;" alt="...">
                                    <div class="card-body">
                                        <h5 class="card-title">${filteredProducts[addCount].name}</h5>
                                        <p class="card-text">${filteredProducts[addCount++].description}</p>
                                    </div>
                            </div>
                        </a>
                        </div>
                    </div>
                </div>`
                cardContainer.innerHTML += addCount<products.length&&addCount===20?cardInner+`<a class="link-primary" href="#"> ...More</a>`:cardInner
            }
        };
        return currentProducts
    }, products)
   
}


function readMoreString(string, sliceEndIndex) {
    let newString = ""
    if (string.length > sliceEndIndex + 1) {
        newString = string.slice(0, sliceEndIndex) + `<a class="link-primary" href="#"> ...More</a>`
    } else {
        newString = string.slice(0, sliceEndIndex)
    }
    return newString
}


