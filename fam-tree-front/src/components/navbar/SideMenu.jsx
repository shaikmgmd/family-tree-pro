import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import {Layout, Menu, Typography} from 'antd';
import {UserOutlined} from '@ant-design/icons';
import {useSelector} from "react-redux";

const {Sider} = Layout;
const {SubMenu} = Menu;
const SideMenu = () => {
    const location = useLocation();
    const userData = JSON.parse(localStorage.getItem('userData'));
    const user = useSelector((state) => state.user.getConnectedUser.payload);
    // TODO supprimer user du store quand déconnexion

    return (
        <Sider
            style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                background: 'linear-gradient(to bottom, #4CC425, #A4B631)'
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
                style={{height: '100%', borderRight: 0, background: 'transparent', color: 'white'}}
            >
                {userData && (
                    <>
                        <Menu.Item key="/presentation" icon={<UserOutlined/>} style={{marginBottom: '15px'}}>
                            <Link to="/presentation"
                                  style={{color: location.pathname === '/presentation' ? '#333' : 'white'}}>Présentation</Link>
                        </Menu.Item>
                        <Menu.Item key="/family-tree" icon={<UserOutlined/>} style={{marginBottom: '15px'}}>
                            <Link to="/family-tree"
                                  style={{color: location.pathname === '/family-tree' ? '#333' : 'white'}}>Arbre
                                Généalogique</Link>
                        </Menu.Item>
                    </>
                )}

                {!userData && (<Menu.Item key="/home" icon={<UserOutlined/>} style={{marginBottom: '15px'}}>
                    <Link to="/home"
                          style={{color: location.pathname === '/home' ? '#333' : 'white'}}>Accueil</Link>
                </Menu.Item>)}
                {user &&
                    user?.userRoles.some((ur) => ur.id === 1) &&
                    user?.firstLogin === false
                    && (
                        <>
                            <SubMenu key="admin" title={<span style={{color: 'white'}}
                            >Administrateur</span>}
                                     icon={<UserOutlined style={{color: "white"}}/>} style={{background: 'transparent'}}>
                                <Menu.Item key="/adhesion/dashboard">
                                    <Link to="/adhesion/dashboard"
                                          style={{color: location.pathname === '/adhesion/dashboard' ? 'black' : 'black'}}>Adhésion
                                        Dashboard</Link>
                                </Menu.Item>
                            </SubMenu>
                        </>
                    )}
                {!userData && (
                    <Menu.Item key="/adhesion/apply" icon={<UserOutlined/>}>
                        <Link to="/adhesion/apply"
                              style={{color: location.pathname === '/adhesion/apply' ? '#333' : 'white'}}>Demande
                            d'adhésion
                        </Link>
                    </Menu.Item>
                )}

            </Menu>
            <Menu
                mode="vertical"
                selectedKeys={[location.pathname]}
                style={{
                    height: userData ? '100px' : '60px',
                    borderRight: 0,
                    background: 'transparent',
                    color: 'white',
                    position: 'absolute',
                    bottom: 0,
                    width: '100%'
                }}
            >
                {
                    userData ?
                        <div className='w-full'>
                            <Menu.Item key="/profile" icon={<UserOutlined/>}>
                                <Link to="/profile"
                                      style={{color: location.pathname === '/profile' ? '#333' : 'white'}}>Mon
                                    Profil</Link>
                            </Menu.Item>
                            <Menu.Item key="/logout" icon={<UserOutlined/>}>
                                <Link to="/logout"
                                      style={{color: location.pathname === '/logout' ? '#333' : 'white'}}>Déconnexion</Link>
                            </Menu.Item>
                        </div>
                        :
                        <Menu.Item key="/login" icon={<UserOutlined/>}>
                            <Link to="/login"
                                  style={{color: location.pathname === '/login' ? '#333' : 'white'}}>Connexion</Link>
                        </Menu.Item>
                }
            </Menu>
        </Sider>
    );
};

export default SideMenu;
