import supabase from '@/utils/supabaseClient';
import { sendMessage } from '@/utils/wati';
import { NextResponse } from 'next/server';
import cron from 'node-cron';

// Schedule daily messages at 9 AM
cron.schedule('0 9 * * *', async () => {
  try {
    // Fetch all users from Supabase
    const { data: users, error: usersError } = await supabase.from('users').select('*');
    if (usersError) {
      console.error('Error fetching users:', usersError.message);
      throw usersError;
    }

    // Iterate through each user and send the message
    for (const user of users) {
      const message = `Hello ${user.name}, here’s your daily message.`;
      
      // Send the message to the user
      await sendMessage(user.phone, message);

      // Log the message in the 'messages' table
      const { error: insertError } = await supabase.from('messages').insert([
        {
          userId: user.id,
          message: message,
        },
      ]);

      if (insertError) {
        console.error(`Error inserting message for user ${user.id}:`, insertError.message);
        throw insertError;
      }
    }

    console.log('Daily messages sent successfully.');
  } catch (error) {
    console.error('Error during daily message cron job:', error);
  }
});

export async function GET() {
  return NextResponse.json({ message: 'Daily messages cron set up' });
}