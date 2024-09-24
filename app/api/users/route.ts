import { fetchUsers } from '@/utils/db';
import { NextResponse } from 'next/server';


export async function GET() {
    try {
      const users = await fetchUsers();
      return NextResponse.json(users);
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }