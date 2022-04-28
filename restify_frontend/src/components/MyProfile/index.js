import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export default function MyProfile() {
    let navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8000/accounts/profile/view/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`  // get auth key from local storage
            }
        })
            .then(res => res.json())
            .then(json => navigate(`/profile/${json.id}/view`))
    }, [])
}
