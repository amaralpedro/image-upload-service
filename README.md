# Image Upload Service
This serverless service is designed to upload images from an API authenticated client to a AWS S3 bucket, where it will be further processed for metadata extraction. The extracted metadata is stored in the same bucket as a JSON file.

## Architecture, Layers, and Responsabilities
The folders organization and the service layered architecture is inspired by the "Clean Archicture" pattern, proposed by Uncle Bob.
- **controllers**: Interface adapters that works converting incoming data to the most convenient format for the internal layers of the service (the same for the outgoing data consumed by the API clients).
- **services**: They manage the application specific business rules and orchestrate the data flow and the data processment.
- **handlers**: Similar to controllers but specific for asynchronous processes.
- **lib**: Encapsulates configuration and infrastructure-related resources.
- **routes**: API routes and endpoints.

## Service Setup

### System requirements

[Node.js](https://nodejs.org/en/) version [10.24.0 (LTS)](https://nodejs.org/en/blog/release/v10.24.0/), it is recommended installing it via [Node Version Manager (`nvm`)](https://github.com/nvm-sh/nvm). In addition, globally install [Yarn](https://yarnpkg.com/) to be used as the default package manager:
```shell-script
npm install -g yarn@latest
```
[Serverless Framework](https://www.serverless.com/) is used to manage the deployment and infrastructure setup in Amazon Web Services console.
It also depends on [ImageMagick](https://imagemagick.org/index.php) to handle image metadata extraction. Since the service is based on AWS Lambda functions, an AWS Lambda Layer needs to be defined in order to provide these binaries, reason why this [open source Lambda Layer application](https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-east-1:145266761615:applications~image-magick-lambda-layer) was used in this project.
[AWS Cognito](https://aws.amazon.com/cognito/) is also used to handle the users management and API security.

### Deployment
Assuming that AWS CLI is properly configured in your machine and the ImageMagick AWS Lambda Layer is set to your AWS account, make sure you create a `.env` file in the root folder based on `.env.example`.

Install the dependencies:
```shell-script
yarn
```

Create the Lambda Layer package to be uploaded to AWS:
```shell-script
mkdir nodejs
cp package.json nodejs/
```

Install the layer dependencies inside that folder:
```shell-script
yarn --prod
```

Finally, wrap the Lambda Layer archive and delete the the temporary folder:
```shell-script
zip -r service-layer.zip nodejs/
rm -r nodejs/
```

You can now run the `deploy` command:
```shell-script
yarn deploy
```

### Running locally
In order to test the application locally, after installing the dependencies, run:
```shell-script
yarn start
```

### Testing live
You can try out the service by signing up [here](https://service-user-pool-domain-dev-tweak-challenge.auth.us-east-2.amazoncognito.com/login?client_id=4ugbnu7483f2lbj2hfamncsju&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=http://localhost:9000), using the AWS Cognito Hosted UI. After going through the process (it includes email verification), you will be redirect to a non-available localhost page. Grab the id_token query parameter from the URL and request a signed upload URL to the service (replacing `<your_id_token>`, `<your_image_name>`, and `<your_image_mime_type>` with one of the following possible values [`image/png`|`image/jpeg`|`image/svg+xml`|`image/gif`]):
```shell-script
curl --location --request POST 'https://32g5dm1gd5.execute-api.us-east-2.amazonaws.com/api/v1/images/upload-url' \
--header 'Authorization: Bearer <your_id_token>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "filename": "<your_image_name>",
    "contentType": "<your_image_mime_type>"
}'
```

Get the upload URL from the response payload and execute (replacing `<your_upload_url>`, `<your_image_mime_type>`, and `<your_image_full_path>`):
```shell-script
curl --location --request PUT '<your_upload_url>' \
--header 'Content-Type: <your_image_mime_type>' \
--data-binary '@<your_image_full_path>'
```
