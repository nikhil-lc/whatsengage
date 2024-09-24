import { NextResponse } from 'next/server';
import db from '@/utils/db';

export async function POST(req: Request) {
  const { name, phone } = await req.json();

  db.run('INSERT INTO users (name, phone) VALUES (?, ?)', [name, phone], function (err) {
    if (err) {
      return NextResponse.json({ error: 'Failed to add user' }, { status: 500 });
    }
  });

  return NextResponse.json({ message: 'User added successfully' });
}