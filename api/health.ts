interface VercelRequest {
  method?: string;
}

interface VercelResponse {
  json: (object: any) => VercelResponse;
  status: (code: number) => VercelResponse;
  setHeader: (name: string, value: string) => void;
  end: (chunk?: any) => void;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  return res.json({ 
    status: 'OK', 
    message: 'Notes API is running',
    timestamp: new Date().toISOString()
  });
}
