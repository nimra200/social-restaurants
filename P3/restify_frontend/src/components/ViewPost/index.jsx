import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import './style.css'
import LikeButton from "../LikeButton";
import UnlikeButton from "../UnlikeButton";


export default function ViewPost() {
    const { pid } = useParams()
    const [data, setData] = useState({})
    const [userData, setUserData] = useState({})
    const [restaurantData, setRestaurantData] = useState({})
    const [loggedIn, setLoggedIn] = useState(false)
    let navigate = useNavigate();
    useEffect(() => {
        if(localStorage.getItem('token')) setLoggedIn(true)
        else setLoggedIn(false)
    }, [])

    useEffect(() => {
        let head = {}
        if(loggedIn) head={'Authorization': `Bearer ${localStorage.getItem('token')}`}
        fetch(`http://localhost:8000/restaurants/posts/${pid}/view/`, {
            method: 'GET',
            headers: head
        })
            .then(res => res.json())
            .then(json => setData(json))

    }, [loggedIn])

    useEffect(() => {
        if(Object.keys(data).length !== 0) {
            fetch(`http://localhost:8000/accounts/get-profile/${data.owner_id}/`, {
                method: 'GET'
            })
                .then(res => res.json())
                .then(json => setUserData(json))

            fetch(`http://localhost:8000/restaurants/${data.restaurant_id}/view/`, {
                method: 'GET'
            })
                .then(res => res.json())
                .then(json => setRestaurantData(json))
        }
    }, [data])

    console.log(data)
    console.log(userData)
    console.log(restaurantData)

    const likeBtnClicked = id => {
        fetch(`http://localhost:8000/restaurants/post/${id}/like/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(json => {
                setData(json)
            })
    }

    const unlikeBtnClicked = id => {
        fetch(`http://localhost:8000/restaurants/post/${id}/unlike/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(json => {
                setData(json)
            })
    }


    function format_date(created) {
        let d = new Date(parseInt(created.substring(0,4)), parseInt(created.substring(5,7))-1, parseInt(created.substring(8,10)))
        let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
        let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
        let da = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(d);
        return `${mo} ${da}, ${ye}`
    }

    let like_btn = null
    if(loggedIn) {
        like_btn = !data.userLiked ? <LikeButton classname="btn btn-primary" like_fn={() => likeBtnClicked(data.id)}/> : <UnlikeButton classname="btn btn-primary" unlike_fn={() => unlikeBtnClicked(data.id)}/>
    }


    return (
        <>
            <div className="container view-post-container" style={{marginTop: '105px', color: 'white'}}>

                <div className="view-post-col1">
                    {data.picture ? <img className="view-post-img" src={data.picture}/> : null}

                    <div style={{color: 'black', backgroundColor: 'white', padding: '10px'}}>
                        <h1>{data.title}</h1>

                        <h5>Topic: {data.topic}</h5>

                        <h6><i className="fa fa-calendar"></i> {data.created ? format_date(data.created) : null}</h6>

                        <br/>

                            <p>
                                {data.description}
                            </p>
                    </div>
                </div>

                <div className="view-post-col2">

                    <div className="view-post-profile" onClick={() => navigate(`/profile/${data.owner_id}/view`)}>
                        {data.profile_picture ? <img className="view-post-pfp" src={userData.profile_picture}/> : null} <a>{userData.username}</a>
                    </div>

                    <div className="view-post-profile" onClick={() => navigate(`/restaurants/${data.restaurant_id}`)}>
                        <img className="view-post-pfp"
                             src={restaurantData.logo}/>
                            <a>{restaurantData.name}</a>
                    </div>

                    <div style={{paddingLeft: "10px", marginTop: '15px'}}>

                        {like_btn}

                        <i style={{paddingRight:'5px'}} className="fa fa-heart"></i> {data.num_likes}
                    </div>
                </div>


            </div>

        </>
    )
}

