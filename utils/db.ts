import supabase from './supabaseClient';

// Fetch all users
export const fetchUsers = async () => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw new Error(error.message);
  return data;
};

// Add a new user
export const addUser = async (name: string, phone: string) => {
  const { data, error } = await supabase.from('users').insert([{ name, phone }]);
  if (error) throw new Error(error.message);
  return data;
};

// Fetch messages for a user
export const fetchMessages = async (userId: number) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('userId', userId);
  if (error) throw new Error(error.message);
  return data;
};

// Add a new message
export const addMessage = async (userId: number, message: string, response: string) => {
  const { data, error } = await supabase.from('messages').insert([{ userId, message, response }]);
  if (error) throw new Error(error.message);
  return data;
};