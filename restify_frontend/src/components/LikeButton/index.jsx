
export default function LikeButton({like_fn, classname}) {
    return (
        <a className={classname} style={{marginRight: '50px'}}
           role="button" onClick={like_fn}>Like <i className="fa fa-thumbs-up"></i></a>
    )
}