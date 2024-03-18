const dotenv = require("dotenv")
dotenv.config()

if (process.env.NODE_ENV === "production") {
  module.exports = {
    port: process.env.PORT || 80,
    secrets: {
      jwt: process.env.JWT,
      jwtExp: process.env.JWTEXP
    },
    aws: {
      accessKeyId: process.env.AWS_ACCESS,
      secretAccessKey: process.env.AWS_SECRET,
      bucketName: process.env.AWS_BUCKET
    }
  }
} else {
  module.exports = {
    port: process.env.PORT || 4000,
    database: process.env.DEVELOPMENT_DB,
    secrets: {
      jwt: process.env.JWT,
      jwtExp: process.env.JWTEXP
    },
    aws: {
      accessKeyId: process.env.AWS_ACCESS,
      secretAccessKey: process.env.AWS_SECRET,
      bucketName: process.env.AWS_BUCKET
    }
  }
}
