import serverless from 'serverless-http';

// Dynamically import the compiled Express app from the backend build output
const appModule = await import('../../backend/dist/app.js');
const app = appModule.default;

export const config = {
  runtime: 'nodejs22.x',
};

export default serverless(app);
