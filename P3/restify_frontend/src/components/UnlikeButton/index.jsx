
export default function UnlikeButton({unlike_fn}) {
    return (
        <a className="feed-buttons btn btn-primary" style={{marginRight: '50px'}}
           role="button" onClick={unlike_fn}>Unlike <i className="fa fa-thumbs-down"></i></a>
    )
}