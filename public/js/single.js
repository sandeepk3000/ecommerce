
const productId = window.location.search.split("=")[1];
const product_single = document.querySelector(".product_single")
const getSingleData = async () => {
    try {
        if (productId) {
            const data = await fetch(`/bookStore/operations/${productId}`, {
                method: "GET",
            });
            console.log(data);
            setSingleData(data)
        }
        else{
            console.log("id not defind");
            product_single.innerHTML = "<h1>OOP's this query is not defind</h1> "
        }
    } catch (error) {
        console.log(error);
    }
}
getSingleData()

const setSingleData = async (data) => {
    const { book } = await data.json();
    console.log(book);
    let singleBook = `
    <div class="sb-img">
    <div class="like-container">
        <div class="like-icon">
            <i class="fa-regular fa-heart dislike" onclick="OnProduct(this)"></i>
            <i class="fa-solid fa-heart like"onclick="OnProduct(this)"></i>
        </div>
        <span>333k</span>
    </div>
    <img src="/products_img/${book.imgUrl}" alt="">
</div>
<div class="sb-content">
    <h3>${book.title}</h3>
    <div class="sprice">$24.55 <span>$30.5</span></div>
    <div class="sb-btn">
        <a href="" class="custom-btn buy-btn">Buy</a>
        <a href="/addToCart" class="custom-btn add-to-cart" id="${book._id}">Add to cart</a>
    </div>
    <div class="highlights">
        <h3>Highlights</h3>
        <ul>
            <li>Language : ${book.language}</li>
            <li>Author : ${book.author}</li>
            <li>Publisher : ${book.publisher}</li>
            <li>Pages : ${book.nopage}</li>
            <li>Edition : ${book.edition}</li>
            <li>Publishing Date : ${book.publishingdate}</li>
            <li>Discription :-
            
            ${book.discription}</li>
        </ul>
    </div>
</div>
    `
    product_single.innerHTML = singleBook
    addToCart()
}