import { Handler, Context, Callback } from 'aws-lambda';

interface HelloResponse {
  statusCode: number;
  body: string;
}

const main: Handler = (event: any, context: Context, callback: Callback) => {
  const response: HelloResponse = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello World from AWS Lambda and TypeScript!',
      input: event,
    }),
  };
  callback(null, response);
};

export { main };
