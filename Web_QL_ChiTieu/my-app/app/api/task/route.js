// app/api/tasks/route.js
import { NextResponse } from 'next/server';
import { supabase } from '../config/supabase'; 

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("👉 [API Tasks] Nhận được dữ liệu:", body); // Kiểm tra xem Frontend có gửi data lên không

    const { title, description } = body;

    const { data, error } = await supabase
      .from('tasks') 
      .insert([{ title, description, status: 'open' }])
      .select();

    console.log("👉 [API Tasks] Phản hồi từ Supabase:", { data, error }); // Kiểm tra xem Supabase nói gì

    if (error) throw error;
    
    // Đảm bảo trả về đúng data
    return NextResponse.json(data ? data[0] : {}, { status: 201 });
  } catch (error) {
    console.error("🔴 [API Tasks] Lỗi sập nguồn:", error); // Bắt lỗi nếu có
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}