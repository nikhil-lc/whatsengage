import { NextResponse } from 'next/server';
import { sendMessage } from '@/utils/wati';
import db from '@/utils/db';

export async function POST(req: Request) {
  const { userId } = await req.json();

  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user:any) => {
      if (err) {
        reject(NextResponse.json({ error: 'User not found' }, { status: 404 }));
      } else {
        db.all(
          'SELECT * FROM messages WHERE userId = ? AND timestamp >= datetime("now", "-7 days")',
          [userId],
          async (err, rows:any) => {
            if (err) {
              reject(NextResponse.json({ error: 'Error fetching messages' }, { status: 500 }));
            }

            let summary = rows
              .map((row: { message: any; response: any; }) => `Message: ${row.message}, Response: ${row.response || 'No Response'}`)
              .join('\n');

            await sendMessage(user.phone, `Your weekly summary:\n${summary}`);

            resolve(NextResponse.json({ message: 'Summary sent' }));
          }
        );
      }
    });
  });
}