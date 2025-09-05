import serverless from 'serverless-http';

let cachedApp: any = null;
let cachedServerlessHandler: any = null;

async function getServerlessHandler() {
  if (!cachedServerlessHandler) {
    if (!cachedApp) {
      const mod = await import('../backend-dist/app.js');
      cachedApp = mod.default;
    }
    cachedServerlessHandler = serverless(cachedApp);
  }
  return cachedServerlessHandler;
}

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: any, res: any) {
  const sls = await getServerlessHandler();
  return sls(req, res);
}
