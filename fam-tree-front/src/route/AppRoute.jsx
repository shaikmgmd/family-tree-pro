import {Route, Routes} from "react-router";
import {AdhesionDashboard} from "../pages/adhesion/AdhesionDashboard";
import Home from "../pages/home/Home";
import {AdhesionForm} from "../pages/adhesion/AdhesionForm";
import {LoginPage} from "../pages/authentication/LoginPage";
import {LogoutPage} from "../pages/authentication/LogoutPage";
import PasswordChange from "../pages/authentication/PasswordChange";
import Profile from "../pages/profile/Profile";
import Presentation from "../pages/presentation/Presentation";
import FamilyTree from "../pages/tree/FamilyTree";

const AppRoute = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/home' element={<Home />}/>
            <Route path='/adhesion/dashboard' element={<AdhesionDashboard />}/>
            <Route path='/adhesion/apply' element={<AdhesionForm />}/>
            <Route path='/login' element={<LoginPage />}/>
            <Route path='/logout' element={<LogoutPage />}/>
            <Route path='/password-change' element={<PasswordChange />}/>
            <Route path='/profile' element={<Profile />}/>
            <Route path='/presentation' element={<Presentation />}/>
            <Route path='/family-tree' element={<FamilyTree />}/>
        </Routes>
    )
}

export default AppRoute;