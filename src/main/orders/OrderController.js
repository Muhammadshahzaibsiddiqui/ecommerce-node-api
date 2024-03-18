const crudControllers = require("../../utils/crud")
const generateOrderNumber = require("../../utils/generateOrderNumber")
const Orders = require("./OrderModel")
const Products = require("../products/ProductModel")

const searchQuery = "number"
module.exports = {
  ...crudControllers(Orders, searchQuery),
  async getOne(req, res) {
    try {
      const doc = await Orders.findOne({
        ...(req.user._id &&
          req.user.role !== "admin" && { createdBy: req.user._id }),
        _id: req.params.id
      })
        .lean()
        .exec()

      const productIds = doc.products.map((product) => product._id)

      const products = await Products.find({ _id: { $in: productIds } })

      doc.products.forEach((product) => {
        const matchedProduct = products.find(
          (pro) => pro._id.toHexString() === product._id.toHexString()
        )
        if (matchedProduct && product.orderType !== "Custom") {
          product.price = matchedProduct.price - matchedProduct.discount
        } else {
          const customProduct = matchedProduct.customProducts.find(
            (custom) => custom.name === product.orderProduct
          )
          if (customProduct) {
            product.price = customProduct.price - customProduct.discount
          }
        }
        product.featureImage = matchedProduct.featureImage
        product.name = matchedProduct.name
      })
      if (!doc) {
        return res.status(400).json({ data: null, message: null })
      }

      res.status(200).json({ data: doc, message: null })
    } catch (e) {
      console.error(e)
      res.status(500).json({ data: null, message: "Server Error" })
    }
  },
  async createOne(req, res) {
    const createdBy = req.user._id
    try {
      const uniqueOrderNumber = generateOrderNumber()
      const productIds = req.body.products.map((product) => product._id)

      const products = await Products.find({ _id: { $in: productIds } })

      let total = 0

      req.body.products.forEach((product) => {
        const getProduct = products.find(
          (pro) => pro._id.toHexString() === product._id
        )
        if (product.orderType !== "Custom") {
          total +=
            product.quantity * (+getProduct.price - +getProduct.discount)
        } else {
          const customProduct = getProduct.customProducts.find(
            (custom) => custom.name === product.orderProduct
          )
          if (customProduct) {
            total +=
              product.quantity *
              (+customProduct.price - +customProduct.discount)
          }
        }
      })

      const doc = await Orders.create({
        ...req.body,
        number: uniqueOrderNumber,
        total,
        createdBy
      })
      res.status(201).json({ data: doc, message: null })
    } catch (e) {
      console.error(e)
      res.status(500).json({ data: null, message: "Server Error" })
    }
  }
}
