
const queryString = new URLSearchParams(window.location.search)
createUserStatus()
setEvents("#openReviewForm", "click", openReviewForm)
const productId = queryString.get("productId")
const productAccordion = document.querySelector("#prductAccordion")
const productCard = document.querySelector("#productCard")
const productImgList = document.querySelector(".productImgList")
const product_img_shower = document.querySelector(".product_img_shower")
const getSingleData = async (productId) => {
    try {
        if (productId) {
            const data = await fetch(`/bookStore/operations/${productId}`, {
                method: "GET",
            });
            setSingleData(data)
        }
        else {
            console.log("id not defind");
            content_Section.innerHTML = "<h1>OOP's this query is not defind</h1> "
        }
    } catch (error) {
        console.log(error);
    }
}
getSingleData(productId)

const setSingleData = async (data) => {
    const { product } = await data.json();
    const [mainImage, setMainImage] = useState(product.images[0])
    product["offers"] = ["1Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam, cumque.", "2Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam, cumque.", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam, cumque.", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam, cumque.", "ksdjfksd"]
    let productImgListInner =
        ` ${(product.images.map((image, index) => {
            return `<li class="page-item w-100 mt-2" >
            <button type="button" style="border-radius:15px;overflow:hidden;border: 1px solid rgba(0,0,0,.125);"  class="btn product_img" aria-colindex="${index}">
                <img src="/products_img/${image}" style="height:70px;width:70px" alt="">
            </button>`
        })).join("")}
        </li>
       `
    productImgList.innerHTML = productImgListInner
    setEvents(".productImgList", "click", showImg)
    document.querySelectorAll(".product_img")[0].click();
    function showImg(event) {
        const target = event.target
        console.log(target);
        const imgIndex = target.closest(".product_img").getAttribute("aria-colindex")
        setMainImage(product.images[parseInt(imgIndex)])
        product_img_shower.innerHTML = ` <img src="/products_img/${mainImage()}" alt="">`
    }
    //        <li class="page-item">
    //        <a class="page-link" href="#" aria-label="Next">
    //            <i class="fa-solid fa-chevron-down"></i>
    //        </a>
    //    </li>

    let productCardInner =
        `<h5 class="card-title">${product.name}</h5>
    <span class="badge bg-primary">${product.rating}<i class="fa-solid fa-star"></i></span> <span
      class="card-title">Notifications</span>
    <div class="fs-3 fw-bold">
    ${product.price.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR"
        })}
      <p class="card-title d-inline fs-5 fw-light">
        <span class="text-decoration-line-through">
          ${product.price.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR"
        })}
        </span>
      </p>
    </div>

    <h5 class="card-title">Available offers</h5>
    <ul class="list-group">
    ${(product.offers.map((offer, index) => {
            if (index + 1 > 5) return;
            return `<li class="list-group-item border-0">
                <i class="fa-solid fa-tag m-3 mt-0 mb-0 text-primary"></i>
                <span>
                ${offer}
                </span>
            </li>`
        })).join("")}
    </ul>
    ${product.offers.length <= 5 ? "" : `<a href="#" class="link-primary">View 3 more offers</a>`}  `
    productCard.innerHTML = productCardInner
    console.log(product);
    let productAccordionInner =
        `
        <div class="accordion-item">
            <h2 class="accordion-header" id="panelsStayOpen-headingOne">
                <button class="accordion-button" type="button" data-bs-toggle="collapse"
                    data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true"
                    aria-controls="panelsStayOpen-collapseOne">
                    Highlights
                </button>
            </h2>
            <div id="panelsStayOpen-collapseTwo" class="accordion-collapse collapse show"
                aria-labelledby="panelsStayOpen-headingTwo">
                <div class="accordion-body">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item border-0 fw-bold">Print lenght: <span
                            class="fw-normal"> ${product.pageCount}</span></li>
                        <li class="list-group-item border-0 fw-bold"> Language <span
                            class="fw-normal"> ${product.language}</span></li>
                        <li class="list-group-item border-0 fw-bold">Edition:<span
                            class="fw-normal">${product.edition}</span></li>
                        <li class="list-group-item border-0 fw-bold">Weight:<span
                            class="fw-normal">${product.weight}</span></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="accordion-item">
            <h2 class="accordion-header" id="panelsStayOpen-headingTwo">
                <button class="accordion-button" type="button" data-bs-toggle="collapse"
                    data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="true"
                    aria-controls="panelsStayOpen-collapseTwo">
                    About this item
                </button>
            </h2>
            <div id="panelsStayOpen-collapseTwo" class="accordion-collapse collapse show"
                aria-labelledby="panelsStayOpen-headingTwo">
                <div class="accordion-body">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item border-0 fw-bold">Description: <span
                            class="fw-normal"> ${product.
            description}</span></li>
                    </ul>
                </div>
            </div>
        </div>`
    productAccordion.innerHTML = productAccordionInner
    getReveiwers(productId)
}

