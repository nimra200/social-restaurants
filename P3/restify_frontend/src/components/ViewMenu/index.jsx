import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import './style.css'

export default function ViewMenu(){
    const { restaurantid } = useParams()
    const [menu, setMenu] = useState({id: "", menu_name: "", restaurant: "", foods: []})
    
    useEffect(() => {
        fetch(`http://localhost:8000/restaurants/view-menu/${restaurantid}/`, 
        {
            method: "GET"
        })
        .then(res => res.json())
        .then(json => setMenu(json))

    
    }, [restaurantid])
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

    </>)
}