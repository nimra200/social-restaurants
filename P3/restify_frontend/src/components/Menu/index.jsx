import { useState } from "react";
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
        <div style={{backgroundColor : "white", margin : "5%"}}>
            <form onSubmit={submitHandler}>
                <label>Enter Menu Name</label>
                <input type="text" name="name" value={name} 
                onChange={e => setName(e.target.value)}/>
                
                <table>
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
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={handleAddRow}>Add Menu Item</button>
                <br></br><br></br>
                <input type="submit" className="text-center btn btn-dark" style={{width:"10%"}} value="Submit!"/>
            </form>
        </div>
        
    </>)
}