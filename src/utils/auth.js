const config = require("../config/config")
const User = require("../main/users/UserModel")
const jwt = require("jsonwebtoken")
const Newsletter = require("../main/newsletter/NewsletterModel")

const newToken = (user) => {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp
  })
}

const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

const signup = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: "need email and password" })
  }

  try {
    const user = await User.create(req.body)
    if (req.body.newsletter) await Newsletter.create(req.body)

    /*eslint no-unused-vars: ["error", { "ignoreRestSiblings": true }]*/
    const { name, email, role, _id, createdAt } = user
    const token = newToken(user)
    return res
      .status(201)
      .send({ token, user: { name, email, role, _id, createdAt } })
  } catch (e) {
    console.info(e)
    return res.status(500).end()
  }
}

const signin = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: "need email and password" })
  }

  const invalid = { message: "Invalid email and passoword combination" }

  try {
    const user = await User.findOne({
      email: req.body.email,
      status: "Active"
    }).exec()

    if (!user) {
      return res.status(401).send(invalid)
    }

    const match = await user.checkPassword(req.body.password)

    if (!match) {
      return res.status(401).send(invalid)
    }

    const token = newToken(user)
    console.info(user, "check user")
    const { name, email, role, _id, createdAt } = user

    return res
      .status(201)
      .send({ token, user: { name, email, role, _id, createdAt } })
  } catch (e) {
    console.error(e)
    console.info(e, "e")
    res.status(500).end()
  }
}

const signinAdmin = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: "need email and password" })
  }

  const invalid = { message: "Invalid email and password combination" }

  try {
    const user = await User.findOne({ email: req.body.email, role: "admin" })
      //   .select("email password")
      .exec()

    if (!user) {
      return res.status(401).send({ message: "User not found" })
    }

    const match = await user.checkPassword(req.body.password)

    if (!match) {
      return res.status(401).send(invalid)
    }

    const token = newToken(user)
    const { name, email, role, _id, createdAt } = user

    return res
      .status(201)
      .send({ token, user: { name, email, role, _id, createdAt } })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: "Server error" })
  }
}

const protect = async (req, res, next) => {
  console.info("protect")
  const bearer = req.headers.authorization

  if (!bearer || !bearer.startsWith("Bearer ")) {
    return res.status(401).json({ data: null, message: "Authorization needed" })
  }

  const token = bearer.split("Bearer ")[1].trim()
  let payload
  try {
    payload = await verifyToken(token)
  } catch (e) {
    return res.status(401).json({ data: null, message: "User not valid" })
  }

  const user = await User.findById(payload.id).select("-password").lean().exec()
  if (!user) {
    return res.status(401).json({ data: null, message: "User not found" })
  }

  req.user = user
  next()
}

const protectByAdmin = async (req, res, next) => {
  const bearer = req.headers.authorization

  if (!bearer || !bearer.startsWith("Bearer ")) {
    return res.status(401).json({ data: null, message: "Authorization needed" })
  }

  const token = bearer.split("Bearer ")[1].trim()
  let payload
  try {
    payload = await verifyToken(token)
  } catch (e) {
    return res.status(401).json({ data: null, message: "User not valid" })
  }

  const user = await User.findOne({ _id: payload.id, role: "admin" })
    .select("-password")
    .lean()
    .exec()
  if (!user) {
    return res.status(404).json({ data: null, message: "User not found" })
  }

  req.user = user
  next()
}
const availableAll = async (req, res, next) => {
  const bearer = req.headers.authorization
  let user = null
  if (bearer) {
    const token = bearer.split("Bearer ")[1].trim()
    let payload
    payload = await verifyToken(token)

    user = await User.findOne({ _id: payload.id })
      .select("-password")
      .lean()
      .exec()
  }

  req.user = user
  next()
}

module.exports = {
  newToken,
  verifyToken,
  signup,
  signin,
  protect,
  protectByAdmin,
  signinAdmin,
  availableAll
}
