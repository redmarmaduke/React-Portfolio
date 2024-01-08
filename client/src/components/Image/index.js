import React, { useState } from 'react';

/**
 * @constructor
 * @param {*} props 
 * @returns 
 */
export default function Image (props) {
    const [ loaded, setLoaded ] = useState(false);
    const [ error, setError ] = useState(false);
    /**
     * onError
     * 
     * sets the src to undefined which will result in a rerender using a div
     */
    function onLoad() {
        setLoaded(true);
    }
    function onError() {
        setError(true);
    }

    const divStyle = {
        backgroundColor: 'black',
        color: 'white',
        objectFit: 'cover',
        width: '100%',
        height: '100%',
    };

    /**
     * if not loaded and no error then use test image
     * else if not loaded and error then render empty div (or message)
     * else re-render the img tag since we know that the src is valid
     */
    return !loaded ?
        (!error ? (<><img src={props.src} onLoad={onLoad} onError={onError} alt={'pre-load'}/><div>Loading</div></>) : <div style={divStyle}></div>):
        <img alt={props.alt || ""} {...props}/>;
}