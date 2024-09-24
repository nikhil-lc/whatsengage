import { NextResponse } from 'next/server';
import db from '@/utils/db';

export async function GET() {
    return new Promise<void | Response>((resolve, reject) =>{
    db.all('SELECT * FROM users', (err, users) => {
      if (err) {
        reject(NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 }));
      } else {
        resolve(NextResponse.json(users));
      }
    });
  });
}