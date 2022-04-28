import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

export default function EditRestaurant() {
    const [data, setData] = useState({name: '', phone_number: '', address: '', postal_code: '', email: ''})
    const [logo, setLogo] = useState(null)
    const [errors, setErrors] = useState([])

    let navigate = useNavigate()

    useEffect(() => {
        document.body.className="form-body-class"

        fetch('http://localhost:8000/restaurants/my-restaurant/edit/', {
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

    function clean_phone_num(pnum) {
        return pnum.replace(/\D/g, "")  // remove all non-digits
    }

    useEffect(() => {
        let err = []
        const pnum = clean_phone_num(data.phone_number)
        if (!data.name || !data.phone_number || !data.address || !data.postal_code || !data.email || !logo) {
            err.push('All fields are required')
        }
        if (pnum && pnum.length !== 10) {
            err.push("Invalid phone number. Must be 10 digits long")
        }
        if(data.postal_code.length != 6) {
            err.push('Postal Code must be 6 characters long')
        }

        const re = new RegExp("^[A-Za-z0-9!#$%&'*+-/=?^_`{|}~]+@[A-Za-z0-9-]*\.?[A-Za-z.]+$")
        const re2 = new RegExp('^.*\\.\\..*$')
        if (!re.test(data.email) || re2.test(data.email)) {
            err.push("Invalid email address.")
        }
        setErrors(err)
    }, [data, logo]) // check for errors when data changes


    function submit_handler(e) {
        e.preventDefault()
        const fd = new FormData()
        fd.append('name', data.name)
        fd.append('email', data.email)
        fd.append('phone_number', clean_phone_num(data.phone_number))
        fd.append('address', data.address)
        fd.append('postal_code', data.postal_code)
        fd.append('logo', logo, logo.name)

        fetch('http://localhost:8000/restaurants/my-restaurant/edit/', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: fd
        })
            .then(res => {
                if(res.ok) {
                    return res.json()
                }
                else console.log('there was an error in input')
            })
            .then(json => {
                if(json) {
                    navigate('/restaurants/my-restaurant')
                }
            })

    }


    return (
        <>
            <div className="jumbotron text-center">
                <h1 className="title">Edit Restaurant</h1>
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
                            <label htmlFor="Rname">Restaurant Name:</label>
                            <input type="text" id="Rname" name="Rname" className="form-control" value={data.name}
                                onChange={e => setData({...data, name: e.target.value})}/>
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
                                <label htmlFor="addr">Address:</label>
                                <input type="text" id="addr" name="addr" className="form-control" value={data.address}
                                    onChange={e => setData({...data, address: e.target.value})}/>
                            </div>
                            <div className="col">
                                <label htmlFor="pcode">Postal Code:</label>
                                <input type="text" id="pcode" name="pcode" className="form-control" value={data.postal_code}
                                    onChange={e => setData({...data, postal_code: e.target.value})}/>
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
                                    <label htmlFor="logo">Upload Logo:</label>
                                    <input type="file" id="logo" name="logo" accept="image/gif, image/jpeg, image/png"
                                           className="form-control" onChange={e => setLogo(e.target.files[0])}/>
                                </div>
                            </div>
                            <br/><br/>

                                <input type="submit" value="Submit" disabled={errors.length !== 0} style={{display:'block', margin: 'auto'}}/>

                </div>
            </form>

        </>
    )
}