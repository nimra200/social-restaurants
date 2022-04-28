import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

export default function AddImage() {
    const [image, setImage] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        document.body.className="form-body-class"
        return () => {
            document.body.className=""      // remove classname when leaving page
        }
    }, [])

    function submit_handler(e) {
        e.preventDefault()
        const fd = new FormData()
        fd.append('img', image, image.name)

        fetch('http://localhost:8000/restaurants/my-restaurant/add-image/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: fd
        })
            .then(res => {
                if(res.ok) navigate('/restaurants/my-restaurant')
                return res.json()
            })
    }

    return (
        <>
            <div className="jumbotron text-center">
                <h1 className="title">Add Image</h1>
            </div>

            <form encType="multipart/form-data" onSubmit={submit_handler}>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <label htmlFor="image">Image:</label>
                            <input type="file" id="image" name="image" accept="image/gif, image/jpeg, image/png"
                                   className="form-control" onChange={e => setImage(e.target.files[0])}/>
                        </div>
                    </div>
                    <br/><br/>
                    <input type="submit" value="Submit" style={{display:'block', margin: 'auto'}}/>
                </div>
            </form>
        </>
    )
}