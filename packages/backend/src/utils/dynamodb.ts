import { DynamoDB } from 'aws-sdk';

let options = {};
if (process.env.IS_OFFLINE || process.env.JEST_WORKER_ID) { // IS_OFFLINE for serverless-offline
  options = {
    region: 'localhost',
    endpoint: 'http://localhost:8000', // Default for serverless-dynamodb-local
    accessKeyId: 'DEFAULT_ACCESS_KEY', // needed if you use AccessKeyId and SecretAccessKey
    secretAccessKey: 'DEFAULT_SECRET' // needed if you use AccessKeyId and SecretAccessKey
  };
}

export const documentClient = new DynamoDB.DocumentClient(options);
export const tableName = process.env.DYNAMODB_TABLE!; // Ensure this is set in serverless.yml environment
