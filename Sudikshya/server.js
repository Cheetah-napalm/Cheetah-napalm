// import the required external libraries
const express = require("express")
const Butter = require("buttercms")

//const { addToCart, getCartItems } = require("./store")

// initialize your butterCMS instance
const butter = Butter("<token>")

// initialize the express application
const app = express()
app.use(express.json())
// this serves all files in the `public` directory
// and can be used to serve our HTML website
app.use(express.static("public"))
// this renders all "ejs" pages within the `views` directory
app.set("view engine", "ejs")

const port = 1337

// our application can have multiple users, but for now, let's assume there's a single user
// who has this user name
const userName = "sample user"

// start an express server on the given port
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})

app.get("/products", (req, res) => {

	butter.page
		.list("product")
		.then((resp) => {
			res.json(resp.data)
		})
	.catch((err)=> res.status(500).send(err))
})

// create a new class to hold the logic of our products actions
class Product {
	constructor(data) {
		this.data = data
		this.quantity = 0
	}

	html() {
		// get the fields from the product data
		const { title, description, price } = this.data.fields

		// create the section that will display the overall quantity
		// and "add to cart" button
		this.quantityHTML = $("<span></span>")
		const addToCart = $("<button>Add to cart</button>").click(
			// the `addToCart` method has to be implemented
			this.addToCart.bind(this)
		)
		addToCart.append(this.quantityHTML)

		// create the HTML template of the product
		const elem = $(`<div class="product">
        <div class="title">${title}</div>
        <div class="description">${description}</div>
        <div class="price">$${price}</div>
    	</div>`).append(addToCart)
		// the addToCart section is appended to each product at the end

		return elem
	}
}

// call the products endpoint we just created
fetch("/products")
	.then((res) => res.json())
	.then((data) => {
		// if successful, loop through each item and append its
		// HTML output to the product catalog div
		data.data.forEach((item) => {
			const product = new Product(item)
			$(".product-catalog").append(product.html())
		})
	})
	.catch((err) => console.error(err))

app.post("\checkout", (req, res) => {
	//get items from user cart
	const item = getCartItems(userName)
	//create a list of request to retreive product information for each item 
	const request = Object.keys(items).map((key) => 
		butter.page.retrieve("product",key)
	)
	//initialize total to 0
	let total = 0
	//execute all request simultaneously using promise.all
	Promise.all(requests)
		.then((responses) => {
			//once all info is retrieved,add to total
			//using the product price and quantity
			const renderItems = responses.map((resp) => {
				const { price, total } = resp.data.data.fields
				const quantity = items[resp.data.data.name]
				total += price * quantity
				//the quantity and the price are stored in the renderItems Variable
				return {
					quantity,
					title,
				}
			})
			//we render the "payment confirmation"ejs templates, by providing total and the items as templates
			res.render("Payment Confirmation", {
				total,
				items: renderItems,
			})
		})
		//return an internal server error if the api returns an error
		.catch((err) => {
			console.log(err)
			res.status(500).end()

        })

})