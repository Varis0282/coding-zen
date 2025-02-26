import React from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, VideoCameraOutlined, LogoutOutlined } from '@ant-design/icons';

const { Sider } = Layout;

interface SideBarProps {
  collapsed: boolean;
}

const SideBar: React.FC<SideBarProps> = ({ collapsed }) => {

  const user = localStorage.getItem('user');
  const userName = user ? JSON.parse(user).name : '';
  const siderStyle: React.CSSProperties = {
    overflow: 'auto',
    height: '100vh',
    position: 'sticky',
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: 'thin',
    scrollbarGutter: 'stable',
  };

  const handleMenuClick = (key: string) => {
    if (key === 'logout') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  };

  return (
    <Sider style={siderStyle} trigger={null} collapsible collapsed={collapsed}>
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['/']}
        onClick={({ key }) => handleMenuClick(key)}
        items={[
          { key: '/', icon: <UserOutlined />, label: userName ? `Welcome ${userName}` : 'Welcome User' },
          { key: 'logout', icon: <LogoutOutlined />, label: 'Logout' },
        ]}
      />
    </Sider>
  );
};

export default SideBar;
