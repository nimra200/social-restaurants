
export default function UnlikeButton({unlike_fn, classname}) {
    return (
        <a className={classname} style={{marginRight: '50px'}}
           role="button" onClick={unlike_fn}>Unlike <i className="fa fa-thumbs-down"></i></a>
    )
}