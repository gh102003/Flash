import React from "react";

export class FlashcardModal extends React.Component {
    render() {
        return (
            <div className="modal-background" onClick={() => this.props.handleExit()}>
                <div className={"card flashcard flashcard-modal"} style={this.props.styles} onClick={(event) => {
                    event.stopPropagation(); // Prevent parent from recieving click
                    this.props.handleFlip();
                }}>
                    <div className="flashcard-button" onClick={(event) => {
                        event.stopPropagation();
                        this.props.handleExit();
                    }}>
                        <i className="material-icons">close</i>
                    </div>
                    {this.props.text}
                </div>
            </div>
        );
    }
}