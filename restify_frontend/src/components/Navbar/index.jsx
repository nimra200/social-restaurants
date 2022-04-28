import {Outlet} from 'react-router-dom'
import {Nav, NavDropdown} from 'react-bootstrap'
import {useEffect, useState} from "react";
import NavbarNotification from "../NavbarNotification";


export default function Navbar() {
    const [data, setData] = useState({results: []})
    const [notificationOpen, setNotificationOpen] = useState(false)
    const [pageNumber, setPageNumber] = useState(1)
    const [hasMore, setHasMore] = useState(false)
    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        if(localStorage.getItem('token')) setLoggedIn(true)
        else setLoggedIn(false)
    }, [])

    useEffect(() => {
        if(localStorage.getItem('token')) {
            fetch(`http://localhost:8000/accounts/profile/notifications/?page=${pageNumber}`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(res => res.json())
                .then(json => {
                    const new_res = [...new Set([...data.results, ...json.results])]
                    const new_data = {results: new_res}
                    setData({...data, ...new_data})
                    setHasMore(json.next !== null)
                })
        }
    }, [pageNumber])



    return (
        <>
        <nav className="navbar navbar-expand navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="/home">Restify</a>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="/home">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/profile/my-feed">Feed</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/restaurants/my-restaurant">My Restaurant</a>
                        </li>

                            <NavDropdown show={notificationOpen} onClick={() => setNotificationOpen(true)}
                                         onToggle={() => setNotificationOpen(!notificationOpen)} title="Notifications">
                                {data.results.map((notification, index) => {
                                    return <NavbarNotification key={index} notification={notification}/>
                                })}
                                {hasMore ? <><NavDropdown.Divider/><NavDropdown.Item
                                    onClick={() => setPageNumber(pageNumber + 1)}>See More</NavDropdown.Item></> : null}

                            </NavDropdown>

                    </ul>


                    <ul className="navbar-nav ms-auto">

                        {loggedIn ? <NavDropdown title="My Profile">
                            <NavDropdown.Item href='/profile/view'>View Profile</NavDropdown.Item>
                            <NavDropdown.Item href='/profile/edit'>Edit Profile</NavDropdown.Item>
                            <NavDropdown.Item href='/logout'>Log Out</NavDropdown.Item>
                        </NavDropdown> :
                            <li className="nav-item"><a className="nav-link btn btn-success" style={{color: 'white'}}
                                    href="/login">Login</a></li>}

                    </ul>
                </div>
            </div>
        </nav>

        <Outlet />
    </>

    )
}