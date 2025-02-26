// pages/index.jsx or Home.jsx
"use client";
import '@ant-design/v5-patch-for-react-19';
import PageWithSideBar from '@/components/common/PageWithSidebar';
import HomePage from '@/components/home/HomePage';
import React, { useEffect } from 'react';

export default function Home() {

  useEffect(() => {
    const getUserDetails = async () => {
      const userData = await fetch('/api/getUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await userData.json();
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.data));
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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
