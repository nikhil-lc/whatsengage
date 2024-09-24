'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button'; // Shadcn button
import { Input } from '@/components/ui/input'; // Shadcn input

export default function AddUser() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async () => {
    await fetch('/api/add-users', {
      method: 'POST',
      body: JSON.stringify({ name, phone }),
    });
    alert('User added successfully');
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add User</h1>
      <div className="space-y-4">
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Button onClick={handleSubmit}>Add User</Button>
      </div>
    </div>
  );
}