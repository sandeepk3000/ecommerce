const category = window.location.search.split("=")[1]

console.log(category);
setEvents(".search", "keypress", inputSearch)
const setData = async () => {
    // console.log(await data.json());
    const single_categories_wrapper = document.querySelector(".single_categories_wrapper")
    const { books } = await searchProducts(category)
    console.log(books);
    books.map((book,index) => {
        
        let bookcard =
            `<div class="col-6 col-md-4 col-lg-2 p-3">
                <a href="" class="text-decoration-none text-dark">
                    <div class="card" style="width:100%;">
                        <img src="/products_img/Weapons of Math Destruction.jpg" class="card-img-top" style="height: 250px; alt="...">
                        <div class="card-body">
                            <h5 class="card-title">Card title</h5>
                            <div class="fs-3 fw-bold">
                            ${book.price.toLocaleString("en-IN",{
                                style:"currency",
                                currency:"INR"
                            })}
                                <p class="card-title d-inline fs-5 fw-light">
                                    <span class="text-decoration-line-through">
                                       ${book.price.toLocaleString("en-IN",{
                                        style:"currency",
                                        currency:"INR"
                                       })}
                                    </span>
                                </p>
                            </div>
                            <div class="d-flex gap-2 product_star_rating-${index}" style="flex-direction: row;">
                                
                            </div>
                            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the
                                card's content.</p>
                        </div>

                    </div>
                </a>
            </div>`
        single_categories_wrapper.innerHTML += bookcard
        setProductStarRating(book.rating,`.product_star_rating-${index}`)
        
    })
}
setData()
