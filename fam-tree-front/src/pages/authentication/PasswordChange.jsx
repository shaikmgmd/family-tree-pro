// PasswordChange.jsx

import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {handleFirstLoginPasswordUpdateAction, userLoginAction} from "../../store/features/slices/auth";
import {Button, Divider, Input, Typography} from "antd";
import {useNavigate} from "react-router-dom";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FTProButton from "../../components/button/FTProButton";
import {ReactComponent as PasswordChangeIcon} from "../../assets/ui/svg/passwordChange/password.svg";

function PasswordChange() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const userData = JSON.parse(localStorage.getItem('userData'));
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            dispatch(handleFirstLoginPasswordUpdateAction({
                payload: {
                    privateCode: userData.privateCode,
                    newPassword: password
                }
            })).then((response) => {
                if (response && typeof response === "object" && response.type === "user-password-change/fulfilled") {
                    localStorage.setItem("userData", JSON.stringify(response.payload));
                    if (localStorage.getItem("userData")) {
                        localStorage.removeItem("userData");
                    }
                    toast.success("Votre mot de passe a été modifié !", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    console.log("Attempting to navigate to /login");
                    navigate("/login");
                    window.location.href = '/login'
                }
            });
        }
    }

    return (
        <div className="flex h-screen">
            <div className="w-1/2 flex items-center justify-center border-r p-10">
                <PasswordChangeIcon/>
            </div>
            <div className="w-1/2 flex items-center justify-center p-10">
                <form onSubmit={handleSubmit} className="w-full max-w-lg">
                    <Typography.Title level={2} className="mb-10 text-center">
                        Changez votre mot de passe
                    </Typography.Title>
                    <Input.Password
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nouveau mot de passe"
                        className="mb-3"
                        name="password"
                    />
                    <Input.Password
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirmer mot de passe"
                        className="mb-3"
                        name="confirmPassword"
                    />

                    <FTProButton content={"Modifier"} type="submit"/>
                </form>
            </div>
        </div>
    );
}

export default PasswordChange;
