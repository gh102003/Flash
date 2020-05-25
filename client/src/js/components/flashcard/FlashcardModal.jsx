import React, { useEffect } from "react";

import { Katex } from "../Katex.jsx";

export const FlashcardModal = props => {

    const keyboardEventListener = event => {
        event.stopPropagation();
        switch (event.key) {
            case "ArrowRight":
                props.handleSwitch(1);
                break;
            case "ArrowLeft":
                props.handleSwitch(-1);
                break;
            case " ":
                props.handleFlip();
                break;
            case "Escape":
                props.handleExit();
                break;
        }
    };

    // Keyboard events
    useEffect(() => {
        document.addEventListener("keydown", keyboardEventListener);

        // Return cleanup function to remove event listener
        return () => document.removeEventListener("keydown", keyboardEventListener);
    });

    // Font size can be manipulated by ems in CSS media queries as well as here
    const textSize = Math.min(1, 1 - 0.003 * (props.text.length - 5));

    return (
        <div className="modal-background" onClick={() => props.handleExit()}>
            <div
                className={"card flashcard flashcard-modal"}
                style={props.styles}
                onClick={(event) => {
                    event.stopPropagation(); // Prevent parent from recieving click
                    props.handleFlip();
                }}
            >
                <div className="flashcard-button" onClick={(event) => {
                    event.stopPropagation();
                    props.handleExit();
                }}>
                    <i className="material-icons">close</i>
                </div>
                <div className="flashcard-button-wrapper">
                    <div className="flashcard-button" onClick={(event) => {
                        event.stopPropagation();
                        props.handleSwitch(-1);
                    }}>
                        <i className="material-icons">chevron_left</i>
                    </div>
                    <div className="flashcard-button" onClick={(event) => {
                        event.stopPropagation();
                        props.handleSwitch(1);
                    }}>
                        <i className="material-icons">chevron_right</i>
                    </div>
                </div>
                <span style={{ fontSize: textSize + "em" }}>
                    <Katex>{props.text}</Katex>
                </span>
            </div>
        </div>
    );

}