import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

export default function MyRestaurant() {
    const [loggedIn, setLoggedIn] = useState(false)
    let navigate = useNavigate()

    useEffect(() => {
        if(!localStorage.getItem('token')) {
            navigate('/login')
        } // user is not logged in
        else setLoggedIn(true)
    }, [])

    useEffect(() => {
        if(loggedIn) {
            fetch('http://localhost:8000/restaurants/my-restaurant/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(res => {
                    if (res.ok) return res.json()
                    else navigate('/restaurants/create')
                })
                .then(json => navigate(`/restaurants/${json.id}`))
        }
    }, [loggedIn])
}

