import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { useNavigate } from "react-router-dom";

export default function CreatePost(){
    const [inputs, setInputs] = useState({});

    let navigate = useNavigate();

    const submitHandler = (event) => {
        event.preventDefault();
        var formData = new FormData();
        formData.append("title", inputs.title);
        formData.append("description", inputs.description);
        formData.append("picture", inputs.picture);
        formData.append("topic", inputs.topic);

        fetch('http://localhost:8000/restaurants/create-blog-post/',
            {
                method: 'POST',
                headers: {
                    
                    'Authorization': `Bearer ${localStorage.getItem('token')}`  // get auth key from local storage
                },
                body: formData
            })
            .then(res => {
                if (res.ok)
                    return res.json()
            })
            .then(data => {
                if (data) {
                    navigate(`/${data.restaurant_id}/posts/view`)
                }
            })
    }
   
        

    return (<>
       
       <div style={{color:"white"}} className="jumbotron text-center">
            <h1 style={{marginTop: "5%"}}>Create a New Post</h1>
            <p><em>Engage with your audience by making a blog post. </em></p>
        </div>
        
        <form onSubmit={submitHandler} encType="multipart/form-data">
            <div style={{padding: "2%", backgroundColor : "white"}} className="container">
                <div className="row">
                    
                        <label for="title">Blog Title:
                            <input required type="text" name="title" value={inputs.title} 
                            className="form-control" size="40"
                            onChange={e => setInputs({...inputs, title: e.target.value})}
                            />
                        </label>
                        
                </div>        
                <div className="row" style={{paddingTop: "2%"}}>
                    <label for="file">Attach media to blog post
                        <input required type="file" name="file" className="form-control"
                        onChange={e => setInputs({...inputs, picture: e.target.files[0]})}/>
                    </label> 
                </div>        

            
                        <div className="row" style={{paddingTop: "2%"}}>
                            <label for="topic" style={{alignItems: "center"}} >Topic:
                                <input required type="text" name="topic" className="form-control" 
                                value={inputs.topic}
                                onChange={e => setInputs({...inputs, topic: e.target.value})}/><br></br>
                            </label>
                        </div>
                        
                    
                    <div className="row">
                        
                            <label for="description">Blog entry:
                                <textarea name="description" rows="4" className="form-control"
                                    value={inputs.description} 
                                    onChange={e => setInputs({...inputs, description: e.target.value})}>
                                </textarea>                            
                            </label><br></br><br></br>
                            
                            
                        
                    </div>
                    
                    <div style={{padding: "2%", textAlign : "center"}}>
                    <input type="submit" className="text-center btn btn-dark"  value="Publish!"/>
                    </div>
            </div>
        
        </form>
    </>)

}