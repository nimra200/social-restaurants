import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginForm from "../Login";
import Navbar from "../Navbar";
import ViewProfile from "../ViewProfile";
import Post from "../Post";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navbar/>}>
                    <Route path="login" element={<LoginForm/>}/>
                    <Route path="profile/view" element={<ViewProfile/>}/>
                    <Route path="post/create" element={<Post/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router