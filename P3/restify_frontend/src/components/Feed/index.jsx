import {useCallback, useEffect, useRef, useState} from "react";
import './style.css'
import LikeButton from "../LikeButton";
import UnlikeButton from "../UnlikeButton";

export default function ViewFeed() {
    const [data, setData] = useState({results: []})
    const [pageNumber, setPageNumber] = useState(1)
    const [loading, setLoading] = useState(true)
    const [hasMore, setHasMore] = useState(false)

    useEffect(() =>  {
        document.title = "My Feed"
    }, [])

    const observer = useRef()

    const lastPostElementRef = useCallback(node => {
        if (loading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                console.log('at bottom')
                setPageNumber(prevPageNumber => prevPageNumber + 1)
            }
        })
        if (node) observer.current.observe(node)
    }, [loading, hasMore])


    useEffect(() => {
        setLoading(true)
        fetch(`http://localhost:8000/accounts/profile/my-feed/?page=${pageNumber}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(json => {
                const new_res = [...new Set([...data.results, ...json.results])]
                const new_data = {results: new_res}
                setData({...data, ...new_data})
                setHasMore(json.next !== null)
                setLoading(false)
            })
    }, [pageNumber])


    const likeBtnClicked = id => {
        fetch(`http://localhost:8000/restaurants/post/${id}/like/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(json => {
                const posts = [...data.results]
                const post = posts.filter(c => c.id === id)[0]
                post.num_likes = json.num_likes
                post.userLiked = json.userLiked
                setData({...data, results: posts})
            })
    }


    const unlikeBtnClicked = id => {
        fetch(`http://localhost:8000/restaurants/post/${id}/unlike/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(json => {
                const posts = [...data.results]
                const post = posts.filter(c => c.id === id)[0]
                post.num_likes = json.num_likes
                post.userLiked = json.userLiked
                setData({...data, results: posts})
            })
    }

    function format_date(created) {
        let d = new Date(parseInt(created.substring(0,4)), parseInt(created.substring(5,7))-1, parseInt(created.substring(8,10)))
        let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
        let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
        let da = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(d);
        return `${mo} ${da}, ${ye}`
    }


    console.log(data)

    return (
        <>
            <div className="jumbotron text-center">
                <h1 className='title'>My Feed</h1>
            </div>

            <div className="container">
                <div className="feed-flex-container">
                    {data.results.map((post, index) => (
                        <div ref={data.results.length === index + 1 ? lastPostElementRef : null} key={post.id} className="row feed-row">
                            <div className="feed-blog_post_container">
                                {post.picture ?
                                    <img className="feed-img"
                                         src={post.picture}/>
                                    : null
                                }
                                <div className="feed-text" style={!post.picture ? {width: '100%'} : null}>
                                    <h3> {post.title} </h3>
                                    <span className="feed-span"> <i className="fa fa-calendar"></i> {format_date(post.created)}</span>
                                    <span className="feed-span"> <i className="fa fa-folder"></i> Vegan</span>
                                    <span className="feed-span"> <i className="fa fa-comment"></i> 2 Comments</span>
                                    <span className="feed-span"> <i className="fa fa-heart"></i> {post.num_likes}
                                        {post.num_likes===1 ? ' Like' : ' Likes'} </span>
                                    <br/><br/>
                                    <p>{post.description}</p>
                                    <br/>

                                    {post.userLiked ? <UnlikeButton unlike_fn={() => unlikeBtnClicked(post.id)}/> :
                                        <LikeButton like_fn={() => likeBtnClicked(post.id)}/>}
                                    <a className="feed-buttons btn btn-link" style={{marginLeft: '100px'}} href="#" role="button">Read More</a>
                                </div>
                            </div>

                        </div>
                    ))}</div>
                </div>

            <div style={{textAlign: "center"}}>{loading && 'Loading...'}</div>


        </>
)

}