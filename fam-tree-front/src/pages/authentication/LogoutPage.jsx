import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {Input, Button, Divider, Typography} from 'antd';
import {userLoginAction, userLogoutAction} from "../../store/features/slices/auth";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

export const LogoutPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const logout = async () => {
        const response = await dispatch(userLogoutAction());
    }
    useEffect(() => {
        localStorage.removeItem("userData");
        // TODO : logout();
        /*toast.success("Vous êtes déconnecté avec succès !", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });*/
        navigate('/login');
    }, []);

    return (
        <></>
    );
}
