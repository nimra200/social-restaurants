import React, {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import './style.css'


export default function Signup() {
    const [details, setDetails] = useState({username: "", password: "", password2: "", email: ""})
    const [sub, setSub] = useState(false)

    const [errors, setErrors] = useState({})

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
        fetch('http://localhost:8000/accounts/register/',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(details)
            }).then(res => {
                if (res.ok){
                    setSub(true)
                    return res.json()
                }
                else
                    console.log('Account with same username or email already exists')
            })

            }
            else {
        	console.log('Please fix form errors')
        }

    }

    return (
        <>
        <div className="container">
            <div className="flex-container">
                <div className="row">
                    <div className="text">
                        <div className ="column">
                            <h2>Sign Up</h2>
                            <br />
                            <form onSubmit={submitHandler}>
                                <label>Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={details.username}
                                    onChange={e => setDetails({...details, username: e.target.value})}
                                /><br /><p>{errors.username}</p><br />
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={details.password}
                                        onChange={e => setDetails({...details, password: e.target.value})}
                                    /><br /><p>{errors.password}</p><br />
                                    <label>Repeat Password</label>
                                    <input
                                        type="password"
                                        name="password2"
                                        value={details.password2}
                                        onChange={e => setDetails({...details, password2: e.target.value})}
                                    /><br /><p>{errors.password2}</p><br />
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={details.email}
                                        onChange={e => setDetails({...details, email: e.target.value})}
                                    /><br /><p>{errors.email}</p><br />
                                        <input type="submit" value="Sign Up"/>
                                        <br />
                                        {Object.keys(errors).length === 0 && sub === true ? (<p>User signed up successfully</p>) :
                                        (<p>Please fill in the fields above</p>)}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>

    )

}
