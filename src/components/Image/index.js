import React from 'react';

export function Image (props) {
    if (props.children) {
        try {
            let { width, height } = await new Promise((resolve) => {
                let image = new Image();
                image.onload = function() {
                    resolve({ width : this.width, height: this.height });
                }                
                image.src = props.src;    
            });

            return (
                <div style={{ display: "inline", backgroundImage: `url(${props.src})`, backgroundSize: `${width}px ${height}px`, width: `${width}px`, height: `${height}px` }}>
                    {props.children}
                </div>);        
        }
        catch (error) {
            return (
                <div style={{ display: "inline" }}>
                    {props.children}
                </div>);        
        }
    }
    else {
        return <img {...props}/>
    }
}