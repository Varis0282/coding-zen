// pages/index.jsx or Home.jsx
"use client";
import '@ant-design/v5-patch-for-react-19';
import PageWithSideBar from '@/components/common/PageWithSidebar';
import HomePage from '@/components/home/HomePage';
import React, { useEffect } from 'react';
import { getCookie, setCookie, removeCookie } from '@/utils/cookies';

export default function Home() {

  const token = getCookie(null, 'token');

  useEffect(() => {
    const getUserDetails = async () => {
      const userData = await fetch('/api/getUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application',
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await userData.json();
      if (data.success && typeof window !== 'undefined') {
        setCookie(null, 'userName', data.data.name);
        setCookie(null, 'userId', data.data._id);
      } else {
        if (typeof window !== 'undefined') {
          removeCookie(null, 'token');
          removeCookie(null, 'userName');
          removeCookie(null, 'userId');
        }
        window.location.href = '/login';
      }
    }
    getUserDetails();
  }, []);

  return (
    <PageWithSideBar>
      <HomePage />
    </PageWithSideBar>
  );
}
