import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginForm from "../Login";
import Navbar from "../Navbar";
import ViewProfile from "../ViewProfile";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navbar/>}>
                    <Route path="login" element={<LoginForm/>}/>
                    <Route path="profile/view" element={<ViewProfile/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router