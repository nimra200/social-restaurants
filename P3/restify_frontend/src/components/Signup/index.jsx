import React, {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';

export default function Signup() {
    const [details, setDetails] = useState({username: "", password: "", password2: "", email: ""})
    const [errors, setErrors] = useState({})
    const [usernameTaken, setUsernameTaken] = useState('')

    let navigate = useNavigate()

    const validate = (fields) => {
        const formerrors = {};
        const emailreg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;

        if (!fields.username) {
            formerrors.username = "Username is empty";
        }
        if (!fields.password) {
            formerrors.password = "Password is empty";
        }

        else if (fields.password.length < 8) {
            formerrors.password = "Password is too short, must be 8 characters or more";
        }

        if (fields.password !== fields.password2) {
            formerrors.password2 = "Passwords do not match";
        }

        if (!fields.email) {
            formerrors.email = "Email is empty";
        }
        else if (!emailreg.test(fields.email)) {
            formerrors.email = "Email is invalid";
        }
        return formerrors;
    }


    const submitHandler = (e) => {
        e.preventDefault()
        setErrors(validate(details))
        if (Object.keys(errors).length === 0) {
            const fd = new FormData()
            fd.append('username', details.username)
            fd.append('email', details.email)
            fd.append('password', details.password)
            fd.append('password2', details.password2)
            fetch('http://localhost:8000/accounts/register/',
                {
                    method: 'POST',
                    body: fd
                }).then(res => {
                if (res.ok){
                    navigate('/login')
                    return res.json()
                }
                else {
                    console.log('Account with same username or email already exists')
                    setUsernameTaken('Account with same username or email already exists')
                    return res.json()
                }

            })
        }
        else {
            console.log('Please fix form errors')
        }

    }

    return (
        <>
            <br/><br/><br/><br/>
            <div className="container">
                <div className="flex-container">
                    <div className="row" style={{backgroundColor: 'white', padding: '10px'}}>
                        <div className="text">
                            <div className ="column">
                                <h2>Sign Up</h2>
                                <div style={{textAlign: 'center', color: 'red'}}>{usernameTaken}</div>
                                <br />
                                <form onSubmit={submitHandler}>
                                    <label>Username</label><br/>
                                    <input
                                        type="text"
                                        name="username"
                                        value={details.username}
                                        onChange={e => setDetails({...details, username: e.target.value})}
                                    /><br /><p>{errors.username}</p><br />
                                    <label>Password</label><br/>
                                    <input
                                        type="password"
                                        name="password"
                                        value={details.password}
                                        onChange={e => setDetails({...details, password: e.target.value})}
                                    /><br /><p>{errors.password}</p><br />
                                    <label>Repeat Password</label><br/>
                                    <input
                                        type="password"
                                        name="password2"
                                        value={details.password2}
                                        onChange={e => setDetails({...details, password2: e.target.value})}
                                    /><br /><p>{errors.password2}</p><br />
                                    <label>Email</label><br/>
                                    <input
                                        type="email"
                                        name="email"
                                        value={details.email}
                                        onChange={e => setDetails({...details, email: e.target.value})}
                                    /><br /><p>{errors.email}</p><br />
                                    <input type="submit" value="Sign Up"/>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )

}
