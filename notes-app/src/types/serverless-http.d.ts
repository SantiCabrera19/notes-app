declare module 'serverless-http' {
  import type { Handler } from 'aws-lambda';
  import type { Application } from 'express';
  const serverless: (app: Application) => Handler;
  export default serverless;
}
