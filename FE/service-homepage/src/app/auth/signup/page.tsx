'use client';

import {ChangeEventHandler, FormEvent, useState} from 'react';
import axios from 'axios';


export default function Page() {
  const [form, setForm] = useState({
    fullName: 'kimcookieya',
    id: 'kimcookieya',
    password: '1234',
    passwordConfirm: '1234',
  });


  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setForm({
      ...form,
      [e.target!.name]: e.target!.value,
    });
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log(form);

    try {
      const res = await axios.post('/api/service/signup', form);
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-cetner p-24">
      <h1 className="text-4xl font-bold">Welcome to Service Client</h1>
      <p className="text-lg">This is a 회원가입 Page.</p>
      <form className="flex flex-col w-1/3 mt-8"
       onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          className="p-2 border border-gray-300 rounded-md mb-4"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="Id"
          className="p-2 border border-gray-300 rounded-md mb-4"
          name="id"
          value={form.id}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 border border-gray-300 rounded-md mb-4"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Password Confirm"
          className="p-2 border border-gray-300 rounded-md mb-4"
          name="passwordConfirm"
          value={form.passwordConfirm}
          onChange={handleChange}
          required
        />
        <button className="bg-blue-500 text-white p-2 rounded-md">
          Signup
        </button>
      </form>
    </main>
  );
}
