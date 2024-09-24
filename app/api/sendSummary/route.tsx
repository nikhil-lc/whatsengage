import { NextResponse } from 'next/server';
import { sendMessage } from '@/utils/wati';
import supabase from '@/utils/supabaseClient';

export async function POST(req: Request) {
  const { userId } = await req.json();

  try {
    // Fetch the user from Supabase
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch messages from the last 7 days for the user
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('userId', userId)
      .gte('timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());  // Filter for messages within the last 7 days

    if (messagesError) {
      return NextResponse.json({ error: 'Error fetching messages' }, { status: 500 });
    }

    // Create a summary from the fetched messages
    let summary = messages
      .map((message) => `Message: ${message.message}, Response: ${message.response || 'No Response'}`)
      .join('\n');

    // Send the weekly summary to the user via sendMessage
    await sendMessage(user.phone, `Your weekly summary:\n${summary}`);

    // Return a successful response
    return NextResponse.json({ message: 'Summary sent' });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}