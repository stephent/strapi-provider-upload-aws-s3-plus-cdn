'use strict';

/**
 * Module dependencies
 */

/* eslint-disable no-unused-vars */
// Public node modules.
const AWS = require('aws-sdk');

module.exports = {
  init(config) {
    const S3 = new AWS.S3({
      apiVersion: '2006-03-01',
      ...config,
    });

    return {
      upload(file, customParams = {}) {
        return new Promise((resolve, reject) => {
          // upload file on S3 bucket
          const path = file.path ? `${file.path}/` : '';
          let params = {
            Key: `${path}${file.hash}${file.ext}`,
            Body: Buffer.from(file.buffer, 'binary'),
            ContentType: file.mime,
            ...customParams,
          };

          // If CDN url not specified, assume the S3 bucket is configured for public-read
          // Essentially, this makes this upload provider behave exactly like strapi-provider-upload-aws-s3 if not using a CDN
          if (!S3.config.cdnUrl) {
            params.ACL = 'public-read';
          }

          S3.upload(params, (err, data) => {
            if (err) {
              return reject(err);
            }

            // set the bucket file url
            if (S3.config.cdnUrl) {
              // Write the url using the CDN instead of S3
              file.url = `${S3.config.cdnUrl}${data.Key}`;
            } else {
              // Use the S3 location if no cdn configured
              file.url = data.Location;
            }

            resolve();
          });
        });
      },
      delete(file, customParams = {}) {
        return new Promise((resolve, reject) => {
          // delete file on S3 bucket
          const path = file.path ? `${file.path}/` : '';
          S3.deleteObject(
            {
              Key: `${path}${file.hash}${file.ext}`,
              ...customParams,
            },
            (err, data) => {
              if (err) {
                return reject(err);
              }

              resolve();
            }
          );
        });
      },
    };
  },
};
