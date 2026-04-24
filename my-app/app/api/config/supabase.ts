// app/api/config/supabase.ts
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Ép Next.js lùi ra ngoài 1 thư mục để đọc chung file .env với Frontend
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseServiceKey);

export const supabase = hasSupabaseConfig
	? createClient(supabaseUrl, supabaseServiceKey)
	: null;