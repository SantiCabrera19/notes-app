interface VercelRequest {
  method?: string;
  query: { [key: string]: string | string[] | undefined };
  url?: string;
}

interface VercelResponse {
  redirect: (url: string) => void;
  status: (code: number) => VercelResponse;
  json: (object: any) => VercelResponse;
  end: (chunk?: any) => void;
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, error, error_description } = req.query;

  // Handle OAuth error
  if (error) {
    console.error('OAuth error:', error, error_description);
    return res.redirect(`${process.env.VITE_APP_URL || 'http://localhost:5173'}?error=${encodeURIComponent(error as string)}`);
  }

  // Handle OAuth success
  if (code) {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      
      // Exchange code for session
      const { data, error: authError } = await supabase.auth.exchangeCodeForSession(code as string);
      
      if (authError) {
        console.error('Auth exchange error:', authError);
        return res.redirect(`${process.env.VITE_APP_URL || 'http://localhost:5173'}?error=auth_failed`);
      }

      if (data.session) {
        // Set session cookies or redirect with success
        const redirectUrl = `${process.env.VITE_APP_URL || 'http://localhost:5173'}?access_token=${data.session.access_token}&refresh_token=${data.session.refresh_token}`;
        return res.redirect(redirectUrl);
      }
    } catch (err) {
      console.error('Callback processing error:', err);
      return res.redirect(`${process.env.VITE_APP_URL || 'http://localhost:5173'}?error=callback_failed`);
    }
  }

  // No code or error - redirect to home
  return res.redirect(process.env.VITE_APP_URL || 'http://localhost:5173');
}
