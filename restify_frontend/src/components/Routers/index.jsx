import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import LoginForm from "../Login";
import Navbar from "../Navbar";
import ViewProfile from "../ViewProfile";
import ViewFeed from "../Feed";
import EditProfile from "../EditProfile";
import CreatePost from "../CreatePost";
import ViewPost from "../ViewPost";
import Logout from "../Logout";
import MyProfile from "../MyProfile";
import ViewRestaurant from "../ViewRestaurant";
import EditRestaurant from "../EditRestaurant";
import MyRestaurant from "../MyRestaurant";
import AddImage from "../AddImage";
import HomePage from "../HomePage";
import CreateRestaurant from "../CreateRestaurant";
import SignUp from "../Signup";
import AddMenu from "../AddMenu";
import ViewMenu from "../ViewMenu";
import EditMenu from "../EditMenu";
import RestaurantPosts from "../RestaurantPosts";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navbar/>}>
                    <Route path="signup" element={<SignUp/>}/>
                    <Route path="login" element={<LoginForm/>}/>
                    <Route path="logout" element={<Logout/>}/>

                    <Route path="profile/:uid/view" element={<ViewProfile/>}/>
                    <Route path="profile/view" element={<MyProfile/>}/>
                    <Route path="profile/edit" element={<EditProfile/>}/>
                    <Route path="profile/my-feed" element={<ViewFeed/>}/>

                    <Route path="post/:pid/view" element={<ViewPost/>}/>
                    <Route path="restaurants/my-restaurant/create-post" element={<CreatePost/>}/>

                    <Route path="restaurants/create" element={<CreateRestaurant/>}/>
                    <Route path="restaurants/:rid" element={<ViewRestaurant/>}/>
                    <Route path="restaurants/my-restaurant" element={<MyRestaurant/>}/>
                    <Route path="restaurants/my-restaurant/edit" element={<EditRestaurant/>}/>

                    <Route path="restaurants/my-restaurant/add-image" element={<AddImage/>}/>

                    <Route path="restaurants/my-restaurant/create-menu" element={<AddMenu/>}/>
                    <Route path="restaurants/:restaurantid/menu/view" element={<ViewMenu/>}/>
                    <Route path="restaurants/:restaurantid/menu/edit" element={<EditMenu/>}/>
                    <Route path="restaurants/:restaurantid/posts/view" element={<RestaurantPosts/>}/>


                    <Route path="home" element={<HomePage/>}/>


                    <Route path="/" element={<Navigate to="/home"/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router
