import './style.css'
import {useEffect, useState} from "react";

export default function ViewProfile() {

    const [data, setData] = useState({username: '', first_name: '', last_name: '', email: '', phone_number: '',
                                                    profile_picture: ''})

    useEffect(() => {
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


    <div className="container">
        <div>
            <div>
                <img className="pfp" src={data.profile_picture}/>
            </div>

            <div className='text'>
                <h1> {data.first_name + ' ' + data.last_name} </h1>
                <h3> {data.username} </h3>
                <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.

                </p><br/>

                <ul className="ul-class">
                    <li className="li-class"> <a className="item" href={`mailto: ${data.email}`}><i class="lnr lnr-envelope"></i> {data.email}</a> </li>
                    <li className="li-class"> <i class="lnr lnr-phone-handset"></i> {`(${data.phone_number.substring(0, 3)})-
                            ${data.phone_number.substring(3, 6)}-${data.phone_number.substring(6, 10)}`} </li>
                </ul>

                <br/><br/>

                    <div className='btn-container'>
                        <a className="btn btn-secondary" href="edit_profile.html" role="button">Edit
                            Profile</a>
                    </div>
            </div>
        </div>
    </div>
            </>

)

}