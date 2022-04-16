import React, {useState, useEffect} from "react";
import { useParams } from 'react-router-dom';
import './style.css'

export default function Addcomment() {

  const [comment, setComment] = useState({title: "", text: "", restaurant: 0, rating: 1})

  const commentHandler = (e) => {
      e.preventDefault()
      const { id } = useParams();
      setComment({...comment, restaurant: {id}})
      fetch('http://localhost:8000/restaurants/add_comment/', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify(comment)
              }).then(res => {
                  if (res.ok) {
                      console.log("Comment added")
                  }

              })
  }

  return (<>
              <h4 class="text-center">Leave a comment</h4>
              <div class="col-8">
                      <form onSubmit={commentHandler}>
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
                      <input type="submit" value="Add Comment"/>
                      </form>
              </div>
  </>)



}