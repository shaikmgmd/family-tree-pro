import React, {useEffect} from 'react';

import AppRoute from "./route/AppRoute";
import {Link, useNavigate, useLocation} from "react-router-dom";
import {CssBaseline, Container} from "@mui/material";
import SideMenu from "./components/navbar/SideMenu";
import {useDispatch, useSelector} from "react-redux";
import {getConnectedUserAction} from "./store/features/slices/user";
import {ToastContainer} from "react-toastify";
import './App.css';
import {StompSessionProvider} from "react-stomp-hooks";
import {ReactNotifications} from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'
import ChildComponent from "./components/notification/ChildComponent";

function App() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.user.getConnectedUser.payload);
    const location = useLocation()

    useEffect(() => {
        if (user && user.firstLogin) {
            navigate('/password-change');
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await dispatch(getConnectedUserAction());
            // console.log("2eme useEffect", response);
        };

        fetchData();
    }, [location.pathname]);


    return (
        <div>
            <div style={{display: 'flex'}} className='bg-gray-100'>
                <StompSessionProvider
                    url={'http://localhost:8080/ws-endpoint'}>
                    <ReactNotifications/>
                    <ChildComponent/>
                    <ToastContainer/>
                    <CssBaseline/>
                    <SideMenu/>
                    <div style={{flex: 1, overflow: 'auto', marginLeft: 210}}>
                        <AppRoute/>
                    </div>
                </StompSessionProvider>
            </div>
        </div>
    );
}

export default App;
