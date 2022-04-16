import React, {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import './style.css'

export default function LoginForm() {
    const [details, setDetails] = useState({username: "", password: ""})
    const [errors, setErrors] = useState({})

    let navigate = useNavigate();

    
    const validate = (fields) => {
        const formerrors = {};

        if (!fields.username) {
            formerrors.username = "Username is empty";
        }
        if (!fields.password) {
            formerrors.password = "Password is empty";
        }

        return formerrors;
    }

    const submitHandler = e => {
        e.preventDefault()
        setErrors(validate(details))

        if (Object.keys(errors).length === 0) {
            console.log('form submitted')
            console.log(details)
            fetch('http://localhost:8000/accounts/login/',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(details)
                })
                .then(res => {
                    if (res.ok)
                        return res.json()
                    else
                        console.log('account does not exist')
                })
                .then(data => {
                    if (data) {
                        console.log(data)
                        localStorage.setItem('token', data.access)  // add the access token to local storage
                        //navigate('hello')
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
            <div className="login-flex-container">
                <div className="row login-row">
                    <div className="text">
                        <div className ="column login-column">
                            <h2>Log In</h2>
                            <br />
                            <form onSubmit={submitHandler}>
                                <label>Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={details.username}
                                    onChange={e => setDetails({...details, username: e.target.value})}
                                /><br /><p>{errors.username}</p><br /><br />
                                    <label>Password</label>
                                    <input
                                        type="text"
                                        name="password"
                                        value={details.password}
                                        onChange={e => setDetails({...details, password: e.target.value})}
                                    /><br /><p>{errors.password}</p><br /><br />
                                        <input type="submit" value="Log In"/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
                    </div>
        </>

)

}
