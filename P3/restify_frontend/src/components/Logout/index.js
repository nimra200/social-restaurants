import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

export default function Logout() {
    let navigate = useNavigate()
    localStorage.clear()
    useEffect(() => {
        navigate('/login')
    }, [])
}