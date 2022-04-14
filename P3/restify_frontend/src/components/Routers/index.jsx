import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginForm from "../Login";
import Navbar from "../Navbar";
import ViewProfile from "../ViewProfile";
import ViewFeed from "../Feed";
import EditProfile from "../EditProfile";
import Post from "../Post"
import Menu from "../Menu";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navbar/>}>
                    <Route path="login" element={<LoginForm/>}/>
                    <Route path="profile/view" element={<ViewProfile/>}/>
                    <Route path="profile/edit" element={<EditProfile/>}/>
                    <Route path="profile/my-feed" element={<ViewFeed/>}/>
                    <Route path="post/create" element={<Post/>}/>
                    <Route path="menu/create" element={<Menu/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router
