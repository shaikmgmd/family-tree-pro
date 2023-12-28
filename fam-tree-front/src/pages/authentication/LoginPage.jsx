import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {Input, Button, Divider, Typography} from 'antd';
import {userLoginAction} from "../../store/features/slices/auth";
import {useNavigate, Link} from "react-router-dom";
import {toast} from 'react-toastify';
import {ReactComponent as SecureLoginIcon} from '../../assets/ui/svg/login/secure_login.svg';
import 'react-toastify/dist/ReactToastify.css';
import {Tree} from "@phosphor-icons/react";
import FTProButton from "../../components/button/FTProButton";

export const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loginInfo, setLoginInfo] = useState({
        privateCode: '',
        password: ''
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setLoginInfo(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await dispatch(userLoginAction({payload: loginInfo}));

        if (response && typeof response === "object" && response.type === "user-login/fulfilled") {
            localStorage.setItem("userData", JSON.stringify(response.payload));
            toast.success("Bienvenue à bord ! Votre connexion a été un succès !", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                /*                style: {
                                    background: "#6dc3ef",
                                    color: "white"
                                }*/
            });
            navigate("/presentation");
        } else {
            toast.error("Oops ! Petit souci de connexion. Tentons à nouveau !", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
            });
        }
    };

    return (
        <div className="flex h-screen">
            <div className="w-1/2 flex items-center justify-center border-r">
                <SecureLoginIcon/>
            </div>
            <div className="w-1/2 flex items-center justify-center p-10">
                <form onSubmit={handleSubmit} className="w-full max-w-lg">
                    <div className="mb-12">
                        <div className="flex justify-center items-center">
                            <Tree size={60} color="#4CC425"/>
                        </div>
                        <Typography.Title level={2} className="mb-10 text-center">
                            Connexion à votre compte
                        </Typography.Title>
                    </div>
                    <Input
                        className="mb-3"
                        placeholder="Entrez votre code privé"
                        name="privateCode"
                        onChange={handleChange}
                        value={loginInfo.privateCode}
                    />
                    <Input.Password
                        className="mb-3"
                        placeholder="Entrez votre mot de passe"
                        name="password"
                        onChange={handleChange}
                        value={loginInfo.password}
                    />
                    {/*<button type="default" htmlType="submit"*/}
                    {/*        className="mt-6 w-full text-white bg-green-ftpro hover:bg-green-ftpro-h transition duration-75 px-3.5 py-1.5 rounded-md"*/}
                    {/*>*/}
                    {/*    Se connecter*/}
                    {/*</button>*/}
                    <FTProButton content="Se connecter" type="submit" noMarginTop/>
                    <Divider/>
                    <div className="block text-center text-sm text-gray-400 font-extralight mt-4">
                        <Link to="/adhesion/apply" className="hover:text-gray-500 hover:transition">
                            Prêt à nous rejoindre ? Lancez votre demande d'adhésion dès maintenant !
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
