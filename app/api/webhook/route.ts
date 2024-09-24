import { NextResponse } from 'next/server';
import db from '@/utils/db';

export async function POST(req: Request) {
  const { userId, messageId, response } = await req.json();

  db.run('UPDATE messages SET response = ? WHERE id = ?', [response, messageId], function (err) {
    if (err) {
      return NextResponse.json({ error: 'Failed to record response' }, { status: 500 });
    }
  });

  return NextResponse.json({ message: 'Response recorded' });
}