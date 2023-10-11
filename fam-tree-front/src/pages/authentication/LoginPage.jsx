import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {Input, Button, Divider, Typography} from 'antd';
import {userLoginAction} from "../../store/features/slices/auth";
import {useNavigate, Link} from "react-router-dom";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
            toast.success("Vous êtes connecté avec succès!", {
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
            toast.error("Erreur lors de la connexion.", {
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
                <Typography.Title level={1} className="text-white">
                    mettre photo
                </Typography.Title>
            </div>
            <div className="w-1/2 flex items-center justify-center p-10">
                <form onSubmit={handleSubmit} className="w-full max-w-lg">
                    <Typography.Title level={2} className="mb-4">
                        Connexion
                    </Typography.Title>
                    <Input
                        className="mb-3"
                        placeholder="Code privé"
                        name="privateCode"
                        onChange={handleChange}
                        value={loginInfo.privateCode}
                    />
                    <Input.Password
                        className="mb-3"
                        placeholder="Mot de passe"
                        name="password"
                        onChange={handleChange}
                        value={loginInfo.password}
                    />
                    <Button type="default" htmlType="submit" className="mt-4">
                        Se connecter
                    </Button>
                    <Divider/>
                    <div className="block text-center text-sm text-gray-400 font-extralight mt-4">
                        <Link to="/adhesion/apply" className="hover:text-gray-500 hover:transition">
                            Pas inscrit ? Faites une demande d'adhésion
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
