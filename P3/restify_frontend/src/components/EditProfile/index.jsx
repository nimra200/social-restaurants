import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import "./style.css"

export default function EditProfile() {
    const [data, setData] = useState({first_name: "", last_name: "", email: "", phone_number: ""})
    const [avatar, setAvatar] = useState(null)
    const [errors, setErrors] = useState([])

    let navigate = useNavigate();

    useEffect(() => {
        document.body.className="form-body-class"

        fetch('http://localhost:8000/accounts/profile/edit/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`  // get auth key from local storage
            }
        })
            .then(res => res.json())
            .then(json => setData(json))

        return () => {
            document.body.className=""      // remove classname when leaving page
        }
    }, [])

    useEffect(() => {
        let err = []
        const pnum = clean_phone_num(data.phone_number)
        if (pnum && pnum.length !== 10) {
            err.push("Invalid phone number. Must be 10 digits long")
        }

        const re = new RegExp("^[A-Za-z0-9!#$%&'*+-/=?^_`{|}~]+@[A-Za-z0-9-]*\.?[A-Za-z.]+$")
        const re2 = new RegExp('^.*\\.\\..*$')
        if (!re.test(data.email) || re2.test(data.email)) {
            err.push("Invalid email address.")
        }
        setErrors(err)
    }, [data]) // check for errors when data changes


    function clean_phone_num(pnum) {
        return pnum.replace(/\D/g, "")  // remove all non-digits
    }


    const submit_handler = e => {
        e.preventDefault()

        const fd = new FormData()
        fd.append('first_name', data.first_name)
        fd.append('last_name', data.last_name)
        fd.append('email', data.email)
        fd.append('phone_number', clean_phone_num(data.phone_number))
        if (avatar) {
            fd.append('profile_picture', avatar, avatar.name)
        }
        fetch('http://localhost:8000/accounts/profile/edit/', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: fd
        })
            .then(res => {
                if (res.ok)
                    return res.json()
                else
                    console.log('there was an error in input')
            })
            .then(json => {
                if (json) {
                    console.log(json)
                    navigate('/profile/view')
                }
            })

    }

    return (
        <>
            <div className="jumbotron text-center">
                <h1 className="title">Edit Profile</h1>
            </div>

            <div style={{textAlign: "center", color: "red"}}>
                <ul style={{display: "inline-table"}}>
                    {errors.map((err, index) => <li key={index}>{err}</li>)}
                </ul>
            </div>

            <form encType="multipart/form-data" onSubmit={submit_handler}>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <label htmlFor="first_name">First Name:</label>
                            <input type="text" id="first_name" name="first_name" className="form-control" value={data.first_name}
                                   onChange={e => setData({...data, first_name: e.target.value})}/>
                        </div>
                        <div className="col">
                            <label htmlFor="last_name">Last Name:</label>
                            <input type="text" id="last_name" name="last_name" className="form-control" value={data.last_name}
                                   onChange={e => setData({...data, last_name: e.target.value})}/>
                        </div>
                    </div>
                    <br/><br/>
                        <div className="row">
                            <div className="col">
                                <label htmlFor="email">Email Address:</label>
                                <input type="email" id="email" name="email" className="form-control" value={data.email}
                                       onChange={e => setData({...data, email: e.target.value})}/>
                            </div>
                            <div className="col">
                                <label htmlFor="pnum">Phone Number:</label>
                                <input type="text" id="pnum" name="pnum" className="form-control" value={data.phone_number}
                                       onChange={e => setData({...data, phone_number: e.target.value})}/>
                            </div>
                        </div>
                        <br/><br/>
                            <div className="row">
                                <div className="col">
                                    <label htmlFor="avatar">Upload Avatar:</label>
                                    <input type="file" id="avatar" name="avatar"
                                           accept="image/gif, image/jpeg, image/png" className="form-control"
                                           onChange={e => setAvatar(e.target.files[0])}/>
                                </div>
                            </div>
                        <br/><br/>

                                <input type="submit" value="Submit" style={{ display: "block", margin: "auto"}}/>

                </div>
            </form>


        </>
    )


}