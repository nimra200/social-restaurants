
export default function LikeButton({like_fn}) {
    return (
        <a className="feed-buttons btn btn-primary" style={{marginRight: '50px'}}
           role="button" onClick={like_fn}>Like <i className="fa fa-thumbs-up"></i></a>
    )
}