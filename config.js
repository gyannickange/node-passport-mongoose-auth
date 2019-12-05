module.exports = {
  mongodb: process.env.MONGODB_URI,
  appUrl: process.env.APP_URL,
  s3: {
    key: process.env.S3_ACCESS_KEY,
    secret: process.env.S3_ACCESS_SECRET,
    bucket: process.env.S3_BUCKET,
    region: process.env.S3_REGION
  },
  session: {
    secret: process.env.SESSION_SECRET
  },
  mail: {
    transport: 'SMTP',
    config: {
      host: 'smtp.sparkpostmail.com',
      port: 587,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
      }
    },
    defaults: {
      from: 'Applicante <no-reply@domaine.com>'
    }
  }
};
