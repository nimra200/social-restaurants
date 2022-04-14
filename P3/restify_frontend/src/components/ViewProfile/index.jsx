import './style.css'
import {useEffect, useState} from "react";

export default function ViewProfile() {

    const [data, setData] = useState({username: '', first_name: '', last_name: '', email: '', phone_number: '',
                                                    profile_picture: ''})

    useEffect(() => {
        document.title = "My Profile"
        fetch('http://localhost:8000/accounts/profile/view/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`  // get auth key from local storage
            }
        })
            .then(res => res.json())
            .then(json => setData(json))
    }, [])


    return (
        <>
        <div className="jumbotron text-center">
            <h1 className='title'>My Profile</h1>
        </div>



    <div className="container profile-container">
        <div>
            <div>
                {data.profile_picture ? <img className="pfp" src={data.profile_picture}/> : null}
            </div>

            <div className='text'>
                <h1> {data.first_name + ' ' + data.last_name} </h1>
                <h3> {data.username} </h3>
                <p className="profile-bio"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.

                </p><br/>

                <ul className="ul-class">
                    <li className="li-class"> <a className="item" href={`mailto: ${data.email}`}>
                        <i className="profile-icons lnr lnr-envelope"></i> {data.email}</a> </li>
                    {data.phone_number ? <li className="li-class"> <i className="profile-icons lnr lnr-phone-handset"></i> {`(${data.phone_number.substring(0, 3)})-
                            ${data.phone_number.substring(3, 6)}-${data.phone_number.substring(6, 10)}`} </li> : null}
                </ul>

                <br/><br/>

                    <div className='btn-container'>
                        <a className="btn btn-secondary" href="/profile/edit" role="button">Edit
                            Profile</a>
                    </div>
            </div>
        </div>
    </div>
            </>

)

}