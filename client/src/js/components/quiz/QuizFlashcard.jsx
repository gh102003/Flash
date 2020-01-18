import React from "react";

import * as util from "../../util";

export const QuizFlashcard = props => {

    // Font size can be manipulated by ems in CSS media queries as well as here
    const textSize = Math.min(1, 1 - 0.004 * props.text.length);

    let styles = {
        backgroundColor: util.colourFromInteger(props.colour),
        color: util.contrastingColourFromInteger(props.colour),
    };

    return (
        <div className="quiz-flashcard" style={styles}>
            <span style={{ fontSize: textSize + "em" }}>
                {props.text}
            </span>
        </div>
    );
}