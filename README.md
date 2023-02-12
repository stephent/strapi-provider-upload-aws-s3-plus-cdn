# strapi-provider-upload-aws-s3-plus-cdn

## Background

This Strapi upload provider adapts the strapi-provider-upload-aws-s3, bundled with Strapi, to support writes to non-public S3 buckets plus optional download from a CDN endpoint (e.g. AWS Cloudfront).

Inspired by this discussion: https://github.com/strapi/strapi/issues/5868#issuecomment-705200530

This project is essentially the same as https://www.npmjs.com/package/strapi-provider-upload-aws-s3-cdn, but it includes the required dependencies in package.json.

## Compatibility

- Versions 1.x are compatible with Strapi 3.x
- Versions 4.x are compatible with Strapi 4.x (bumped this package version to 4.x to make this more obvious)

## Configuration

Your configuration is passed down to the provider. (e.g: `new AWS.S3(config)`). You can see the complete list of options [here](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property)

See the [using a provider](https://docs.strapi.io/developer-docs/latest/development/providers.html) documentation for information on installing and using a provider. And see the [environment variables](https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#environment-variables) for setting and using environment variables in your configs.

If using a CDN to deliver media files to end users, you can include a `cdnUrl` property, as shown below.

**Example**

`./config/plugins.js`

```js
module.exports = ({ env }) => ({
  // ...
  upload: {
    config: {
      provider: 'aws-s3-plus-cdn',
      providerOptions: {
        accessKeyId: env('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env('AWS_ACCESS_SECRET'),
        region: env('AWS_REGION'),
        params: {
          Bucket: env('AWS_BUCKET'),
        },
        cdnUrl: env("CDN_URL"), // Optional CDN URL - include protocol and trailing forward slash, e.g. 'https://assets.example.com/'
      },
    },
  },
  // ...
});
```

### Security Middleware Configuration

Due to the default settings in the Strapi Security Middleware you will need to modify the `contentSecurityPolicy` settings to properly see thumbnail previews in the Media Library. You should replace `strapi::security` string with the object bellow instead as explained in the [middleware configuration](https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/configurations/required/middlewares.html#loading-order) documentation.

`./config/middlewares.js`

```js
module.exports = [
  // ...
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'dl.airtable.com',
            'yourBucketName.s3.yourRegion.amazonaws.com',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'dl.airtable.com',
            'yourBucketName.s3.yourRegion.amazonaws.com',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  // ...
];
```

Comment: this guidance follows that given by the official [Strapi S3 Upload Provider](https://github.com/strapi/strapi/blob/master/packages/providers/upload-aws-s3/README.md). However, you may prefer to use the `AWS_REGION` and `AWS_BUCKET` env vars instead to construct the bucket URL.

## Note

Strapi will use the configured S3 bucket for upload and delete operations, but writes the CDN url (if configured) into the database record.

In the event that you need to change the storage backend in the future, to avoid the need to re-upload assets or to write custom queries to update Strapi database records, it is probably best to configure your CDN to use a URL that you control (e.g. use assets.mydomain.com rather than d12345687abc.cloudfront.net). If you need to change the storage backend later, you can simply update your DNS record.

## Resources

- [License](LICENSE)

## Credits

- Thanks to @MattieBelt for the Strapi v4 compatibility work

