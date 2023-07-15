const asyncWrapper = require("../middlewares/asyncWrapper")

const stripe = require("stripe")("sk_test_51NNH3OSCI5qRRjQxIL6rITrpj3FWXIv1KClNKXlU7As2nnPYsRpjlnbqxDz37bIHc5mHljfw3Xxb6DhkRgM9UtOe007dNCApyz")

const payNow = asyncWrapper(async(req,res)=>{
    const session = await stripe.checkout.session.create({
        payment_method_types:["card"],
        line_items:[
            {
                price_data:{
                    currency : "usd",
                    product_data:{
                        name:"Books"
                    },
                    unit_amount:888,   
                },
                quantity:1,

            },
        ],
        mode:"payment",
        success_url:"",
        cancel_url:""
    });
    res.json({id:session.id})
})
module.exports = payNow