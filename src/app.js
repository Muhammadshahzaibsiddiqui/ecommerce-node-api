const express = require("express")
const bodyParser = require("body-parser")
const morgan = require("morgan")
const cors = require("cors")
// import { signup, signin, protect } from "./utils/auth"
const connect = require("./utils/database")
const { signup, signin, protect, signinAdmin } = require("./utils/auth")
// import newsRouter from "./main/news/NewsRouter"
const newsRouter = require("./main/news/NewsRouter")
const currencyRouter = require("./main/currency/CurrencyRouter")
const categoriesRouter = require("./main/categories/CategoriesRouter")
const sliderRouter = require("./main/sliders/SliderRouter")
const productRouter = require("./main/products/ProductRouter")
const deliveryConfigsRouter = require("./main/delivery-configs/DeliveryConfigsRouter")
const orderRouter = require("./main/orders/OrderRouter")
const favoriteRouter = require("./main/favorites/FavoriteRouter")
const contactRouter = require("./main/contacts/ContactRouter")
const newsLetterRouter = require("./main/newsletter/NewsletterRouter")
const customerRouter = require("./main/users/UserRouter")
const uploadRouter = require("./utils/uploadImage")

const app = express()
const PORT = 4000
app.disable("x-powered-by")

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan("dev"))

app.get("/api/status", (req, res) => {
  res.status(200).send({ status: 200 });
})

app.post("/auth/signup", signup)
app.post("/auth/signin", signin)
app.post("/auth/admin/signin", signinAdmin)

// app.use("/api", protect)

app.use("/api/news", newsRouter)
app.use("/api/customers", customerRouter)
app.use("/api/currency", currencyRouter)
app.use("/api/categories", categoriesRouter)
app.use("/api/sliders", sliderRouter)
app.use("/api/products", productRouter)
app.use("/api/delivery-configs", deliveryConfigsRouter)
app.use("/api/orders", orderRouter)
app.use("/api/favorites", favoriteRouter)
app.use("/api/contacts", contactRouter)
app.use("/api/newsletter", newsLetterRouter)
app.use("/api/upload", uploadRouter)

const start = async () => {
  try {
    await connect()
    app.listen(PORT, () => {
      console.log(`REST API on http://localhost:${PORT}/api`)
    })
  } catch (e) {
    console.error(e)
  }
}
start()
