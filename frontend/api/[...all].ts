let cachedApp: any = null;

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: any, res: any) {
  if (!cachedApp) {
    const mod = await import('../backend-dist/app.js');
    cachedApp = mod.default; // Express app is a request handler (req, res)
  }
  return cachedApp(req, res);
}
