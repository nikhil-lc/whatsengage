import db from '@/utils/db';
import { sendMessage } from '@/utils/wati';
import { NextResponse } from 'next/server';
import cron from 'node-cron';

// Define the user type explicitly
type User = {
  id: number;
  phone: string;
};

type Message = {
  message: string;
  response: string | null;
};

// Schedule the weekly summary cron job for every Sunday at 10 AM
cron.schedule('0 10 * * SUN', () => {
  db.all('SELECT * FROM users', (err, users: User[]) => { // Type the users array correctly
    if (err) throw err;

    users.forEach((user: User) => {
      db.all(
        'SELECT * FROM messages WHERE userId = ? AND timestamp >= datetime("now", "-7 days")',
        [user.id],
        (err, rows: Message[]) => { // Type the rows array correctly
          if (err) throw err;

          let summary = rows
            .map((row) => `Message: ${row.message}, Response: ${row.response || 'No Response'}`)
            .join('\n');

          sendMessage(user.phone, `Your weekly summary:\n${summary}`);
        }
      );
    });
  });
});

export async function GET() {
  return NextResponse.json({ message: 'Weekly summary cron set up' });
}