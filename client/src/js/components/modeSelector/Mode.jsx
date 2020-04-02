import React, { useRef } from "react";
import { useHistory } from "react-router-dom";

export const Mode = ({ path, children }) => {

    const history = useHistory();
    const modeRef = useRef();

    return <div className="mode-wrapper"
        onMouseMove={event => {
            const rect = modeRef.current.getBoundingClientRect();
            const centreX = rect.left + rect.width / 2;
            const centreY = rect.top + rect.height / 2;
            const x = event.clientX - centreX; // x position relative to element's centre.
            const y = event.clientY - centreY;  // y position relative to element's centre.

            const distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            const rotationAmount = (distance * 0.1) - (Math.pow(distance, 2) * 0.0002);
            modeRef.current.style.transform = `perspective(800px) rotate3D(${-y}, ${x}, 0, ${rotationAmount}deg) `;
        }}
        onMouseLeave={() => {
            modeRef.current.style.transition = "transform 400ms";
            modeRef.current.style.transform = "perspective(800px) ";
        }}
        onMouseEnter={() => {
            modeRef.current.style.transition = "none";
        }}>
        {/* Receives mouse events so that it is a constant size */}
        <div className="mode"
            ref={modeRef}
            onClick={() => history.push(path)}
        >
            {children}
            {/* <h3>Prioritise</h3>
            <p>
                Sort your priorities for your crucial courses by ticking off what you know and what&apos;s still left to learn.
            </p> */}
        </div>
    </div>;
};