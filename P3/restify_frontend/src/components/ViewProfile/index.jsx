import './style.css'
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

export default function ViewProfile() {
    const { uid } = useParams()
    const [data, setData] = useState({username: '', first_name: '', last_name: '', email: '', phone_number: '',
                                                    profile_picture: '', restaurant: ''})
    const [loggedIn, setLoggedIn] = useState(false)
    const [isMyProfile, setIsMyProfile] = useState(false)

    useEffect(() => {
        document.title = "My Profile"
        if (localStorage.getItem('token')) setLoggedIn(true)
        else setLoggedIn(false)
        fetch(`http://localhost:8000/accounts/get-profile/${uid}/`, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(json => setData(json))
    }, [])

    useEffect(() => {
        if(loggedIn) {
            fetch('http://localhost:8000/accounts/profile/view/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`  // get auth key from local storage
                }
            })
                .then(res => res.json())
                .then(json => {
                    if(json.id === data.id) setIsMyProfile(true)
                })
            }
    }, [data, loggedIn])


    let restaurant_btn = null
    if(data.restaurant) {
        restaurant_btn = <div className='btn-container'><a className="btn btn-secondary" href={`/restaurants/${data.restaurant}`} role="button">Visit My Restaurant!</a></div>
    }

    return (
        <>

            <div className="jumbotron text-center">
                <h1 className='title'>{isMyProfile ? 'My' : null} Profile</h1>
            </div>


    <div className="container profile-container">
        <div>
            <div>
                {data.profile_picture ? <img className="pfp" src={data.profile_picture}/> : null}
            </div>

            <div className='text'>
                <h1> {data.first_name + ' ' + data.last_name} </h1>
                <h3> {data.username} </h3>
              <br/>

                <ul className="ul-class">
                    <li className="li-class"> <a className="item" href={`mailto: ${data.email}`}>
                        <i className="profile-icons lnr lnr-envelope"></i> {data.email}</a> </li>
                    {data.phone_number ? <li className="li-class"> <i className="profile-icons lnr lnr-phone-handset"></i> {`(${data.phone_number.substring(0, 3)})-${data.phone_number.substring(3, 6)}-${data.phone_number.substring(6, 10)}`} </li> : null}
                </ul>

                <br/><br/>

                {isMyProfile ? <div className='btn-container'>
                    <a className="btn btn-secondary" href="/profile/edit" role="button">Edit
                        Profile</a>
                </div> : null}

                {restaurant_btn}
            </div>
        </div>
    </div>
            </>

)

}