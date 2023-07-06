require('dotenv').config()
const AWS = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
})

const multerS3config = multerS3({
  s3,
  bucket: process.env.AWS_BUCKET_NAME,
  acl: 'public-read',
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname })
  },
  key: function (req, file, cb) {
    const filExtension = file.originalname.slice(file.originalname.lastIndexOf('.'))
    cb(null, 'resources/' + Date.now().toString() + '_1' + filExtension)
  },
  contentType: function (req, file, cb) {
    cb(null, file.mimetype)
  }
})

const upload = multer({
  storage: multerS3config
})

exports.uploadFileToS3 = upload
