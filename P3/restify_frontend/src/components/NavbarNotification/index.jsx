import {NavDropdown} from "react-bootstrap";

export default function NavbarNotification({notification}) {
    console.log(notification)

    function calculate_time(date) {
        const current_date = new Date()
        const old_date = new Date(date)
        const seconds = Math.floor((current_date.getTime() - old_date.getTime()) / 1000)
        if (seconds < 60) return `${seconds}s`
        const minutes = Math.floor(seconds / 60)
        if (minutes < 60) return `${minutes}m`
        const hours = Math.floor(minutes / 60)
        if (hours < 24) {
            if(hours === 1) return `${hours}hr`
            else return `${hours}hrs`
        }
        const days = Math.floor(hours / 24)
        if (days === 1) return `${days} day`
        return `${days} days`
    }


    if (notification.type === 'Like' && notification.post) {
        return (
            <NavDropdown.Item>{`${notification.from_user} liked your post: `} <u>{notification.post}</u>
            {` ${calculate_time(notification.date)} ago`}</NavDropdown.Item>
        )
    }
    if (notification.type === 'Post') {
        return <NavDropdown.Item>{`${notification.restaurant} created a new post: `} <u>{notification.post}</u>
            {` ${calculate_time(notification.date)} ago`}</NavDropdown.Item>
    }
    return <NavDropdown.Item>Notificaiton test</NavDropdown.Item>
}
