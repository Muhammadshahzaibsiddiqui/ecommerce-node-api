const mongoose = require("mongoose")
const config = require("../config/config")

module.exports = connect = (url = config.database, opts = {}) => {
  mongoose.set("strictQuery", false)
  return mongoose.connect(url, { ...opts, useNewUrlParser: true })
}
