import logo from './logo.svg';
import './App.css';
import Home from "./pages/home/Home";
import AppRoute from "./route/AppRoute";
import {Link} from "react-router-dom";
import {Layout} from "antd";
import {CssBaseline, Container} from "@mui/material";
import SideMenu from "./components/navbar/SideMenu";
function App() {
    return (
        <div>
            <div style={{ display: 'flex' }} className='bg-gray-100'>
                <CssBaseline />
                <SideMenu />
                <div style={{ flex: 1, overflow: 'auto', marginLeft: 210 }}>
                    <AppRoute />
                </div>
            </div>
        </div>
    );
}

export default App;
