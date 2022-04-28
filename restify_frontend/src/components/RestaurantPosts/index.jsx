import {useState, handle, useEffect, useRef, useCallback} from "react";
import { useParams } from "react-router-dom";
import LikeButton from "../LikeButton";
import UnlikeButton from "../UnlikeButton";

export default function RestaurantPosts(){
    const [posts, setPosts] = useState({results: []});
    const [name, setName] = useState("");
    const [loggedIn, setLoggedIn] = useState(false)
    const [pageNumber, setPageNumber] = useState(1)
    const [hasMore, setHasMore] = useState(false)
    const [userData, setUserData] = useState({})
    const { restaurantid } = useParams()

    const observer = useRef()


    useEffect(() => {
        document.title = "Restaurant Posts"
        if(localStorage.getItem('token')) setLoggedIn(true)
        else setLoggedIn(false)
    }, [])

    useEffect(() => {
        if(loggedIn) {
            fetch('http://localhost:8000/accounts/profile/view/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(res => res.json())
                .then(json => {
                    setUserData(json)
                })
        }
    }, [loggedIn])

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


    const likeBtnClicked = id => {
        fetch(`http://localhost:8000/restaurants/post/${id}/like/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(json => {
                const data = [...posts.results]
                const post = data.filter(c => c.id === id)[0]
                post.num_likes = json.num_likes
                post.userLiked = json.userLiked
                setPosts({...posts, results: data})
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
                const data = [...posts.results]
                const post = data.filter(c => c.id === id)[0]
                post.num_likes = json.num_likes
                post.userLiked = json.userLiked
                setPosts({...posts, results: data})
            })
    }

    function format_date(created) {
        let d = new Date(parseInt(created.substring(0,4)), parseInt(created.substring(5,7))-1, parseInt(created.substring(8,10)))
        let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
        let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
        let da = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(d);
        return `${mo} ${da}, ${ye}`
    }

    useEffect(() =>  {
        fetch(`http://localhost:8000/restaurants/${restaurantid}/view/`,
            {
                method: "GET"
            })
            .then(res => res.json())
            .then(json => {
                var restaurantOwner = json["id"];
                setName(json["name"]);
                return fetch(`http://localhost:8000/restaurants/${restaurantOwner}/posts/?page=${pageNumber}`,
                    {
                        method: "GET",
                        headers: loggedIn ? {'Authorization': `Bearer ${localStorage.getItem('token')}`} : {}
                    })
            })
            .then(res => res.json())
            .then(json => {
                const new_res = [...new Set([...posts.results, ...json.results])]
                const new_data = {results: new_res}
                setPosts({...posts, ...new_data})
                setHasMore(json.next !== null)
            })
    }, [restaurantid, loggedIn, pageNumber])

    console.log(userData)

    function delete_btn_clicked(e, post) {
        fetch(`http://localhost:8000/restaurants/${post.id}/delete-post/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(json => {
                const data = [...posts.results].filter(c => c.id !== post.id)
                setPosts({...posts, results: data})
            })


    }


    function get_like_btn(post) {
        if(!loggedIn) return null
        return post.userLiked ? <UnlikeButton classname="feed-buttons btn btn-primary" unlike_fn={() => unlikeBtnClicked(post.id)}/> : <LikeButton classname="feed-buttons btn btn-primary" like_fn={() => likeBtnClicked(post.id)}/>
    }

    function get_delete_btn(post) {
        if (userData.restaurant === parseInt(restaurantid)) {
            return <a className="feed-buttons btn btn-danger" style={{right: '20px'}} onClick={e => delete_btn_clicked(e, post)}>delete</a>
        }
        return null
    }

    return (
        <>
            <div style={{backgroundColor: "blue"}} className="jumbotron text-center">
                <h1 className='title'> Welcome to the blog for <em>{name}</em></h1>
            </div>

            <div className="container">
                <div className="feed-flex-container">
                    {posts.results.map((post, index) => (
                        <div ref={posts.results.length === index + 1 ? lastPostElementRef : null} key={post.id} className="row feed-row">
                            <div className="feed-blog_post_container">
                                {post.picture ?
                                    <img className="feed-img"
                                         src={post.picture}/>
                                    : null
                                }
                                <div className="feed-text" style={!post.picture ? {width: '100%'} : null}>
                                    <h3> {post.title} </h3>
                                    <span className="feed-span"> <i className="fa fa-calendar"></i> {format_date(post.created)}</span>
                                    <span className="feed-span"> <i className="fa fa-folder"></i> {post.topic}</span>

                                    <span className="feed-span"> <i className="fa fa-heart"></i> {post.num_likes}
                                        {post.num_likes===1 ? ' Like' : ' Likes'} </span>
                                    <br/><br/>
                                    <p>{post.description}</p>
                                    <br/>

                                    {get_like_btn(post)}
                                    <a className="feed-buttons btn btn-link" style={{marginLeft: '100px'}} href={`/post/${post.id}/view`} role="button">Read More</a>
                                    {get_delete_btn(post)}
                                </div>
                            </div>

                        </div>
                    ))}</div>
            </div>



        </>
    )
}
