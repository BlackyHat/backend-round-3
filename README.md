# Short Link API 🤓🧐🏆

This project has been generated using the `aws-nodejs-typescript`
template from the [Serverless framework](https://www.serverless.com/).

Long URLs can be inconvenient to use, especially in correspondence. To solve this
problem, there are services that shorten long links. We need to build our own cost-
efficient and flexible API for a link shortener application

# [API Documentation](https://documenter.getpostman.com/view/26203555/2s9YXpUJ1f)👀⚙️🖥️

## Installation/deployment instructions ⚙️

Depending on your preferred package manager, follow the instructions below to deploy your project.Make sure to configure your AWS credentials before deploying.
Make sure to configure your AWS credentials before deploying. Adjust the code based on your specific requirements and structure.

### Using NPM ⬇️

- Run `npm i` to install the project dependencies
- Run `npx sls deploy` to deploy this stack to AWS

## Locally 🗒

- Run `npx sls offline` to deploy this stack to AWS

❌Make sure to install the necessary npm packages (serverless-esbuild, serverless-dynamodb, serverless-offline).

### Project structure 🖥️

The project code base is mainly located within the `src` folder. This folder is divided in:

- `functions` - containing code base and configuration for your lambda functions
- `libs` - containing shared code base between your lambdas
- `models` - containing shared TypeScript type definitions for lambdas
- `services` - containing shared application services and providers

```
.
├── src
│   ├── functions               # Lambda configuration and source code folder
│   └── libs                    # Lambda shared code
│   └── models                  # Shared TypeScript type definitions
│   └── services                # Shared application services and providers
│
├── env.sample                  # Simple list environment variables you'll use for this project
├── package.json
├── serverless.ts               # Serverless service file
├── tsconfig.json               # Typescript compiler configuration
├── tsconfig.paths.json         # Typescript paths
└── webpack.config.js           # Webpack configuration
```

### Base Api Functionality 👀

# Auth 🏦

✅ Sign up a new user by email and password. Should return the auth token (JWE
is the best option but you can use JWT as well)
✅ Sign in. create a new JWE or JWT tokens for existing users.

# Links 📈

✅ Create a new link. Should expect an original link and the expiration time in the
request.
✅ Deactivate a link (by user request) by ID.
✅ Deactivate links (by cron Event Bridge) that are expired.
✅ List all links created by the user.

# Notifications SES, SQS

✅ After the link is marked as deactivated. The sending process should be
asynchronous from the process that deactivates links.

🚧 Before you can start using AWS SES to sending out emails, you need to configure the SES with valid identities, either a domain or an email.
If your account is still in the Amazon SES sandbox, you can only send to verified addresses or domains, or to email addresses associated with the Amazon SES Mailbox Simulator. For more information, see Verifying email addresses and domains in the Amazon Simple Email Service Developer Guide.

##

![image](https://img.shields.io/badge/Amazon_AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![image](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![image](https://img.shields.io/badge/Amazon%20DynamoDB-4053D6?style=for-the-badge&logo=Amazon%20DynamoDB&logoColor=white)

![image](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=Postman&logoColor=white)
![image](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![image](https://img.shields.io/badge/VSCode-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white)
