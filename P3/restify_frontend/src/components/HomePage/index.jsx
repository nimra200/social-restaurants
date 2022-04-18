import {useCallback, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";

export default function HomePage() {
    const [query, setQuery] = useState('')
    const [data, setData] = useState({results: []})
    const [pageNumber, setPageNumber] = useState(1)
    const [hasMore, setHasMore] = useState(false)


    let navigate = useNavigate()
    const observer = useRef()


    useEffect(() => {
        document.title = 'Home'
    }, [])

    const lastPostElementRef = useCallback(node => {
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                console.log('at bottom')
                setPageNumber(prevPageNumber => prevPageNumber + 1)
            }
        })
        if (node) observer.current.observe(node)
    }, [hasMore])


    useEffect(() => {
        fetch(`http://localhost:8000/restaurants/search/?search=${query}&page=${pageNumber}`, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(json => {
                let new_res = [...new Set([...data.results, ...json.results])]
                new_res = [...new Map(new_res.map(item => [item.id, item])).values()]
                console.log('data', data)
                console.log('new_res', new_res)
                setData({...data, results: new_res})
                setHasMore(json.next !== null)
            })
    }, [query, pageNumber])


    function handle_search(e) {
        setQuery(e.target.value)
        setPageNumber(1)
        setData({results: []})
    }

    return (
        <>
        <div className="jumbotron text-center">
            <h1 className='title'>Restify</h1>
        </div>

            <div style={{textAlign: 'center'}}>
                <input type="text" style={{borderRadius: '15px', width: '30%', height: '50px', padding: '10px'}}
                    value={query} onChange={handle_search}/>
            </div>


            <div className="album py-5">
                <div className="container">
                    <div className="row">

                        {data.results.map((restaurant, index) => (
                            <div ref={data.results.length === index + 1 ? lastPostElementRef : null} key={restaurant.id} className="col-md-4">
                                <div className="card mb-4 box-shadow" style={{cursor: "pointer"}} onClick={() => navigate(`/restaurants/${restaurant.id}`)}>
                                    <img className="card-img-top" style={{height: '300px', objectFit: 'cover'}} src={restaurant.logo}/>
                                    <div className="card-body">
                                        {restaurant.name}
                                    </div>
                                </div>
                            </div>
                        ))}


                </div>
            </div>
        </div>
        </>
    )
}

// used: https://getbootstrap.com/docs/4.0/examples/