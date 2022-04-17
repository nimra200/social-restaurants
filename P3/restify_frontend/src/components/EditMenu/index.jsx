import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function EditMenu(){
    const { restaurantid } = useParams()
    const [menu, setMenu] =  useState({id: "", menu_name: "", restaurant: "", foods: []})
    const [food, setFood] = useState([{}])
    let navigate = useNavigate();
    
    useEffect(() => {
        fetch(`http://localhost:8000/restaurants/view-menu/${restaurantid}/`, 
        {
            method: "GET"
        })
        .then(res => res.json())
        .then(json => setMenu(json))

    
    }, [restaurantid])

    const handleAddRow = (event) => {
        event.preventDefault();
        setFood([...food, {}])
    };

    const submitHandler = (event) => {
        event.preventDefault();
        fetch(`http://localhost:8000/restaurants/delete-menu/${restaurantid}/`, 
            {
                method: "DELETE",  
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`  // get auth key from local storage
                }
            })
            .then(res => {
                if(res.ok){
                    fetch("http://localhost:8000/restaurants/create-menu/", 
                    {
                        method: "POST",  
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`  // get auth key from local storage
                        },
                        body: JSON.stringify(
                            {
                                menu_name : menu.menu_name, 
                                foods: [...menu.foods, ...food]
                            })
                        })
                    .then(res => {
                        if(res.ok)
                            navigate(`/restaurants/${restaurantid}/menu/view`)
                    })
                }
                else
                    console.log("error: menu not deleted")

            
        })
            
    }
    
    return (<>
        <h1 style={{color:"white"}}>Edit your menu</h1>

        <div  style={{backgroundColor: "white", padding: "2%"}} className="container" >
            <form onSubmit={submitHandler}>
                <div style={{padding: "2%" , textAlign: "center"}}>
                    <label>Menu Name: 
                    <input type="text" name="name" defaultValue={menu.menu_name} 
                        onChange={e => setMenu({...menu, menu_name: e.target.value})}/>
                    </label>
                </div>
                
                <h2>Existing Food Items</h2>
                <table style={{marginLeft: "auto", marginRight : "auto"}}>
                
                    <thead>
                        <tr>
                            <th>Food Name</th>
                            <th>Description</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        {menu.foods.map((item, index) => (
                            
                            <tr key={index}>
                                
                                <td>{menu.foods[index].name}</td>
                                <td>{menu.foods[index].description}</td>
                                <td>{menu.foods[index].price}</td>
                                <td>
                                    <button style={{width: "100%"}} onClick={(event) => {
                                                    event.preventDefault();
                                                    const updated_food = [...menu.foods];
                                                    updated_food.splice(index, 1);
                                                    setMenu({...menu, foods: updated_food});
                                                }}>Remove</button>
                                </td> 
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                <h2>Add new item to the menu</h2>
                <table style={{marginLeft: "auto", marginRight : "auto"}}>
                
                    <thead>
                        <tr>
                            <th>Food Name</th>
                            <th>Description</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        {food.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <input required type="text" name="name" value={food[index].name}
                                            onChange={event => 
                                                    {const { name, value } = event.target;
                                                    //console.log(name, value)
                                                    const new_food = [...food]
                                                    new_food[index].name = value;
                                                    setFood(new_food);}}/>
                                    
                                </td>
                                <td>
                                    <input required type="text" name="description" value={food[index].description}
                                            onChange={event => 
                                                {const { name, value } = event.target;
                                                const new_food = [...food]
                                                new_food[index].description = value;
                                                setFood(new_food);}}/>
                                    
                                </td>
                                <td>
                                    <input required type="text" name="price" value={food[index].price}
                                            onChange={ event => 
                                                {const { name, value } = event.target;
                                                const new_food = [...food]
                                                new_food[index].price = value;
                                                setFood(new_food);}}/>
                                    
                                </td>
                                <td>
                                    <button style={{width: "100%"}} onClick={(event) => {
                                                    event.preventDefault();
                                                    const new_food = [...food];
                                                    new_food.splice(index, 1);
                                                    setFood(new_food);
                                                }}>Remove</button>
                                </td> 
                                
                            </tr>
                            
                        ))}
                       
                    </tbody>
                    
                </table>
                <button onClick={handleAddRow}>Add Item</button>
               
                
                <div style={{textAlign: "center", padding: "2%"}}>
                <input type="submit" className="text-center btn btn-dark" style={{width:"10%"}} value="Submit!"/>
                </div>
                
            </form>
        </div>


    </>)
} 