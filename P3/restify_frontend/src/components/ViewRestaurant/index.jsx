import ImageSlider from "../ImageSlider";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import CommentForm from "../CommentForm";

export default function ViewRestaurant() {
    const [data, setData] = useState({phone_number: '', images: [], comments: []})
    const [loggedIn, setLoggedIn] = useState(false)
    const [follow_button, setFollow_button] = useState(null)
    const [userData, setUserData] = useState({})
    const [commentData, setCommentData] = useState({title: '', text: '', rating: ''})

    const { rid } = useParams()
    useEffect(() => {
        document.body.className="form-body-class"
        let head = {}
        if (localStorage.getItem('token')) {
            setLoggedIn(true)
            head = {'Authorization': `Bearer ${localStorage.getItem('token')}`}
        }
        fetch(`http://localhost:8000/restaurants/${rid}/view/`, {
            method: 'GET',
            headers: head
        })
            .then(res => res.json())
            .then(json => setData(json))

        return () => {
            document.body.className=""      // remove classname when leaving page
        }

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
                    if(json.following.includes(parseInt(rid))) {
                        setFollow_button(<button className="btn btn-light" onClick={unfollowBtnClicked}> Following <i className="fa fa-bell"></i></button>)
                    }
                    else {
                        setFollow_button(<button className="btn btn-light" onClick={followBtnClicked}> Follow us! <i className="fa fa-bell"></i></button>)
                    }
                })
        }
    }, [loggedIn, data])


    console.log(data)

    const likeBtnClicked = () => {
        fetch(`http://localhost:8000/restaurants/${rid}/like/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(json => setData(json))
    }

    const unlikeBtnClicked = () => {
        fetch(`http://localhost:8000/restaurants/${rid}/unlike/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(json => setData(json))
    }

    const followBtnClicked = () => {
        fetch(`http://localhost:8000/restaurants/${rid}/follow/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(json => setData(json))
    }

    const unfollowBtnClicked = () => {
        fetch(`http://localhost:8000/restaurants/${rid}/unfollow/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(json => setData(json))
    }

    function submit_handler(e) {
        e.preventDefault()
        if(!commentData.title && !commentData.text && !commentData.rating) return
        const fd = new FormData()
        fd.append('title', commentData.title)
        fd.append('text', commentData.text)
        fd.append('rating', commentData.rating)
        fd.append('restaurant', rid)

        fetch('http://localhost:8000/restaurants/add_comment/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: fd
        })
            .then(res => res.json())
            .then(json => {
                const new_comments = [...new Set([...data.comments, json])]
                const new_data = {comments: new_comments}
                setData({...data, ...new_data})
            })
    }


    let like_button = null
    if (loggedIn) {
        like_button = !data.userLiked ? <button onClick={likeBtnClicked} className="btn btn-light"> Like Us <i className="fa fa-thumbs-up"></i></button> : <button onClick={unlikeBtnClicked} className="btn btn-light"> Unlike <i className="fa fa-thumbs-down"></i></button>
    }


    return (
        <>
            <div className="jumbotron text-center">
                <h1 className='title'>{data.name}</h1>
            </div>



            <div className="container" style={{color: 'white'}}>
                <div style={{textAlign: 'center'}}>
                    <img style={{maxHeight: '300px'}} src={data.logo}/>
                </div><br/>

                <div className="d-flex justify-content-center py-2 bg-warning">

                    <a className="mx-auto px-2 rounded bg-white text-dark" href={`/restaurants/${rid}/menu/view`}>View Menu</a>
                    <a className="mx-auto px-2 rounded  bg-white text-dark" href={`/restaurants/${rid}/posts/view`}>Recent Blog Posts</a>
                    {userData.id === data.owner_id ?
                        <>
                        <a className="mx-auto px-2 rounded  bg-white text-dark" href="/restaurants/my-restaurant/create-post">Publish New Blog Post</a>
                        <a className="mx-auto px-2 rounded  bg-white text-dark" href="/restaurants/my-restaurant/edit">Edit Restaurant
                        Information</a>
                            <a className="mx-auto px-2 rounded  bg-white text-dark" href="/restaurants/my-restaurant/add-image">Add Image</a>
                        </>
                    : null}
                </div>

                {data.images.length !== 0 ? <ImageSlider data={data}/> : null}

                <br/>
                <div className="row">
                    <div className="col-6">
                        <em>Contact Us:</em> {data.email}<br/>
                        {`(${data.phone_number.substring(0, 3)})-${data.phone_number.substring(3, 6)}-${data.phone_number.substring(6, 10)}`}
                    </div>
                    <div className="col-6">
                        <span className="float-end"> <em>Located At:</em> {data.address} {data.postal_code}</span>
                    </div>

                </div>

                <hr className="accent"/>
                <br/>
                <div className="row">
                    <div className="col-6">
                        {like_button} <em>{data.num_likes} people have liked this restaurant.</em>

                    </div>
                    <div className="col-6">
              <span className="float-end">{follow_button}
                <em> {data.num_followers} Followers.</em></span>
                    </div>

                    </div>

                <hr className="accent"/>
                <h4 className="text-center">Leave a comment</h4>
                {loggedIn ? <CommentForm submit={submit_handler} commentData={commentData} setCommentData={setCommentData}/>
                    : <em>You must be logged in to leave a comment.</em>}
                <br/><br/>


                {data.comments.map((comment, index) => (
                    <div key={index} className="card text-dark" style={{marginBottom: '30px'}}>
                        <div className="card-body">
                            <div style={{textAlign: 'center'}}><h5><u>{comment.title}</u></h5></div>

                            <h6 className="card-title">{comment.author} <span className="font-weight-light float-end">Rating: {comment.rating}/5</span>
                            </h6>


                            <p className="card-text py-2">
                                {comment.text}
                            </p>
                        </div>
                    </div>
                ))}



            </div>
            <br/>
            <br/>

        </>
    )
}

