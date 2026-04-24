// app/api/transactions/route.js
import { NextResponse } from 'next/server';

// Dùng alias @/ để Next.js tự động tìm từ thư mục gốc, không lo sai dấu chấm (../) nữa
import { hasSupabaseConfig, supabase } from '../config/supabase';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    if (!hasSupabaseConfig || !supabase) {
      return NextResponse.json(
        { message: 'Thiếu cấu hình Supabase trên server.' },
        { status: 500, headers: corsHeaders }
      );
    }

    const { data: rows, error } = await supabase
      .from('transactions')
      .select('id, title, amount, category_name, date, createdAt')
      .order('date', { ascending: false })
      .order('createdAt', { ascending: false });

    if (error) throw error;

    const formattedRows = rows.map((row) => ({
      id: row.id,
      title: row.title,
      amount: row.amount,
      category: row.category_name, 
      date: row.date, 
      createdAt: row.createdAt
    }));

    return NextResponse.json(formattedRows, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error('Lỗi GET transactions:', error);
    return NextResponse.json(
      { message: 'Lỗi máy chủ khi tải dữ liệu.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(request) {
  try {
    if (!hasSupabaseConfig || !supabase) {
      return NextResponse.json(
        { message: 'Thiếu cấu hình Supabase trên server.' },
        { status: 500, headers: corsHeaders }
      );
    }

    const body = await request.json();
    const { title, amount, category, date, createdAt } = body;

    if (!title || !amount || !date) {
      return NextResponse.json(
        { message: 'Vui lòng nhập đầy đủ tên, số tiền và ngày.' },
        { status: 400, headers: corsHeaders }
      );
    }

    const { data: result, error } = await supabase
      .from('transactions')
      .insert([{
          user_id: 1,
          title: title,
          amount: Number(amount),
          category_name: category || 'Khác',
          date: date,
          createdAt: createdAt || new Date().toISOString()
      }])
      .select(); 

    if (error) throw error;

    const insertedData = result[0];
    const newTransaction = {
      id: insertedData.id,
      title: insertedData.title,
      amount: Number(insertedData.amount),
      category: insertedData.category_name, 
      date: insertedData.date,
      createdAt: insertedData.createdAt,
    };

    return NextResponse.json(newTransaction, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error('Lỗi POST transactions:', error);
    return NextResponse.json(
      { message: 'Lỗi máy chủ khi lưu giao dịch.' },
      { status: 500, headers: corsHeaders }
    );
  }
}