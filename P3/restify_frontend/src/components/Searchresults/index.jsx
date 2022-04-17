import React, {useEffect, useState} from "react";
import Searchbar from "../Searchbar";
import './style.css'

const Searchresults = () => {
    const [results, setResults] = useState([])
    const [query, setQuery] = useState({search: '', page: 1})
    const [totalPages, setTotalPages] = useState(1)

    useEffect( () => {
        fetch(`http://localhost:8000/restaurants/search/?search=${query.search}`)
            .then(response => response.json())
            .then(json => {
                setResults(json.data)
            })

    }, [query])

    return (
    <>
    <Searchbar value={query.search}
             update={(value) => setQuery({search: value, page: 1})}/>
                    
            <div class="text">
                {results.map(result => (
                    <div>
                        <div class="row">
                            <div class="column">
                                <h5><u> {result.name} </u></h5>
                                <br></br>
                                <p> {result.phone_number} </p>
                                <br></br>
                                <p> {result.address} </p>
                                <br></br>
                                <p> {result.email} </p>
                            </div>

                            <div class="column">
                                <img src={result.logo} />
                            </div>

                        </div>
                        <hr class="accent" />
                    </div>
                ))}

                 </div>


    </>)
}

export default Searchresults;