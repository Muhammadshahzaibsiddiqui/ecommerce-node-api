const shortid = require("short-unique-id")

const generateOrderNumber = () => {
  const uid = new shortid()
  const alphabets = uid.randomUUID(4).toUpperCase()
  const number = Math.floor(Math.random() * 900000) + 100000
  const timestamp = uid.stamp(32).toString(36).substr(2, 4).toUpperCase()

  const order_number = `${alphabets}-${number}-${timestamp}`
  return order_number
}

module.exports = generateOrderNumber
