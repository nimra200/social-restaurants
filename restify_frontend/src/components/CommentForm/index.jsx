import {useEffect, useState} from "react";

export default function CommentForm({submit, commentData, setCommentData}) {
    const [error, setError] = useState('')

    useEffect(() => {
        if(!commentData.title || !commentData.text || !commentData.rating) {
            setError('All fields are required')
        }
        else setError('')
        if(!commentData.title && !commentData.text && !commentData.rating) setError('')
    }, [commentData])

    return (
        <form onSubmit={submit}>
            <label htmlFor="title">Title:</label><br/><br/>
            <input type="text" id="title" value={commentData.title}
                onChange={e => setCommentData({...commentData, title: e.target.value})}/><br/><br/>

            <label htmlFor="comment">Comment:</label><br/><br/>
            <textarea id="comment" rows="4" className="form-control" value={commentData.text}
                onChange={e => setCommentData({...commentData, text: e.target.value})}/><br/>

            <label htmlFor="rating">Rating:</label><br/>
            <input type="number" id="rating" min="1" max="5" value={commentData.rating}
                onChange={e => setCommentData({...commentData, rating: e.target.value})}/>

            {error ? <><div style={{textAlign: 'center', color: 'red'}}>{error}</div><br/></> : null}

            <input type="submit" className="btn btn-light" style={{display: 'block', margin: '0 auto'}}
                   disabled={error.length!==0} value="Publish!"/>



        </form>
    )
}