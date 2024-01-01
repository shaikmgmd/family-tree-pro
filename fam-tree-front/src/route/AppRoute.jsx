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
import ListUser from "../pages/familytreeuser/ListUser";
import FamilyTreeUser from "../pages/familytreeuser/FamilyTreeUser";
import ChatList from "../pages/chat/ChatList";
import ErrorBornDate from "../pages/tree/ErrorBornDate";
import ConfirmRelationship from "../pages/confirm-relationship/ConfirmRelationship";
import ErrorPageNotFound from "../pages/error/ErrorPageNotFound";
import DashboardPage from "../pages/stats/DashboardPage";
import PageFaq from "../pages/faq/PageFaq";
import SupervisionDashboard from "../pages/supervision-dashboard/SupervisionDashboard";

const AppRoute = () => {
    return (
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/home' element={<Home/>}/>
            <Route path='/adhesion/dashboard' element={<AdhesionDashboard/>}/>
            <Route path='/adhesion/apply' element={<AdhesionForm/>}/>
            <Route path='/login' element={<LoginPage/>}/>
            <Route path='/logout' element={<LogoutPage/>}/>
            <Route path='/password-change' element={<PasswordChange/>}/>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/presentation' element={<Presentation/>}/>
            <Route path='/family-tree' element={<FamilyTree/>}/>
            <Route path='/family-tree/born-date-error' element={<ErrorBornDate/>}/>
            <Route path='/user/all-except-current' element={<ListUser/>}/>
            <Route path='/family-tree/user/:userId' element={<FamilyTreeUser/>}/>
            <Route path='/chat-list' element={<ChatList/>}/>
            <Route path='/confirm-relationship/:confirmationCode' element={<ConfirmRelationship/>}/>
            <Route path='/stats' element={<DashboardPage />}/>
            <Route path='/faq' element={<PageFaq />}/>
            <Route path='/supervision-dashboard' element={<SupervisionDashboard />}/>
            <Route path='*' element={<ErrorPageNotFound/>}/>
        </Routes>
    )
}

export default AppRoute;