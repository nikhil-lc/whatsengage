import { NextResponse } from 'next/server';
import { sendInteractiveMessage, sendMessage, sendTemplateMessage, sendTextMessage } from '@/utils/wati';
import db from '@/utils/db';

type User = {
    id: number;
    name:string;
    phone: string;
  };

export async function POST(req: Request) {
  const { userId, templateName, templateParams, message } = await req.json();


  return new Promise<void | Response>((resolve, reject) =>{
    db.get('SELECT * FROM users WHERE id = ?', [userId], async (err, user:User) => {
      if (err) {
        reject(NextResponse.json({ error: 'User not found' }, { status: 404 }));
      } else {
        const defaultMessage = `Hello ${user.name}, here’s your automated message!`;
        console.log("test")
        // await sendTextMessage(user.phone, message || defaultMessage);
        //await sendInteractiveMessage(user.phone);
        await sendTemplateMessage(user.phone, templateName, templateParams);


        db.run('INSERT INTO messages (userId, message) VALUES (?, ?)', [user.id, message || defaultMessage]);

        resolve(NextResponse.json({ message: 'Message sent' }));
      }
    });
  });
}