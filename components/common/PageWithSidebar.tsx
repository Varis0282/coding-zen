"use client";
import React, { useState } from 'react';
import { Layout, Button, theme } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import SideBar from './SideBar';

const { Header, Content } = Layout;

const PageWithSideBar = ({ children }: { children: React.ReactNode }) => {
    const [collapsed, setCollapsed] = useState(true);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout hasSider>
            <SideBar collapsed={collapsed} />
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: '16px', width: 64, height: 64 }}
                    />
                </Header>
                <Content
                    style={{
                        padding: '10px 24px',
                        minHeight: '100vh',
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                    className='md:mt-[-64px]'
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default PageWithSideBar;
