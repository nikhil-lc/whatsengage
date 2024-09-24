import db from '@/utils/db';
import { sendMessage } from '@/utils/wati';
import { NextResponse } from 'next/server';
import cron from 'node-cron';

// Send daily messages at 9 AM
cron.schedule('0 9 * * *', () => {
  db.all('SELECT * FROM users', (err, users) => {
    if (err) throw err;
    users.forEach((user: { id: number; name: string; phone: string }) => {
      const message = `Hello ${user.name}, here’s your daily message.`;
      sendMessage(user.phone, message);
      db.run('INSERT INTO messages (userId, message) VALUES (?, ?)', [user.id, message]);
    });
  });
});

export async function GET() {
  return NextResponse.json({ message: 'Daily messages cron set up' });
}