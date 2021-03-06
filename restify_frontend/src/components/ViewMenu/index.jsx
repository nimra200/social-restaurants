import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import './style.css'

export default function ViewMenu(){
    const { restaurantid } = useParams()
    const [menu, setMenu] = useState({id: "", menu_name: "", restaurant: "", foods: []})
    const [restaurant, setRestaurant] = useState({})
    const [userData, setUserData] = useState({})
    const [loggedIn, setLoggedIn] = useState(false)
    const [noMenu, setNoMenu] = useState(false)

    let navigate = useNavigate()

    useEffect(() => {
        if(localStorage.getItem('token')) setLoggedIn(true)
        else setLoggedIn(false)
    }, [])

    useEffect(() => {
        if(loggedIn) {
            fetch('http://localhost:8000/accounts/profile/view/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(res => res.json())
                .then(json => setUserData(json))
        }
    }, [loggedIn])
    
    useEffect(() => {

        fetch(`http://localhost:8000/restaurants/view-menu/${restaurantid}/`,
            {method: "GET"})
            .then(res => {
                if(!res.ok) setNoMenu(true)
                return res.json()
            })
            .then(json => {
                if (json.menu_name)
                    setMenu(json)
                else {
                    if(userData.restaurant === parseInt(restaurantid))    // user owns the restaurant
                        navigate("/restaurants/my-restaurant/create-menu")
                }
            })

        fetch(`http://localhost:8000/restaurants/${restaurantid}/view/`,
            {method:"GET"})
            .then(res => res.json())
            .then(json => setRestaurant(json))

    }, [userData])

    if(noMenu) {
        if (userData.restaurant === parseInt(restaurantid)) {
            navigate("/restaurants/my-restaurant/create-menu")
            return
        }
        return (
            <div style={{backgroundColor: "blue", color:"white"}} className="jumbotron text-center">
                <h1 style={{marginTop: "5%"}}>User has no menu!</h1>
            </div>
        )
    }


    return (<>
        <div style={{backgroundColor: "blue", color:"white"}} className="jumbotron text-center">
            <h1 style={{marginTop: "5%"}}>Menu for {menu.restaurant}</h1>
            <p><em>See the latest menu items. </em></p>
        </div>

        <div style={{padding: "2%", border: "black", background:"light grey"}}>
            <h2 style={{padding: "2%", textAlign: "center", color: "white"}}>{menu.menu_name}</h2>
            <div style={{backgroundColor: "white", padding: "2%"}} className="container" >
                <table style={{marginLeft: "auto", marginRight : "auto"}}>
                    <thead >
                    <tr >
                        <td>Food Name</td>
                        <td>Description</td>
                        <td>Price</td>
                    </tr>
                    </thead>
                    <tbody>

                    {menu.foods.map((food, index) => (
                        <tr key={index}>
                            <td>{food.name}</td>
                            <td>{food.description}</td>
                            <td>${food.price}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
        <h3 style={{textAlign: "center", color:"white"}}>Come dine with us!</h3>
        
        {userData.id === restaurant.owner_id ?
            <>
            <div style={{padding: "2%",textAlign:"center"}}>
                <a style={{margin: "auto", backgroundColor: "blue", color: "white", padding: "1%"}} role="button" href={`/restaurants/${restaurantid}/menu/edit`}>Edit Menu</a>    
            </div>
            </>
            : null}
                        
    </>)
}