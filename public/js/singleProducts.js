const category = window.location.search.split("=")[1]
const single_categories_wrapper = document.querySelector(".single_categories_wrapper")
console.log(category);
const getData = async (cat="Math") => {
    try {
        const data = await fetch(`/bookStore/operations/singleProducts/${cat}`, {
            method: "GET",
        });
        setData(data)
    } catch (error) {
        console.log(error);
    }
}
getData(category)

const setData = async (data) => {
    const { books } = await data.json()
    console.log(books);
    books.map((book) => {
        console.log(book)
        let bookcard = `
        <div class="book-card">
            <div class="b-img">
                <img src="/products_img/${book.imgUrl}" alt="">
            </div>
            <div class="b-content">
                <h3>${book.title}</h3>
                <div class="price">$24.55 <span>$30.5</span></div>
                <div class="card-btn">
                    <a href="/single?productId=${book._id}" class="custom-btn buy-btn">Buy</a>
                    <a href="/addToCart" class="custom-btn add-to-cart" id="${book._id}">Add to cart</a>
                </div>
            </div>
        </div>
        `
        single_categories_wrapper.innerHTML+=bookcard
    })
    addToCartEvent()
}