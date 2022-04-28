import React, {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import './style.css'

export default function LoginForm() {
    const [details, setDetails] = useState({username: "", password: ""})
    const [error, setError] = useState("")

    let navigate = useNavigate();
    
    const submitHandler = e => {
        e.preventDefault()
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
                else {
                    console.log('account does not exist')
                    setError('Invalid username/password combination')
                }

            })
            .then(data => {
                if (data) {
                    console.log(data)
                    localStorage.setItem('token', data.access)  // add the access token to local storage
                    navigate('/profile/view')
                    window.location.reload()
                }
            })
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
                            <div style={{textAlign: 'center', color: 'red'}}>{error}</div>

                            <br />
                            <form onSubmit={submitHandler}>
                                <label>Username</label>
                                <input style={{margin:'5px'}}
                                    type="text"
                                    name="username"
                                    value={details.username}
                                    onChange={e => setDetails({...details, username: e.target.value})}
                                /><br /><br />
                                    <label>Password</label>
                                    <input style={{margin: '5px'}}
                                        type="password"
                                        name="password"
                                        value={details.password}
                                        onChange={e => setDetails({...details, password: e.target.value})}
                                    /><br /><br />
                                        <input type="submit" value="Log In"/>
                            </form>
                            <br/>
                            <a style={{color: '#0d6efd', textDecoration: 'underline'}} href='/signup'>Don't have an account? Sign up here</a>
                        </div>
                    </div>
                </div>
            </div>
                    </div>
        </>

)

}