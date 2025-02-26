// pages/index.jsx or Home.jsx
"use client";
import '@ant-design/v5-patch-for-react-19';
import PageWithSideBar from '@/components/common/PageWithSidebar';
import HomePage from '@/components/home/HomePage';
import React, { useEffect } from 'react';
import LoginForm from '@/components/login/LoginForm';

export default function Login() {

  useEffect(() => {
    let token: string | null = null;
    if (typeof window === 'undefined') {
      token = localStorage.getItem('token');
    }
    if (token) {
      window.location.href = '/';
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 justify-center items-center">
      <LoginForm />
    </div>
  );
}
