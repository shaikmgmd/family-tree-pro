import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Sider } = Layout;

const SideMenu = () => {
    const location = useLocation();

    return (
        <Sider
            style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                background: 'linear-gradient(to bottom, #007BFF, #00C0FF)'
            }}
        >
            <div
                style={{
                    height: '32px',
                    margin: '16px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '24px',
                    color: 'white',
                    fontFamily: "'Lucida Console', Monaco, monospace"  // Une belle police d'exemple
                }}
            >
                FTPro++
            </div>

            <Menu
                mode="vertical"
                selectedKeys={[location.pathname]}
                style={{ height: '100%', borderRight: 0, background: 'transparent', color: 'white' }}
            >
                <Menu.Item key="/home" icon={<UserOutlined />} style={{marginBottom: '15px'}}>
                    <Link to="/home" style={{ color: location.pathname === '/home' ? '#333' : 'white' }}>Home</Link>
                </Menu.Item>
                <Menu.Item key="/adhesion/dashboard" icon={<UserOutlined />} style={{marginBottom: '15px'}}>
                    <Link to="/adhesion/dashboard" style={{ color: location.pathname === '/adhesion/dashboard' ? '#333' : 'white' }}>Adhesion Dashboard</Link>
                </Menu.Item>
                <Menu.Item key="/adhesion/apply" icon={<UserOutlined />}>
                    <Link to="/adhesion/apply" style={{ color: location.pathname === '/adhesion/apply' ? '#333' : 'white' }}>Adhesion - Apply</Link>
                </Menu.Item>
            </Menu>
        </Sider>
    );
};

export default SideMenu;
