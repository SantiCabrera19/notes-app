import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-routes',
      configureServer(server) {
        server.middlewares.use('/api', async (req: any, res: any) => {
          try {
            const url = req.url || '';
            const method = req.method || 'GET';
            
            // Parse request body for POST/PUT/PATCH requests
            if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
              let body = '';
              req.on('data', (chunk: any) => {
                body += chunk.toString();
              });
              await new Promise(resolve => req.on('end', resolve));
              try {
                req.body = JSON.parse(body);
              } catch {
                req.body = {};
              }
            }

            // Parse URL and extract path parameters
            const urlObj = new URL(url, `http://${req.headers.host}`);
            req.query = Object.fromEntries(urlObj.searchParams);
            
            // Extract ID from URL path for operations that need it
            const pathParts = urlObj.pathname.split('/');
            // Only extract ID if it's not a special route segment like 'active', 'archived', 'search', 'by-tags'
            const specialSegments = ['active', 'archived', 'search', 'by-tags'];
            if (pathParts.length >= 3 && pathParts[2] && !specialSegments.includes(pathParts[2])) {
              req.query.id = pathParts[2];
            }

            // Add CORS headers
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            
            if (method === 'OPTIONS') {
              res.statusCode = 200;
              res.end();
              return;
            }

            // Add helper methods to response
            res.json = (data: any) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            };
            
            res.status = (code: number) => {
              res.statusCode = code;
              return res;
            };

            // Route to appropriate handler
            if (url.startsWith('/health')) {
              const { default: handler } = await import('./api/health.ts');
              await handler(req, res);
            } else if (url.startsWith('/notes')) {
              // Check if this is a request for a specific note (has ID)
              if (req.query.id) {
                const { default: handler } = await import('./api/notes/[id].ts');
                await handler(req, res);
              } else {
                const { default: handler } = await import('./api/notes.ts');
                await handler(req, res);
              }
            } else if (url.startsWith('/tags')) {
              const { default: handler } = await import('./api/tags.ts');
              await handler(req, res);
            } else {
              res.statusCode = 404;
              res.end('Not Found');
            }
          } catch (error) {
            console.error('API Error:', error);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
          }
        });
      }
    }
  ]
})
