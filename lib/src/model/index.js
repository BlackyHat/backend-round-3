import * as AWS from "aws-sdk";
export default ;
const dynamoDBClient = () => {
    if (process.env.IS_OFFLINE) {
        return new AWS.DynamoDB.DocumentClient({
            region: "localhost",
            endpoint: "http://localhost:5000",
        });
    }
    return new AWS.DynamoDB.DocumentClient();
};
//# sourceMappingURL=index.js.map