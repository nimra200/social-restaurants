import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginForm from "../Login";
import Navbar from "../Navbar";
import ViewProfile from "../ViewProfile";
import ViewFeed from "../Feed";
import EditProfile from "../EditProfile";
import CreatePost from "../Post"
import AddMenu from "../AddMenu";
import RestaurantPosts from "../RestaurantPosts";
import ViewMenu from "../ViewMenu";
import Signup from "../Signup";
import Searchresults from "../Searchresults";
import EditMenu from "../EditMenu";
const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navbar/>}>
                    <Route path="login" element={<LoginForm/>}/>
                    <Route path="register" element={<Signup/>}/>
                    <Route path="profile/view" element={<ViewProfile/>}/>
                    <Route path="profile/edit" element={<EditProfile/>}/>
                    <Route path="profile/my-feed" element={<ViewFeed/>}/>
                    <Route path="post/create" element={<CreatePost/>}/>
                    <Route path="menu/create" element={<AddMenu/>}/>
                    <Route path=":restaurantid/menu/view" element={<ViewMenu/>}/>
                    <Route path=":restaurantid/menu/edit" element={<EditMenu/>}/>
                    <Route path=":restaurantid/posts/view" element={<RestaurantPosts/>}/>
                    <Route path="search" element={<Searchresults/>}/>
                    
                    
                    
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router
