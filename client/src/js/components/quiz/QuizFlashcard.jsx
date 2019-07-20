import React from "react";

import * as util from "../../util";

export class QuizFlashcard extends React.Component {

    render() {
        let styles = {
            backgroundColor: util.colourFromInteger(this.props.colour),
            color: util.contrastingColourFromInteger(this.props.colour)
        };

        return (
            <div className="quiz-flashcard" style={styles}>
                {this.props.text}
            </div>
        );
    }

}