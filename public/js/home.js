

const carousel_inner = document.querySelector(".carousel-inner")
const categories_wrapper2 = document.querySelector(".categories_wrapper-2")
const categories_wrapper3 = document.querySelector(".categories_wrapper-3");
console.log("home");
const getData = async () => {
    try {
        const data = await fetch("/bookStore/operations", {
            method: "GET",
        });
        setData(data)
    } catch (error) {
        console.log(error);
    }
}
getData()

const setData = async (data) => {
    const { books } = await data.json()
    books.filter((book) => book.category === "Science").map((book) => {

    })

    books.filter((book) => book.category === "History").map((book) => {

    })

    books.filter((book) => book.category === "Self-help").map((book) => {

    })

    books.filter((book) => book.category === "Business").map((book) => {

    })

    books.filter((book) => book.category === "Travel").map((book) => {

    })

    books.filter((book) => book.category === "Cooking").map((book) => {

    })

    books.filter((book) => book.category === "Picture Books").map((book) => {

    })

    books.filter((book) => book.category === "Math").map((book) => {
        console.log(book)
        let bookcard = `
        <h2>${ book.category} Books</h2>
        <div class="book-card">
            <div class="b-img">
                <img src="/products_img/${book.imgUrl}" alt="">
            </div>
            <div class="b-content">
                <h3>${book.title}</h3>
                <div class="price">$24.55 <span>$30.5</span></div>
                <div class="card-btn">
                    <a href="/single?productId=${book._id}" class="custom-btn buy-btn">Buy</a>
                    <a href="" class="custom-btn add-to-cart">Add to cart</a>
                </div>
            </div>
        </div>
        `
        categories_wrapper2.innerHTML+=bookcard
    })

    books.filter((book) => book.category === "Social Sciences").map((book) => {

    })

    books.filter((book) => book.category === "Literature").map((book) => {

    })
    books.filter((book) => book.category === "Picture Books").map((book) => {

    })

    books.filter((book) => book.category === "Math").map((book) => {

    })

    books.filter((book) => book.category === "Sports").map((book) => {

    })

    books.filter((book) => book.category === "Religion and Spirituality").map((book) => {

    })
    books.filter((book) => book.category === "Health and Fitness").map((book) => {

    })

}