import serverless from 'serverless-http';

// Import the compiled Express app copied into the frontend during build
const appModule = await import('../backend-dist/app.js');
const app = appModule.default;

export const config = {
  runtime: 'nodejs',
};

export default serverless(app);
