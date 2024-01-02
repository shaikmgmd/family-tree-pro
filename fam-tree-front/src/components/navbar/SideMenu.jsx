import React, {useEffect} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {Layout, Menu, Typography} from 'antd';
import {UserOutlined} from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import {
    House,
    Clipboard,
    SignIn,
    Info,
    Tree,
    UserList,
    Chat,
    Gauge,
    User,
    SignOut,
    ChartLine,
    Question,
    TestTube,
    Star
} from "@phosphor-icons/react";
import {getConnectedUserAction} from "../../store/features/slices/user";
import {getAllTestsResultsAction} from "../../store/features/slices/tests";
import {isUserAdmin} from "../../utils/isUserAdmin";

const {Sider} = Layout;
const {SubMenu} = Menu;

const selectedIconColor = "#4CC425";

const SideMenu = () => {
    const location = useLocation();
    const userData = JSON.parse(localStorage.getItem('userData'));
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.getConnectedUser.payload);

    useEffect(() => {
        dispatch(getConnectedUserAction());
    }, []);


    return (
        <Sider
            style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                background: 'linear-gradient(to bottom, #4CC425, #A4B631)',
                fontFamily: 'Montserrat',
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
                }}
            >
                <div className="flex items-center justify-center space-x-2">
                    <Tree size={25} color="#FFFFFF"/>
                    <span>FTPro++</span>
                </div>
            </div>

            <Menu
                mode="vertical"
                selectedKeys={[location.pathname]}
                style={{height: '100%', borderRight: 0, background: 'transparent', color: 'white'}}
            >
                {userData && (
                    <>
                        <Menu.Item key="/presentation"
                                   icon={<Info
                                       style={{color: location.pathname === '/presentation' ? selectedIconColor : 'white'}}/>}
                                   style={{marginBottom: '15px'}}>
                            <Link to="/presentation"
                                  style={{color: location.pathname === '/presentation' ? '#333' : 'white'}}>Présentation</Link>
                        </Menu.Item>
                        <Menu.Item key="/family-tree"
                                   icon={<Tree
                                       style={{color: location.pathname === '/family-tree' ? selectedIconColor : 'white'}}/>}
                                   style={{marginBottom: '15px'}}>
                            <Link to="/family-tree"
                                  style={{color: location.pathname === '/family-tree' ? '#333' : 'white'}}>Arbre
                                Généalogique</Link>
                        </Menu.Item>
                        <Menu.Item key="/user/all-except-current"
                                   icon={<UserList
                                       style={{color: location.pathname === '/user/all-except-current' ? selectedIconColor : 'white'}}/>}
                                   style={{marginBottom: '15px'}}>
                            <Link to="/user/all-except-current"
                                  style={{color: location.pathname === '/user/all-except-current' ? '#333' : 'white'}}>Utilisateurs</Link>
                        </Menu.Item>
                        <Menu.Item key="/chat-list"
                                   icon={<Chat
                                       style={{color: location.pathname === '/chat-list' ? selectedIconColor : 'white'}}/>}
                                   style={{marginBottom: '15px'}}>
                            <Link to="/chat-list"
                                  style={{color: location.pathname === '/chat-list' ? '#333' : 'white'}}>Discussions</Link>
                        </Menu.Item>
                        <Menu.Item key="/stats"
                                   icon={<ChartLine
                                       style={{color: location.pathname === '/stats' ? selectedIconColor : 'white'}}/>}
                                   style={{marginBottom: '15px'}}>
                            <Link to="/stats"
                                  style={{color: location.pathname === '/stats' ? '#333' : 'white'}}>Statistiques</Link>
                        </Menu.Item>
                        <Menu.Item key="/faq"
                                   icon={<Question
                                       style={{color: location.pathname === '/faq' ? selectedIconColor : 'white'}}/>}
                                   style={{marginBottom: '15px'}}>
                            <Link to="/faq"
                                  style={{color: location.pathname === '/faq' ? '#333' : 'white'}}>FAQ</Link>
                        </Menu.Item>
                    </>
                )}

                {!userData && (
                    <>
                        <Menu.Item
                            key="/home"
                            icon={<House style={{color: location.pathname === '/home' ? selectedIconColor : 'white'}}/>}
                            style={{marginBottom: '15px'}}>
                            <Link to="/home"
                                  style={{color: location.pathname === '/home' ? '#333' : 'white'}}>Accueil</Link>
                        </Menu.Item>
                        <Menu.Item key="/presentation"
                                   icon={<Info
                                       style={{color: location.pathname === '/presentation' ? selectedIconColor : 'white'}}/>}
                                   style={{marginBottom: '15px'}}>
                            <Link to="/presentation"
                                  style={{color: location.pathname === '/presentation' ? '#333' : 'white'}}>Présentation</Link>
                        </Menu.Item></>)
                }
                {
                    user && userData &&
                    isUserAdmin(userData) &&
                    user?.firstLogin === false
                    && (
                        <>
                            {/*<SubMenu key="admin" title={<span style={{color: 'white'}}>Administrateur</span>}
                                     icon={<Gauge style={{color: 'white'}}/>}
                                     style={{background: 'transparent'}}>

                            </SubMenu>*/}
                            <Menu.Item key="/adhesion/dashboard" icon={<Gauge
                                style={{color: location.pathname === '/adhesion/dashboard' ? selectedIconColor : 'white'}}/>}>
                                <Link to="/adhesion/dashboard"
                                      style={{color: location.pathname === '/adhesion/dashboard' ? '#333' : 'white'}}>
                                    Dashboard <Star style={{display: "inline", marginLeft: "43px"}} size={18}
                                                    color="#FFD700"/>
                                </Link>
                            </Menu.Item>

                            <Menu.Item key="/supervision-dashboard" icon={<TestTube
                                style={{color: location.pathname === '/supervision-dashboard' ? selectedIconColor : 'white'}}/>}>
                                <Link to="/supervision-dashboard" style={{
                                    color: location.pathname === '/supervision-dashboard' ? '#333' : 'white'
                                }}>
                                    Supervision <Star style={{display: "inline", marginLeft: "40px"}} size={18}
                                                      color="#FFD700"/>
                                </Link>
                            </Menu.Item>

                        </>
                    )
                }
                {
                    !userData && (
                        <Menu.Item key="/adhesion/apply" icon={<Clipboard
                            style={{color: location.pathname === '/adhesion/apply' ? selectedIconColor : 'white'}}/>}>
                            <Link to="/adhesion/apply"
                                  style={{color: location.pathname === '/adhesion/apply' ? '#333' : 'white'}}>Demande
                                d'adhésion</Link>
                        </Menu.Item>
                    )
                }

            </Menu>
            <Menu
                mode="vertical"
                selectedKeys={[location.pathname]}
                style={{
                    height: userData ? '100px' : '60px',

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
                            <Menu.Item
                                key="/profile"
                                icon={<User
                                    style={{color: location.pathname === '/profile' ? selectedIconColor : 'white'}}/>}
                                style={{
                                    marginBottom: '5px',
                                    color: location.pathname === '/profile' ? '#333' : 'white',
                                    backgroundColor: location.pathname === '/profile' ? '#E6F4FF' : 'transparent',
                                }}>
                                <Link to="/profile"
                                      style={{color: location.pathname === '/profile' ? '#333' : 'white'}}>{user?.firstName}</Link>
                            </Menu.Item>
                            <Menu.Item key="/logout" icon={<SignOut
                                style={{color: location.pathname === '/logout' ? selectedIconColor : 'white'}}/>}
                                       style={{
                                           color: location.pathname === '/logout' ? '#333' : 'white',
                                           backgroundColor: location.pathname === '/logout' ? '#E6F4FF' : 'transparent',
                                       }}>
                                <Link to="/logout"
                                      style={{color: location.pathname === '/logout' ? '#333' : 'white'}}>Déconnexion</Link>
                            </Menu.Item>
                        </div>
                        :
                        <Menu.Item key="/login" icon={<SignIn
                            style={{color: location.pathname === '/login' ? selectedIconColor : 'white'}}/>}>
                            <Link to="/login"
                                  style={{color: location.pathname === '/login' ? '#333' : 'white'}}>Connexion</Link>
                        </Menu.Item>
                }
            </Menu>
        </Sider>
    )
        ;
};

export default SideMenu;
