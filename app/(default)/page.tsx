// pages/index.jsx or Home.jsx
"use client";
import '@ant-design/v5-patch-for-react-19';
import PageWithSideBar from '@/components/common/PageWithSidebar';
import HomePage from '@/components/home/HomePage';
import React, { useEffect } from 'react';

export default function Home() {

  useEffect(() => {
    const getUserDetails = async () => { };
  }, []);

  return (
    <PageWithSideBar>
      <HomePage />
    </PageWithSideBar>
  );
}
