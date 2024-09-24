import { NextResponse } from 'next/server';
import { sendTemplateMessage } from '@/utils/wati';  // Assuming you're using this function for templates
import supabase from '@/utils/supabaseClient';

export async function POST(req: Request) {
  const { userId, templateParams, message } = await req.json();

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

    const templateName = 'nikhil_test_reminder';  // Hardcoded template name for now
    const defaultMessage = `Hello ${user.name}, here’s your automated message!`;

    // Send the template message
    await sendTemplateMessage(user.phone, templateName, templateParams);

    // Log the message in the 'messages' table
    const { data, error: insertError } = await supabase
      .from('messages')
      .insert([
        { userid: user.id, message: message || defaultMessage }
      ]);

    if (insertError) {
      console.error('Supabase Insert Error:', insertError.message);
      return NextResponse.json({ error: 'Failed to log message', details: insertError.message }, { status: 500 });
    }

    console.log("Message inserted into database:", data);

    return NextResponse.json({ message: 'Message sent and logged successfully', data });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'An error occurred', details: error.message }, { status: 500 });
  }
}