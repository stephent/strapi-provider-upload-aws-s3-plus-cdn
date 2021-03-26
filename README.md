# strapi-provider-upload-aws-s3-with-cdn

## Background

This Strapi upload provider adapts the strapi-provider-upload-aws-s3, bundled with Strapi, to support writes to non-public S3 buckets plus optional download from a CDN endpoint (e.g. AWS Cloudfront).

Inspired by this discussion: https://github.com/strapi/strapi/issues/5868#issuecomment-705200530

This project is essentially the same as https://www.npmjs.com/package/strapi-provider-upload-aws-s3-cdn, but it includes the required dependencies in package.json.
## Configurations

Your configuration is passed down to the provider. (e.g: `new AWS.S3(config)`). You can see the complete list of options [here](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property)

See the [using a provider](https://strapi.io/documentation/developer-docs/latest/development/plugins/upload.html#using-a-provider) documentation for information on installing and using a provider. And see the [environment variables](https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#environment-variables) for setting and using environment variables in your configs.

**Example**

`./config/plugins.js`

```js
module.exports = ({ env }) => ({
  // ...
  upload: {
    provider: 'aws-s3-with-cdn',
    providerOptions: {
      accessKeyId: env('AWS_ACCESS_KEY_ID'),
      secretAccessKey: env('AWS_ACCESS_SECRET'),
      region: env('AWS_REGION'),
      params: {
        Bucket: env('AWS_BUCKET'),
      },
      cdnUrl: env("CDN_URL"), // Optional CDN URL
    },
  },
  // ...
});
```

## Resources

- [License](LICENSE)
