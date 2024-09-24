'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button'; // Shadcn button
import { Input } from '@/components/ui/input'; // Shadcn input

type User = {
  id: number;
  name: string;
  phone: string;
};

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleSendMessage = async (type: 'manual' | 'automated') => {
    if (!selectedUserId) {
      alert('Please select a user');
      return;
    }

    const user = users.find((u) => u.id === selectedUserId);
    if (!user) return;

    let url = '/api/sendMessage';
    if (type === 'automated') {
      url = '/api/sendDailyMessage';
    }

    await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ userId: selectedUserId, message: type === 'manual' ? message : null }),
    });

    alert(`${type === 'manual' ? 'Manual' : 'Automated'} message sent to ${user.name}`);
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <div className="mb-4">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between mb-2">
            <div>
              {user.name} ({user.phone})
            </div>
            <Button variant="outline" onClick={() => setSelectedUserId(user.id)}>
              Select
            </Button>
            
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-2">Send Message</h2>
      <Input
        placeholder="Enter manual message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="mb-2"
      />

      <div className="space-x-4">
        <Button variant="default" onClick={() => handleSendMessage('manual')}>
          Send Manual Message
        </Button>
        <Button variant="outline" onClick={() => handleSendMessage('automated')}>
          Send Automated Message
        </Button>
      </div>
    </div>
  );
}