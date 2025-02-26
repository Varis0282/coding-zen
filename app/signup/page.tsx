// pages/index.jsx or Home.jsx
"use client";
import '@ant-design/v5-patch-for-react-19';
import PageWithSideBar from '@/components/common/PageWithSidebar';
import HomePage from '@/components/home/HomePage';
import React, { useEffect } from 'react';
import LoginForm from '@/components/login/LoginForm';
import SignupForm from '@/components/signup/SignUpForm';
import { getCookie } from '@/utils/cookies';

export default function SignUp() {

  useEffect(() => {
    const token = getCookie(null, 'token');
    if (token) {
      window.location.href = '/';
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 justify-center items-center">
      <SignupForm />
    </div>
  );
}
