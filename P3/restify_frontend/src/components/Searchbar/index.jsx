import React from 'react';
import './style.css'

class Searchbar extends React.Component {
    render(){
        const {update, value} = this.props
        return (<>
            <span>Search for restaurants</span>
            <div class="box">
            <input type="text"
                   value={value}
                   onChange={event => update(event.target.value)}
            />
            </div>
        </>)
    }
}

export default Searchbar;