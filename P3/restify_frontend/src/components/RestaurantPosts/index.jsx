import { useState, handle, useEffect } from "react";
import { useParams } from "react-router-dom";
import LikeButton from "../LikeButton";
import UnlikeButton from "../UnlikeButton";
import "../Feed/style.css"

export default function RestaurantPosts(){
    const [posts, setPosts] = useState({results: []});
    const [name, setName] = useState("");
    const { restaurantid } = useParams()

        
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
            return fetch(`http://localhost:8000/restaurants/${restaurantOwner}/posts/`, 
            {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`  // get auth key from local storage
                }
            })
        })
        .then(res => res.json())
        .then(data => {
            setPosts(data);
            })
    }, [restaurantid])

    
    return (
        <> 
        <div style={{backgroundColor: "blue"}} className="jumbotron text-center">
                <h1 className='title'> Welcome to the blog for <em>{name}</em></h1>
        </div>
        
        <div className="container">
                <div className="feed-flex-container">
                    {posts.results.map((post, index) => (
                        <div key={post.id} className="row feed-row">
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

                                    {post.userLiked ? <UnlikeButton unlike_fn={() => unlikeBtnClicked(post.id)}/> :
                                        <LikeButton like_fn={() => likeBtnClicked(post.id)}/>}
                                    <a className="feed-buttons btn btn-link" style={{marginLeft: '100px'}} href="#" role="button">Read More</a>
                                </div>
                            </div>

                        </div>
                    ))}</div>
                </div>

            
        
        </>
    )
}