import {Outlet} from 'react-router-dom'
import {Nav, NavDropdown} from 'react-bootstrap'

export default function Navbar() {
    return (
        <>
        <nav className="navbar navbar-expand navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="home.html">Restify</a>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="home.html">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="feed.html">Feed</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="my-restaurant.html">My Restaurant</a>
                        </li>

                        <NavDropdown title="Notifications">
                            <NavDropdown.Item href="#">Temp</NavDropdown.Item>
                            <NavDropdown.Item href="#">Temp</NavDropdown.Item>
                        </NavDropdown>

                    </ul>


                    <ul className="navbar-nav ms-auto">

                       <NavDropdown title="My Profile">
                           <NavDropdown.Item href='#'>View Profile</NavDropdown.Item>
                           <NavDropdown.Item href='#'>Edit Profile</NavDropdown.Item>
                           <NavDropdown.Item href='#'>Log Out</NavDropdown.Item>
                       </NavDropdown>
                    </ul>
                </div>
            </div>
        </nav>

        <Outlet />
    </>

    )
}