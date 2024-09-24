import { NextResponse } from 'next/server';
import { addUser } from '@/utils/db';

export async function POST(req: Request) {
  const { name, phone } = await req.json();
  
  try {
    const user = await addUser(name, phone);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}