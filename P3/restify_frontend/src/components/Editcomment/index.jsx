import React, {useState, useEffect} from "react";
import { useParams } from 'react-router-dom';
import './style.css'

export default function Editcomment() {

  const [comment, setComment] = useState({title: "", text: "", restaurant: 0, rating: 1})
  const [errors, setErrors] = useState({})


  const validate = (fields) => {
    let formerrors = {}

    if (!fields.title) {
        formerrors.title = "No title entered";
    }
    if (!fields.text) {
        formerrors.text = "No comment text entered";
    }
    return formerrors

  }

  const { id } = useParams();
  setComment({...comment, restaurant: {id}})

  useEffect(() => {

        fetch('http://localhost:8000/restaurants/' + comment.title + '/edit_comment/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(json => setComment(json))

        return () => {
            document.body.className=""
        }
    }, [])

  const deleteHandler = (e) => {
    e.preventDefault()
    setComment({title: "", text: "", restaurant: 0, rating: 1})
    fetch('http://localhost:8000/restaurants/' + comment.title + '/delete_comment/', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
            }).then(res => {
            if (res.ok)
                return res.json()
            else
                console.log('Comment cannot be found')
        })

  }

  const editHandler = (e) => {
        e.preventDefault()
        setErrors(validate(comment))
        if (Object.keys(errors).length === 0) {
        fetch('http://localhost:8000/restaurants/' + comment.title + '/edit_comment/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(comment)
            }).then(res => {
            if (res.ok)
                return res.json()
            else
                console.log('Comment cannot be found')
        })
        }
  }

  return (
  <>
  <h4 class="text-center">Edit or delete your comment:</h4>
            <div class="col-8">
                    <form onSubmit={editHandler}>
                    <label>Title:</label>
                    <input type="text"
                                    name="title"
                                    value={comment.title}
                                    onChange={e => setComment({...comment, title: e.target.value})}/>
                    <label>Rating:</label>
                    <input type="number" name="rating" min="1" max="5"
                                    value={comment.rating}
                                    onChange={e => setComment({...comment, rating: e.target.value})}/>
                    <br/><br/>
                    <label for="comments">Comments:</label><br/><br/>
                    <textarea name="comments" rows="4" class="form-control"
                    onChange={e => setComment({...comment, text: e.target.value})}>
                    {comment.text}
                    </textarea>
                    <input type="submit" value="Edit Comment"/>
                    </form>
                    <br /><br />
                    <input type="button" value="Delete comment" onClick={deleteHandler}/>
                </div>


  </>
  )

}