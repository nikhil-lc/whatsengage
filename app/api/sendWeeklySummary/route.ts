import supabase from '@/utils/supabaseClient';  // Supabase client
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
cron.schedule('0 10 * * SUN', async () => {
  try {
    // Fetch all users from Supabase
    const { data: users, error: usersError } = await supabase.from('users').select('*');
    if (usersError) {
      console.error('Error fetching users:', usersError.message);
      throw usersError;
    }

    // Iterate over each user
    for (const user of users as User[]) {
      // Fetch messages from the last 7 days for each user
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('userId', user.id)
        .gte('timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (messagesError) {
        console.error(`Error fetching messages for user ${user.id}:`, messagesError.message);
        throw messagesError;
      }

      // Create a summary from the messages
      const summary = (messages as Message[])
        .map((msg) => `Message: ${msg.message}, Response: ${msg.response || 'No Response'}`)
        .join('\n');

      // Send the summary to the user's phone
      await sendMessage(user.phone, `Your weekly summary:\n${summary}`);
    }
  } catch (error) {
    console.error('Error in weekly summary cron job:', error);
  }
});

export async function GET() {
  return NextResponse.json({ message: 'Weekly summary cron set up' });
}