// app/api/health/route.js
import { NextResponse } from 'next/server';
import { hasSupabaseConfig, supabase } from '../config/supabase';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    if (!hasSupabaseConfig || !supabase) {
      return NextResponse.json({
        status: 'error',
        message: 'Thiếu cấu hình Supabase trên server',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
      }, { status: 500, headers: corsHeaders });
    }

    // Gọi thử vào Supabase (Bảng transactions)
    const { error } = await supabase.from('transactions').select('*').limit(1);

    if (error) throw error;

    return NextResponse.json({
      status: 'success',
      message: '✅ Backend kết nối Supabase THÀNH CÔNG!',
      database: 'connected',
      timestamp: new Date().toISOString(),
    }, { status: 200, headers: corsHeaders });

  } catch (error) {
    console.error('❌ Backend kết nối Supabase THẤT BẠI:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Lỗi kết nối database',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 500, headers: corsHeaders });
  }
}