const express = require("express")
const AWS = require("aws-sdk")
const multer = require("multer")
const config = require("../config/config")
const router = express.Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB
  }
}).single("file")

router.post("/", upload, (req, res) => {
  const { originalname, buffer } = req.file

  const s3 = new AWS.S3({
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey
  })

  const params = {
    Bucket: config.aws.bucketName,
    Key: originalname,
    Body: buffer
  }

  // S3 ManagedUpload with callbacks are not supported in AWS SDK for JavaScript (v3).
  // Please convert to `await client.upload(params, options).promise()`, and re-run aws-sdk-js-codemod.
  s3.upload(params, (err, data) => {
    if (err) {
      console.error(err)
      res
        .status(500)
        .json({ data: null, message: "Error uploading file to S3" })
    } else {
      res.status(200).json({ data: { image: data.Location }, message: null })
    }
  })
})

module.exports = router
