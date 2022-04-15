import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
/* TODO: Add a delete feature */ 
export default function CreateMenu(){
    const [name, setName] = useState("");
    const [food, setFood] = useState([{}]);

    const handleAddRow = (event) => {
        event.preventDefault();
        setFood([...food, {}])
    };
    
    
    const submitHandler = (event) => {
        event.preventDefault();
        const details = {
            menu_name : name, 
            foods: food
        }
        

        fetch("http://localhost:8000/restaurants/create-menu/", 
            {
                method: "POST",  
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`  // get auth key from local storage
                },
                
                body: JSON.stringify(details)
            })
            .then(res => {
                if(res.ok)
                    return res.json()
                else
                    console.log("error: menu not created")
            })
            .then(data => {
                if(data)
                    console.log(data)
            })
    }

    return (<>
        <div style={{color:"white"}} className="jumbotron text-center">
            <h1 style={{marginTop: "5%"}}>Create Your Restaurant's Menu</h1>
            <p><em>Add new menu items. </em></p>
        </div>

        <div  style={{backgroundColor: "white", padding: "2%"}} className="container" >
            <form onSubmit={submitHandler}>
                <div style={{padding: "2%" , textAlign: "center"}}>
                    <label>Enter Menu Name: 
                    <input type="text" name="name" value={name} 
                        onChange={e => setName(e.target.value)}/>
                    </label>
                </div>
                
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
                                    <button onClick={(event) => {
                                                    event.preventDefault();
                                                    const updated_food = [...food];
                                                    updated_food.splice(index, 1);
                                                    setFood(updated_food);
            
                                                }}>Remove</button>
                                </td> 
                            </tr>
                        ))}
                    </tbody>
                    <button onClick={handleAddRow}>Add Menu Item</button>
                </table>
                
               
                
                <div style={{textAlign: "center", padding: "2%"}}>
                <input type="submit" className="text-center btn btn-dark" style={{width:"10%"}} value="Submit!"/>
                </div>
                
            </form>
        </div>
        
    </>)
}