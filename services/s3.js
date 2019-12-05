const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3-transform')
const uuid = require('uuid')
const sharp = require('sharp')

const config = require('../config')

aws.config.update({
  region: config.s3.region,
  accessKeyId: config.s3.key,
  secretAccessKey: config.s3.secret
});

const s3 = new aws.S3()

module.exports = {
  upload: multer({
    storage: multerS3({
      s3: s3,
      bucket: config.s3.bucket,
      shouldTransform: (req, file, cb) => {
        cb(null, /^image/i.test(file.mimetype))
      },
      transforms: [
        {
          id: 'original',
          key: (req, file, cb) => {
            cb(null, uuid.v4() + '.' + file.originalname.split('.').pop())
          },
          transform: (req, file, cb) => {
            cb(null, sharp().png())
          }
        }, 
        {
          id: 'thumbnail',
          key: (req, file, cb) => {
            cb(null, uuid.v4() + '.' + file.originalname.split('.').pop())
          },
          transform: (req, file, cb) => {
            cb(null, sharp().resize(200, 200).png())
          }
        } 
      ]
    })
  })
}