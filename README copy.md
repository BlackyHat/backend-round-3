Especially helpful for local development you can also invoke the Lambda locally and see the resulting log via

serverless invoke local --function=createUser --log
The expected result should be similar to:

PASSWORD_ITERATIONS: 4096
PASSWORD_DERIVED_KEY_LENGTH: 256
EMAIL_SERVICE_API_KEY: KEYEXAMPLE1234
{
"statusCode": 200,
"body": "{\"message\":\"User created\"}"
}

serverless offline
