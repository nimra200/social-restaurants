import {useEffect, useState} from "react";
import './style.css'
import leftArrow from "./Icons/left-arrow.svg";
import rightArrow from "./Icons/right-arrow.svg";

export default function ImageSlider({data}) {
    const [slideIndex, setSlideIndex] = useState(0)

    return (
        <div className="container-slider">
            {data.images.map((image, index) => {
                return (
                    <div key={image.id} className={slideIndex === index ? "slide active-anim" : "slide"}>
                        <img src={image.img}/>
                    </div>
                )
            })}

            <button
                onClick={() => setSlideIndex((slideIndex + 1) % data.images.length)}
                className="btn-slide next"><img src={rightArrow}/></button>
            <button
                onClick={() => setSlideIndex((((slideIndex - 1) % data.images.length) + data.images.length) % data.images.length)}
                className="btn-slide prev"><img src={leftArrow}/></button>
        </div>

    )
}