

// const carouselF = document.querySelector(".carouselF")
const carouselData = document.querySelectorAll(".carouselData")
console.log(Array.from(carouselData));
const carouselThInner = document.querySelector(".carouselThInner")
const categories_wrapper3 = document.querySelector(".categories_wrapper-3");

const card_move_btn = document.querySelectorAll(".card_move_btn")
const intializationOfHome = () => {
    const book_card = document.querySelectorAll(".book-card")
    const categoriesWrapperS= document.querySelectorAll(".categoriesWrapperS")
    setHomeEventsOn(card_move_btn, categoriesWrapperS,book_card)
}
const getData = async () => {
    try {
        const data = await fetch("/bookStore/operations", {
            method: "GET",
        });
        makeTemplate(data)
    } catch (error) {
        console.log(error);
    }
}
getData()
const setTemplate = (books, cat, address, section, isInsert = 3) => {
    console.log(books);
    if (section === "card") {
        console.log(books);
        let template = books.filter((book) => book.category === cat).map((book) => {
            return `
           <div class="book-card">
               <div class="b-img">
                   <img src="/products_img/${book.imgUrl}" alt="">
               </div>
               <div class="b-content">
                   <h3>${book.title}</h3>
                   <div class="price">$24.55 <span>$30.5</span></div>
                   <div class="card-btn">
                       <a href="/single?productId=${book._id}" class="custom-btn buy-btn">Buy</a>
                       <a href="/addToCart" class="custom-btn add-to-cart" id="${book._id}" >Add to cart</a>
                   </div>
               </div>
           </div>
            `
        })
        address.innerHTML += template
    }
    if (section === "carousel") {
        let i = 0;
        let counter = 1;
        let items = " "
        books.filter((book) => book.category === cat).map((book, index, arr) => {
            let template = `<div class="carousel-item active">
            <img src="/products_img/${book.imgUrl}" class="d-block w-100"
              style="height: 40rem;" alt="Image 1">
              <div class="carousel-caption">
                  <h3>Slide 1</h3>
                  <p>Slide 1 description</p>
              </div>
      </div>`
            items += template
            if (arr.length - arr.length % isInsert === index && arr.length % isInsert < 2) {
                return
            }
            if (counter === isInsert) {
                address[i].innerHTML = items
                ++i;
                counter = 0;
                items = ""
            }
            counter += 1;
        })

    }
  
}

const makeTemplate = async (data) => {
    const { books } = await data.json()
    if (books) {
        setTemplate(books, "Science", Array.from(carouselData), "carousel", 3)
        // setTemplate(books, "Math", categoriesWrapperS, "card");
        // setTemplate(books, "Science", card_container, "card")
        intializationOfHome()
    }
}
const setHomeEventsOn = (card_move_btn, card_container,book_card) => {
    addToCartEvent()
    book_card.forEach((element,index)=>{
        console.log("hei");
        element.style.left = `${270*index}px`
    })
    card_move_btn.forEach((element) => {
        element.addEventListener("click",(event) => {
            const card_container = document.querySelector(".card_container")
            if (event.target.classList[0] === "left_move") {
                card_container.scrollLeft -= 220
            }
            if (event.target.classList[0] === "right_move") {
                card_container.scrollLeft += 220
            }
        })
    
    })
}