function getInputRating(event) {
    const rating = document.querySelectorAll('input[type="checkbox"]:checked').length;
    const reviewText = document.querySelector('textarea[name="reviewText"]').value;
    console.log(reviewText.length);
    if (!(rating && !(reviewText.length < 50))) {
        return
    }
    const productID = productId
    postInputRating(reviewText, rating, productID)
    rating_add_btn.click()
}
async function postInputRating(ratingText, rating, productID) {
    console.log(rating + " " + ratingText);
    const { user } = await getUser(userId)
    console.log(user._id);
    await fetch("/bookStore/operations/addReviews", {
        method: "PATCH",
        body: JSON.stringify(
            {
                productID: productID,
                username: user.username,
                userID: user._id,
                rating: rating,
                reviewsText: ratingText
            }
        ),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (response) {
        return response.json()
    }).then(function (data) {
        // console.log(data);
        if (data.isAddRating) {
            getReveiwers(productId)
        }
    }).catch(function (error) {
        console.log(error);
    })
}

function getReveiwers(productID) {
    fetch(`/bookStore/operations/getReviews/${productID}`, {
        method: "GET"
    }).then(function (response) {
        return response.json()
    }).then(function (data) {
        console.log("getData,,,");
        console.log(data);
        if (!data.isGetReviews) {
            return
        }
        const { reviewers, reviews } = data
        console.log("revererere");
        console.log(reviewers);
        // [reviewers].map(function(r){
        //     console.log(r._id);
        // })
        let totalRating = 0;
        const reviewersData = reviews.reduce((reviewers, { userID, ...otherData }) => {
            totalRating += otherData.rating
            console.log(otherData);

            const matchReviewer = reviewers.find((reviewer) => reviewer._id === userID);
            if (matchReviewer) {
                Object.assign(matchReviewer, otherData)
            }
            return reviewers
        }, reviewers)
        const productRating = totalRating / reviewers.length
        createReviews(reviewersData)
        setProductStarRating(productRating, ".product_star_rating")
        setProductProgressRating(reviews, reviewers.length)
    }).catch(function (error) {
        console.log(error);
    })
}


function createReviews(reviewersData) {
    const reviewers_wrapper = document.querySelector(".reviews")
    reviewers_wrapper.innerHTML = ""
    console.log("reviewerData", reviewersData);
    reviewersData.map(function (reviewer) {
        let reviewHtml = `
        <div class="card border-primary mb-3">
            <div class="card-header border-0" style="background:none;">
              <div class="row">
                <div class="col">
                  <div class="row">
                    <div class="rounded-circle col-6" style="width: 70px;height: 70px; overflow: hidden;"><img
                        src="Weapons of Math Destruction.jpg" alt="" class="w-100">
                    </div>
                    <h5 class="card-title col-6 mt-auto mb-auto">Primary card title</h5>
                  </div>
                </div>
                <div class="col d-flex justify-content-right" style="justify-content: end;margin: auto;">
                  <div class="card-title" style="cursor: pointer;padding: 10px;"><i
                      class="fa-solid fa-ellipsis-vertical"></i></div>
                </div>
              </div>
            </div>
            <div class="card-body">
              <span class="badge bg-primary">${reviewer.rating}<i class="fa-solid fa-star"></i></span> <span
                class="card-title">Notifications</span>
              <p class="card-text">${reviewer.reviewsText}</p>
            </div>
          </div>
     `
        reviewers_wrapper.innerHTML += reviewHtml
    })

}

async function openReviewInput(event) {

}




function setProductProgressRating(reviews, totalRating) {
    const ratings = [5, 4, 3, 2, 1]
    let percentageRating = 0
    const product_progress = document.querySelector(".product_progress")
    product_progress.innerHTML = ""
    ratings.reduce(function (reviews, ratingV) {
        const matchReviews = reviews.filter((review) => review.rating === ratingV)
        if (matchReviews) {
            percentageRating = (matchReviews.length / totalRating) * 100
        }
        const actualPercentageRating = percentageRating > 100 ? 100 : percentageRating
        const rating_progressInner = `<div class="progress mb-2">
        <div class="progress-bar" role="progressbar" style="width: ${actualPercentageRating}%;" aria-valuenow="25"
          aria-valuemin="0" aria-valuemax="100">${actualPercentageRating}%</div>
      </div>
        `
        product_progress.innerHTML += rating_progressInner
        return reviews
    }, reviews)
   
}


setEvents("#add-to-cart", "click", cartController);
async function cartController() {
    const { user } = await getUser(userId)
    const cartBtn = document.querySelector("#add-to-cart")
    addBtnSpinner(cartBtn)
    const status = await addToCart(user._id, productId)
    console.log(status);
    if (status || !status) {
        window.location.href = "/addToCart"
        removeBtnSpinner(cartBtn, "Cart")
    }

}
setEvents("#buyBtn", "click", buyBottonController)
function buyBottonController(event) {
    addBtnSpinner(document.querySelector("#buyBtn"))
    if (!productId) {
        return
    }
    localStorage.setItem("productInfo", JSON.stringify({ productId: productId, type: "singleProduct" }))
    const time = setTimeout(() => {
        location.href = "/paymentInterface?type=singleProduct"
        removeBtnSpinner(document.querySelector("#buyBtn"), "buy")
        clearTimeout(time)
    }, 2000)
}
let ratingModel;
function openReviewForm(event) {
    const target = event.target;
    target.parentElement.innerHTML+=
        ` <div class="modal fade" id="ratingModel" tabindex="-1" aria-labelledby="ratingModelLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="btn-close" id="closeReviewForm" data-bs-dismiss="model"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mx-0 mx-sm-auto">
                            <div class="card">
                                <div class="card-body">
                                    <form class="px-2" action="">
                                        <p class="text-center"><strong>How do you rate customer support:</strong></p>

                                        <ul class="h2 rating justify-content-center pb-3 d-flex" style="list-style: none;"
                                            data-mdb-toggle="rating">
                                            <li>
                                                <i class="far fa-star fa-sm text-primary" title="Bad"></i>
                                            </li>
                                            <li>
                                                <i class="far fa-star fa-sm text-primary" title="Poor"></i>
                                            </li>
                                            <li>
                                                <i class="far fa-star fa-sm text-primary" title="OK"></i>
                                            </li>
                                            <li>
                                                <i class="far fa-star fa-sm text-primary" title="Good"></i>
                                            </li>
                                            <li>
                                                <i class="far fa-star fa-sm text-primary" title="Excellent"></i>
                                            </li>
                                        </ul>

                                        <p class="text-center"><strong>What could we improve?</strong></p>

                                        <!-- Message input -->
                                        <div class="form-outline mb-4">
                                            <textarea class="form-control" id="form4Example6" rows="4"></textarea>
                                            <label class="form-label" for="form4Example6">Your feedback</label>
                                        </div>
                                        <div class="text-center">
                                            <button type="button" class="btn btn-primary">Submit</button>
                                        </div>
                                    </form>
                                </div>

                            </div>
                        </div>
                    </div>
                    <!-- <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Send message</button>
                    </div> -->
                </div>
            </div>
        </div>`
        
    ratingModel = new bootstrap.Modal(document.getElementById('ratingModel'))
    ratingModel.show()
    setEvents("#closeReviewForm","click",closeReviewForm)
    // setTimeout(()=>{
    //     ratingModel.
    // },3000)
    
}
function closeReviewForm(event){
    ratingModel.dispose()
}



