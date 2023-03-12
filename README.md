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
      provider: 'strapi-provider-upload-aws-s3-plus-cdn',
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
## Note

Strapi will use the configured S3 bucket for upload and delete operations, but writes the CDN url (if configured) into the database record.

In the event that you need to change the storage backend in the future, to avoid the need to re-upload assets or to write custom queries to update Strapi database records, it is probably best to configure your CDN to use a URL that you control (e.g. use assets.mydomain.com rather than d12345687abc.cloudfront.net). If you need to change the storage backend later, you can simply update your DNS record.

If you have previously been using `@strapi/provider-upload-aws-s3` and already have some assets uploaded to the Media Library, you can switch to using this package instead, making the configuration changes noted above. Any existing assets will retain their previously configured URLs, but new assets will be saved with URLs using `CDN_URL`. To update older assets with S3 URLs, you will need to execute appropriate update queries on your database.

## Resources

- [License](LICENSE)

## Credits

- Thanks to @MattieBelt for the Strapi v4 compatibility work

