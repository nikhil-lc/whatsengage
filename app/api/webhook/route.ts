import { NextResponse } from 'next/server';
import supabase from '@/utils/supabaseClient';

export async function POST(req: Request) {
  try {
    // Parse the incoming webhook request from WATI
    const body = await req.json();

    // Extract important details from the webhook payload
    const { whatsappNumber, message, reply, timestamp } = body;

    // Find the corresponding user in the database using the phone number
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('phone', whatsappNumber)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Insert the response message into the 'messages' table
    const { error: insertError } = await supabase
      .from('messages')
      .insert([
        {
          userid: user.id,
          message: reply, // Store the response message
          timestamp: new Date(timestamp).toISOString(), // Store the response timestamp
        },
      ]);

    if (insertError) {
      console.error('Error inserting message:', insertError.message);
      return NextResponse.json({ error: 'Failed to store the message' }, { status: 500 });
    }

    // Return a success response
    return NextResponse.json({ message: 'Message response stored successfully' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'An error occurred while processing the webhook' }, { status: 500 });
  }
}