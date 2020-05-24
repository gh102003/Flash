import React, { useState } from "react";
import { useTransition } from "react-spring";
import AutosizeInput from "react-input-autosize";

import { MathsFormattingHint } from "../MathsFormattingHint.jsx";
import * as constants from "../../constants";

export const FlashcardEdit = props => {

    const [showMathsFormattingHint, setShowMathsFormattingHint] = useState(false);
    const hintTransitions = useTransition(showMathsFormattingHint, null, {
        from: { top: "75%", opacity: 0, transform: "scale(1.1)", boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1" },
        enter: { top: "100%", opacity: 1, transform: "scale(1)", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2" },
        leave: { top: "75%", opacity: 0, transform: "scale(1.1)", boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1" },
        config: { tension: 250, friction: 26 }
    });

    // Font size can be manipulated by ems in CSS media queries as well as here
    const textSize = Math.min(1, 1 - 0.004 * props.text.length);

    return (
        <div className="card flashcard card-edit" style={props.styles} onClick={(event) => event.stopPropagation()}>
            <div className="flashcard-button" onClick={event => {
                event.stopPropagation();
                props.handleSaveTextEdit();
            }}>
                <i className="material-icons" >done</i>
            </div>
            <div className="flashcard-button" onClick={event => {
                event.stopPropagation();
                props.handleToggleReversible();
            }}>
                <i className="material-icons" >{props.isReversible ? "sync" : "sync_disabled"}</i>
            </div>
            <div className="flashcard-button" onClick={event => {
                event.stopPropagation();
                props.handleDelete();
            }}>
                <i className="material-icons" >delete</i>
            </div>
            <AutosizeInput
                className="auto-size-input-wrapper"
                type="text"
                autoFocus
                value={props.text}
                minWidth="80"
                style={{
                    fontSize: textSize + "em",
                    borderBottom: `2px solid ${props.styles.color.replace("1)", "0.6)")}` // Transparent version of text colour
                }}
                onChange={e => {
                    setShowMathsFormattingHint(e.target.value.match(constants.containsMathsRegex));

                    props.handleTextEdit(e.target.value);
                }}
                onClick={e => e.stopPropagation()}
                onKeyDown={e => {
                    if (e.keyCode === 13) { // Enter
                        props.handleSaveTextEdit();
                    }
                }}
            />
            {
                hintTransitions.map(({ item: isVisible, key, props }) =>
                    isVisible && <MathsFormattingHint style={props} key={key} />)
            }
            {/* {showMathsFormattingHint && <MathsFormattingHint />} */}
        </div>
    );
};
