import {Route, Routes} from "react-router";
import {AdhesionDashboard} from "../pages/adhesion/AdhesionDashboard";
import Home from "../pages/home/Home";
import {AdhesionForm} from "../pages/adhesion/AdhesionForm";

const AppRoute = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/home' element={<Home />}/>
            <Route path='/adhesion/dashboard' element={<AdhesionDashboard />}/>
            <Route path='/adhesion/apply' element={<AdhesionForm />}/>
        </Routes>
    )
}

export default AppRoute;